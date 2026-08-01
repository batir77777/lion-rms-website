// Guards for the Pagefind search index (Phase 5A, PR 9).
//
// The index is generated build output, so nothing about it is visible from
// source. Every assertion here therefore reads the index Pagefind ACTUALLY
// produced — decompressing its fragments — rather than the list of pages the
// build script believes it staged. The two agreeing is the point of the
// exercise; asserting on the second would prove nothing about the first.
//
// The failure guards are exercised by running the real build script against
// fixture directories, so a guard that stops working is caught here rather
// than discovered when a broken index ships silently.

import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { KNOWLEDGE_SEGMENTS } from "@/lib/knowledge-sections";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const indexDir = path.join(repoRoot, "public/pagefind");
const fragmentDir = path.join(indexDir, "fragment");
const script = path.join(repoRoot, "scripts/build-search-index.mjs");

/** Every indexed page, as Pagefind stored it. */
let fragments = [];

before(() => {
  if (!fs.existsSync(fragmentDir)) {
    throw new Error(
      "run `npm run build` (or `npm run search:index` after a build) before this suite — it asserts on the generated index"
    );
  }
  fragments = fs.readdirSync(fragmentDir).map((name) => {
    const text = gunzipSync(fs.readFileSync(path.join(fragmentDir, name))).toString("utf8");
    return JSON.parse(text.slice(text.indexOf("{")));
  });
});

describe("Index scope — only Knowledge Centre content pages", () => {
  test("the build script's section list matches lib/knowledge-sections", () => {
    // The script cannot import the TypeScript registry (it runs as plain Node
    // against build output), so it carries a literal copy. This is the seam
    // that stops the copy drifting.
    const source = fs.readFileSync(script, "utf8");
    const literal = source.match(/const KNOWLEDGE_SECTIONS = \[([^\]]+)\]/);
    assert.ok(literal, "the build script no longer declares KNOWLEDGE_SECTIONS as an array literal");
    const inScript = literal[1].match(/"([a-z-]+)"/g).map((s) => s.replaceAll('"', ""));
    assert.deepEqual(inScript, [...KNOWLEDGE_SEGMENTS]);
  });

  test("every indexed page belongs to a Knowledge Centre section", () => {
    for (const fragment of fragments) {
      const segment = fragment.url.replace(/^\//, "").split("/")[0];
      assert.ok(
        KNOWLEDGE_SEGMENTS.includes(segment),
        `${fragment.url} is indexed but is not in a Knowledge Centre section`
      );
    }
  });

  test("the excluded routes are absent", () => {
    // /check is an interactive tool whose question fragments read as
    // authoritative guidance once lifted into an excerpt; case studies are
    // excluded by editorial decision; _not-found has no content of its own.
    for (const prefix of ["/check", "/case-studies", "/_not-found", "/search", "/knowledge"]) {
      const hit = fragments.find((f) => f.url === `${prefix}/` || f.url.startsWith(`${prefix}/`));
      assert.equal(hit, undefined, `${prefix} should not be indexed but ${hit?.url} is`);
    }
  });

  test("aggregation pages are absent — they only quote pages already indexed", () => {
    for (const segment of KNOWLEDGE_SEGMENTS) {
      assert.ok(
        !fragments.some((f) => f.url === `/${segment}/`),
        `the /${segment} listing page is indexed; it duplicates its own items`
      );
    }
    const yearArchive = fragments.find((f) => /^\/news\/\d{4}\/$/.test(f.url));
    assert.equal(yearArchive, undefined, `${yearArchive?.url} is a year archive and duplicates its items`);
  });

  test("no page that declares noindex is indexed", () => {
    const outDir = path.join(repoRoot, ".next/server/app");
    for (const fragment of fragments) {
      const file = path.join(outDir, `${fragment.url.replace(/^\/|\/$/g, "")}.html`);
      if (!fs.existsSync(file)) continue;
      const html = fs.readFileSync(file, "utf8");
      assert.ok(
        !/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html),
        `${fragment.url} declares noindex but is in the search index`
      );
    }
  });

  test("every section is represented", () => {
    for (const segment of KNOWLEDGE_SEGMENTS) {
      const count = fragments.filter((f) => f.url.startsWith(`/${segment}/`)).length;
      assert.ok(count > 0, `no ${segment} pages are indexed`);
    }
  });
});

describe("Result URLs are the routes the site actually serves", () => {
  test("no indexed URL carries a .html suffix", () => {
    // Next.js writes prerendered pages as files, so an unstaged index produces
    // /news/foo.html — a URL that 404s. This is the regression guard for the
    // directory-per-route staging step.
    const offenders = fragments.filter((f) => f.url.includes(".html"));
    assert.deepEqual(offenders.map((f) => f.url), []);
  });

  test("every indexed URL resolves to a prerendered page", () => {
    const outDir = path.join(repoRoot, ".next/server/app");
    for (const fragment of fragments) {
      const route = fragment.url.replace(/^\/|\/$/g, "");
      assert.ok(
        fs.existsSync(path.join(outDir, `${route}.html`)),
        `${fragment.url} is in the index but no page was built for it`
      );
    }
  });
});

