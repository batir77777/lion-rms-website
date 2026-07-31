import Link from "next/link";

// Force-status and outstanding-effects treatment for a Legislation page
// (Phase 5A, PR 6).
//
// Three rules govern this file.
//
// Status is never conveyed by colour alone. Every state carries a visible text
// label. On a page about legal duties this is not a nicety: "repealed" is the
// most consequential word that can appear, and a reader who cannot distinguish
// the palette must still read it.
//
// The outstanding-effects notice is NOT ordinary commentary and does not live
// in the body. It is legislation.gov.uk's warning that the official revised
// text is KNOWN not to incorporate all changes — so the text the reader is
// about to rely on is demonstrably incomplete. It renders above everything
// except the legal-advice disclaimer.
//
// Order is fixed by the template, not left to the author: disclaimer, then
// status, then outstanding effects, then the page. A screen-reader user meets
// every caveat before the substance.

export interface Successor {
  label: string;
  href: string;
}

export interface OutstandingEffect {
  effect: string;
  source: string;
  note?: string;
}

/** The general-information notice. Always present, always first. */
export function LegalAdviceNotice({ text }: { text: string }) {
  return (
    <aside
      role="note"
      aria-labelledby="legal-advice-heading"
      className="mb-6 rounded-2xl border border-slate-300 bg-slate-50 p-6"
    >
      <h2
        id="legal-advice-heading"
        className="text-sm font-extrabold uppercase tracking-[0.12em] text-navy-900"
      >
        General information, not legal advice
      </h2>
      <p className="mt-2 text-base leading-relaxed text-slate-700">{text}</p>
    </aside>
  );
}

/** States warranting a prominent banner rather than a badge in the metadata. */
const BANNER_STATES = new Set([
  "not-yet-in-force",
  "partially-in-force",
  "partially-repealed",
  "repealed",
  "revoked",
  "spent",
]);

export default function LegislationStatusBanner({
  forceStatus,
  statusLabel,
  statusNote,
  terminationLabel,
  successors,
}: {
  forceStatus: string;
  statusLabel: string;
  statusNote?: string;
  terminationLabel?: string;
  successors: Successor[];
}) {
  if (!BANNER_STATES.has(forceStatus)) return null;

  const severe = forceStatus === "repealed" || forceStatus === "revoked";

  return (
    <aside
      role="note"
      aria-labelledby="force-status-heading"
      className={`mb-6 rounded-2xl border p-6 ${
        severe ? "border-amber-300 bg-amber-50" : "border-slate-300 bg-slate-50"
      }`}
    >
      <h2
        id="force-status-heading"
        className="text-base font-extrabold uppercase tracking-[0.12em] text-navy-900"
      >
        Status: {statusLabel.toLowerCase()}
      </h2>

      {terminationLabel && (
        <p className="mt-3 text-base leading-relaxed text-slate-700">
          Ceased to have effect on {terminationLabel}.
        </p>
      )}

      {/* The nuance the enum cannot carry. Required on any page whose status
          alone would mislead — see the schema note on statusNote. */}
      {statusNote && (
        <p className="mt-3 text-base leading-relaxed text-slate-700">{statusNote}</p>
      )}

      {successors.length > 0 && (
        <p className="mt-4 text-base font-semibold text-navy-900">
          Replaced by:{" "}
          {successors.map((s, i) => (
            <span key={s.href}>
              {i > 0 && ", "}
              <Link
                href={s.href}
                className="text-teal-700 underline underline-offset-2 hover:text-teal-800"
              >
                {s.label}
              </Link>
            </span>
          ))}
        </p>
      )}
    </aside>
  );
}

/**
 * The outstanding-effects warning.
 *
 * Rendered whenever any effect is recorded. Deliberately worded to say that
 * the OFFICIAL TEXT is incomplete, not that our page is — because that is the
 * fact, and because a reader who follows the official source link needs to
 * know what they will and will not find there.
 */
export function OutstandingEffectsNotice({
  effects,
  asAtLabel,
  asAtStated,
}: {
  effects: OutstandingEffect[];
  asAtLabel?: string;
  asAtStated: boolean;
}) {
  if (effects.length === 0) return null;

  return (
    <aside
      role="note"
      aria-labelledby="outstanding-effects-heading"
      className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-6"
    >
      <h2
        id="outstanding-effects-heading"
        className="text-base font-extrabold uppercase tracking-[0.12em] text-navy-900"
      >
        The official text does not yet include all changes
      </h2>
      <p className="mt-3 text-base leading-relaxed text-slate-700">
        {effects.length === 1
          ? "One change has been made to this instrument but has not yet been applied to the revised text published on legislation.gov.uk."
          : `${effects.length} changes have been made to this instrument but have not yet been applied to the revised text published on legislation.gov.uk.`}{" "}
        {asAtLabel && asAtStated
          ? `The official text was stated as current to ${asAtLabel}.`
          : asAtLabel
            ? `We last confirmed the position on ${asAtLabel}; the source did not display a currency date.`
            : null}
      </p>

      <ul className="mt-4 space-y-3">
        {effects.map((e) => (
          <li key={`${e.source}-${e.effect}`} className="text-base leading-relaxed text-slate-700">
            <span className="font-semibold text-navy-900">{e.effect}</span>
            <span className="block text-sm text-slate-600">
              Source: {e.source}
              {e.note ? ` — ${e.note}` : ""}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** Inline status badge for cards and metadata. Text label always present. */
export function ForceStatusBadge({
  forceStatus,
  statusLabel,
}: {
  forceStatus: string;
  statusLabel: string;
}) {
  const severe = forceStatus === "repealed" || forceStatus === "revoked";
  const partial =
    forceStatus === "partially-in-force" ||
    forceStatus === "partially-repealed" ||
    forceStatus === "not-yet-in-force" ||
    forceStatus === "spent";

  const tone = severe
    ? "border-amber-300 bg-amber-50 text-amber-900"
    : partial
      ? "border-slate-300 bg-slate-100 text-slate-700"
      : "border-teal-100 bg-teal-50 text-teal-700";

  const dot = severe ? "bg-amber-600" : partial ? "bg-slate-500" : "bg-teal-500";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] ${tone}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
      {statusLabel}
    </span>
  );
}
