import Reveal from "@/components/Reveal";
import { EyebrowPill, GradientText } from "./MwsUi";

export default function MwsPlatformPreview() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <EyebrowPill>Platform Preview</EyebrowPill>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              See exactly what your team{" "}
              <GradientText>will be working in.</GradientText>
            </h2>
            <p className="mb-14 text-base text-slate-500">
              Clean, focused interfaces built for the way professional service teams
              actually operate.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Panel 1 — Enquiry inbox */}
          <Reveal delay={0}>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold text-slate-500">
                Enquiry Inbox
              </div>
              <div className="space-y-2 p-4">
                {[
                  { name: "Acme Construction Ltd", time: "2m ago", badge: "New", bc: "#0ea5a0" },
                  { name: "Riverside Property Mgmt", time: "1h ago", badge: "Open", bc: "#60a5fa" },
                  { name: "Meridian Health Group", time: "3h ago", badge: "Replied", bc: "#10b981" },
                ].map((r) => (
                  <div
                    key={r.name}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{r.name}</p>
                      <p className="text-[10px] text-slate-400">{r.time}</p>
                    </div>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                      style={{ background: `${r.bc}18`, color: r.bc }}
                    >
                      {r.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Panel 2 — Project board */}
          <Reveal delay={80}>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold text-slate-500">
                Active Projects
              </div>
              <div className="space-y-4 p-4">
                {[
                  { name: "Office Refurbishment", pct: 72, color: "#0ea5a0" },
                  { name: "Fire Risk Programme", pct: 45, color: "#10b981" },
                  { name: "H&S Policy Review", pct: 91, color: "#60a5fa" },
                ].map((p) => (
                  <div key={p.name} className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-medium text-slate-700">{p.name}</span>
                      <span className="text-slate-400">{p.pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Panel 3 — Dashboard stats */}
          <Reveal delay={160}>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold text-slate-500">
                Business Dashboard
              </div>
              <div className="grid grid-cols-2 gap-3 p-4">
                {[
                  { num: "48", label: "Enquiries", color: "#0ea5a0" },
                  { num: "12", label: "Live Jobs", color: "#10b981" },
                  { num: "£9.4k", label: "Revenue", color: "#60a5fa" },
                  { num: "94%", label: "Compliance", color: "#a78bfa" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                    <p className="text-xl font-extrabold leading-none" style={{ color: s.color }}>{s.num}</p>
                    <p className="mt-1 text-[10px] text-slate-500">{s.label}</p>
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
