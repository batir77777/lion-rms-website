// Pure filtering logic for the Downloads listing (Phase 5A, PR 8A).
//
// Same pattern as lib/news-filtering.ts: the decision logic lives outside the
// component so it can be tested without a render.
//
// Two axes — resource type and delivery format — and the second one is the
// interesting choice. A reader on this page is usually not browsing a subject;
// they have a job to do and a constraint about how they need to do it. "I need
// something I can fill in on a spreadsheet" and "I need something I can print
// for a clipboard" are the questions the format axis answers, and neither is
// answerable from a category.
//
// Category is deliberately NOT an axis. Every resource in this library sits in
// fire safety or health and safety, so a category filter would split seven
// items into two piles and tell the reader nothing they could not see.

export interface FilterableDownloadLike {
  resourceType: string;
  /** Every way this resource can be obtained, including "html" for printable. */
  formats: readonly string[];
}

export interface DownloadFilterState {
  resourceType: string | null;
  format: string | null;
}

export const NO_FILTERS: DownloadFilterState = { resourceType: null, format: null };

export function applyDownloadFilters<T extends FilterableDownloadLike>(
  items: readonly T[],
  state: DownloadFilterState
): T[] {
  return items
    .filter((i) => (state.resourceType ? i.resourceType === state.resourceType : true))
    .filter((i) => (state.format ? i.formats.includes(state.format) : true));
}

/**
 * A human description of what is filtered, or null when nothing is.
 *
 * Feeds both the live-region announcement and the empty state. A reader who
 * filters into an empty page — a screen-reader user especially — must be told
 * WHICH combination produced no results, not merely that there are none.
 */
export function describeDownloadFilters(
  state: DownloadFilterState,
  labels: { resourceType?: string | null; format?: string | null }
): string | null {
  const parts = [
    state.resourceType ? (labels.resourceType ?? state.resourceType) : null,
    state.format ? (labels.format ?? state.format) : null,
  ].filter(Boolean) as string[];
  return parts.length > 0 ? parts.join(", ") : null;
}

export function announceDownloadResults(count: number, description: string | null): string {
  const noun = count === 1 ? "resource" : "resources";
  return description
    ? `Showing ${count} ${noun}: ${description}.`
    : `Showing all ${count} ${noun}.`;
}
