// Downloads library — accessor, schema output, routing, redirect and
// structured data (Phase 5A, PR 8A).
//
// Same three layers as the Standards, Legislation and News suites, and the same
// governing caution: assertions are made against Velite's OUTPUT rather than
// the schema's intent, because the failure mode of the `s.mdx().optional()`
// class of defect is silence.
//
// Two things here are specific to Downloads and are the reason this suite
// exists at all.
//
// FILE VALIDATION IS A BUILD GUARANTEE, NOT A CONVENTION. Velite's `s.file()`
// waves a non-relative path straight through — its very first line is
// `if (allowNonRelativePath && !isRelativePath(value)) return value` — so an
// absolute path would be neither resolved nor checked, and the build would go
// green with a broken download. The fixture group below runs real Velite builds
// to prove the flag is off and stays off.
//
// WITHDRAWN RESOURCES STAY AT 200. A completed record in a client's fire safety
// file cites the version it was printed from. Making that URL 404 would destroy
// the record rather than correct it.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const appDir = path.join(repoRoot, "app");

before(() => {
  execFileSync("npx", ["velite", "build", "--strict", "--clean", "--silent"], {
    cwd: repoRoot,
    stdio: "pipe",
  });
});

const source = (p) => fs.readFileSync(path.join(appDir, p), "utf8");
const exists = (p) => fs.existsSync(path.join(appDir, p));

/** Runs a fixture Velite build and returns its combined output, or null if it succeeded. */
function buildFixture(name) {
  try {
    execFileSync(
      "npx",
      ["velite", "build", "--config", `tests/fixtures-config/${name}.velite.config.ts`, "--strict", "--clean"],
      { cwd: repoRoot, stdio: "pipe", encoding: "utf8" }
    );
    return null;
  } catch (error) {
    return `${error.stdout ?? ""}${error.stderr ?? ""}`;
  }
}

