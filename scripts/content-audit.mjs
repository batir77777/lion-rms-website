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
  console.log("\n[audit] PASS — no editorial errors or warnings.\n");
  process.exit(0);
} catch (error) {
  process.stdout.write(error.stdout || "");
  process.stderr.write(error.stderr || "");
  console.error("\n[audit] FAIL — editorial issues found (warnings are treated as failures here).\n");
  process.exit(1);
}
