// Headless verification that no scroll-revealed content can stay hidden.
//
// Drives the locally-installed Edge via puppeteer-core against the dev server:
//  1. Normal pass: load /, scroll section by section to the bottom, then assert
//     every Framer-Motion-revealed element has computed opacity 1.
//  2. Fast-jump pass: load /, instantly jump to the bottom (worst case for
//     IntersectionObserver), wait out the fail-safe, assert again.
//  3. Anchor pass: load /#digital-compliance directly (anchor jump on initial
//     load), assert the elements above and around the anchor become visible.
//
// Usage: node scripts/check-reveals.mjs [baseUrl]   (default http://localhost:3001)

import puppeteer from "puppeteer-core";

const BASE = process.argv[2] || "http://localhost:3001";
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// Framer Motion drives reveal opacity via inline style on motion.div wrappers.
// Select every element whose inline style mentions opacity — that includes all
// Reveal wrappers and the timeline/stats children. Sample opacity twice 400ms
// apart: an element is only "stuck" if it stays below 0.99 with an UNCHANGED
// value (deliberate transients like the testimonial cross-fade are animating,
// not stuck).
async function hiddenRevealCount(page) {
  return page.evaluate(async () => {
    const els = Array.from(
      document.querySelectorAll('[style*="opacity"]'),
    ).filter((el) => {
      // Ignore decorative/fixed chrome (scroll progress bar etc.)
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return false;
      return true;
    });
    const read = () => els.map((el) => parseFloat(getComputedStyle(el).opacity));
    const first = read();
    await new Promise((r) => setTimeout(r, 400));
    const second = read();
    const hidden = els.filter(
      (el, i) => second[i] < 0.99 && Math.abs(second[i] - first[i]) < 0.001,
    );
    return {
      total: els.length,
      hidden: hidden.length,
      samples: hidden.slice(0, 5).map((el) => ({
        tag: el.tagName,
        cls: String(el.className).slice(0, 80),
        text: (el.textContent || "").trim().slice(0, 60),
        opacity: getComputedStyle(el).opacity,
      })),
    };
  });
}

async function settle(page, ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--window-size=1366,900"],
    defaultViewport: { width: 1366, height: 900 },
  });
  const page = await browser.newPage();
  let failures = 0;

  const report = (name, res) => {
    const ok = res.hidden === 0;
    console.log(
      `${ok ? "PASS" : "FAIL"}  ${name} — ${res.total} reveal elements, ${res.hidden} stuck hidden`,
    );
    if (!ok) {
      failures++;
      for (const s of res.samples)
        console.log(`       stuck: <${s.tag}> opacity=${s.opacity} "${s.text}"`);
    }
  };

  // ---- Pass 1: normal section-by-section scroll ----
  await page.goto(`${BASE}/`, { waitUntil: "networkidle2", timeout: 60000 });
  await settle(page, 800);
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y <= h; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
    }
    window.scrollTo(0, h);
  });
  await settle(page, 2200); // out-wait animations + fail-safe
  report("normal scroll", await hiddenRevealCount(page));

  // ---- Pass 2: instant jump to bottom (worst case for IO) ----
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await settle(page, 2600); // fail-safe grace (1.5s) + animation time
  report("instant jump to bottom", await hiddenRevealCount(page));

  // ---- Pass 3: anchor-jump initial load ----
  await page.goto(`${BASE}/#digital-compliance`, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });
  await settle(page, 2600);
  // Only assert on elements at/above the viewport (below-fold items will
  // reveal on scroll as designed).
  const res3 = await page.evaluate(() => {
    const els = Array.from(
      document.querySelectorAll('[style*="opacity"]'),
    ).filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return false;
      return r.top < window.innerHeight; // in or above the viewport
    });
    const hidden = els.filter(
      (el) => parseFloat(getComputedStyle(el).opacity) < 0.99,
    );
    return {
      total: els.length,
      hidden: hidden.length,
      samples: hidden.slice(0, 5).map((el) => ({
        tag: el.tagName,
        cls: String(el.className).slice(0, 80),
        text: (el.textContent || "").trim().slice(0, 60),
        opacity: getComputedStyle(el).opacity,
      })),
    };
  });
  report("anchor jump (#digital-compliance), in/above viewport", res3);

  // ---- Console error check (Clock deprecation must be gone) ----
  const warnings = [];
  page.on("console", (m) => {
    if (/deprecated|THREE\.Clock/i.test(m.text())) warnings.push(m.text());
  });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle2", timeout: 60000 });
  await settle(page, 2500);
  if (warnings.length) {
    failures++;
    console.log(`FAIL  console deprecations: ${warnings.join(" | ")}`);
  } else {
    console.log("PASS  no THREE.Clock deprecation warnings in console");
  }

  await browser.close();
  console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

run().catch((e) => {
  console.error("check failed to run:", e.message);
  process.exit(1);
});
