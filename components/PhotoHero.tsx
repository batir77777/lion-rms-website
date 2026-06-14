import Reveal from "./Reveal";

export default function PhotoHero({
  eyebrow,
  title,
  body,
  children,
  image: _image,  // retained for API compat, no longer renders photo
}: {
  image?: string;
  eyebrow: string;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* Subtle teal glow — matches homepage */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30"
          style={{ background: "radial-gradient(ellipse, rgba(14,165,160,0.15) 0%, transparent 70%)" }}
        />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-36 sm:px-6 sm:pb-20 sm:pt-44">
        <div className="max-w-3xl">
          <Reveal>
            <p className="mb-4 inline-block rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-600">
              {eyebrow}
            </p>
            <h1 className="text-4xl font-bold leading-[1.05] text-navy-900 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
              {body}
            </p>
            {children && <div className="mt-8">{children}</div>}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
