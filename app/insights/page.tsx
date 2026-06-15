import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import { POSTS } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Fire safety and health & safety insights, standards updates, and compliance guidance from Lion RMS.",
};

export default function InsightsPage() {
  return (
    <>
      <PhotoHero
        eyebrow="Insights"
        title="Fire & safety insights"
        body="Practical guidance, standards updates, and compliance thinking from our work across London."
      />
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <div className="space-y-6">
            {POSTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <Link
                  href={`/insights/${p.slug}`}
                  className="group block rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl"
                >
                  <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-teal-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
                    {p.dateLabel}
                  </p>
                  <h2 className="text-2xl font-bold text-navy-900 leading-snug group-hover:text-navy-700">{p.title}</h2>
                  <p className="mt-3 text-base leading-relaxed text-slate-500">{p.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 group-hover:gap-2.5 transition-all">
                    Read more
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
