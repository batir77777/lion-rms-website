/*
 * Print the current content hash of every authored sitemap route.
 *
 * The test suite already fails and names any route whose rendered content has
 * drifted from the hash recorded in lib/page-dates.ts. This exists for when you
 * would rather read all seventeen at once — after a sweep that touched many
 * pages, for instance — than run the suite repeatedly.
 *
 * Usage:  npm run build && npm run sitemap:hashes
 *
 * It reports, it does not write. Deciding whether a change was substantive
 * enough to move `lastModified` is a judgement, and a script that edited the
 * registry would quietly make that judgement for you — always in the direction
 * of "nothing to see here", because it cannot read the diff.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const OUT_DIR = ".next/server/app";

if (!fs.existsSync(OUT_DIR)) {
  console.error(`No build found at ${OUT_DIR}. Run "npm run build" first.`);
  process.exit(1);
}

/* Duplicated from lib/page-dates.ts, which is TypeScript and cannot be
   imported by a plain Node script. tests/sitemap-dates.test.mjs asserts the two
   agree by checking the recorded hashes against this same build output.
   The name part must include "%": a DYNAMIC route's chunk path is
   percent-encoded (static/chunks/app/services/%5Bslug%5D/page-<hash>.js).
   This copy fell out of sync with lib/page-dates.ts's normalisePageHtml when
   PR10 added "%" there and not here — discovered during repositioning PR1
   when this script reported /services/fire-safety and
   /services/fire-engineering as changed while the real, test-suite-enforced
   normaliser agreed they had not. Fixed here so this reporting tool matches
   the function that actually governs the registry again. */
const normalisePageHtml = (html) => {
  const candidates = new Set();
  const comment = html.match(/<!--([A-Za-z0-9_-]{16,})-->/)?.[1];
  if (comment) candidates.add(comment);
  for (const m of html.matchAll(/\\"b\\":\\"([A-Za-z0-9_-]{16,})\\"/g)) candidates.add(m[1]);
  let out = html;
  for (const id of candidates) out = out.split(id).join("BUILD_ID");
  return out
    .replace(/(\/_next\/)?static\/chunks\/([A-Za-z0-9._%/-]*?)-[0-9a-f]{16,}\.js/g, "$1static/chunks/$2-HASH.js")
    .replace(/(\/_next\/)?static\/css\/[0-9a-f]{8,}\.css/g, "$1static/css/HASH.css");
};

const registry = fs.readFileSync("lib/page-dates.ts", "utf8");
const recorded = new Map(
  [...registry.matchAll(/"([^"]+)":\s*\{\s*lastModified:\s*"([\d-]+)",\s*contentHash:\s*"([0-9a-f]{16})"/g)].map(
    (m) => [m[1], { lastModified: m[2], contentHash: m[3] }]
  )
);

if (recorded.size === 0) {
  console.error("Could not read any entries from lib/page-dates.ts — has its shape changed?");
  process.exit(1);
}

let drifted = 0;
console.log("\n  route                                                       date         hash              status");
console.log("  " + "-".repeat(104));

for (const [route, entry] of recorded) {
  const file = path.join(OUT_DIR, `${route === "/" ? "index" : route.slice(1)}.html`);
  if (!fs.existsSync(file)) {
    console.log(`  ${route.padEnd(58)} ${entry.lastModified}   ${"-".repeat(16)}  NOT BUILT`);
    drifted += 1;
    continue;
  }
  const actual = crypto
    .createHash("sha256")
    .update(normalisePageHtml(fs.readFileSync(file, "utf8")))
    .digest("hex")
    .slice(0, 16);
  const changed = actual !== entry.contentHash;
  if (changed) drifted += 1;
  console.log(
    `  ${route.padEnd(58)} ${entry.lastModified}   ${actual}  ${changed ? `CHANGED (recorded ${entry.contentHash})` : "ok"}`
  );
}

console.log();
if (drifted) {
  console.log(
    `  ${drifted} route(s) changed. Update contentHash in lib/page-dates.ts, and update\n` +
      `  lastModified TOO if a reader would notice the change — leave it if this was\n` +
      `  accessibility, layout, metadata or refactor work only.\n`
  );
  process.exit(1);
}
console.log("  All authored routes match their recorded hashes.\n");
