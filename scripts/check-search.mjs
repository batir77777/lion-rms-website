/*
 * Browser verification for the Knowledge Centre hub and search (Phase 5A, PR 9).
 *
 * Follows the convention set by check-reveals.mjs and check-demo.mjs: the
 * things that can only be established by running the page in a browser live in
 * a script, run against a served build, rather than in the node:test suite —
 * which asserts on built HTML and generated output and stays fast.
 *
 * What only a browser can answer:
 *   - does the layout overflow horizontally at each approved width;
 *   - does axe-core find any WCAG 2.1 AA violation;
 *   - does Pagefind actually return the expected results for real queries;
 *   - can the whole interface be operated from the keyboard alone;
 *   - do the live regions carry the result count and the empty state.
 *
 * Usage:
 *   npx serve@latest -s <static root>    # or: npm start
 *   node scripts/check-search.mjs [baseUrl] [--browser <path to chrome>]
 *
 * Exits non-zero on the first failure, and prints every result either way.
 */

import puppeteer from "puppeteer-core";
import { readFileSync, existsSync } from "node:fs";

const args = process.argv.slice(2);
const flagIndex = args.indexOf("--browser");
const BROWSER =
  flagIndex === -1
    ? process.env.CHROME_PATH ?? "/opt/pw-browsers/chromium"
    : args[flagIndex + 1];
const BASE = (args[0] && !args[0].startsWith("--") ? args[0] : "http://localhost:3000").replace(/\/$/, "");

const WIDTHS = [1280, 1024, 768, 375, 320];
const QUERIES = ["second staircase", "flat entrance doors", "responsible person"];
/*
 * axe-core is injected as source rather than by URL. A <script src> to a CDN
 * is subject to the page's own content-security policy and to whatever the
 * network allows, so a blocked request would look like a failing audit rather
 * than a missing tool. Point AXE_PATH at a local axe.min.js
 * (`npm i axe-core` anywhere) — the version used is printed in the output.
 */
const AXE_PATH = process.env.AXE_PATH ?? "node_modules/axe-core/axe.min.js";

const failures = [];
const pass = (label, detail = "") => console.log(`  PASS  ${label}${detail ? ` — ${detail}` : ""}`);
const fail = (label, detail) => {
  failures.push(`${label}: ${detail}`);
  console.log(`  FAIL  ${label} — ${detail}`);
};

const settle = (ms) => new Promise((r) => setTimeout(r, ms));

/* Type into the field the way a person does, so the debounce and the
   per-keystroke effects run as they would in use. */
