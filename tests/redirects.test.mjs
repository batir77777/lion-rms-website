// Redirect-map tests (Phase 5A, PR 3).
//
// These assert the declarative contract in next.config.mjs: that every legacy
// Insights URL has exactly one permanent rule, that its destination is a real
// published guide, and that no rule's destination is itself another rule's
// source — which is what a redirect chain looks like before it reaches a
// browser.
//
// The complementary check — that a live server actually answers 308 with the
// expected Location, and that the destination answers 200 — is a
// preview-deployment verification step rather than a unit test, because it
// needs a running server. Both are required before merge; this file is the
// half that can run in CI without one.
//
// These rules are permanent. 308 responses are cached indefinitely by
// browsers, so a rule removed from this file is not undone for anyone who has
// already followed it. The migration is fix-forward only after merge.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

before(() => {
  execFileSync("npx", ["velite", "build", "--strict", "--clean", "--silent"], {
    cwd: repoRoot,
    stdio: "pipe",
  });
});

const LEGACY_SLUGS = [
  "fire-risk-assessments-explained",
  "pas-79-methodology-explained",
  "fire-door-inspections-explained",
  "fire-safety-responsibilities-responsible-person",
  "commercial-fire-safety-compliance",
  "block-management-fire-safety-guidance",
  "pas-9970-bsi-consultation-fire-safety-construction",
];

async function loadRedirects() {
  const { default: config } = await import("../next.config.mjs");
  return config.redirects();
}

describe("Insights to Guides redirect map", () => {
  test("the index and all seven articles have permanent rules", async () => {
    const rules = await loadRedirects();
    const bySource = new Map(rules.map((r) => [r.source, r]));

    const index = bySource.get("/insights");
    assert.ok(index, "/insights has no redirect rule");
    assert.equal(index.destination, "/guides");
    assert.equal(index.permanent, true);

    for (const slug of LEGACY_SLUGS) {
      const rule = bySource.get(`/insights/${slug}`);
      assert.ok(rule, `/insights/${slug} has no redirect rule`);
      assert.equal(rule.destination, `/guides/${slug}`);
      assert.equal(rule.permanent, true);
    }
  });

  test("permanent rules mean 308, which is what the live check must assert", async () => {
    const rules = await loadRedirects();
    for (const rule of rules.filter((r) => r.source.startsWith("/insights"))) {
      // Next.js emits 308 for permanent: true. Google treats 308 and 301 as
      // equivalent for consolidation; the distinction matters only when
      // asserting the status code on a live response.
      assert.equal(rule.permanent, true, `${rule.source} is not permanent`);
    }
  });

  test("every rule is enumerated, never a wildcard", async () => {
    const rules = await loadRedirects();
    for (const rule of rules.filter((r) => r.source.startsWith("/insights"))) {
      assert.equal(
        /[:*]/.test(rule.source),
        false,
        `${rule.source} uses a pattern; a wildcard would redirect paths that should 404`
      );
    }
  });

  test("no rule's destination is another rule's source, so there are no chains", async () => {
    const rules = await loadRedirects();
    const sources = new Set(rules.map((r) => r.source));
    for (const rule of rules) {
      assert.equal(
        sources.has(rule.destination),
        false,
        `chain: ${rule.source} -> ${rule.destination}, which itself redirects`
      );
    }
  });

  test("no rule redirects a path to itself", async () => {
    const rules = await loadRedirects();
    for (const rule of rules) {
      assert.notEqual(rule.source, rule.destination, `loop on ${rule.source}`);
    }
  });

  test("every destination is a guide that actually exists", async () => {
    const rules = await loadRedirects();
    const { getGuide } = await import("../lib/guides");
    for (const rule of rules.filter((r) => r.source.startsWith("/insights/"))) {
      const slug = rule.destination.replace("/guides/", "");
      assert.ok(getGuide(slug), `${rule.destination} does not resolve to a published guide`);
    }
  });

  test("the pre-existing redirects are untouched", async () => {
    const rules = await loadRedirects();
    const bySource = new Map(rules.map((r) => [r.source, r]));
    assert.equal(bySource.get("/ai-automation").destination, "https://www.liondigital.org");
    assert.equal(bySource.get("/areas").destination, "/sectors");
  });

  test("the Downloads redirect has not shipped early", async () => {
    const rules = await loadRedirects();
    const early = rules.find((r) => r.source === "/resources/fire-safety-checklist");
    assert.equal(
      early,
      undefined,
      "/resources/fire-safety-checklist must keep working until the Downloads vertical exists"
    );
  });
});
