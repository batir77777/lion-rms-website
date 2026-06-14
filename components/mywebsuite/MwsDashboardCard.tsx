"use client";

// Right-side hero platform preview card for MyWebSuite.

const rows = [
  {
    icon: "📋",
    iconBg: "bg-mws-teal/10 text-mws-teal-light",
    title: "Website Enquiry — Acme Ltd",
    sub: "Received 2 minutes ago",
    badge: "New",
    badgeCls: "bg-mws-teal/10 text-mws-teal-light",
  },
  {
    icon: "✅",
    iconBg: "bg-mws-green/10 text-mws-green",
    title: "Client Workflow — Phase 2",
    sub: "Smith & Co · Updated today",
    badge: "Active",
    badgeCls: "bg-mws-green/10 text-mws-green",
  },
  {
    icon: "🌐",
    iconBg: "bg-teal-400/10 text-teal-400",
    title: "Service Page — Published",
    sub: "mywebsuite.co.uk · 3 edits today",
    badge: "Review",
    badgeCls: "bg-amber-400/10 text-amber-400",
  },
];

export default function MwsDashboardCard() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(14,165,160,0.08)]"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.03] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 flex-1 rounded-md bg-white/[0.06] px-3 py-1 text-[10px] text-slate-400">
          app.mywebsuite.co.uk/dashboard
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Header row */}
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">Business Dashboard</h4>
          <span className="rounded-full bg-mws-teal/10 px-3 py-0.5 text-[10px] font-semibold text-mws-teal-light">
            ● Live
          </span>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          {[
            { num: "48", label: "Enquiries" },
            { num: "12", label: "Active Jobs" },
            { num: "£9.4k", label: "This Month" },
          ].map(({ num, label }) => (
            <div
              key={label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] py-3 text-center"
            >
              <p
                className="text-xl font-bold"
                style={{
                  background: "linear-gradient(135deg,#14d9d3,#10b981)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {num}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <div
              key={r.title}
              className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.025] px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs ${r.iconBg}`}
                >
                  {r.icon}
                </span>
                <div>
                  <p className="text-xs font-medium text-slate-100">{r.title}</p>
                  <p className="text-[10px] text-slate-400">{r.sub}</p>
                </div>
              </div>
              <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.badgeCls}`}>
                {r.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
