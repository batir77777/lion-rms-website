import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import { POSTS } from "@/lib/insights";
import { IMAGES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Fire safety and health & safety insights, standards updates, and practical guidance from Lion Risk Management Solutions.",
};

export default function InsightsPage() {
  return (
    <>
      <PhotoHero
        image={IMAGES.office}
        eyebrow="Insights"
        title="Fire & safety insights"
        body="Practical guidance, standards updates, and thinking from our work across London."
      />
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="space-y-6">
            {POSTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <Link
                  href={`/insights/${p.slug}`}
                  className="block rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
                    {p.dateLabel}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-navy-900">{p.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{p.excerpt}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-teal-600">
                    Read more →
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
