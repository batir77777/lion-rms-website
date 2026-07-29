"use client";

import { useMemo, useState } from "react";
import StandardCard, { type StandardCardProps } from "@/components/StandardCard";
import {
  applyStandardFilters,
  describeFilters,
  announceResults,
} from "@/lib/standard-filtering";

export interface FilterableStandard extends StandardCardProps {
  documentClass: string;
  isCurrent: boolean;
}

export interface ClassOption {
  slug: string;
  label: string;
  count: number;
}

// Client-side filtering for /standards (Phase 5A, PR 5).
//
// Deliberately client-side and URL-free, exactly as GuideFilter is. A
// `?class=pas` parameter would create a second indexable representation of a
// subset with no editorial content of its own, and the standards library has
// no category or tag routes for such a subset to belong to.
//
// Every card is present in the statically generated HTML: this is a client
// component, but Next.js server-renders it at build time, so crawlers and
// no-JS readers see every document. Filtering is progressive enhancement.
//
// Two axes rather than one, and the currency axis defaults to showing
// EVERYTHING. That is the important decision in this file. A reader looking up
// a document they found cited in a five-year-old assessment must find it, and
// must find out it has been withdrawn. Hiding withdrawn documents behind a
// filter would defeat the purpose of publishing their pages at all.
//
// Two independent filters can produce an empty result, which one filter cannot.
// The empty state therefore names the combination that produced it and offers
// a way back, rather than rendering nothing and leaving the reader to guess.
export default function StandardFilter({
  standards,
  classes,
}: {
  standards: FilterableStandard[];
  classes: ClassOption[];
}) {
  const [activeClass, setActiveClass] = useState<string | null>(null);
  const [currentOnly, setCurrentOnly] = useState(false);

  // The decision logic is pure and lives in lib/standard-filtering.ts, so the
  // empty-combination branch below can be covered deterministically without a
  // render — it is unreachable by clicking through the eight launch documents,
  // and adding a ninth purely to reach it would be inventing content to
  // satisfy a test.
  const visible = useMemo(
    () => applyStandardFilters(standards, { documentClass: activeClass, currentOnly }),
    [standards, activeClass, currentOnly]
  );

  const classLabel = activeClass
    ? (classes.find((c) => c.slug === activeClass)?.label ?? activeClass)
    : null;

  const filterDescription = describeFilters(
    { documentClass: activeClass, currentOnly },
    classLabel
  );

  const reset = () => {
    setActiveClass(null);
    setCurrentOnly(false);
  };

  const currentCount = standards.filter((s) => s.isCurrent).length;

  return (
    <div>
      <div className="mb-10 space-y-5">
        {classes.length > 1 && (
          <div>
            <h2 id="standard-class-heading" className="sr-only">
              Filter by document type
            </h2>
            <div
              role="group"
              aria-labelledby="standard-class-heading"
              className="flex flex-wrap gap-2"
            >
              <FilterButton
                label={`All types (${standards.length})`}
                pressed={activeClass === null}
                onClick={() => setActiveClass(null)}
              />
              {classes.map((c) => (
                <FilterButton
                  key={c.slug}
                  label={`${c.label} (${c.count})`}
                  pressed={activeClass === c.slug}
                  onClick={() => setActiveClass(activeClass === c.slug ? null : c.slug)}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 id="standard-currency-heading" className="sr-only">
            Filter by currency
          </h2>
          <div
            role="group"
            aria-labelledby="standard-currency-heading"
            className="flex flex-wrap gap-2"
          >
            <FilterButton
              label={`All documents (${standards.length})`}
              pressed={!currentOnly}
              onClick={() => setCurrentOnly(false)}
            />
            <FilterButton
              label={`Current only (${currentCount})`}
              pressed={currentOnly}
              onClick={() => setCurrentOnly(true)}
            />
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {announceResults(visible.length, filterDescription)}
      </p>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <p className="text-lg font-semibold text-navy-900">
            No documents match {filterDescription}.
          </p>
          <p className="mt-2 text-base text-slate-600">
            That combination of filters has no entries in the library yet.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 inline-flex rounded-full border border-teal-700 bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Show all documents
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {visible.map((s, i) => (
            <StandardCard key={s.slug} {...s} delay={i * 60} />
          ))}
        </div>
      )}
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
