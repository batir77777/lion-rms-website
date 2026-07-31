"use client";

import { useMemo, useState } from "react";
import LegislationCard, { type LegislationCardProps } from "@/components/LegislationCard";
import {
  applyLegislationFilters,
  describeLegislationFilters,
  announceLegislationResults,
  STATUS_GROUP_LABELS,
  type LegislationFilterState,
} from "@/lib/legislation-filtering";

export interface FilterableLegislation extends LegislationCardProps {
  application: string[];
  tier: string;
  statusGroup: string;
}

export interface FilterOption {
  slug: string;
  label: string;
  count: number;
}

// Client-side filtering for /legislation (Phase 5A, PR 6).
//
// Three axes, following StandardFilter's pattern: URL-free, server-rendered at
// build time so crawlers and no-JS readers see everything, with the decision
// logic in lib/legislation-filtering.ts so it can be tested without a render.
//
// The jurisdiction axis filters on APPLICATION, not extent, because the
// question a reader is asking is "does this apply to me". It also matches on
// containment: filtering for Scotland returns instruments applying to Scotland
// AND those applying to Great Britain or the United Kingdom, because those
// apply to a Scottish reader too. Strict equality would hide the Health and
// Safety at Work Act from them, which on a compliance reference would be worse
// than unhelpful.
//
// Unlike the Standards listing, three axes make an empty result GENUINELY
// REACHABLE in the launch set — 22 of the 96 combinations match nothing, and
// "No longer in force" reaches it in one click because no launch instrument is
// repealed or revoked. So the empty state has a manual path as well as
// deterministic coverage, and it names the combination that produced it.
export default function LegislationFilter({
  items,
  jurisdictions,
  tiers,
}: {
  items: FilterableLegislation[];
  jurisdictions: FilterOption[];
  tiers: FilterOption[];
}) {
  const [state, setState] = useState<LegislationFilterState>({
    jurisdiction: null,
    tier: null,
    statusGroup: null,
  });

  const visible = useMemo(() => applyLegislationFilters(items, state), [items, state]);

  const labels = {
    jurisdiction: state.jurisdiction
      ? (jurisdictions.find((j) => j.slug === state.jurisdiction)?.label ?? state.jurisdiction)
      : null,
    tier: state.tier
      ? (tiers.find((t) => t.slug === state.tier)?.label ?? state.tier)
      : null,
    statusGroup: state.statusGroup
      ? (STATUS_GROUP_LABELS[state.statusGroup] ?? state.statusGroup)
      : null,
  };

  const description = describeLegislationFilters(state, labels);
  const reset = () => setState({ jurisdiction: null, tier: null, statusGroup: null });

  const statusCounts = (group: string) =>
    items.filter((i) => i.statusGroup === group).length;

  const toggle = <K extends keyof LegislationFilterState>(key: K, value: string) =>
    setState((s) => ({ ...s, [key]: s[key] === value ? null : value }));

  return (
    <div>
      <div className="mb-10 space-y-5">
        <FilterGroup id="legislation-jurisdiction" heading="Filter by where it applies">
          <FilterButton
            label={`All jurisdictions (${items.length})`}
            pressed={state.jurisdiction === null}
            onClick={() => setState((s) => ({ ...s, jurisdiction: null }))}
          />
          {jurisdictions.map((j) => (
            <FilterButton
              key={j.slug}
              label={`${j.label} (${j.count})`}
              pressed={state.jurisdiction === j.slug}
              onClick={() => toggle("jurisdiction", j.slug)}
            />
          ))}
        </FilterGroup>

        <FilterGroup id="legislation-tier" heading="Filter by type of legislation">
          <FilterButton
            label={`All types (${items.length})`}
            pressed={state.tier === null}
            onClick={() => setState((s) => ({ ...s, tier: null }))}
          />
          {tiers.map((t) => (
            <FilterButton
              key={t.slug}
              label={`${t.label} (${t.count})`}
              pressed={state.tier === t.slug}
              onClick={() => toggle("tier", t.slug)}
            />
          ))}
        </FilterGroup>

        <FilterGroup id="legislation-status" heading="Filter by status">
          <FilterButton
            label={`All statuses (${items.length})`}
            pressed={state.statusGroup === null}
            onClick={() => setState((s) => ({ ...s, statusGroup: null }))}
          />
          {(["in-force", "not-fully-in-force", "no-longer-in-force"] as const).map((g) => (
            <FilterButton
              key={g}
              label={`${STATUS_GROUP_LABELS[g]} (${statusCounts(g)})`}
              pressed={state.statusGroup === g}
              onClick={() => toggle("statusGroup", g)}
            />
          ))}
        </FilterGroup>
      </div>

      <p aria-live="polite" className="sr-only">
        {announceLegislationResults(visible.length, description)}
      </p>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <p className="text-lg font-semibold text-navy-900">
            No legislation matches {description}.
          </p>
          <p className="mt-2 text-base text-slate-600">
            That combination has no entries in the library yet. It does not mean no such
            legislation exists — only that this library does not cover it.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 inline-flex rounded-full border border-teal-700 bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Show all legislation
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {visible.map((item, i) => (
            <LegislationCard key={item.slug} {...item} delay={i * 60} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 id={`${id}-heading`} className="sr-only">
        {heading}
      </h2>
      <div role="group" aria-labelledby={`${id}-heading`} className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
}

function FilterButton({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
        pressed
          ? "border-teal-700 bg-teal-700 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:text-teal-700"
      }`}
    >
      {label}
    </button>
  );
}
