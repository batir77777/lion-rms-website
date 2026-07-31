import Link from "next/link";
import Reveal from "@/components/Reveal";

export interface NewsCardProps {
  slug: string;
  title: string;
  summary: string;
  formatLabel: string;
  categoryLabel: string;
  /** Format slug, so a round-up can be marked without relying on the label. */
  format: string;
  publishedLabel?: string;
  publishedIso?: string;
  /** The one event-side date worth showing on a card, already labelled. */
  leadFact?: { label: string; value: string; iso: string };
  /** True where the item has been corrected since publication. */
  corrected: boolean;
  sourceOrganisation: string;
  delay?: number;
}

// Card used on the /news listing and year archives (Phase 5A, PR 7).
// Follows StandardCard and LegislationCard rather than introducing a third
// visual language.
//
// Two things appear here that the other cards do not carry. A round-up is
// marked as such, because a reader scanning the list needs to know whether
// they are about to open one report or a month of them. And a corrected item
// says so on the card: a correction the reader only discovers after opening
// the page is a correction that failed at the job of being visible.
export default function NewsCard({
  slug,
  title,
  summary,
  formatLabel,
  categoryLabel,
  format,
  publishedLabel,
  publishedIso,
  leadFact,
  corrected,
  sourceOrganisation,
  delay = 0,
}: NewsCardProps) {
  const isRoundUp = format === "monthly-roundup";
  return (
    <Reveal delay={delay}>
      <Link
        href={`/news/${slug}`}
        className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] ${
              isRoundUp
                ? "border border-navy-200 bg-navy-50 text-navy-900"
                : "border border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            {formatLabel}
          </span>
          <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-teal-800">
            {categoryLabel}
          </span>
          {corrected && (
            <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-amber-900">
              Corrected
            </span>
          )}
        </div>

        <h2 className="text-xl font-bold leading-snug text-navy-900 transition group-hover:text-teal-800">
          {title}
        </h2>

        {publishedLabel && publishedIso && (
          <p className="mt-2 text-sm text-slate-500">
            Published <time dateTime={publishedIso}>{publishedLabel}</time>
          </p>
        )}

        <p className="mt-4 flex-1 text-base leading-relaxed text-slate-600">{summary}</p>

        <dl className="mt-5 space-y-1 border-t border-slate-100 pt-4 text-sm">
          {leadFact && (
            <div className="flex gap-2">
              <dt className="font-semibold text-navy-900">{leadFact.label}</dt>
              <dd className="text-slate-600">
                <time dateTime={leadFact.iso}>{leadFact.value}</time>
              </dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="font-semibold text-navy-900">Source</dt>
            <dd className="text-slate-600">{sourceOrganisation}</dd>
          </div>
        </dl>
      </Link>
    </Reveal>
  );
}
