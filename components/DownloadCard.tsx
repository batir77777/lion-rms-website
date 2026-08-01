import Link from "next/link";
import Reveal from "@/components/Reveal";

export interface DownloadCardProps {
  slug: string;
  title: string;
  summary: string;
  typeLabel: string;
  /** Human labels for every way the resource can be obtained. */
  formatLabels: string[];
  version: string;
  updatedLabel?: string;
  updatedIso?: string;
  /** True where the landing page itself is the printable resource. */
  printable: boolean;
  delay?: number;
}

// Card used on the /downloads listing (Phase 5A, PR 8A).
// Follows NewsCard and StandardCard rather than introducing a fourth visual
// language.
//
// The formats are on the card deliberately. A reader arriving here usually has
// a constraint before they have a preference — they need something they can
// print for a clipboard, or something they can type into. Making them open a
// page to discover it is a PDF wastes the trip, and on a phone on site that
// trip is expensive.
export default function DownloadCard({
  slug,
  title,
  summary,
  typeLabel,
  formatLabels,
  version,
  updatedLabel,
  updatedIso,
  printable,
  delay = 0,
}: DownloadCardProps) {
  return (
    <Reveal delay={delay}>
      <Link
        href={`/downloads/${slug}`}
        className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-teal-800">
            {typeLabel}
          </span>
          {formatLabels.map((f) => (
            <span
              key={f}
              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-slate-700"
            >
              {f}
            </span>
          ))}
          {printable && (
            <span className="inline-flex items-center rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-navy-900">
              Printable
            </span>
          )}
        </div>

        <h2 className="text-xl font-bold leading-snug text-navy-900 transition group-hover:text-teal-800">
          {title}
        </h2>

        <p className="mt-4 flex-1 text-base leading-relaxed text-slate-600">{summary}</p>

        <dl className="mt-5 space-y-1 border-t border-slate-100 pt-4 text-sm">
          <div className="flex gap-2">
            <dt className="font-semibold text-navy-900">Version</dt>
            <dd className="text-slate-600">{version}</dd>
          </div>
          {updatedLabel && updatedIso && (
            <div className="flex gap-2">
              <dt className="font-semibold text-navy-900">Updated</dt>
              <dd className="text-slate-600">
                <time dateTime={updatedIso}>{updatedLabel}</time>
              </dd>
            </div>
          )}
        </dl>
      </Link>
    </Reveal>
  );
}
