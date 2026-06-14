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
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30"
          style={{ background: "radial-gradient(ellipse, rgba(14,165,160,0.15) 0%, transparent 70%)" }}
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6">
        <Reveal>
          <p className="mb-4 inline-block rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-600">
            {eyebrow}
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-500">
            {body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