describe("Downloads accessor", () => {
  test("exposes the migrated checklist, published", async () => {
    const { publishedDownloads } = await import("../lib/downloads");
    const { downloads: raw } = await import("../.velite");
    const items = publishedDownloads();

    /*
     * This asserted `items.length === 1` until PR 8B added six resources.
     * A hard-coded total is not what this test is for: it breaks every time
     * the library grows, and a passing count says nothing about whether the
     * right items came back. What matters is that the accessor returns
     * exactly the published set and nothing else, so that is what is checked
     * — against Velite's own output rather than against a number someone has
     * to remember to update.
     */
    const expected = raw.filter((d) => d.status === "published").map((d) => d.slug).sort();
    assert.deepEqual(items.map((d) => d.slug).sort(), expected);
    for (const item of items) assert.equal(item.status, "published");

    const checklist = items.find((d) => d.slug === "fire-safety-checklist");
    assert.ok(checklist, "the migrated checklist should still be published");
    assert.equal(checklist.status, "published");
  });

  test("excludes anything not published from the listing", async () => {
    const { downloads: raw } = await import("../.velite");
    const { publishedDownloads } = await import("../lib/downloads");
    const visible = new Set(publishedDownloads().map((d) => d.slug));
    for (const item of raw) {
      if (item.status !== "published") assert.equal(visible.has(item.slug), false);
    }
  });

  test("getDownload resolves a published slug and refuses an unknown one", async () => {
    const { getDownload } = await import("../lib/downloads");
    assert.ok(getDownload("fire-safety-checklist"));
    assert.equal(getDownload("no-such-resource"), undefined);
  });

  test("routableDownloads includes withdrawn resources, publishedDownloads does not", async () => {
    const { routableDownloads, publishedDownloads, withdrawnDownloads } = await import(
      "../lib/downloads"
    );
    const routable = new Set(routableDownloads().map((d) => d.slug));
    for (const d of publishedDownloads()) assert.ok(routable.has(d.slug));
    for (const d of withdrawnDownloads()) {
      assert.ok(routable.has(d.slug), `${d.slug} must still be built`);
      assert.equal(
        publishedDownloads().some((p) => p.slug === d.slug),
        false,
        `${d.slug} must not appear in the listing`
      );
    }
  });

  test("deliveryFormats returns nothing for an HTML-native resource", async () => {
    // Not a defect and callers must not treat it as one: delivery is the page.
    const { getDownload, deliveryFormats, hasPrintableHtml } = await import("../lib/downloads");
    const item = getDownload("fire-safety-checklist");
    assert.deepEqual(deliveryFormats(item), []);
    assert.equal(hasPrintableHtml(item), true);
  });

  test("every published resource offers at least one delivery route", async () => {
    // Rule R1's live guarantee, asserted against the accessor rather than the
    // rule, so a resource that satisfied the rule but confused the accessor
    // still fails.
    const { publishedDownloads, deliveryFormats, hasPrintableHtml } = await import(
      "../lib/downloads"
    );
    for (const item of publishedDownloads()) {
      assert.ok(
        deliveryFormats(item).length > 0 || hasPrintableHtml(item),
        `${item.slug} offers no way to obtain it`
      );
    }
  });

  test("formatBytes renders kB and MB, and nothing for an absent size", async () => {
    const { formatBytes } = await import("../lib/downloads");
    assert.equal(formatBytes(undefined), "");
    assert.equal(formatBytes(0), "");
    assert.equal(formatBytes(512), "512 bytes");
    assert.equal(formatBytes(240_000), "240 kB");
    assert.equal(formatBytes(2_400_000), "2.4 MB");
  });

  test("formatDate renders en-GB and tolerates an absent value", async () => {
    const { formatDate } = await import("../lib/downloads");
    assert.equal(formatDate("2026-03-06"), "6 March 2026");
    assert.equal(formatDate(undefined), undefined);
    assert.equal(formatDate("not-a-date"), undefined);
  });

  test("recordFacts carries the version and never a next review on a withdrawn item", async () => {
    const { getDownload, recordFacts } = await import("../lib/downloads");
    const facts = recordFacts(getDownload("fire-safety-checklist"));
    assert.ok(facts.some((f) => f.label === "Version"));
    assert.ok(facts.some((f) => f.label === "Next review due"));
  });

  test("successorsOf returns published replacements only", async () => {
    const { publishedDownloads, successorsOf } = await import("../lib/downloads");
    for (const item of publishedDownloads()) {
      for (const s of successorsOf(item)) assert.equal(s.status, "published");
    }
  });
});

describe("Downloads schema — what reached Velite's output", () => {
  test("gated is gone from every item", async () => {
    const { downloads } = await import("../.velite");
    for (const d of downloads) {
      assert.equal("gated" in d, false, `${d.slug} still carries gated`);
    }
  });

  test("an optional s.file() populates when present and is absent when not", async () => {
    // The `s.mdx().optional()` trap from PR 4 is the reason this is asserted
    // against output rather than assumed from the schema: that defect's failure
    // mode was silence, and an optional file field is the same shape of risk.
    const { downloads } = await import("../.velite");
    for (const d of downloads) {
      if (d.fileFormat === "html") {
        assert.equal(d.fileUrl, undefined, `${d.slug} should carry no file`);
      } else {
        assert.equal(typeof d.fileUrl, "string", `${d.slug} lost its fileUrl`);
        assert.ok(d.fileUrl.startsWith("/static/"), `${d.slug} was not copied to the asset output`);
      }
    }
  });

  test("licence and accessibility status are present on every item", async () => {
    const { downloads } = await import("../.velite");
    for (const d of downloads) {
      assert.equal(d.licence, "lion-rms-permitted-use", d.slug);
      assert.ok(d.accessibilityStatus, d.slug);
    }
  });

  test("defaults materialise rather than staying undefined", async () => {
    const { downloads } = await import("../.velite");
    for (const d of downloads) {
      assert.ok(Array.isArray(d.additionalFormats), d.slug);
      assert.ok(Array.isArray(d.previousVersions), d.slug);
      assert.ok(Array.isArray(d.supersededBy), d.slug);
      assert.equal(typeof d.printableHtml, "boolean", d.slug);
      assert.equal(typeof d.thirdPartyMaterial, "boolean", d.slug);
    }
  });

  test("body compiled to a populated MDX function body", async () => {
    const { downloads } = await import("../.velite");
    for (const d of downloads) {
      assert.equal(typeof d.body, "string", `${d.slug}: body is not a string`);
      assert.ok(d.body.length > 500, `${d.slug}: body is suspiciously short`);
    }
  });

  test("every item carries at least one tag from the registry", async () => {
    const { downloads } = await import("../.velite");
    const { CONTENT_TAG_SLUGS } = await import("../lib/taxonomy");
    const known = new Set(CONTENT_TAG_SLUGS);
    for (const d of downloads) {
      assert.ok(d.tags.length > 0, `${d.slug} has no tags — rule C3 requires them on downloads`);
      for (const t of d.tags) assert.ok(known.has(t), `${d.slug}: unknown tag ${t}`);
    }
  });
});

