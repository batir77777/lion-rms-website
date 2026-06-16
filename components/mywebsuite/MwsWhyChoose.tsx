import Reveal from "@/components/Reveal";
import { SectionLabel, GradientText, PrimaryBtn } from "./MwsUi";

const REASONS = [
  "Consultancy and software in one solution",
  "Practical, commercial advice",
  "Fast turnaround times",
  "Ongoing compliance support",
  "Digital compliance platform",
  "Fire safety specialists",
  "Health & safety specialists",
  "Competency and Responsible Person support",
  "London based — UK-wide coverage",
];

export default function MwsWhyChoose() {
  return (
    <section className="border-y border-slate-100 bg-slate-50 py-28 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Why choose us</SectionLabel>
            <h2 className="mb-5 text-4xl font-extrabold leading-tight text-navy-900 sm:text-5xl">
              From report to <GradientText>compliance.</GradientText>
            </h2>
            <p className="mb-14 text-lg leading-relaxed text-slate-500">
              Most providers deliver a report. We help you manage compliance — assign actions,
              track progress, maintain records, demonstrate competence and give leadership complete
              visibility across the organisation.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => (
            <Reveal key={r} delay={i * 40}>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4">
                <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <circle cx="10" cy="10" r="10" fill="rgba(14,165,160,0.12)" />
                  <path d="M6.5 10.3l2.3 2.3 4.7-4.7" stroke="#0ea5a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm font-semibold text-navy-900">{r}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 text-center">
            <PrimaryBtn href="/contact" large>Book your Fire Risk Assessment</PrimaryBtn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
