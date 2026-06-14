const STANDARDS = [
  "RRO (Fire Safety) Order 2005",
  "PAS 79",
  "BS 9999 · BS 9991",
  "Health & Safety at Work Act 1974",
  "CDM 2015",
  "HSG274 (Legionella)",
];

export default function AuthorityStrip() {
  return (
    <section className="border-b border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Grounded in UK legislation &amp; recognised standards
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {STANDARDS.map((s) => (
            <span
              key={s}
              className="font-display text-sm font-semibold tracking-tight text-slate-500"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