describe("File validation is enforced by the build, not by convention", () => {
  test("a non-relative path is rejected rather than waved through", () => {
    const output = buildFixture("download-nonrelative-file");
    assert.ok(output, "the build should have failed");
    assert.match(output, /fileUrl/);
    assert.match(output, /nonexistent\.pdf/);
  });

  test("a relative path pointing at nothing fails the build", () => {
    const output = buildFixture("download-missing-file");
    assert.ok(output, "the build should have failed");
    assert.match(output, /does-not-exist\.pdf/);
  });

  test("a resource offering no delivery at all fails the build", () => {
    const output = buildFixture("download-no-delivery");
    assert.ok(output, "the build should have failed");
    assert.match(output, /no way to obtain it/);
  });

  test("an HTML-only resource with no file validates", () => {
    // The counterpart of the three failures above, and the more important
    // assertion: strictness must not have made a legitimate shape impossible.
    assert.equal(buildFixture("valid"), null);
  });

  test("the schema turns off allowNonRelativePath explicitly", () => {
    const src = fs.readFileSync(path.join(repoRoot, "lib/content-schemas.ts"), "utf8");
    // Comments are stripped first: this file DOCUMENTS the bare `s.file()`
    // hazard at length, and matching prose would fail on the explanation of
    // the very thing the assertion exists to prevent.
    const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    assert.match(code, /allowNonRelativePath:\s*false/);
    assert.ok(
      !/s\.file\(\s*\)/.test(code),
      "a bare s.file() would silently accept absolute paths and skip the existence check"
    );
    // And every call site must carry the flag, not just one of them.
    const calls = code.match(/s\.file\(/g) ?? [];
    const guarded = code.match(/s\.file\(\{\s*allowNonRelativePath:\s*false\s*\}\)/g) ?? [];
    assert.equal(calls.length, guarded.length, "an s.file() call site is missing the flag");
  });
});

describe("Downloads routing", () => {
  test("generateStaticParams returns every routable resource", async () => {
    const mod = await import("../app/downloads/[slug]/page.tsx");
    const { routableDownloads } = await import("../lib/downloads");
    const params = mod.generateStaticParams().map((p) => p.slug);
    const expected = routableDownloads().map((d) => d.slug);
    assert.deepEqual([...params].sort(), [...expected].sort());
  });

  test("dynamicParams is false", async () => {
    const mod = await import("../app/downloads/[slug]/page.tsx");
    assert.equal(mod.dynamicParams, false);
  });

  test("there is exactly one dynamic segment under /downloads", () => {
    const entries = fs.readdirSync(path.join(appDir, "downloads"), { withFileTypes: true });
    const dynamic = entries.filter((e) => e.isDirectory() && e.name.startsWith("["));
    assert.deepEqual(dynamic.map((d) => d.name), ["[slug]"]);
  });

  test("the old /resources route is gone", () => {
    assert.equal(exists("resources"), false, "app/resources should have been removed");
    assert.equal(exists("resources/fire-safety-checklist"), false);
  });

  test("routes deferred to PR 9 and later are not built", () => {
    for (const route of ["downloads/category", "downloads/tag", "knowledge", "search"]) {
      assert.equal(exists(route), false, `${route} should not exist yet`);
    }
  });

  test("every resource's metadata sits inside the editorial ranges and self-canonicalises", async () => {
    const mod = await import("../app/downloads/[slug]/page.tsx");
    const { publishedDownloads } = await import("../lib/downloads");
    for (const item of publishedDownloads()) {
      const meta = await mod.generateMetadata({ params: Promise.resolve({ slug: item.slug }) });
      assert.ok(
        meta.title.length >= 30 && meta.title.length <= 65,
        `${item.slug}: title is ${meta.title.length} characters`
      );
      assert.ok(
        meta.description.length >= 120 && meta.description.length <= 170,
        `${item.slug}: description is ${meta.description.length} characters`
      );
      assert.equal(meta.alternates.canonical, `/downloads/${item.slug}`);
      assert.equal(meta.openGraph.type, "article");
    }
  });

  test("a published resource is indexable", async () => {
    const mod = await import("../app/downloads/[slug]/page.tsx");
    const meta = await mod.generateMetadata({
      params: Promise.resolve({ slug: "fire-safety-checklist" }),
    });
    assert.equal(meta.robots, undefined);
  });

  test("the listing description sits inside the editorial band", () => {
    const src = source("downloads/page.tsx");
    const match = src.match(/const DESCRIPTION =\s*\n?\s*"([^"]+)"/);
    assert.ok(match, "DESCRIPTION not found");
    const length = match[1].length;
    assert.ok(length >= 120 && length <= 170, `listing description is ${length} characters`);
  });

  test("the listing declares an absolute self-canonical", () => {
    assert.match(source("downloads/page.tsx"), /alternates: \{ canonical: DOWNLOADS_PATH \}/);
  });
});

