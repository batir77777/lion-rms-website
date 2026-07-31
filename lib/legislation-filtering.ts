// Pure filtering logic for the Legislation listing (Phase 5A, PR 6).
//
// Same pattern as lib/standard-filtering.ts, and for the same reason: the
// decision logic lives outside the component so it can be tested without a
// render.
//
// Three axes here rather than two, which changes one thing materially. With
// three, an empty result is REACHABLE in the launch dataset — 22 of the 96
// combinations match nothing, and the shortest is a single click on "No longer
// in force", since no launch instrument is repealed or revoked. So the empty
// state has a manual path as well as deterministic coverage. That was not true
// of the Standards listing, where the branch was implemented but unobservable.
//
// Worth being exact about one near-miss, because it is the case that looks
// empty and is not: Scotland plus secondary legislation returns the Management
// of Health and Safety at Work Regulations 1999, which apply to Great Britain
// and therefore to a Scottish reader. That is containment doing its job.

export interface FilterableLegislationLike {
  /** Application jurisdictions — where it actually imposes duties. */
  application: string[];
  tier: string;
  /** Bucketed status: "in-force" | "not-fully-in-force" | "no-longer-in-force". */
  statusGroup: string;
}

export interface LegislationFilterState {
  jurisdiction: string | null;
  tier: string | null;
  statusGroup: string | null;
}

export const NO_FILTERS: LegislationFilterState = {
  jurisdiction: null,
  tier: null,
  statusGroup: null,
};

/**
 * Jurisdictions each filter value should match.
 *
 * Containment is what a reader means. Somebody filtering for Scotland wants
 * instruments applying to Scotland AND those applying to Great Britain or the
 * United Kingdom, because those apply to them too. A strict equality match
 * would hide the Health and Safety at Work Act from a Scottish reader, which
 * would be actively misleading on a compliance reference.
 */
export const JURISDICTION_CONTAINMENT: Record<string, readonly string[]> = {
  england: ["england", "england-and-wales", "great-britain", "united-kingdom"],
  wales: ["wales", "england-and-wales", "great-britain", "united-kingdom"],
  "england-and-wales": ["england-and-wales", "great-britain", "united-kingdom"],
  scotland: ["scotland", "great-britain", "united-kingdom"],
  "northern-ireland": ["northern-ireland", "united-kingdom"],
  "great-britain": ["great-britain", "united-kingdom"],
  "united-kingdom": ["united-kingdom"],
};

/** Buckets the seven force statuses into the three a reader actually asks about. */
export function statusGroupOf(forceStatus: string): string {
  if (forceStatus === "in-force") return "in-force";
  if (forceStatus === "repealed" || forceStatus === "revoked") return "no-longer-in-force";
  // partially-in-force, not-yet-in-force, partially-repealed, spent
  return "not-fully-in-force";
}

export const STATUS_GROUP_LABELS: Record<string, string> = {
  "in-force": "In force",
  "not-fully-in-force": "Not fully in force",
  "no-longer-in-force": "No longer in force",
};

export function applyLegislationFilters<T extends FilterableLegislationLike>(
  items: readonly T[],
  state: LegislationFilterState
): T[] {
  return items
    .filter((i) => {
      if (!state.jurisdiction) return true;
      const matches = JURISDICTION_CONTAINMENT[state.jurisdiction] ?? [state.jurisdiction];
      return i.application.some((a) => matches.includes(a));
    })
    .filter((i) => (state.tier ? i.tier === state.tier : true))
    .filter((i) => (state.statusGroup ? i.statusGroup === state.statusGroup : true));
}

/**
 * A human description of what is filtered, or null when nothing is.
 *
 * Feeds both the live-region announcement and the empty state's message. A
 * reader who filters into an empty page — a screen-reader user especially —
 * must be told WHICH combination produced no results, not merely that there
 * are none.
 */
export function describeLegislationFilters(
  state: LegislationFilterState,
  labels: { jurisdiction?: string | null; tier?: string | null; statusGroup?: string | null }
): string | null {
  const parts = [
    state.jurisdiction ? (labels.jurisdiction ?? state.jurisdiction) : null,
    state.tier ? (labels.tier ?? state.tier) : null,
    state.statusGroup ? (labels.statusGroup ?? state.statusGroup) : null,
  ].filter(Boolean) as string[];
  return parts.length > 0 ? parts.join(", ") : null;
}

export function announceLegislationResults(
  count: number,
  description: string | null
): string {
  const noun = count === 1 ? "instrument" : "instruments";
  return description
    ? `Showing ${count} ${noun}: ${description}.`
    : `Showing all ${count} ${noun}.`;
}