describe("Indexed text is clean user-facing prose", () => {
  const joined = () => fragments.map((f) => f.raw_content ?? f.content ?? "").join("\n");

  test("no React Server Component or hydration payload leaks into the index", () => {
    const text = joined();
    for (const marker of ["self.__next_f", "__NEXT_DATA__", "$undefined", "buildId", "className"]) {
      assert.ok(!text.includes(marker), `the index contains ${marker}`);
    }
  });

  test("no markup, styles or encoded blobs leak into the index", () => {
    const text = joined();
    for (const [name, pattern] of Object.entries({
      "script or style tags": /<script|<style/i,
      "SVG path data": /\bd="M[\d.\- ]{10,}/,
      "base64 payloads": /base64,[A-Za-z0-9+/]{40,}/,
      "URL-encoded blobs": /%[0-9A-F]{2}%[0-9A-F]{2}%[0-9A-F]{2}/,
    })) {
      assert.ok(!pattern.test(text), `the index contains ${name}`);
    }
  });

  test("navigation and footer chrome is excluded by --root-selector main", () => {
    // Without it every page opens with the primary nav. These strings appear in
    // the header and footer of every page and in the main content of none.
    for (const fragment of fragments) {
      const opening = (fragment.raw_content ?? fragment.content ?? "").slice(0, 120);
      assert.ok(
        !/Request a Quote\. News\./.test(opening),
        `${fragment.url} opens with navigation chrome: ${opening.slice(0, 60)}`
      );
    }
  });

  test("every indexed page has real content, not just a title", () => {
    for (const fragment of fragments) {
      assert.ok(
        (fragment.word_count ?? 0) >= 40,
        `${fragment.url} indexed only ${fragment.word_count} words`
      );
    }
  });
});

describe("Body-text phrases are findable where they are not in the title", () => {
  // The whole reason for full-text search rather than a title/summary index.
  // Asserted against the indexed content itself: if the phrase is in the
  // fragment, Pagefind can match it.
  const PHRASES = ["second staircase", "flat entrance doors", "responsible person"];

  const normalise = (s) => s.toLowerCase().replace(/[‘’']/g, "'").replace(/\s+/g, " ");

  for (const phrase of PHRASES) {
    test(`"${phrase}" appears in indexed body text`, () => {
      const matches = fragments.filter((f) =>
        normalise(f.raw_content ?? f.content ?? "").includes(phrase)
      );
      assert.ok(matches.length > 0, `"${phrase}" is not in any indexed page`);

      const bodyOnly = matches.filter(
        (f) => !normalise(f.meta?.title ?? "").includes(phrase)
      );
      assert.ok(
        bodyOnly.length > 0,
        `"${phrase}" only ever appears in page titles — a title index would have found these too`
      );
    });
  }
});

// ---------------------------------------------------------------------------
// The failure guards, exercised against fixtures.
// ---------------------------------------------------------------------------

describe("The build fails loudly rather than shipping a wrong index", () => {
  let tmp;

  before(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "search-guards-"));
  });

  after(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  /** Run the real build script with fixture paths; never touches public/pagefind. */
  const run = (env = {}) =>
    spawnSync(process.execPath, [script], {
      cwd: repoRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        SEARCH_INDEX_STAGE_DIR: path.join(tmp, "stage"),
        SEARCH_INDEX_OUT_DIR: path.join(tmp, "out"),
        ...env,
      },
    });

  test("a missing prerendered-HTML directory stops the build", () => {
    const result = run({ SEARCH_INDEX_APP_DIR: path.join(tmp, "does-not-exist") });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /does not exist/);
  });

  test("a prerendered-HTML directory with no pages stops the build", () => {
    const empty = path.join(tmp, "empty");
    fs.mkdirSync(empty, { recursive: true });
    const result = run({ SEARCH_INDEX_APP_DIR: empty });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /no \.html files/);
  });

  test("a collapse in the number of indexable pages stops the build", () => {
    const result = run({ SEARCH_INDEX_MIN_PAGES: "5000" });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /expected at least 5000/);
  });

  test("a page Pagefind cannot index stops the build", () => {
    // A page with no <main> is silently skipped under --root-selector main, so
    // the staged and indexed counts diverge. Simulated with a fixture tree so
    // the real build output is never modified.
    const app = path.join(tmp, "app-with-unindexable");
    const realApp = path.join(repoRoot, ".next/server/app");
    fs.cpSync(realApp, app, { recursive: true });
    fs.mkdirSync(path.join(app, "guides"), { recursive: true });
    fs.writeFileSync(
      path.join(app, "guides", "fixture-no-main.html"),
      "<!DOCTYPE html><html lang=\"en-GB\"><head><title>No main</title></head><body><div>No landmark.</div></body></html>"
    );
    const result = run({ SEARCH_INDEX_APP_DIR: app });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Staged \d+ page\(s\) but Pagefind indexed \d+/);
  });

  test("the guards are all present in the script", () => {
    // Cheap structural check so a guard cannot be deleted without a test
    // failing, even where simulating its trigger is impractical.
    const source = fs.readFileSync(script, "utf8");
    for (let n = 1; n <= 6; n += 1) {
      assert.match(source, new RegExp(`Guard ${n}:`), `Guard ${n} has been removed`);
    }
  });
});
