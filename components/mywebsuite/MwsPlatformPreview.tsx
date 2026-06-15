import Reveal from "@/components/Reveal";
import { SectionLabel, GradientText } from "./MwsUi";

export default function MwsPlatformPreview() {
  return (
    <section className="bg-slate-50 py-28 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Platform Preview</SectionLabel>
            <h2 className="mb-5 text-4xl font-extrabold leading-tight text-navy-900 sm:text-5xl">
              See your compliance<br />
              <GradientText>at a glance.</GradientText>
            </h2>
            <p className="mb-16 text-lg text-slate-500 leading-relaxed">
              Clean, focused interfaces built for fire safety and health &amp; safety
              compliance management — not generic project management software.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Panel 1 — Fire Risk Register */}
          <Reveal delay={0}>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-xs font-bold text-slate-600">Fire Risk Register</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">Active</span>
              </div>
              <div className="space-y-2 p-4">
                {[
                  { site: "Riverside Court — Block A", risk: "Medium", due: "3 months", rc: "#f59e0b" },
                  { site: "Elmswood House", risk: "Low", due: "8 months", rc: "#10b981" },
                  { site: "Commercial Wharf", risk: "High", due: "Overdue", rc: "#ef4444" },
                ].map((r) => (
                  <div
                    key={r.site}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800 leading-snug">{r.site}</p>
                      <p className="text-[10px] text-slate-400">Next review: {r.due}</p>
                    </div>
                    <span
                      className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                      style={{ background: `${r.rc}15`, color: r.rc }}
                    >
                      {r.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Panel 2 — Action Tracker */}
          <Reveal delay={80}>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-xs font-bold text-slate-600">Action Tracker</span>
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-500">3 Critical</span>
              </div>
              <div className="space-y-2 p-4">
                {[
                  { action: "Replace FD30 — Block A, L2", prio: "Critical", pc: "#ef4444", assigned: "Maintenance" },
                  { action: "Update fire log records", prio: "Medium", pc: "#f59e0b", assigned: "Building Mgr" },
                  { action: "Test emergency lighting", prio: "Low", pc: "#10b981", assigned: "Contractor" },
                ].map((a) => (
                  <div key={a.action} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                        style={{ background: `${a.pc}15`, color: a.pc }}
                      >
                        {a.prio}
                      </span>
                      <span className="text-[10px] text-slate-400">{a.assigned}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 leading-snug">{a.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Panel 3 — Compliance Dashboard */}
          <Reveal delay={160}>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-xs font-bold text-slate-600">Compliance Overview</span>
                <span className="text-[10px] text-slate-400">16 sites</span>
              </div>
              <div className="p-4 space-y-4">
                {[
                  { label: "Fire Safety", pct: 94, color: "#0ea5a0" },
                  { label: "Health & Safety", pct: 76, color: "#f59e0b" },
                  { label: "Fire Door Inspections", pct: 88, color: "#10b981" },
                  { label: "Emergency Lighting", pct: 91, color: "#60a5fa" },
                ].map((p) => (
                  <div key={p.label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-700">{p.label}</span>
                      <span className="text-[11px] font-bold" style={{ color: p.color }}>{p.pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, background: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
