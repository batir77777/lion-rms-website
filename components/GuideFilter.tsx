"use client";

import { useMemo, useState } from "react";
import GuideCard, { type GuideCardProps } from "@/components/GuideCard";

export interface FilterableGuide extends GuideCardProps {
  categorySlug: string;
}

export interface CategoryOption {
  slug: string;
  label: string;
  count: number;
}

// Client-side category filter for /guides (Phase 5A, PR 3).
//
// Deliberately client-side and URL-free. A `?category=` parameter would create
// a second indexable representation of a subset that the (deferred) category
// hub routes are the proper home for, so filtering changes what is shown and
// nothing else — no navigation, no request, no canonical question.
//
// Every card is still present in the statically generated HTML: this is a
// client component, but Next.js server-renders it at build time, so crawlers
// and no-JS readers see all guides. Filtering is a progressive enhancement.
//
// Accessibility: a real button group with aria-pressed rather than a <select>,
// and an aria-live region announcing the result count, so a screen-reader user
// is told what changed rather than having to go looking for it.
export default function GuideFilter({
  guides,
  categories,
}: {
  guides: FilterableGuide[];
  categories: CategoryOption[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const visible = useMemo(
    () => (active ? guides.filter((g) => g.categorySlug === active) : guides),
    [active, guides]
  );

  const activeLabel = active
    ? categories.find((c) => c.slug === active)?.label ?? active
    : null;

  return (
    <div>
      {categories.length > 1 && (
        <div className="mb-10">
          <h2 id="guide-filter-heading" className="sr-only">
            Filter guides by category
          </h2>
          <div
            role="group"
            aria-labelledby="guide-filter-heading"
            className="flex flex-wrap gap-2"
          >
            <FilterButton
              label={`All guides (${guides.length})`}
              pressed={active === null}
              onClick={() => setActive(null)}
            />
            {categories.map((c) => (
              <FilterButton
                key={c.slug}
                label={`${c.label} (${c.count})`}
                pressed={active === c.slug}
                onClick={() => setActive(active === c.slug ? null : c.slug)}
              />
            ))}
          </div>
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {activeLabel
          ? `Showing ${visible.length} ${visible.length === 1 ? "guide" : "guides"} in ${activeLabel}.`
          : `Showing all ${visible.length} guides.`}
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((g, i) => (
          <GuideCard key={g.slug} {...g} delay={i * 60} />
        ))}
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
