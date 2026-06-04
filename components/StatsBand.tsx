import Reveal from "./Reveal";

const STATS = [
  { value: "3", label: "Disciplines under one roof" },
  { value: "London", label: "& across the UK" },
  { value: "RRO 2005", label: "& HSWA 1974 compliant" },
  { value: "End-to-end", label: "Assess · advise · digitise" },
];

export default function StatsBand() {
  return (
    <section className="bg-ink-950">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 70}>
              <div className="text-center sm:text-left">
                <div className="font-display text-3xl font-bold text-white sm:text-4xl">
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
