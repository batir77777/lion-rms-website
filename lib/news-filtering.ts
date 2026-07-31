// Pure filtering logic for the News listing (Phase 5A, PR 7).
//
// Same pattern as lib/standard-filtering.ts and lib/legislation-filtering.ts:
// the decision logic lives outside the component so it can be tested without
// a render.
//
// Two axes here — format and category — rather than Legislation's three. That
// is deliberate. A third axis (year) already exists as a real route at
// /news/[year], and duplicating it as a client-side filter would give the same
// content two addresses, one of which crawlers cannot reach.

export interface FilterableNewsLike {
  format: string;
  category: string;
}

export interface NewsFilterState {
  format: string | null;
  category: string | null;
}

export const NO_FILTERS: NewsFilterState = { format: null, category: null };

export function applyNewsFilters<T extends FilterableNewsLike>(
  items: readonly T[],
  state: NewsFilterState
): T[] {
  return items
    .filter((i) => (state.format ? i.format === state.format : true))
    .filter((i) => (state.category ? i.category === state.category : true));
}

/**
 * A human description of what is filtered, or null when nothing is.
 *
 * Feeds both the live-region announcement and the empty state. A reader who
 * filters into an empty page — a screen-reader user especially — must be told
 * WHICH combination produced no results, not merely that there are none.
 */
export function describeNewsFilters(
  state: NewsFilterState,
  labels: { format?: string | null; category?: string | null }
): string | null {
  const parts = [
    state.format ? (labels.format ?? state.format) : null,
    state.category ? (labels.category ?? state.category) : null,
  ].filter(Boolean) as string[];
  return parts.length > 0 ? parts.join(", ") : null;
}

export function announceNewsResults(count: number, description: string | null): string {
  const noun = count === 1 ? "item" : "items";
  return description
    ? `Showing ${count} ${noun}: ${description}.`
    : `Showing all ${count} ${noun}.`;
}
