import Reveal from "@/components/Reveal";
import { SectionLabel, GradientText } from "./MwsUi";

const MODULES = [
  { icon: "🔥", color: "#ef4444", module: "Fire Risk Management", desc: "Manage fire risk assessments, action schedules, and review dates in one place." },
  { icon: "🛡️", color: "#0ea5a0", module: "H&S Management", desc: "Risk assessments, audits, RAMS, policies, and competent-person records." },
  { icon: "✅", color: "#10b981", module: "Action Tracking", desc: "Raise, assign, and close remedial actions — with full priority and audit trail." },
  { icon: "🔍", color: "#60a5fa", module: "Audit & Inspections", desc: "Fire door inspections, workplace audits, and scheduled inspection programmes." },
  { icon: "📊", color: "#a78bfa", module: "Compliance Dashboard", desc: "Portfolio-wide compliance score, status indicators, and overdue-item alerts." },
  { icon: "📄", color: "#f472b6", module: "Document Control", desc: "Version-controlled reports, policies, certificates, and test records." },
  { icon: "📈", color: "#0ea5a0", module: "Reporting & Analytics", desc: "Board-ready compliance reports and trend analysis across your entire portfolio." },
  { icon: "🔔", color: "#fbbf24", module: "Automated Reminders", desc: "Review dates, action deadlines, inspection schedules — never miss a deadline." },
];

export default function MwsModules() {
  return (
    <section className="bg-white py-28 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Platform Modules</SectionLabel>
            <h2 className="mb-5 text-4xl font-extrabold leading-tight text-navy-900 sm:text-5xl">
              Every compliance tool<br />
              <GradientText>in one platform.</GradientText>
            </h2>
            <p className="mb-16 text-lg text-slate-500 leading-relaxed">
              Eight integrated modules that replace the spreadsheets, email chains, and
              disconnected tools most organisations rely on today.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m, i) => (
            <Reveal key={m.module} delay={i * 40}>
              <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-lg">
                {/* Top colour bar on hover */}
                <div
                  className="absolute inset-x-0 top-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: m.color }}
                />
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-lg"
                  style={{ background: `${m.color}15`, border: `1px solid ${m.color}28` }}
                >
                  {m.icon}
                </div>
                <h3 className="mb-2 text-sm font-bold text-navy-900 leading-snug">{m.module}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
