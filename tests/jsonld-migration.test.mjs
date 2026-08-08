// Proof that the PR 10 JSON-LD consolidation is a pure refactor.
//
// PR 10 moved four structured-data surfaces — StructuredData, BreadcrumbJsonLd,
// PersonJsonLd and FaqJsonLd — off inline object literals and onto builders in
// lib/content-jsonld.ts, where every other schema on the site already lived.
//
// A refactor that silently changes what search engines are told is not a
// refactor. So the fixture in tests/fixtures/jsonld-before-pr10.json records a
// hash of every JSON-LD object emitted by every built page BEFORE the change —
// 234 objects across 82 routes — and this suite re-derives them from the
// current build and compares.
//
// Hashes rather than whole objects: the full snapshot is 416 KB of duplicated
// site data, and a hash proves equality just as well. The @type is stored
// alongside so a failure names the schema that moved, not just a route.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, ".next/server/app");
const fixturePath = path.join(__dirname, "fixtures/jsonld-before-pr10.json");

const builtPages = (dir = outDir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) builtPages(full, out);
    else if (e.name.endsWith(".html")) out.push(full);
  }
  return out;
};

/* Next.js escapes <, > and & inside inline JSON-LD to keep the script tag
   safe. Reverse that before parsing, exactly as the fixture generator did. */
const parseBlocks = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => m[1].replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/\\u0026/g, "&"))
    .map((raw) => JSON.parse(raw));

const digest = (obj) =>
  crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex").slice(0, 32);

let emitted = {};
let fixture = {};

before(() => {
  if (!fs.existsSync(outDir)) {
    throw new Error("run `npm run build` before this suite — it asserts on built HTML");
  }
  fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  for (const file of builtPages()) {
    const route = path.relative(outDir, file).replace(/\.html$/, "").split(path.sep).join("/");
    const objs = parseBlocks(fs.readFileSync(file, "utf8"));
    if (objs.length) emitted[route] = objs;
  }
});

describe("Emitted JSON-LD is unchanged by the migration", () => {
  test("the same routes emit JSON-LD as before", () => {
    assert.deepEqual(Object.keys(emitted).sort(), Object.keys(fixture).sort());
  });

  test("every route emits the same number of objects, in the same order", () => {
    for (const route of Object.keys(fixture)) {
      assert.deepEqual(
        emitted[route].map((o) => o["@type"]),
        fixture[route].map((f) => f.type),
        `${route} emits a different set or order of schemas`
      );
    }
  });

  test("all 234 objects are byte-identical to the pre-migration snapshot", () => {
    const changed = [];
    for (const [route, expected] of Object.entries(fixture)) {
      expected.forEach((f, i) => {
        const actual = digest(emitted[route][i]);
        if (actual !== f.hash) changed.push(`${route} → ${f.type}`);
      });
    }
    assert.deepEqual(changed, [], `\n  JSON-LD changed for:\n    ${changed.join("\n    ")}\n`);
  });

  test("the snapshot covers the four migrated schemas", () => {
    // Guards the fixture itself: if it were regenerated from a broken build,
    // these counts would move and the equality test above would pass vacuously.
    const counts = {};
    for (const objs of Object.values(fixture)) {
      for (const o of objs) counts[o.type] = (counts[o.type] ?? 0) + 1;
    }
    assert.equal(counts.ProfessionalService, 82, "StructuredData renders on every page");
    assert.equal(counts.BreadcrumbList, 79);
    assert.equal(counts.Person, 1);
    assert.equal(counts.FAQPage, 1);
    assert.equal(Object.values(counts).reduce((a, b) => a + b, 0), 234);
  });
});

describe("The four components are now thin wrappers", () => {
  const read = (p) => fs.readFileSync(path.join(repoRoot, p), "utf8");
  const stripComments = (src) =>
    src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");

  const MIGRATED = {
    "components/StructuredData.tsx": "buildOrganisationSchema",
    "components/BreadcrumbJsonLd.tsx": "buildBreadcrumbListSchema",
    "components/PersonJsonLd.tsx": "buildPersonProfileSchema",
    "components/FaqJsonLd.tsx": "buildFaqPageSchema",
  };

  for (const [file, builder] of Object.entries(MIGRATED)) {
    test(`${path.basename(file)} delegates to ${builder}`, () => {
      const src = stripComments(read(file));
      assert.match(src, new RegExp(`${builder}\\s*\\(`), `${file} does not call ${builder}`);
      assert.match(src, /from "@\/lib\/content-jsonld"/);
      assert.ok(
        !/"@context":\s*"https:\/\/schema\.org"/.test(src),
        `${file} still builds a schema object inline`
      );
    });
  }

  test("no component outside lib/content-jsonld declares a schema @context", () => {
    // The point of the consolidation: one module defines what we tell search
    // engines. This sweeps every component rather than the four we remember.
    const dir = path.join(repoRoot, "components");
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith(".tsx")) continue;
      const src = stripComments(fs.readFileSync(path.join(dir, name), "utf8"));
      assert.ok(
        !/"@context":\s*"https:\/\/schema\.org"/.test(src),
        `components/${name} builds JSON-LD inline; it belongs in lib/content-jsonld.ts`
      );
    }
  });

  test("Crumb is still exported from BreadcrumbJsonLd for its seven importers", () => {
    const src = read("components/BreadcrumbJsonLd.tsx");
    assert.match(src, /export type Crumb/);
  });
});
