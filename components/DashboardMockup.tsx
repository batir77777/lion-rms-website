// Illustrative product visual — not real data. Showcases the digital
// compliance dashboard offering.
export default function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-3xl bg-ink-950 p-4 shadow-2xl ring-1 ring-white/10 sm:p-6">
      {/* window bar */}
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-3 text-[11px] font-medium text-ink-400">
          Lion RMS · Compliance Dashboard
        </span>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Open actions", value: "12", tone: "text-white" },
          { label: "Overdue", value: "2", tone: "text-amber-400" },
          { label: "Compliant", value: "94%", tone: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            <div className={`font-display text-2xl font-bold ${s.tone}`}>{s.value}</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wide text-ink-400">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* mini bar chart */}
      <div className="mt-4 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-medium text-ink-300">Actions closed · last 6 months</span>
          <span className="text-[10px] text-emerald-400">▲ on track</span>
        </div>
        <div className="flex h-20 items-end gap-2">
          {[40, 55, 48, 70, 62, 88].map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand-700 to-brand-400" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      {/* inspection rows */}
      <div className="mt-4 space-y-2">
        {[
          { name: "Fire risk assessment · Block A", status: "Compliant", tone: "bg-emerald-500/15 text-emerald-400" },
          { name: "Fire door inspection · Block C", status: "Due soon", tone: "bg-amber-500/15 text-amber-400" },
          { name: "Emergency lighting test", status: "Overdue", tone: "bg-red-500/15 text-red-400" },
        ].map((r) => (
          <div key={r.name} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
            <span className="truncate text-xs text-ink-200">{r.name}</span>
            <span className={`ml-3 flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${r.tone}`}>
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
