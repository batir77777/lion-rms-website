import Reveal from "@/components/Reveal";
import { Card, SectionLabel, GradientText } from "./MwsUi";

const STATS = [
  { stat: "94%", label: "Average compliance score" },
  { stat: "60%", label: "Reduction in admin time" },
  { stat: "3×", label: "Faster action closure" },
  { stat: "100%", label: "Audit-ready, always" },
];

const OUTCOMES = [
  { icon: "🛡️", text: "Reduced regulatory risk" },
  { icon: "⚡", text: "Faster remedial action closure" },
  { icon: "👁️", text: "Portfolio-wide visibility" },
  { icon: "📋", text: "Inspection records, always current" },
  { icon: "🔔", text: "No missed review dates" },
  { icon: "📊", text: "Boardroom-ready reporting" },
];

export default function MwsOutcomes() {
  return (
    <section className="bg-white py-28 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Business Outcomes</SectionLabel>
            <h2 className="mb-5 text-4xl font-extrabold leading-tight text-navy-900 sm:text-5xl">
              Compliance that proves<br />
              <GradientText>its own value.</GradientText>
            </h2>
            <p className="mb-16 text-lg text-slate-500 leading-relaxed">
              Organisations using the Lion RMS platform see measurable improvements in
              compliance performance and operational efficiency.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((o, i) => (
            <Reveal key={o.label} delay={i * 60}>
              <Card className="p-8 text-center">
                <p
                  className="mb-2 text-5xl font-extrabold leading-none"
                  style={{
                    background: "linear-gradient(135deg,#0ea5a0,#10b981)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {o.stat}
                </p>
                <p className="text-sm font-medium leading-snug text-slate-500">{o.label}</p>
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