describe("The redirect from the old checklist URL", () => {
  const config = fs.readFileSync(path.join(repoRoot, "next.config.mjs"), "utf8");

  test("exists, is permanent, and points at the Downloads page", () => {
    assert.match(
      config,
      /source:\s*"\/resources\/fire-safety-checklist",\s*\n\s*destination:\s*"\/downloads\/fire-safety-checklist",\s*\n\s*permanent:\s*true/
    );
  });

  test("is one hop — the destination is not itself a redirect source", () => {
    const sources = [...config.matchAll(/source:\s*"([^"]+)"/g)].map((m) => m[1]);
    const destinations = [...config.matchAll(/destination:\s*"([^"]+)"/g)].map((m) => m[1]);
    for (const d of destinations) {
      if (d.startsWith("http")) continue;
      assert.equal(
        sources.includes(d),
        false,
        `${d} is both a redirect destination and a redirect source — that is a chain`
      );
    }
  });

  test("the destination is a real built page", async () => {
    const { getDownload } = await import("../lib/downloads");
    assert.ok(getDownload("fire-safety-checklist"), "the redirect target does not exist");
  });

  test("no internal link still points at the old URL", () => {
    const roots = ["app", "components", "lib"];
    const offenders = [];
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(tsx?|mdx)$/.test(entry.name)) {
          if (fs.readFileSync(full, "utf8").includes("/resources/fire-safety-checklist")) {
            offenders.push(path.relative(repoRoot, full));
          }
        }
      }
    };
    for (const r of roots) walk(path.join(repoRoot, r));
    assert.deepEqual(offenders, []);
  });

  test("the old URL is absent from the sitemap and the new one present once", async () => {
    const { default: sitemap } = await import("../app/sitemap.ts");
    const urls = sitemap().map((e) => e.url);
    assert.equal(urls.some((u) => u.includes("/resources/")), false);
    assert.equal(
      urls.filter((u) => u === "https://www.lionrms.uk/downloads/fire-safety-checklist").length,
      1
    );
  });
});

