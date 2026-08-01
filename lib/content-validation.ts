// Cross-collection validation framework for the Knowledge Centre content
// platform (Phase 5A, PR 1).
//
// Velite's own `s.slug()` already handles two things well, per-collection,
// during its own build: frontmatter shape/type validation, and duplicate
// *slug* detection within a single collection. Everything here is the
// layer above that — checks that need visibility across the whole set of
// collections at once, which is exactly what Velite's `complete` hook in
// velite.config.ts exists for.
//
// Every function below is a pure function over plain data (no dependency
// on Velite's internal build context), so each is independently unit
// tested in tests/content-validation.test.mjs without needing a real
// Velite build to exercise it.

import { isReservedSlug } from "./reserved-slugs";
import { SERVICE_CATEGORIES, SECTORS } from "./site";
import { CASE_STUDIES } from "./case-studies";
import type { Severity } from "./editorial-rules";
import { validateEditorialRules } from "./editorial-validation";

export interface ValidationIssue {
  collection: string;
  slug?: string;
  id?: string;
  message: string;
  /**
   * Rule identifier (e.g. "B4"), present on editorial issues added in PR 2 so
   * output can be grouped by rule rather than by item.
   */
  rule?: string;
  /**
   * Defaults to "error" when absent, which keeps every PR 1 structural check
   * blocking without needing to be rewritten. Only editorial checks set
   * "warning".
   */
  severity?: Severity;
}

export interface ValidationResult {
  /** True when there are no ERRORS. Warnings do not invalidate a build. */
  valid: boolean;
  /** Everything found, errors and warnings together. */
  issues: ValidationIssue[];
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export interface ContentItemLike {
  id: string;
  slug: string;
  [key: string]: unknown;
}

/**
 * Reserved-slug validation. No item in any collection may use a slug from
 * the central reserved-word registry (lib/reserved-slugs.ts) — this is
 * checked per collection, at the same "does this slug make sense as a URL
 * segment" layer as Velite's own s.slug(), just for a different rule.
 */
export function checkReservedSlugs(
  collections: Record<string, ContentItemLike[]>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const [collectionName, items] of Object.entries(collections)) {
    for (const item of items) {
      if (isReservedSlug(item.slug)) {
        issues.push({
          collection: collectionName,
          slug: item.slug,
          message: `Slug "${item.slug}" is a reserved system route name and cannot be used by content.`,
        });
      }
    }
  }
  return issues;
}

/**
 * Duplicate `id` detection within a single collection. `id` is a separate,
 * stable identifier from `slug` (Section 5.4 of the architecture plan) — it
 * isn't covered by Velite's own s.slug() uniqueness tracking, so it's
 * checked here instead.
 */
export function checkDuplicateIds(
  collections: Record<string, ContentItemLike[]>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const [collectionName, items] of Object.entries(collections)) {
    const seen = new Map<string, string>(); // id -> first slug seen with it
    for (const item of items) {
      const firstSlug = seen.get(item.id);
      if (firstSlug) {
        issues.push({
          collection: collectionName,
          slug: item.slug,
          id: item.id,
          message: `Duplicate id "${item.id}" in collection "${collectionName}" (also used by slug "${firstSlug}").`,
        });
      } else {
        seen.set(item.id, item.slug);
      }
    }
  }
  return issues;
}

// Maps a relation field name to the collection it points into, and the
// human name used in error messages. This is the map that makes "invalid
// relation fails where target collections exist" possible: if a relation
// field's target collection isn't part of this build (e.g. `relatedArticles`
// when only fixture guides exist), missing targets simply can't be
// resolved and are reported the same way an unknown slug would be — the
// architecture plan's optional-href/plain-text-fallback principle applies
// at render time, not at validation time: validation should still catch a
// typo'd or non-existent slug so it never silently degrades to plain text
// when the real problem is a mistake, not an unbuilt section.
const RELATION_TARGET_COLLECTIONS: Record<string, string> = {
  relatedArticles: "guides",
  relatedStandards: "standards",
  relatedLegislation: "legislation",
  relatedGlossaryTerms: "glossaryTerms",
  relatedDownloads: "downloads",
  // Phase 5A PR 7. Points at the news collection from any collection,
  // including news itself — a follow-up item referencing an earlier one is a
  // self-reference by target, which is why it also appears in
  // SELF_REFERENCE_GUARDED_FIELDS below.
  relatedNews: "news",
};

// Relation fields that point WITHIN the item's own collection rather than at a
// fixed target (Phase 5A, PR 5).
//
// `supersededBy` names successor documents in the same collection — a standard
// is superseded by a standard, an Act by an Act. Before this, `supersededBy`
// was not validated at all: a successor slug with a typo in it resolved to
// nothing, rendered as nothing, and reported as nothing. On a page whose entire
// job is to tell a reader "this document no longer stands, here is what
// replaced it", a silently missing successor is the worst possible failure.
//
// Keyed by field name rather than by collection so Legislation inherits the
// check in PR 6 with no change here.
const SELF_RELATION_FIELDS: readonly string[] = ["supersededBy"];

