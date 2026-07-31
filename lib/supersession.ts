// Supersession resolution for external-document collections
// (Phase 5A, PR 5).
//
// Deliberately collection-agnostic and free of Velite imports: it operates on
// any array of items carrying `slug` and `supersededBy`, so Standards use it
// today and Legislation uses it unchanged in PR 6, and every function is unit
// tested in-memory without a content build.
//
// The one design decision worth stating: `supersedes` is NEVER authored. Only
// `supersededBy` is declared, on the document that has been replaced, and the
// inverse is computed here. That is the same choice made for the Guide →
// Glossary relation in PR 4, and for the same reason — a relationship authored
// on both sides is a relationship that will eventually disagree with itself.
//
// Every traversal below is ITERATIVE with a visited set. A supersession cycle
// is a content error that rule G4 reports; it must never become a stack
// overflow that takes the build down with no useful message.

export interface SupersedableLike {
  slug: string;
  supersededBy?: string[];
}

/**
 * Any item carrying directed relations, keyed by field name (Phase 5A, PR 6).
 *
 * Generalised from `supersededBy` so the same three guarantees — resolve,
 * reject self-reference, terminate on a cycle — cover the legislation
 * `amends` graph without a second implementation of the same walk.
 */
export interface DirectedRelationLike {
  slug: string;
  [field: string]: unknown;
}

const edges = (item: DirectedRelationLike, field: string): string[] =>
  Array.isArray(item[field]) ? (item[field] as string[]) : [];

/** Targets of a directed relation, resolved. Unresolvable slugs are dropped —
 *  rule L1 reports them at build time, and a render-time throw would be a
 *  worse failure than a missing link. */
export function relatedVia<T extends DirectedRelationLike>(
  item: T,
  field: string,
  all: readonly T[]
): T[] {
  const bySlug = new Map(all.map((i) => [i.slug, i]));
  return edges(item, field)
    .filter((slug) => slug !== item.slug)
    .map((slug) => bySlug.get(slug))
    .filter((i): i is T => Boolean(i));
}

/** The inverse of a directed relation, derived by scanning. Never authored —
 *  which is what stops the two halves ever disagreeing. */
export function inverseVia<T extends DirectedRelationLike>(
  item: T,
  field: string,
  all: readonly T[]
): T[] {
  return all.filter(
    (candidate) => candidate.slug !== item.slug && edges(candidate, field).includes(item.slug)
  );
}

/** True where following `field` from this item returns to it. Iterative with a
 *  visited set: a cycle is a content error rule L2 reports, never a stack
 *  overflow that takes the build down with no useful message. */
export function hasCycleVia<T extends DirectedRelationLike>(
  item: T,
  field: string,
  all: readonly T[]
): boolean {
  const bySlug = new Map(all.map((i) => [i.slug, i]));
  const visited = new Set<string>();
  const queue = [...edges(item, field)];
  while (queue.length > 0) {
    const slug = queue.shift()!;
    if (slug === item.slug) return true;
    if (visited.has(slug)) continue;
    visited.add(slug);
    const next = bySlug.get(slug);
    if (next) queue.push(...edges(next, field));
  }
  return false;
}

/**
 * Direct successors, resolved to real items. Slugs that do not resolve are
 * dropped rather than throwing — rule G2 reports them as an error at build
 * time, so by the time this runs in a page render they cannot exist, and a
 * render-time throw would be a worse failure than a missing link.
 */
export function successorsOf<T extends SupersedableLike>(
  item: T,
  all: readonly T[]
): T[] {
  const bySlug = new Map(all.map((i) => [i.slug, i]));
  return (item.supersededBy ?? [])
    .filter((slug) => slug !== item.slug)
    .map((slug) => bySlug.get(slug))
    .filter((i): i is T => Boolean(i));
}

/**
 * The inverse: documents this one replaced. Derived by scanning every item's
 * `supersededBy` for this slug.
 */
export function predecessorsOf<T extends SupersedableLike>(
  item: T,
  all: readonly T[]
): T[] {
  return all.filter(
    (candidate) =>
      candidate.slug !== item.slug &&
      (candidate.supersededBy ?? []).includes(item.slug)
  );
}

/**
 * Walks forward to the documents that currently stand in place of this one,
 * following chains: if A was superseded by B and B by C, the answer for A is
 * C. Returns an empty array for a document that has not been superseded.
 *
 * Chain-following matters because supersession is not always one hop, and a
 * reader arriving at a twice-replaced document needs the document that
 * actually applies now, not the intermediate one that also no longer stands.
 */
export function currentReplacementsFor<T extends SupersedableLike>(
  item: T,
  all: readonly T[]
): T[] {
  const bySlug = new Map(all.map((i) => [i.slug, i]));
  const visited = new Set<string>([item.slug]);
  const terminal = new Map<string, T>();
  const queue = [...(item.supersededBy ?? [])];

  while (queue.length > 0) {
    const slug = queue.shift()!;
    if (visited.has(slug)) continue;
    visited.add(slug);

    const next = bySlug.get(slug);
    if (!next) continue;

    const onward = (next.supersededBy ?? []).filter((s) => !visited.has(s));
    if (onward.length === 0) {
      terminal.set(next.slug, next);
    } else {
      queue.push(...onward);
    }
  }

  return [...terminal.values()];
}

/**
 * True where following `supersededBy` from this item returns to it.
 * Backs rule G4; exported so the accessor can defend itself independently of
 * validation having run.
 */
export function hasSupersessionCycle<T extends SupersedableLike>(
  item: T,
  all: readonly T[]
): boolean {
  const bySlug = new Map(all.map((i) => [i.slug, i]));
  const visited = new Set<string>();
  const queue = [...(item.supersededBy ?? [])];

  while (queue.length > 0) {
    const slug = queue.shift()!;
    if (slug === item.slug) return true;
    if (visited.has(slug)) continue;
    visited.add(slug);
    const next = bySlug.get(slug);
    if (next) queue.push(...(next.supersededBy ?? []));
  }

  return false;
}