async function search(page, term) {
  await page.click('input[type="search"]');
  await page.evaluate(() => {
    const input = document.querySelector('input[type="search"]');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(input, "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.type('input[type="search"]', term, { delay: 12 });
  await settle(1200);
}

if (!existsSync(AXE_PATH)) {
  console.error(`axe-core not found at ${AXE_PATH}. Install it (npm i axe-core) or set AXE_PATH.`);
  process.exit(1);
}
const axeSource = readFileSync(AXE_PATH, "utf8");

const browser = await puppeteer.launch({
  executablePath: BROWSER,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  // -------------------------------------------------------------------------
  console.log("\nHorizontal overflow");
  for (const path of ["/knowledge", "/search", "/guides"]) {
    for (const width of WIDTHS) {
      const page = await browser.newPage();
      await page.setViewport({ width, height: 900 });
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0" });
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const offenders = [...document.querySelectorAll("body *")]
          .filter((el) => el.getBoundingClientRect().right > doc.clientWidth + 1)
          .slice(0, 3)
          .map((el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}`);
        return { scroll: doc.scrollWidth, client: doc.clientWidth, offenders };
      });
      if (overflow.scroll > overflow.client + 1) {
        fail(`${path} @ ${width}px`, `scrollWidth ${overflow.scroll} > ${overflow.client}; ${overflow.offenders.join(", ")}`);
      } else {
        pass(`${path} @ ${width}px`, `${overflow.scroll}px`);
      }
      await page.close();
    }
  }

  // -------------------------------------------------------------------------
  console.log("\naxe-core, WCAG 2.1 A + AA");
  for (const path of ["/knowledge", "/search"]) {
    for (const width of [1280, 375]) {
      const page = await browser.newPage();
      await page.setViewport({ width, height: 900 });
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0" });
      await page.addScriptTag({ content: axeSource });
      /* Run once with results on the page too, so anything the search UI
         renders is audited rather than only the empty state. */
      if (path === "/search") await search(page, "responsible person");
      const results = await page.evaluate(async () =>
        window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } })
      );
      if (results.violations.length) {
        for (const v of results.violations) {
          fail(`${path} @ ${width}px`, `${v.id} (${v.impact}) x${v.nodes.length}: ${v.help}`);
        }
      } else {
        pass(`${path} @ ${width}px`, `${results.passes.length} checks passed, 0 violations`);
      }
      await page.close();
    }
  }

  // -------------------------------------------------------------------------
  console.log("\nSearch results");
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${BASE}/search`, { waitUntil: "networkidle0" });

    for (const term of QUERIES) {
      await search(page, term);
      const found = await page.evaluate(() =>
        [...document.querySelectorAll('ul li a[href^="/"]')]
          .filter((a) => a.querySelector("span"))
          .map((a) => ({
            href: a.getAttribute("href"),
            section: a.querySelector("span")?.textContent?.trim(),
            title: a.querySelectorAll("span")[1]?.textContent?.trim(),
            excerpt: a.querySelectorAll("span")[2]?.textContent?.trim() ?? "",
            marks: a.querySelectorAll("mark").length,
          }))
      );
      const announced = await page.evaluate(
        () => document.querySelector('[aria-live="polite"]')?.textContent ?? ""
      );

      if (!found.length) {
        fail(`"${term}"`, "returned no results");
      } else {
        const bad = found.filter((r) => r.href.includes(".html"));
        if (bad.length) fail(`"${term}"`, `result URL contains .html: ${bad[0].href}`);
        const unlabelled = found.filter((r) => !r.section);
        if (unlabelled.length) fail(`"${term}"`, `result without a section label: ${unlabelled[0].href}`);
        const unmarked = found.filter((r) => r.marks === 0);
        if (unmarked.length) fail(`"${term}"`, `excerpt with no highlighted term: ${unmarked[0].href}`);
        if (!announced.includes("result")) fail(`"${term}"`, `live region did not announce a count: "${announced}"`);

        /* The claim being tested: full text, not titles. At least one result
           must match in the body of a page whose title does not contain the
           phrase. */
        const bodyOnly = found.filter((r) => !r.title?.toLowerCase().includes(term.toLowerCase()));
        if (!bodyOnly.length) {
          fail(`"${term}"`, "every result had the phrase in its title — no body-text match");
        } else {
          pass(
            `"${term}"`,
            `${found.length} shown, announced "${announced.trim()}", body-text example ${bodyOnly[0].href} [${bodyOnly[0].section}]`
          );
        }
      }
    }

    // Empty state
    await search(page, "zzzznotathing");
    const empty = await page.evaluate(() => ({
      announced: document.querySelector('[aria-live="polite"]')?.textContent ?? "",
      visible: document.body.innerText.includes("No results for"),
    }));
    if (!empty.visible) fail("empty state", "no visible empty-state message");
    else if (!empty.announced.toLowerCase().includes("no results"))
      fail("empty state", `not announced: "${empty.announced}"`);
    else pass("empty state", `announced "${empty.announced.trim()}"`);

    await page.close();
  }

  // -------------------------------------------------------------------------
  console.log("\nKeyboard operation");
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${BASE}/search`, { waitUntil: "networkidle0" });

    // Tab from the top of the document until the search field takes focus.
    let steps = 0;
    let reached = false;
    while (steps < 60 && !reached) {
      await page.keyboard.press("Tab");
      steps += 1;
      reached = await page.evaluate(() => document.activeElement?.getAttribute("type") === "search");
    }
    if (!reached) fail("keyboard", "the search field is not reachable by Tab");
    else pass("keyboard", `search field reached in ${steps} tab stops`);

    await page.keyboard.type("responsible person", { delay: 12 });
    await settle(1200);

    // Submitting with Enter must not navigate away or reload.
    const before = page.url();
    await page.keyboard.press("Enter");
    await settle(600);
    if (page.url().split("?")[0] !== before.split("?")[0]) {
      fail("keyboard", `Enter navigated away to ${page.url()}`);
    } else {
      pass("keyboard", "Enter submits without leaving the page");
    }

    // The first result must be reachable, and must have a visible focus ring.
    const focus = await page.evaluate(async () => {
      const link = document.querySelector('ul li a[href^="/"]');
      if (!link) return null;
      link.focus();
      const style = getComputedStyle(link);
      return {
        href: link.getAttribute("href"),
        focused: document.activeElement === link,
        outline: `${style.outlineStyle} ${style.outlineWidth}`,
      };
    });
    if (!focus) fail("keyboard", "no result link to focus");
    else if (!focus.focused) fail("keyboard", "the result link cannot take focus");
    else if (focus.outline.startsWith("none")) fail("keyboard", "the focused result has no outline");
    else pass("keyboard", `result focusable with outline "${focus.outline}" (${focus.href})`);

    // ?q= must survive, so a result set can be shared.
    const shared = page.url();
    if (!shared.includes("q=responsible")) fail("keyboard", `?q= not reflected in the URL: ${shared}`);
    else pass("keyboard", `URL carries the query: ${shared.replace(BASE, "")}`);

    await page.close();
  }

  // -------------------------------------------------------------------------
  console.log("\nPagefind loads only where it should, and only on intent");
  for (const [path, expected] of [
    ["/guides", false],
    ["/downloads", false],
    ["/", false],
    ["/knowledge", true],
    ["/search", true],
  ]) {
    const page = await browser.newPage();
    const requested = [];
    page.on("request", (r) => {
      if (r.url().includes("/pagefind/")) requested.push(r.url().replace(BASE, ""));
    });
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0" });
    await settle(400);
    const onLoad = requested.length;

    if (onLoad > 0) {
      fail(path, `requested Pagefind on page load without any interaction: ${requested[0]}`);
    } else if (!expected) {
      pass(path, "no Pagefind assets requested");
    } else {
      await page.focus('input[type="search"]');
      await settle(1500);
      if (requested.length === 0) fail(path, "focusing the field did not load Pagefind");
      else pass(path, `nothing on load; ${requested.length} asset(s) after focus`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(
  failures.length ? `\n${failures.length} failure(s).\n` : "\nAll browser checks passed.\n"
);
process.exit(failures.length ? 1 : 0);
