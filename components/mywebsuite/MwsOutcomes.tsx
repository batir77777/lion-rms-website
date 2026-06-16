import Reveal from "@/components/Reveal";
import { Card, SectionLabel, GradientText } from "./MwsUi";

// Honest, guaranteed promises — no invented metrics.
const PROMISES = [
  {
    title: "Audit-Ready Records",
    sub: "Your fire safety log is kept up to date and ready for the fire service or an inspection.",
  },
  {
    title: "No Missed Dates",
    sub: "Automated reminders for reviews, remedial works and maintenance deadlines.",
  },
  {
    title: "Direct Expert Access",
    sub: "Advice from a chartered consultant — not a call centre or a faceless portal.",
  },
];

const OUTCOMES = [
  { icon: "🛡️", text: "Reduced regulatory risk" },
  { icon: "⚡", text: "Faster remedial action closure" },
  { icon: "👁️", text: "Portfolio-wide visibility" },
  { icon: "📋", text: "Inspection records kept current" },
  { icon: "🔔", text: "Reminders before review dates" },
  { icon: "📊", text: "Boardroom-ready reporting" },
];

export default function MwsOutcomes() {
  return (
    <section className="bg-white py-28 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>What You Get</SectionLabel>
            <h2 className="mb-5 text-4xl font-extrabold leading-tight text-navy-900 sm:text-5xl">
              Compliance that keeps<br />
              <GradientText>working for you.</GradientText>
            </h2>
            <p className="mb-16 text-lg text-slate-500 leading-relaxed">
              From the assessment onwards, your risks are tracked, your deadlines are managed
              and your records stay ready — so nothing slips through the cracks.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROMISES.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <Card className="p-8 text-center">
                <p className="mb-3 text-xl font-extrabold leading-snug text-navy-900">{p.title}</p>
                <p className="text-sm font-medium leading-relaxed text-slate-500">{p.sub}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OUTCOMES.map((o) => (
              <div
                key={o.text}
                className="flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50 px-5 py-4 transition hover:border-teal-200 hover:bg-teal-50/80"
              >
                <span className="text-xl">{o.icon}</span>
                <span className="text-sm font-semibold text-navy-900">{o.text}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
