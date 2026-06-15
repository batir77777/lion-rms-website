"use client";

// Compliance Dashboard Mockup — hero section right panel for Lion RMS.
// Shows a realistic compliance platform UI: score, status bars, open actions.

const actions = [
  {
    priority: "Critical",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    text: "Replace FD30 fire door — Block A, Level 2",
    due: "3 days",
  },
  {
    priority: "Medium",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    text: "Update fire safety log — Main Building",
    due: "14 days",
  },
  {
    priority: "Low",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    text: "Re-lamp emergency exit light — Basement",
    due: "30 days",
  },
];

const compliance = [
  { label: "Fire Safety", pct: 94, color: "#0ea5a0", status: "Compliant" },
  { label: "Health & Safety", pct: 76, color: "#f59e0b", status: "Actions due" },
  { label: "Water Safety", pct: 89, color: "#10b981", status: "Compliant" },
];

export default function ComplianceDashboard() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-[0_24px_80px_rgba(12,31,63,0.22),0_0_0_1px_rgba(14,165,160,0.15)]"
      style={{ background: "#0c1f3f" }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-2 border-b px-4 py-3"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(6,14,31,0.6)" }}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span
          className="ml-2 flex-1 rounded-md px-3 py-1 text-[11px] text-slate-400"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          app.lionrms.uk/compliance
        </span>
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-bold text-emerald-400"
          style={{ background: "rgba(16,185,129,0.1)" }}
        >
          ● LIVE
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Lion RMS Platform
            </p>
            <h4 className="text-sm font-bold text-white" style={{ letterSpacing: "-0.01em" }}>
              Compliance Dashboard
            </h4>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{ background: "rgba(14,165,160,0.12)", border: "1px solid rgba(14,165,160,0.2)" }}
          >
            <span className="text-[10px] font-semibold text-teal-300">23 Open Actions</span>
          </div>
        </div>

        {/* Compliance score + stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { num: "87%", label: "Overall Score", color: "#0ea5a0" },
            { num: "4", label: "Due Reviews", color: "#f59e0b" },
            { num: "3", label: "Critical Items", color: "#ef4444" },
          ].map(({ num, label, color }) => (
            <div
              key={label}
              className="rounded-xl py-3 text-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-xl font-extrabold leading-none" style={{ color }}>
                {num}
              </p>
              <p className="mt-0.5 text-[9px] font-medium text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Compliance status bars */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-3">
            Compliance Status
          </p>
          {compliance.map((c) => (
            <div key={c.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-200">{c.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">{c.pct}%</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                    style={{
                      color: c.color,
                      background: `${c.color}15`,
                    }}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${c.pct}%`, background: c.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Open actions */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-2">
            Open Actions
          </p>
          {actions.map((a) => (
            <div
              key={a.text}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span
                className="flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold"
                style={{ color: a.color, background: a.bg }}
              >
                {a.priority}
              </span>
              <span className="flex-1 text-[11px] font-medium text-slate-200 leading-snug">
                {a.text}
              </span>
              <span className="flex-shrink-0 text-[10px] text-slate-500">{a.due}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
