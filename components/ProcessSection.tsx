import Reveal from "./Reveal";

const STEPS = [
  { n: "01", title: "Understand", body: "We learn your premises, portfolio, or project and the obligations that apply to you." },
  { n: "02", title: "Assess", body: "We carry out the assessment, audit, or strategy work — grounded in current UK legislation." },
  { n: "03", title: "Recommend", body: "You get clear, prioritised actions in plain English, proportionate to real risk." },
  { n: "04", title: "Manage", body: "We build digital tools to track actions, records, and reviews so nothing slips." },
];

export default function ProcessSection() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-600">
            How we work
          </p>
          <h2 className="max-w-2xl text-3xl font-bold text-slate-900 sm:text-4xl">
            A clear, joined-up process from first call to ongoing compliance
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                <span className="font-display text-3xl font-bold text-teal-200">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
