import Reveal from "@/components/Reveal";
import { Card, EyebrowPill, GradientText } from "./MwsUi";

const STATS = [
  { stat: "60%", label: "Reduction in admin time" },
  { stat: "3×", label: "More enquiries captured" },
  { stat: "4 hr", label: "Average time to go live" },
  { stat: "99.9%", label: "Uptime, every month" },
];

const OUTCOMES = [
  { icon: "⚡", text: "Faster client workflows" },
  { icon: "👁️", text: "Better team accountability" },
  { icon: "🛡️", text: "Reduced compliance risk" },
  { icon: "📊", text: "Improved business visibility" },
  { icon: "📫", text: "Fewer missed enquiries" },
  { icon: "🗂️", text: "Less admin, more delivery" },
];

export default function MwsOutcomes() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <EyebrowPill>Business Outcomes</EyebrowPill>
            <h2 className="mb-4 text-3xl font-bold text-navy-900 sm:text-4xl">
              Results that matter to{" "}
              <GradientText>your bottom line.</GradientText>
            </h2>
            <p className="mb-14 text-base text-slate-500">
              Businesses using MyWebSuite report measurable improvements across
              every area of their operations.
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
                <p className="text-sm font-medium text-slate-500">{o.label}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OUTCOMES.map((o) => (
              <div
                key={o.text}
                className="flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50 px-5 py-4"
              >
                <span className="text-xl">{o.icon}</span>
                <span className="text-sm font-semibold text-slate-700">{o.text}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