// Relation fields that point at a hand-maintained TypeScript REGISTRY rather
// than at a Velite collection (Phase 5A, PR 8A).
//
// These could not simply be added to RELATION_TARGET_COLLECTIONS above,
// because that map resolves slugs against collections in the current build and
// services, sectors and case studies are plain arrays in lib/site.ts and
// lib/case-studies.ts that never pass through Velite at all.
//
// What changes here, precisely. These three were never validated at BUILD time:
// every page component maps the slug through `getCategory()` / `getSector()` /
// `getCaseStudy()` and then `.filter(Boolean)`, so an unknown slug produced no
// broken link and no error — it produced SILENT OMISSION. The related service
// simply never appeared, and nothing said why. That is a worse failure than a
// broken link, because a broken link at least has a symptom.
//
// They were not wholly unguarded, though, and the earlier comment on
// `checkRelations` pointing at "the existing PR #12-derived pattern" was
// pointing at something real: tests/relation-registry.test.mjs has covered
// them since PR 3, and says in its own header that it should be retired if the
// shared validator ever takes the job over. It is NOT retired here, because it
// still carries two things this rule deliberately does not — a Guides-specific
// `hasPage` assertion from the PR #12 hotfix, and `relatedTerms` — so the two
// are complementary rather than duplicative.
//
// This rule covers every collection rather than only Guides, and moves the
// check from test time to build time, which is where a typo needs to be caught
// to never reach production.
//
// It deliberately does NOT require the target to have a live page. A sector
// with no page of its own is a known entity that legitimately renders as plain
// text — RelatedContent supports a label with no href precisely for that — and
// requiring a page here would break the optional-link fallback rather than
// protect it. The runtime `.filter(Boolean)` also stays exactly where it is, as
// defence in depth. What this stops is a MISTAKE hiding inside a mechanism
// built for a legitimate case.
const SERVICE_CATEGORY_SLUGS: readonly string[] = SERVICE_CATEGORIES.map((c) => c.slug);
const SECTOR_SLUGS: readonly string[] = SECTORS.map((x) => x.slug);
const CASE_STUDY_SLUGS: readonly string[] = CASE_STUDIES.map((c) => c.slug);

const REGISTRY_TARGET_FIELDS: Record<string, { label: string; slugs: readonly string[] }> = {
  relatedServices: { label: "service category", slugs: SERVICE_CATEGORY_SLUGS },
  relatedSectors: { label: "sector", slugs: SECTOR_SLUGS },
  relatedCaseStudies: { label: "case study", slugs: CASE_STUDY_SLUGS },
};

/**
 * Registry-relation validation (Phase 5A, PR 8A).
 *
 * Applies to every collection, not only Downloads: the defect it fixes is
 * sitewide, and Guides have carried `relatedServices` since PR 3.
 */
export function checkRegistryRelations(
  collections: Record<string, ContentItemLike[]>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const [collectionName, items] of Object.entries(collections)) {
    for (const item of items ?? []) {
      for (const [field, target] of Object.entries(REGISTRY_TARGET_FIELDS)) {
        const value = item[field];
        if (!Array.isArray(value) || value.length === 0) continue;
        const known = new Set(target.slugs);
        for (const referencedSlug of value as string[]) {
          if (!known.has(referencedSlug)) {
            issues.push({
              collection: collectionName,
              slug: item.slug,
              id: item.id,
              rule: "G18",
              message: `"${item.slug}" has ${field} referencing "${referencedSlug}", which is not a known ${target.label}. It would be silently dropped at render time.`,
            });
          }
        }
      }
    }
  }

  return issues;
}

/**
 * Cross-collection relation validation. For every relation field this
 * platform's content model defines that points at another *content*
 * collection, confirm the referenced slug actually exists in that target
 * collection, where that target collection is part of the current build.
 *
 * Relations pointing at the lib/site.ts and lib/case-studies.ts registries are
 * handled by `checkRegistryRelations` above, for the reason set out there.
 */
