import Reveal from "./Reveal";

const STATS = [
  { value: "3", label: "Disciplines under one roof" },
  { value: "London", label: "Every borough covered" },
  { value: "RRO 2005", label: "& HSWA 1974 compliant" },
  { value: "End-to-end", label: "Assess · advise · digitise" },
];

export default function StatsBand() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(40% 80% at 15% 0%, #1e3a8a 0%, transparent 70%), radial-gradient(40% 80% at 85% 100%, #0f766e 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 70}>
              <div className="h-full bg-ink-950/60 p-6 text-center backdrop-blur sm:text-left">
                <div className="bg-gradient-to-r from-white to-brand-200 bg-clip-text font-display text-3xl font-bold text-transparent sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-ink-300">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
