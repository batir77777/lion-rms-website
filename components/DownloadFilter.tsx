"use client";

import { useMemo, useState } from "react";
import DownloadCard, { type DownloadCardProps } from "@/components/DownloadCard";
import {
  applyDownloadFilters,
  describeDownloadFilters,
  announceDownloadResults,
  type DownloadFilterState,
} from "@/lib/downloads-filtering";

export interface FilterableDownload extends DownloadCardProps {
  resourceType: string;
  /** Every format slug this resource can be obtained as, "html" included. */
  formats: string[];
}

export interface FilterOption {
  slug: string;
  label: string;
  count: number;
}

// Client-side filtering for /downloads (Phase 5A, PR 8A).
//
// Two axes, following NewsFilter's pattern: URL-free, server-rendered at build
// time so crawlers and no-JS readers see every resource, with the decision
// logic in lib/downloads-filtering.ts so it can be tested without a render.
//
// The empty state matters more here than on /news, and says something
// different. On the news listing, no results means we have not written about
// something. Here it means the resource a reader needs does not exist in the
// format they need it in — so the copy points at the thing that WILL help,
// which is asking us, rather than leaving them at a dead end.
export default function DownloadFilter({
  items,
  types,
  formats,
}: {
  items: FilterableDownload[];
  types: FilterOption[];
  formats: FilterOption[];
}) {
  const [state, setState] = useState<DownloadFilterState>({ resourceType: null, format: null });

  const visible = useMemo(() => applyDownloadFilters(items, state), [items, state]);

  const labels = {
    resourceType: state.resourceType
      ? (types.find((t) => t.slug === state.resourceType)?.label ?? state.resourceType)
      : null,
    format: state.format
      ? (formats.find((f) => f.slug === state.format)?.label ?? state.format)
      : null,
  };

  const description = describeDownloadFilters(state, labels);
  const reset = () => setState({ resourceType: null, format: null });

  const toggle = <K extends keyof DownloadFilterState>(key: K, value: string) =>
    setState((s) => ({ ...s, [key]: s[key] === value ? null : value }));

  return (
    <div>
      <div className="mb-10 space-y-5">
        <FilterGroup id="downloads-type" heading="Filter by type of resource">
          <FilterButton
            label={`All resources (${items.length})`}
            pressed={state.resourceType === null}
            onClick={() => setState((s) => ({ ...s, resourceType: null }))}
          />
          {types.map((t) => (
            <FilterButton
              key={t.slug}
              label={`${t.label} (${t.count})`}
              pressed={state.resourceType === t.slug}
              onClick={() => toggle("resourceType", t.slug)}
            />
          ))}
        </FilterGroup>

        <FilterGroup id="downloads-format" heading="Filter by format">
          <FilterButton
            label={`Any format (${items.length})`}
            pressed={state.format === null}
            onClick={() => setState((s) => ({ ...s, format: null }))}
          />
          {formats.map((f) => (
            <FilterButton
              key={f.slug}
              label={`${f.label} (${f.count})`}
              pressed={state.format === f.slug}
              onClick={() => toggle("format", f.slug)}
            />
          ))}
        </FilterGroup>
      </div>

      <p aria-live="polite" className="sr-only">
        {announceDownloadResults(visible.length, description)}
      </p>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <p className="text-lg font-semibold text-navy-900">
            No resources match {description}.
          </p>
          <p className="mt-2 text-base text-slate-600">
            Nothing in the library comes in that combination yet. If you need
            something specific, ask us — it may be quicker than adapting the
            nearest thing.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 inline-flex rounded-full border border-teal-700 bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Show all resources
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {visible.map((item, i) => (
            <DownloadCard key={item.slug} {...item} delay={i * 60} />
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
