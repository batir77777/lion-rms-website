import Reveal from "@/components/Reveal";
import { SectionLabel, GradientText } from "./MwsUi";

const STEPS = [
  {
    n: "1",
    icon: "🔍",
    title: "We carry out your assessment",
    body: "An expert assessor visits your premises and carries out a thorough fire risk assessment or H&S audit, in person.",
  },
  {
    n: "2",
    icon: "⚙️",
    title: "Your platform goes live",
    body: "Assessment findings feed directly into your Lion RMS dashboard — actions prioritised, documents stored, reviews scheduled.",
  },
  {
    n: "3",
    icon: "📊",
    title: "Track and manage compliance",
    body: "Monitor open actions, inspection schedules, and compliance status across your entire portfolio in real time.",
  },
  {
    n: "4",
    icon: "🔔",
    title: "Ongoing support & reminders",
    body: "Automated reminders keep reviews on track. Your assessor is always available for questions, updates, and re-assessments.",
  },
];

export default function MwsHowItWorks() {
  return (
    <section className="bg-navy-50 py-28 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel dark>How It Works</SectionLabel>
            <h2 className="mb-5 text-4xl font-extrabold leading-tight text-navy-900 sm:text-5xl">
              From assessment<br />
              <GradientText>to audit-ready.</GradientText>
            </h2>
            <p className="mb-16 text-lg text-slate-500 leading-relaxed">
              Four steps from your first enquiry to a fully managed, always-current
              compliance record.
            </p>
          </div>
        </Reveal>

        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line (desktop) */}
          <div
            className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-px lg:block"
            style={{
              background: "linear-gradient(90deg,transparent,rgba(12,31,63,0.18),rgba(14,165,160,0.28),rgba(12,31,63,0.18),transparent)",
            }}
            aria-hidden
          />

          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="flex flex-col items-center text-center">
                <div
                  className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-extrabold"
                  style={{
                    background: "white",
                    border: "2px solid #0c1f3f",
                    color: "#0c1f3f",
                    boxShadow: "0 0 0 8px rgba(12,31,63,0.06), 0 4px 20px rgba(12,31,63,0.1)",
                  }}
                >
                  {s.n}
                </div>
                <div className="mb-3 text-2xl">{s.icon}</div>
                <h3 className="mb-2 text-base font-bold text-navy-900 leading-snug">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
