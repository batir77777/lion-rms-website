import Reveal from "./Reveal";

export default function PageHero({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(14,165,160,0.1) 0%, transparent 65%)" }}
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-40 sm:px-6 sm:pb-24">
        <Reveal>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
            {eyebrow}
          </p>
          <h1 className="max-w-3xl text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold leading-[1.06] tracking-tight text-navy-900">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-500">
            {body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