export function checkRelations(
  collections: Record<string, ContentItemLike[]>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const slugSetsByCollection: Record<string, Set<string>> = {};
  for (const [collectionName, items] of Object.entries(collections)) {
    slugSetsByCollection[collectionName] = new Set(items.map((i) => i.slug));
  }

  for (const [collectionName, items] of Object.entries(collections)) {
    for (const item of items) {
      // Self-referencing relations first — the target is the item's own
      // collection, which is always present in the build by definition.
      for (const field of SELF_RELATION_FIELDS) {
        const value = item[field];
        if (!Array.isArray(value) || value.length === 0) continue;
        const targetSlugs = slugSetsByCollection[collectionName] ?? new Set<string>();
        for (const referencedSlug of value as string[]) {
          if (!targetSlugs.has(referencedSlug)) {
            issues.push({
              collection: collectionName,
              slug: item.slug,
              id: item.id,
              rule: "G2",
              message: `"${item.slug}" has ${field} referencing "${referencedSlug}", which does not exist in the "${collectionName}" collection.`,
            });
          }
        }
      }

      for (const [field, targetCollection] of Object.entries(RELATION_TARGET_COLLECTIONS)) {
        const value = item[field];
        if (!Array.isArray(value) || value.length === 0) continue;

        // A relation whose target is the item's own collection can name the
        // item itself, which a plain existence check would happily accept
        // because the slug does exist. `relatedNews` on a news item is the
        // first such case (Phase 5A PR 7); the same guard covers any future
        // field pointing at its own collection.
        if (targetCollection === collectionName) {
          for (const referencedSlug of value as string[]) {
            if (referencedSlug === item.slug) {
              issues.push({
                collection: collectionName,
                slug: item.slug,
                id: item.id,
                message: `"${item.slug}" lists itself in ${field}.`,
              });
            }
          }
        }
        // Only validate against a target collection that exists in this
        // build — an empty/absent target collection means "not built yet",
        // not "every reference to it is wrong". PR 1 ships fixture-only
        // collections, so in practice every relation target below is
        // exercised deliberately by the fixtures, not accidentally skipped.
        const targetSlugs = slugSetsByCollection[targetCollection];
        if (!targetSlugs) continue;
        for (const referencedSlug of value as string[]) {
          if (!targetSlugs.has(referencedSlug)) {
            issues.push({
              collection: collectionName,
              slug: item.slug,
              id: item.id,
              message: `"${item.slug}" has ${field} referencing "${referencedSlug}", which does not exist in the "${targetCollection}" collection.`,
            });
          }
        }
      }
    }
  }

  return issues;
}

/**
 * Runs the full validation framework — PR 1's structural checks plus PR 2's
 * editorial checks — and returns a single aggregated result.
 *
 * Structural issues are always errors and always block the build. Editorial
 * issues carry their own severity: errors block, warnings are reported only.
 * The deliberate consequence is that a review date falling due can never break
 * a deployment; only a real defect can. `npm run content:audit` re-runs the
 * same validation with warnings escalated to failures.
 *
 * `options.now` is injectable so date-dependent rules are deterministic under
 * test and fixtures do not rot as the real clock moves past them.
 */
export function validateContentCollections(
  collections: Record<string, ContentItemLike[]>,
  options: {
    now?: string;
    /**
     * Resolves an emitted asset URL to its real size in bytes, or undefined if
     * it is not on disk (Phase 5A, PR 8A).
     *
     * Injected rather than imported so this module stays free of filesystem
     * access and every rule remains unit-testable without one. The real
     * implementation lives in velite.config.ts, which can stat the file because
     * Velite writes its output BEFORE invoking the `complete` hook that calls
     * this — the same ordering that makes deriving the size in that hook
     * impossible makes verifying it there reliable.
     */
    sizeOf?: (url: string) => number | undefined;
  } = {}
): ValidationResult {
  const issues: ValidationIssue[] = [
    ...checkReservedSlugs(collections),
    ...checkDuplicateIds(collections),
    ...checkRelations(collections),
    ...checkRegistryRelations(collections),
    ...validateEditorialRules(collections, options),
  ];

  const errors = issues.filter((i) => (i.severity ?? "error") === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  return { valid: errors.length === 0, issues, errors, warnings };
}

/**
 * Formats issues for terminal output, grouped by rule so a run that surfaces
 * twenty instances of one guideline reads as one heading rather than twenty
 * unrelated lines. Warning fatigue is a real failure mode for tooling like
 * this; grouping is the cheapest mitigation.
 */
export function formatIssues(issues: ValidationIssue[]): string {
  if (issues.length === 0) return "";
  const byRule = new Map<string, ValidationIssue[]>();
  for (const i of issues) {
    const key = i.rule ?? "structural";
    if (!byRule.has(key)) byRule.set(key, []);
    byRule.get(key)!.push(i);
  }
  const lines: string[] = [];
  for (const [rule, group] of [...byRule.entries()].sort()) {
    lines.push(`  [${rule}] ${group.length} item${group.length === 1 ? "" : "s"}`);
    for (const i of group) {
      lines.push(`    - ${i.collection}: ${i.message}`);
    }
  }
  return lines.join("\n");
}
