import Link from "next/link";
import Reveal from "@/components/Reveal";
import { StandardStatusBadge } from "@/components/StandardStatusBanner";

export interface StandardCardProps {
  slug: string;
  /** The designation — "PAS 79-1:2020". The primary line, because it is what readers scan for. */
  designation: string;
  /** The document's title. Secondary. */
  documentTitle: string;
  summary: string;
  publisher: string;
  currentEdition?: string;
  documentStatus: string;
  statusLabel: string;
  delay?: number;
}

// Card used on the /standards listing (Phase 5A, PR 5). Follows GuideCard
// rather than introducing a second visual language.
//
// Chosen over a data table deliberately. The entries are heterogeneous — some
// carry amendments, some a successor, some an edition year and some a phrase —
// and a table forces empty cells that read as missing information rather than
// as inapplicable. Cards also collapse to one column on a phone without
// horizontal scrolling, which a five-column table does not.
//
// Designation first. Somebody arriving at this page is almost always looking
// for a document they can already name.
//
// The whole card is one link whose accessible name is the designation followed
// by the title, so a screen-reader link list reads as a list of documents
// rather than a column of identical "read more" links.
export default function StandardCard({
  slug,
  designation,
  documentTitle,
  summary,
  publisher,
  currentEdition,
  documentStatus,
  statusLabel,
  delay = 0,
}: StandardCardProps) {
  return (
    <Reveal delay={delay}>
      <Link
        href={`/standards/${slug}`}
        className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl"
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <StandardStatusBadge documentStatus={documentStatus} statusLabel={statusLabel} />
        </div>

        <h3 className="text-xl font-extrabold leading-snug text-navy-900">{designation}</h3>
        <p className="mt-1 text-base font-semibold leading-snug text-slate-700">
          {documentTitle}
        </p>

        <p className="mt-4 flex-1 text-base leading-relaxed text-slate-500">{summary}</p>

        {/*
          Publisher and edition as a definition list rather than free text, so
          each label is programmatically associated with its value instead of
          merely sitting beside it.
        */}
        <dl className="mt-6 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-navy-900">Publisher</dt>
            <dd className="text-slate-600">{publisher}</dd>
          </div>
          {currentEdition && (
            <div>
              <dt className="font-semibold text-navy-900">Edition</dt>
              <dd className="text-slate-600">{currentEdition}</dd>
            </div>
          )}
        </dl>
      </Link>
    </Reveal>
  );
}