describe("Sitemap and asset indexing", () => {
  test("the index and every published resource are listed at the right priority", async () => {
    const { default: sitemap } = await import("../app/sitemap.ts");
    const { publishedDownloads } = await import("../lib/downloads");
    const byUrl = new Map(sitemap().map((e) => [e.url, e]));

    assert.equal(byUrl.get("https://www.lionrms.uk/downloads")?.priority, 0.7);
    for (const d of publishedDownloads()) {
      const entry = byUrl.get(`https://www.lionrms.uk/downloads/${d.slug}`);
      assert.ok(entry, `${d.slug} missing from the sitemap`);
      assert.equal(entry.priority, 0.6);
    }
  });

  test("no file URL ever appears in the sitemap", async () => {
    const { default: sitemap } = await import("../app/sitemap.ts");
    for (const entry of sitemap()) {
      assert.ok(!entry.url.includes("/static/"), `${entry.url} is a file, not a page`);
    }
  });

  test("withdrawn resources are excluded from the sitemap", async () => {
    const { default: sitemap } = await import("../app/sitemap.ts");
    const { withdrawnDownloads } = await import("../lib/downloads");
    const urls = new Set(sitemap().map((e) => e.url));
    for (const d of withdrawnDownloads()) {
      assert.equal(
        urls.has(`https://www.lionrms.uk/downloads/${d.slug}`),
        false,
        `${d.slug} is noindex and must not be in the sitemap`
      );
    }
  });

  test("assets carry X-Robots-Tag: noindex so the file cannot outrank its page", () => {
    const config = fs.readFileSync(path.join(repoRoot, "next.config.mjs"), "utf8");
    assert.match(config, /source:\s*"\/static\/:path\*"/);
    assert.match(config, /X-Robots-Tag/);
    assert.match(config, /noindex, follow/);
  });

  test("public/static is gitignored, because the build empties it", () => {
    const ignore = fs.readFileSync(path.join(repoRoot, ".gitignore"), "utf8");
    assert.match(ignore, /^\/public\/static$/m);
  });
});

