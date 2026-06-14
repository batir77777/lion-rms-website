import Reveal from "@/components/Reveal";
import { EyebrowPill, GradientText } from "./MwsUi";

const MODULES = [
  { icon: "🌐", color: "#0ea5a0", module: "Website CMS", desc: "Professional pages, editable without code." },
  { icon: "📋", color: "#10b981", module: "CRM", desc: "Client records, notes and history in one place." },
  { icon: "✅", color: "#60a5fa", module: "Projects", desc: "Track work from kickoff to completion." },
  { icon: "🛡️", color: "#a78bfa", module: "Compliance", desc: "Manage audits, actions and evidence trails." },
  { icon: "📄", color: "#f472b6", module: "Documents", desc: "Generate branded reports with one click." },
  { icon: "📊", color: "#0ea5a0", module: "Reporting", desc: "Real-time dashboards across every area." },
  { icon: "🤝", color: "#34d399", module: "Client Portal", desc: "Give clients secure, self-service access." },
  { icon: "⚙️", color: "#fbbf24", module: "Automation", desc: "Trigger workflows, reminders and alerts." },
];

export default function MwsModules() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <EyebrowPill>Product Modules</EyebrowPill>
            <h2 className="mb-4 text-3xl font-bold text-navy-900 sm:text-4xl">
              Every tool your business needs,{" "}
              <GradientText>in one platform.</GradientText>
            </h2>
            <p className="mb-14 text-base text-slate-500">
              Eight integrated modules that replace the stack of disconnected apps
              most businesses are struggling with today.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m, i) => (
            <Reveal key={m.module} delay={i * 40}>
              <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-md">
                <div
                  className="absolute inset-x-0 top-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: m.color }}
                />
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-lg"
                  style={{ background: `${m.color}18`, border: `1px solid ${m.color}30` }}
                >
                  {m.icon}
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-navy-900">{m.module}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
