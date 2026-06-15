import Reveal from "@/components/Reveal";
import { Card, SectionLabel, GradientText } from "./MwsUi";

const BENEFITS = [
  {
    icon: "🎯",
    stat: "One",
    statSuffix: "Platform",
    title: "Everything in one place",
    body: "Fire risk assessments, H&S records, action logs, audit reports, and inspection schedules — connected and always current.",
    navy: false,
  },
  {
    icon: "⚡",
    stat: "Real-time",
    statSuffix: "",
    title: "Live compliance dashboards",
    body: "See your compliance status across every building and site at a glance — from overall score to individual action items.",
    navy: true,
  },
  {
    icon: "✅",
    stat: "100%",
    statSuffix: "",
    title: "Full audit trail",
    body: "Every action raised, assigned, and closed is date-stamped and attributed. Audit-ready documentation, always.",
    navy: false,
  },
  {
    icon: "🔔",
    stat: "Zero",
    statSuffix: "",
    title: "Missed reviews",
    body: "Automated reminders for fire risk review dates, inspection schedules, and action deadlines — no item falls through the cracks.",
    navy: true,
  },
  {
    icon: "📄",
    stat: "Instant",
    statSuffix: "",
    title: "Compliance reports",
    body: "Generate professional compliance reports for regulators, insurers, landlords, or boards — in minutes, not hours.",
    navy: false,
  },
  {
    icon: "🔒",
    stat: "UK",
    statSuffix: "Hosted",
    title: "Secure & GDPR-compliant",
    body: "UK-hosted, encrypted, and built to meet the requirements of the Data Protection Act 2018 and GDPR. Your data stays yours.",
    navy: true,
  },
];

export default function MwsBenefits() {
  return (
    <section className="bg-slate-50 py-28 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Platform Benefits</SectionLabel>
            <h2 className="mb-5 text-4xl font-extrabold leading-tight text-navy-900 sm:text-5xl">
              Built for compliance,<br />
              <GradientText>not just record-keeping.</GradientText>
            </h2>
            <p className="mb-16 text-lg text-slate-500 leading-relaxed">
              The Lion RMS platform connects your assessments, actions, inspections,
              and reporting into a single, always-current compliance record.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 55}>
              <Card className="group p-8">
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                  style={{
                    background: b.navy
                      ? "linear-gradient(135deg,rgba(12,31,63,0.07),rgba(14,165,160,0.07))"
                      : "linear-gradient(135deg,rgba(14,165,160,0.08),rgba(16,185,129,0.08))",
                    border: b.navy
                      ? "1px solid rgba(12,31,63,0.1)"
                      : "1px solid rgba(14,165,160,0.12)",
                  }}
                >
                  {b.icon}
                </div>
                <p
                  className="mb-1 text-2xl font-extrabold leading-tight"
                  style={{
                    background: b.navy
                      ? "linear-gradient(120deg,#0c1f3f,#0ea5a0)"
                      : "linear-gradient(120deg,#0ea5a0,#10b981)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {b.stat}
                  {b.statSuffix && <span className="ml-1 text-lg">{b.statSuffix}</span>}
                </p>
                <h3 className="mb-2 text-base font-bold text-navy-900">{b.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{b.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