describe("Downloads structured data", () => {
  test("DigitalDocument carries our author, publisher and licence, and the LANDING PAGE as its url", async () => {
    const { buildDigitalDocumentSchema } = await import("../lib/content-jsonld");
    const json = buildDigitalDocumentSchema({
      name: "x",
      description: "y",
      path: "/downloads/x",
      authorId: "batir-turakulov",
      version: "1.0",
      datePublished: "2026-03-01",
      dateModified: "2026-03-02",
      encodings: [{ format: "pdf", url: "/static/x-abc.pdf", sizeBytes: 1234 }],
    });
    assert.equal(json["@type"], "DigitalDocument");
    assert.equal(json.url, "https://www.lionrms.uk/downloads/x");
    assert.equal(json["@id"], "https://www.lionrms.uk/downloads/x");
    assert.equal(json.publisher.name, "Lion Risk Management Solutions");
    assert.equal(json.copyrightHolder.name, "Lion Risk Management Solutions");
    assert.equal(json.author["@type"], "Person");
    assert.equal(json.version, "1.0");
    assert.equal(json.inLanguage, "en-GB");
    assert.match(json.license, /#licence$/);
  });

  test("the file appears only inside encoding, never as the document's url", async () => {
    const { buildDigitalDocumentSchema } = await import("../lib/content-jsonld");
    const json = buildDigitalDocumentSchema({
      name: "x",
      description: "y",
      path: "/downloads/x",
      authorId: "batir-turakulov",
      version: "1.0",
      encodings: [{ format: "pdf", url: "/static/x-abc.pdf", sizeBytes: 1234 }],
    });
    assert.ok(!json.url.includes("/static/"));
    assert.equal(json.encoding.length, 1);
    assert.equal(json.encoding[0].encodingFormat, "application/pdf");
    assert.equal(json.encoding[0].contentUrl, "https://www.lionrms.uk/static/x-abc.pdf");
    assert.equal(json.encoding[0].contentSize, "1234");
  });

  test("an HTML-native resource emits no encoding node at all", async () => {
    const { buildDigitalDocumentSchema } = await import("../lib/content-jsonld");
    const json = buildDigitalDocumentSchema({
      name: "x",
      description: "y",
      path: "/downloads/x",
      authorId: "batir-turakulov",
      version: "1.0",
      encodings: [],
    });
    assert.equal(json.encoding, undefined);
  });

  test("no offers node is ever emitted", async () => {
    // Nothing here is for sale, and an offers node with a zero price still
    // asserts a commercial transaction that does not exist.
    const src = fs.readFileSync(path.join(repoRoot, "lib/content-jsonld.ts"), "utf8");
    const fn = src.slice(src.indexOf("export function buildDigitalDocumentSchema"));
    assert.ok(!/offers/.test(fn), "offers must not reach DigitalDocument");
  });

  test("the author node inherits the live credentials", async () => {
    const { buildDigitalDocumentSchema } = await import("../lib/content-jsonld");
    const json = buildDigitalDocumentSchema({
      name: "x",
      description: "y",
      path: "/downloads/x",
      authorId: "batir-turakulov",
      version: "1.0",
    });
    assert.match(json.author.jobTitle, /MIFireE/);
  });
});

describe("Landing page structure", () => {
  const src = () => source("downloads/[slug]/page.tsx");

  test("the fixed order is withdrawal, notice, record, actions, resource, accessibility, licence", () => {
    const s = src();
    const order = [
      'aria-labelledby="withdrawn-heading"',
      'aria-label="General information notice"',
      'id="download-record-heading"',
      'id="download-actions-heading"',
      "<MDXContent",
      'id="accessibility-heading"',
      'id="licence-heading"',
      "<CorrectionHistory",
    ];
    let previous = -1;
    for (const marker of order) {
      const at = s.indexOf(marker);
      assert.ok(at > -1, `${marker} is missing`);
      assert.ok(at > previous, `${marker} is out of order`);
      previous = at;
    }
  });

  test("the download link states format and size inside its own text", () => {
    // A screen-reader user moving by links hears the label and nothing else.
    assert.match(src(), /Download \{item\.title\} \(\{f\.label\}, \{f\.sizeLabel\}\)/);
  });

  test("the page says plainly that nothing is required to obtain the resource", () => {
    assert.match(src(), /No sign-up, no email address, and no tracking/);
  });

  test("the adaptation notice names what the template does not replace", () => {
    const s = src();
    assert.match(s, /general template/);
    assert.match(s, /does not replace a fire risk assessment/);
    assert.match(s, /fire door survey/);
  });

  test("a withdrawn resource warns against using it and offers the replacement", () => {
    const s = src();
    assert.match(s, /This resource has been withdrawn/);
    assert.match(s, /Do not use this version for current work/);
    assert.match(s, /There is no direct replacement/);
  });

  test("withdrawal sets noindex, follow rather than removing the page", () => {
    assert.match(src(), /robots: \{ index: false, follow: true \}/);
  });

  test("previous versions stay downloadable so old records still make sense", () => {
    const s = src();
    assert.match(s, /Previous versions/);
    assert.match(s, /records already completed on them/);
  });

  test("every rendered date uses a machine-readable time element", () => {
    const s = src();
    const times = (s.match(/<time dateTime=/g) || []).length;
    assert.ok(times >= 3, `expected several <time> elements, found ${times}`);
  });

  test("the licence block states permitted use and prohibitions", () => {
    const s = src();
    assert.match(s, /adapt this resource/);
    assert.match(s, /may not resell it/);
    assert.match(s, /remove the attribution/);
  });
});

describe("Knowledge Centre navigation", () => {
  test("Downloads has joined the section nav", () => {
    const src = fs.readFileSync(path.join(repoRoot, "components/KnowledgeCentreNav.tsx"), "utf8");
    for (const href of ["/guides", "/glossary", "/standards", "/legislation", "/news", "/downloads"]) {
      assert.ok(src.includes(`href: "${href}"`), `${href} missing from the section nav`);
    }
  });

  test("the hub deferred to PR 9 is still not linked", () => {
    const src = fs.readFileSync(path.join(repoRoot, "components/KnowledgeCentreNav.tsx"), "utf8");
    assert.ok(!src.includes('href: "/knowledge"'), "/knowledge is a later PR");
  });

  test("the downloads index renders the shared nav", () => {
    assert.match(source("downloads/page.tsx"), /KnowledgeCentreNav/);
  });
});
