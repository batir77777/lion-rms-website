import Reveal from "@/components/Reveal";
import { SectionLabel, GradientText, PrimaryBtn } from "./MwsUi";
import ComplianceArt from "./MwsIllustration";

const POINTS = [
  "We carry out the assessment — to recognised standards.",
  "Your risks and actions load straight onto your dashboard.",
  "Reminders, evidence and audit trails are kept in one place.",
];

export default function MwsShowcase() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <SectionLabel>Consultancy + software</SectionLabel>
              <h2 className="mb-5 text-4xl font-extrabold leading-tight text-navy-900 sm:text-[2.75rem]">
                From paperwork to<br />
                <GradientText>managed compliance.</GradientText>
              </h2>
              <p className="mb-7 text-lg leading-relaxed text-slate-500">
                A report is only the first step. We combine expert fire safety and health &amp;
                safety consultancy with a live platform — so nothing is missed once the assessment
                is done.
              </p>
              <ul className="mb-9 space-y-3">
                {POINTS.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-base text-slate-700">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden>
                      <circle cx="10" cy="10" r="10" fill="rgba(14,165,160,0.12)" />
                      <path d="M6.5 10.3l2.3 2.3 4.7-4.7" stroke="#0ea5a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
              <PrimaryBtn href="/contact" large>Book your assessment</PrimaryBtn>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex justify-center">
              <ComplianceArt className="w-full max-w-md" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
