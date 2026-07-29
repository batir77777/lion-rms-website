import Link from "next/link";
import Reveal from "@/components/Reveal";

export interface GuideCardProps {
  slug: string;
  title: string;
  summary: string;
  categoryLabel: string;
  publishedLabel: string;
  reviewedLabel?: string;
  tagLabels: string[];
  delay?: number;
}

// Card used on the /guides index (Phase 5A, PR 3). Follows the existing
// CaseStudyCard pattern rather than introducing a second visual language.
//
// The category renders as unlinked text: category hub routes are deliberately
// not part of PR 3 (revisited at roughly twelve or more guides), and linking to
// a route that does not exist would be worse than not linking at all.
//
// The whole card is one link with the guide title as its accessible name, so a
// screen-reader user gets a meaningful link list rather than a column of
// identical "read more" links.
export default function GuideCard({
  slug,
  title,
  summary,
  categoryLabel,
  publishedLabel,
  reviewedLabel,
  tagLabels,
  delay = 0,
}: GuideCardProps) {
  return (
    <Reveal delay={delay}>
      <Link
        href={`/guides/${slug}`}
        className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl"
      >
        <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
          {categoryLabel}
        </p>

        <h2 className="mb-4 text-xl font-bold leading-snug text-navy-900">{title}</h2>

        <p className="flex-1 text-base leading-relaxed text-slate-500">{summary}</p>

        {tagLabels.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tagLabels.map((t) => (
              <span
                key={t}
                className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <p className="mt-6 text-xs font-medium text-slate-500">
          Published {publishedLabel}
          {reviewedLabel ? ` · Reviewed ${reviewedLabel}` : ""}
        </p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
          Read the guide
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Link>
    </Reveal>
  );
}
