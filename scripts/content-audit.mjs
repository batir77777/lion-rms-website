#!/usr/bin/env node
// Editorial content audit (Phase 5A, PR 2).
//
// Runs exactly the same validation as `npm run content:build`, but with
// editorial WARNINGS escalated to failures.
//
// The split matters. A normal build must never fail because content aged past
// its review date — that would let an unrelated urgent deployment be blocked
// by the calendar. So overdue reviews, thin meta descriptions and similar
// editorial observations are warnings during `next build`. This command is the
// deliberate, human-invoked (or scheduled-CI) counterpart that treats them as
// something to fix.
//
// Implemented as a script rather than an inline env var in package.json so it
// works identically on Windows, where `CONTENT_AUDIT=1 velite ...` is not
// valid shell syntax.

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";

// Orphaned download assets (Phase 5A, PR 8A).
//
// Velite only copies a file that some MDX file references, so an unreferenced
// document in content/downloads/files/ is not published. It is, however, in a
// PUBLIC GitHub repository, which is the exposure that actually matters: an
// unreviewed draft committed "just to have it somewhere" is readable by anyone
// the moment it lands, whether or not the site ever links to it.
//
// This does not fail the audit. It cannot tell a genuine mistake from a file
// staged a few minutes before the MDX that will reference it, and a check that
// blocks legitimate work gets switched off. It reports, so the answer is a
// decision rather than an oversight.
function reportOrphanedAssets() {
  const filesDir = path.join(process.cwd(), "content", "downloads", "files");
  const contentDir = path.join(process.cwd(), "content", "downloads");
  if (!existsSync(filesDir)) return;

  // README.md documents the directory's own conventions and is not an asset.
  const assets = readdirSync(filesDir).filter(
    (f) => !f.startsWith(".") && !f.endsWith(".md")
  );
  if (assets.length === 0) return;

  const mdx = readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => readFileSync(path.join(contentDir, f), "utf8"))
    .join("\n");

  const orphans = assets.filter((a) => !mdx.includes(a));
  if (orphans.length === 0) return;

  console.warn(
    `\n[audit] ${orphans.length} file(s) in content/downloads/files/ are referenced by no resource:\n` +
      orphans.map((o) => `  - ${o}`).join("\n") +
      `\n[audit] These are not published, but they ARE in the public repository.\n`
  );
}

const npx = process.platform === "win32" ? "npx.cmd" : "npx";

try {
  const output = execFileSync(
    npx,
    ["velite", "build", "--strict", "--clean"],
    {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, CONTENT_AUDIT: "1" },
    }
  );
  process.stdout.write(output);
  reportOrphanedAssets();
  console.log("\n[audit] PASS — no editorial errors or warnings.\n");
  process.exit(0);
} catch (error) {
  process.stdout.write(error.stdout || "");
  process.stderr.write(error.stderr || "");
  console.error("\n[audit] FAIL — editorial issues found (warnings are treated as failures here).\n");
  process.exit(1);
}
