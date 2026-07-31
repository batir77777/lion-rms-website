"use client";

import { useMemo, useState } from "react";
import NewsCard, { type NewsCardProps } from "@/components/NewsCard";
import {
  applyNewsFilters,
  describeNewsFilters,
  announceNewsResults,
  type NewsFilterState,
} from "@/lib/news-filtering";

export interface FilterableNews extends NewsCardProps {
  category: string;
}

export interface FilterOption {
  slug: string;
  label: string;
  count: number;
}

// Client-side filtering for /news (Phase 5A, PR 7).
//
// Two axes, following LegislationFilter's pattern: URL-free, server-rendered
// at build time so crawlers and no-JS readers see every item, with the
// decision logic in lib/news-filtering.ts so it can be tested without a
// render.
//
// Deliberately NOT a third axis for year. Year is already a real route at
// /news/[year]; duplicating it here would give the same content two addresses,
// one of which crawlers cannot reach and neither of which is canonical.
export default function NewsFilter({
  items,
  formats,
  categories,
}: {
  items: FilterableNews[];
  formats: FilterOption[];
  categories: FilterOption[];
}) {
  const [state, setState] = useState<NewsFilterState>({ format: null, category: null });

  const visible = useMemo(() => applyNewsFilters(items, state), [items, state]);

  const labels = {
    format: state.format
      ? (formats.find((f) => f.slug === state.format)?.label ?? state.format)
      : null,
    category: state.category
      ? (categories.find((c) => c.slug === state.category)?.label ?? state.category)
      : null,
  };

  const description = describeNewsFilters(state, labels);
  const reset = () => setState({ format: null, category: null });

  const toggle = <K extends keyof NewsFilterState>(key: K, value: string) =>
    setState((s) => ({ ...s, [key]: s[key] === value ? null : value }));

  return (
    <div>
      <div className="mb-10 space-y-5">
        <FilterGroup id="news-format" heading="Filter by type of item">
          <FilterButton
            label={`All items (${items.length})`}
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

        <FilterGroup id="news-category" heading="Filter by subject">
          <FilterButton
            label={`All subjects (${items.length})`}
            pressed={state.category === null}
            onClick={() => setState((s) => ({ ...s, category: null }))}
          />
          {categories.map((c) => (
            <FilterButton
              key={c.slug}
              label={`${c.label} (${c.count})`}
              pressed={state.category === c.slug}
              onClick={() => toggle("category", c.slug)}
            />
          ))}
        </FilterGroup>
      </div>

      <p aria-live="polite" className="sr-only">
        {announceNewsResults(visible.length, description)}
      </p>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <p className="text-lg font-semibold text-navy-900">
            No items match {description}.
          </p>
          <p className="mt-2 text-base text-slate-600">
            That combination has nothing in the library yet. It does not mean nothing
            has happened — only that we have not published on it.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 inline-flex rounded-full border border-teal-700 bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Show all news
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {visible.map((item, i) => (
            <NewsCard key={item.slug} {...item} delay={i * 60} />
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
