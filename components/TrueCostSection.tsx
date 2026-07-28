import Link from "next/link";
import Reveal from "./Reveal";

// "The true cost of a cheap FRA" — honest comparison of the three ways an FRA
// goes. All claims are factual statements about the legal framework (RRO 2005
// enforcement, unlimited fines) and assessment practice — no invented numbers.

const COLUMNS = [
  {
    title: "The cheap FRA",
    tone: "plain",
    points: [
      "Generic, sometimes desktop-based assessments that barely visit the risk",
      "Missed hazards — the defects that actually start and spread fires",
      "Risk of enforcement action and unlimited fines under the Fire Safety Order",
      "No defence when it matters: a deficient assessment offers little protection in court",
    ],
  },
  {
    title: "The over-cautious FRA",
    tone: "plain",
    points: [
      "Blanket recommendations made to cover the assessor, not the building",
      "Works costing thousands that a competent assessment would never require",
      "Disruption and spend with no proportionate reduction in real risk",
      "A longer action list is not a safer building",
    ],
  },
  {
    title: "The professional FRA",
    tone: "ember",
    points: [
      "Suitable and sufficient, evidence-based and building-specific, with reference to recognised guidance including PAS 79 where appropriate",
      "Prioritised, proportionate actions in plain English",
      "Frequently costs less to implement than over-cautious reports demand",
      "Defensible if ever challenged — and carried out personally by a chartered safety practitioner (CMIOSH)",
    ],
  },
];

function Cross() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
  );
}
function Tick() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
    </svg>
  );
}

export default function TrueCostSection() {
  return (
    <section className="bg-ink-950">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">
            The true cost of a cheap FRA
          </p>
          <h2 className="max-w-3xl text-3xl font-bold text-white sm:text-5xl">
            An FRA from £250 + VAT.{" "}
            <span className="text-teal-400">
              The wrong FRA can cost you thousands.
            </span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-300">
            A fire risk assessment is a legal duty, not a commodity. Where it
            sits on the spectrum below decides what it really costs you.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {COLUMNS.map((col, i) => {
            const ember = col.tone === "ember";
            return (
              <Reveal key={col.title} delay={i * 80} className="h-full">
                <div
                  className={`relative flex h-full flex-col rounded-2xl p-7 ${
                    ember
                      ? "border border-teal-500/50 bg-gradient-to-b from-teal-950/60 to-ink-900 shadow-ember"
                      : "border border-white/10 bg-ink-900/60"
                  }`}
                >
                  {ember && (
                    <span className="absolute -top-3 left-6 rounded-full bg-teal-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                      What you actually need
                    </span>
                  )}
                  <h3
                    className={`font-display text-xl font-semibold ${
                      ember ? "text-teal-300" : "text-ink-200"
                    }`}
                  >
                    {col.title}
                  </h3>
                  <ul className="mt-5 flex-1 space-y-3.5">
                    {col.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-300">
                        {ember ? <Tick /> : <Cross />}
                        <span className={ember ? "text-ink-200" : undefined}>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={260}>
          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-teal-950/40 transition hover:bg-teal-500"
            >
              Get a sensible assessment <span aria-hidden>→</span>
            </Link>
            <p className="mt-3 text-xs text-ink-400">
              Fixed fee confirmed same day — no obligation.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
