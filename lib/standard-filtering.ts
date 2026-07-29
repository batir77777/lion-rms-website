// Pure filtering logic for the Standards listing (Phase 5A, PR 5).
//
// Extracted from components/StandardFilter.tsx so it can be tested
// deterministically without a browser, a render or a DOM.
//
// The reason it lives here rather than inline in the component is one specific
// state: the EMPTY RESULT. Two independent filter axes can produce a
// combination that matches nothing, which a single axis cannot. With the eight
// launch documents no such combination exists — every document class contains
// at least one current document — so that branch is unreachable by clicking
// through the real site.
//
// Adding a ninth document purely to make it reachable would be inventing
// content to satisfy a test. Instead the decision logic is pure, and the empty
// case is exercised here against a constructed dataset. The component renders
// what these functions decide, so covering them covers the branch.

export interface FilterableLike {
  documentClass: string;
  isCurrent: boolean;
}

export interface FilterState {
  /** Selected document class, or null for all. */
  documentClass: string | null;
  /** Restrict to documents that still stand. */
  currentOnly: boolean;
}

export const NO_FILTERS: FilterState = { documentClass: null, currentOnly: false };

/**
 * Applies both axes. Order is irrelevant — both are conjunctive — but the
 * class filter runs first because it is the more selective of the two.
 */
export function applyStandardFilters<T extends FilterableLike>(
  standards: readonly T[],
  state: FilterState
): T[] {
  return standards
    .filter((s) => (state.documentClass ? s.documentClass === state.documentClass : true))
    .filter((s) => (state.currentOnly ? s.isCurrent : true));
}

/**
 * A human description of what is currently filtered, or null when nothing is.
 *
 * Feeds both the `aria-live` announcement and the empty state's message. A
 * screen-reader user needs to be told WHICH combination produced no results,
 * not merely that there are none — and a reader who filters their way into an
 * empty page needs the same, plus a way back.
 */
export function describeFilters(
  state: FilterState,
  classLabel: string | null
): string | null {
  if (classLabel && state.currentOnly) return `${classLabel}, current documents only`;
  if (classLabel) return classLabel;
  if (state.currentOnly) return "current documents only";
  return null;
}

/** The announcement text for the live region. */
export function announceResults(count: number, description: string | null): string {
  const noun = count === 1 ? "document" : "documents";
  return description
    ? `Showing ${count} ${noun}: ${description}.`
    : `Showing all ${count} ${noun}.`;
}
