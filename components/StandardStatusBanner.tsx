import Link from "next/link";

// Status treatment for a Standards page (Phase 5A, PR 5).
//
// Two rules govern everything here.
//
// Status is never conveyed by colour alone. Every state carries a visible text
// label; colour and weight accompany it and never replace it. A reader who
// cannot distinguish the palette must still be able to tell that a document
// has been withdrawn, because that is the single most consequential fact on
// the page.
//
// The banner precedes the body in DOM order. A screen-reader user should meet
// the caveat before the substance, not discover after reading a page of
// commentary that the document it describes no longer stands.

export interface Successor {
  designation: string;
  href: string;
}

export interface StandardStatusBannerProps {
  documentStatus: string;
  statusLabel: string;
  withdrawnLabel?: string;
  successors: Successor[];
  revisionInProgress?: boolean;
  revisionNote?: string;
}

/** States that warrant a prominent banner rather than a quiet badge. */
const BANNER_STATES = new Set(["withdrawn", "superseded", "proposed-for-withdrawal", "under-review"]);

export default function StandardStatusBanner({
  documentStatus,
  statusLabel,
  withdrawnLabel,
  successors,
  revisionInProgress,
  revisionNote,
}: StandardStatusBannerProps) {
  const showBanner = BANNER_STATES.has(documentStatus);
  if (!showBanner && !revisionInProgress) return null;

  const severe = documentStatus === "withdrawn" || documentStatus === "superseded";

  return (
    <div className="mb-8 space-y-4">
      {showBanner && (
        <aside
          // role="note" rather than "alert": the content is present on load
          // rather than announced dynamically, and an alert role would
          // interrupt a screen reader mid-navigation for something that is
          // simply part of the page.
          role="note"
          aria-labelledby="document-status-heading"
          className={`rounded-2xl border p-6 ${
            severe
              ? "border-amber-300 bg-amber-50"
              : "border-slate-300 bg-slate-50"
          }`}
        >
          <h2
            id="document-status-heading"
            className="text-base font-extrabold uppercase tracking-[0.12em] text-navy-900"
          >
            This document is {statusLabel.toLowerCase()}
          </h2>

          <p className="mt-3 text-base leading-relaxed text-slate-700">
            {documentStatus === "withdrawn" && (
              <>
                It has been withdrawn by its publisher
                {withdrawnLabel ? ` (${withdrawnLabel})` : ""} and should not be
                relied on as current guidance.
              </>
            )}
            {documentStatus === "superseded" && (
              <>It has been replaced and should not be relied on as current guidance.</>
            )}
            {documentStatus === "proposed-for-withdrawal" && (
              <>
                Its publisher has proposed withdrawing it. It still stands for
                now, but anyone specifying against it should keep that in view.
              </>
            )}
            {documentStatus === "under-review" && (
              <>
                Its publisher has it under formal review. It still stands, but
                its content may change.
              </>
            )}
          </p>

          {successors.length > 0 && (
            <p className="mt-4 text-base font-semibold text-navy-900">
              {successors.length === 1 ? "Replaced by: " : "Replaced by: "}
              {successors.map((s, i) => (
                <span key={s.href}>
                  {i > 0 && ", "}
                  <Link
                    href={s.href}
                    className="text-teal-700 underline underline-offset-2 hover:text-teal-800"
                  >
                    {s.designation}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </aside>
      )}

      {/*
        A revision project is deliberately NOT the same claim as the
        publisher's own "under review" status. It is recorded as an
        informational note rather than a status banner, because overstating a
        pre-draft project as a formal review on a page practitioners rely on
        would be inaccurate. See the schema comment on revisionInProgress.
      */}
      {revisionInProgress && revisionNote && (
        <aside
          role="note"
          aria-labelledby="document-revision-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6"
        >
          <h2
            id="document-revision-heading"
            className="text-sm font-extrabold uppercase tracking-[0.12em] text-navy-900"
          >
            Revision in progress
          </h2>
          <p className="mt-2 text-base leading-relaxed text-slate-700">{revisionNote}</p>
        </aside>
      )}
    </div>
  );
}

/**
 * Inline status badge for cards and provenance blocks.
 *
 * Text label always present. The dot is decorative and aria-hidden — it adds a
 * second visual cue for sighted readers without becoming the only one.
 */
export function StandardStatusBadge({
  documentStatus,
  statusLabel,
}: {
  documentStatus: string;
  statusLabel: string;
}) {
  const severe = documentStatus === "withdrawn" || documentStatus === "superseded";
  const cautionary =
    documentStatus === "under-review" || documentStatus === "proposed-for-withdrawal";

  const tone = severe
    ? "border-amber-300 bg-amber-50 text-amber-900"
    : cautionary
      ? "border-slate-300 bg-slate-100 text-slate-700"
      : "border-teal-100 bg-teal-50 text-teal-700";

  // bg-teal-500 rather than teal-600: teal-600 is banned outright by
  // tests/contrast-tokens.test.mjs, and this matches the existing dot in
  // GuideCard.
  const dot = severe ? "bg-amber-600" : cautionary ? "bg-slate-500" : "bg-teal-500";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] ${tone}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
      {statusLabel}
    </span>
  );
}
