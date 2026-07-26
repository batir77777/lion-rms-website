import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { POSTS, INSIGHT_CATEGORIES, getPostsByCategory } from "@/lib/insights";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Fire safety and health & safety insights, standards updates, and compliance guidance from Lion RMS.",
  alternates: { canonical: "/insights" },
};

function PostCard({ p, delay }: { p: (typeof POSTS)[number]; delay: number }) {
  return (
    <Reveal delay={delay}>
      <Link
        href={`/insights/${p.slug}`}
        className="group block rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl"
      >
        <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
          {p.dateLabel}
        </p>
        <h3 className="text-2xl font-bold text-navy-900 leading-snug group-hover:text-navy-700">{p.title}</h3>
        <p className="mt-3 text-base leading-relaxed text-slate-500">{p.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 group-hover:gap-2.5 transition-all">
          Read more
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>
    </Reveal>
  );
}

export default function InsightsPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: POSTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/insights/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Insights" }]} />
      <PhotoHero
        eyebrow="Insights"
        title="Fire & safety insights"
        body="Practical guidance, standards updates, and compliance thinking from our work across London — organised by topic below."
      />
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          {INSIGHT_CATEGORIES.map((cat) => {
            const posts = getPostsByCategory(cat.slug);
            if (posts.length === 0) return null;
            return (
              <div key={cat.slug} className="mb-16 last:mb-0">
                <Reveal>
                  <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.16em] text-teal-700 border-b border-slate-100 pb-4">
                    {cat.label}
                  </h2>
                </Reveal>
                <div className="space-y-6">
                  {posts.map((p, i) => (
                    <PostCard key={p.slug} p={p} delay={i * 60} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
