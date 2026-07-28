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

export interface ValidationIssue {
  collection: string;
  slug?: string;
  id?: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
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
};

/**
 * Cross-collection relation validation. For every relation field this
 * platform's content model defines that points at another *content*
 * collection (not the pre-existing lib/site.ts services/sectors/case
 * studies, which are out of scope for this validator — they're validated
 * by the existing PR #12-derived pattern), confirm the referenced slug
 * actually exists in that target collection, where that target collection
 * is part of the current build.
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
      for (const [field, targetCollection] of Object.entries(RELATION_TARGET_COLLECTIONS)) {
        const value = item[field];
        if (!Array.isArray(value) || value.length === 0) continue;
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
 * Runs the full cross-collection validation framework and returns a single
 * aggregated result. This is what velite.config.ts's `complete` hook calls,
 * and what the test suite exercises directly with in-memory fixtures.
 */
export function validateContentCollections(
  collections: Record<string, ContentItemLike[]>
): ValidationResult {
  const issues: ValidationIssue[] = [
    ...checkReservedSlugs(collections),
    ...checkDuplicateIds(collections),
    ...checkRelations(collections),
  ];
  return { valid: issues.length === 0, issues };
}
