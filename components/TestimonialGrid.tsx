import Reveal from "@/components/Reveal";
import { TESTIMONIALS } from "@/lib/site";

// Static, responsive grid variant of the testimonials block (Phase 4B PR 2).
// The homepage keeps the existing auto-advancing carousel (components/Testimonials.tsx)
// unchanged — this is an additive option for embedding testimonials lower on
// a page (e.g. a sector or case-study page) without the carousel's motion,
// timers or aria-live region. Deliberately no Review/AggregateRating
// structured data: these testimonials are anonymised with no named author or
// third-party platform behind them, so marking them up as schema.org Review
// would assert something Google's guidelines require to be independently
// verifiable — which isn't the case here.
export default function TestimonialGrid() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
            What clients say
          </p>
          <h2 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
            Trusted across London
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.role} delay={i * 70}>
              <blockquote className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
                <p className="flex-1 text-base leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-5">
                  <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                  <div className="mt-0.5 text-sm text-slate-500">{t.role}</div>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
