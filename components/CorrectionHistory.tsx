export interface CorrectionEntry {
  date: string;
  summary: string;
}

// The visible correction record (Phase 5A, PR 7).
//
// Before this, `changelog` existed on every content schema and NO route
// rendered it anywhere on the site. The correction history was machine-
// readable and invisible, which for a monthly round-up is the wrong way round:
// the whole value of a round-up is that it says what was true in a given
// month, and a reader who acted on the original needs to see both what they
// read and what changed.
//
// Rendered as an aside with role="note" rather than inside the article body,
// so it is announced as an adjunct to the report rather than as part of it —
// and placed AFTER the body, because a correction only makes sense once you
// have read what was corrected.
export default function CorrectionHistory({
  correctionNote,
  entries,
  updatedLabel,
  updatedIso,
}: {
  correctionNote?: string;
  entries: CorrectionEntry[];
  updatedLabel?: string;
  updatedIso?: string;
}) {
  if (!correctionNote && entries.length === 0) return null;

  return (
    <aside
      role="note"
      aria-labelledby="correction-history-heading"
      className="mt-12 rounded-2xl border border-amber-300 bg-amber-50 p-6"
    >
      <h2
        id="correction-history-heading"
        className="text-lg font-bold text-navy-900"
      >
        Corrections to this item
      </h2>

      {correctionNote && (
        <p className="mt-3 text-base leading-relaxed text-slate-700">{correctionNote}</p>
      )}

      {updatedLabel && updatedIso && (
        <p className="mt-3 text-sm text-slate-700">
          Last corrected <time dateTime={updatedIso}>{updatedLabel}</time>.
        </p>
      )}

      {entries.length > 0 && (
        <dl className="mt-4 space-y-3">
          {entries.map((entry) => (
            <div key={`${entry.date}-${entry.summary}`}>
              <dt className="text-sm font-semibold text-navy-900">
                <time dateTime={entry.date.slice(0, 10)}>{entry.date.slice(0, 10)}</time>
              </dt>
              <dd className="text-sm leading-relaxed text-slate-700">{entry.summary}</dd>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        The original wording above has not been rewritten. Corrections are recorded
        here so the record of what was published, and what changed, stays intact.
      </p>
    </aside>
  );
}
