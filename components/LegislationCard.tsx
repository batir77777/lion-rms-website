import Link from "next/link";
import Reveal from "@/components/Reveal";
import { ForceStatusBadge } from "@/components/LegislationStatusBanner";

export interface LegislationCardProps {
  slug: string;
  /** The legal short title — the primary line, and what readers search for. */
  shortTitle: string;
  citation: string;
  summary: string;
  tierLabel: string;
  formLabel: string;
  extentLabel: string;
  applicationLabel: string;
  /** True where extent and application differ, so the card flags it. */
  territoryDiffers: boolean;
  forceStatus: string;
  statusLabel: string;
  outstandingEffectCount: number;
  delay?: number;
}

// Card used on the /legislation listing (Phase 5A, PR 6). Follows
// StandardCard rather than introducing a third visual language.
//
// Two things appear here that no other card on the site carries, because both
// change whether a reader should act on the page at all: a flag where extent
// and application differ, and a count of outstanding effects. Making a reader
// open the page to discover the official text is incomplete would defeat the
// purpose of recording it.
export default function LegislationCard({
  slug,
  shortTitle,
  citation,
  summary,
  tierLabel,
  formLabel,
  extentLabel,
  applicationLabel,
  territoryDiffers,
  forceStatus,
  statusLabel,
  outstandingEffectCount,
  delay = 0,
}: LegislationCardProps) {
  return (
    <Reveal delay={delay}>
      <Link
        href={`/legislation/${slug}`}
        className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl"
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <ForceStatusBadge forceStatus={forceStatus} statusLabel={statusLabel} />
          {outstandingEffectCount > 0 && (
            <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-amber-900">
              {outstandingEffectCount} unapplied{" "}
              {outstandingEffectCount === 1 ? "effect" : "effects"}
            </span>
          )}
        </div>

        <h3 className="text-xl font-extrabold leading-snug text-navy-900">{shortTitle}</h3>
        <p className="mt-1 text-base font-semibold text-slate-700">{citation}</p>

        <p className="mt-4 flex-1 text-base leading-relaxed text-slate-500">{summary}</p>

        <dl className="mt-6 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-navy-900">Type</dt>
            <dd className="text-slate-600">
              {tierLabel} · {formLabel}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-navy-900">Applies in</dt>
            <dd className="text-slate-600">
              {applicationLabel}
              {territoryDiffers && (
                <span className="block text-slate-600">
                  Extends to {extentLabel}
                </span>
              )}
            </dd>
          </div>
        </dl>
      </Link>
    </Reveal>
  );
}
