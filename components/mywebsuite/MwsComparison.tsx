import Reveal from "@/components/Reveal";
import { SectionLabel, GradientText } from "./MwsUi";

const OLD_WAY = [
  "You receive a long report — then it sits in a drawer.",
  "Recommended actions get missed or forgotten.",
  "You're exposed the moment the assessor leaves.",
  "No reminders, no tracking, no oversight.",
];

const LRMS_WAY = [
  "We assess your risks, then load them onto your dashboard.",
  "Every action is tracked from raised to closed.",
  "Automated reminders for reviews and remedial works.",
  "Your records are kept audit-ready with live tracking.",
];

export default function MwsComparison() {
  return (
    <section className="border-y border-slate-100 bg-slate-50 py-28 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>The difference</SectionLabel>
            <h2 className="mb-5 text-4xl font-extrabold leading-tight text-navy-900 sm:text-5xl">
              The old way vs <GradientText>the LRMS way.</GradientText>
            </h2>
            <p className="mb-14 text-lg leading-relaxed text-slate-500">
              Most consultants hand over a PDF and move on. We turn the assessment into live,
              managed compliance that keeps working long after the visit.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-slate-200 bg-white p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">The “static PDF” trap</p>
              <p className="mt-4 text-lg font-bold text-slate-500">Filed away. Forgotten.</p>
              <ul className="mt-5 space-y-3 text-sm text-slate-500">
                {OLD_WAY.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="text-slate-300" aria-hidden>✕</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div
              className="h-full rounded-2xl border border-teal-200 bg-white p-8 shadow-sm"
              style={{ borderLeftWidth: 4, borderLeftColor: "#0ea5a0" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-teal-600">The LRMS way</p>
              <p className="mt-4 text-lg font-bold text-navy-900">Live, managed compliance.</p>
              <ul className="mt-5 space-y-3 text-sm text-navy-900">
                {LRMS_WAY.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="text-teal-500" aria-hidden>✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
