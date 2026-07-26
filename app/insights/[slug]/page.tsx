import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import RelatedContent from "@/components/RelatedContent";
import { POSTS, getPost, getInsightCategory } from "@/lib/insights";
import { SITE, SITE_URL, getCategory, CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF } from "@/lib/site";
import { getCaseStudy } from "@/lib/case-studies";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return { title: "Insights" };
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/insights/${slug}` },
  };
}

function render(body: string) {
  return body.split("\n\n").map((block, i) => {
    const t = block.trim();
    if (t.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-10 text-2xl font-bold text-navy-900">
          {t.slice(3)}
        </h2>
      );
    }
    const parts = t.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
      seg.startsWith("**") && seg.endsWith("**") ? (
        <strong key={j}>{seg.slice(2, -2)}</strong>
      ) : (
        <span key={j}>{seg}</span>
      ),
    );
    return (
      <p key={i} className="mt-5 text-lg leading-relaxed text-slate-600">
        {parts}
      </p>
    );
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  const relatedService = p.relatedService ? getCategory(p.relatedService) : undefined;
  const relatedCaseStudy = p.relatedCaseStudySlug ? getCaseStudy(p.relatedCaseStudySlug) : undefined;

  const canonicalUrl = `${SITE_URL}/insights/${p.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    datePublished: p.date,
    dateModified: p.date,
    author: { "@type": "Person", name: "Batir Turakulov", url: `${SITE_URL}/about` },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE_URL}${SITE.logo}` },
    },
    description: p.excerpt,
    image: `${SITE_URL}/images/hero-banner.jpg`,
    url: canonicalUrl,
    articleSection: getInsightCategory(p.category)?.label,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  return (
    <article className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: p.title },
        ]}
      />

      {/* Article header */}
      <div className="relative isolate overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(14,165,160,0.09) 0%, transparent 65%)" }}
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-40 sm:px-6">
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-teal-600">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
              {p.dateLabel} &middot; {getInsightCategory(p.category)?.label ?? "Insights"}
            </p>
            <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.1] text-navy-900">
              {p.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Article body */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Reveal>
          <div>{render(p.body)}</div>
        </Reveal>

        <RelatedContent
          groups={[
            {
              heading: "Related service",
              items: relatedService ? [{ label: relatedService.title, href: `/services/${relatedService.slug}` }] : [],
            },
            {
              heading: "Related case study",
              items: relatedCaseStudy
                ? [{ label: relatedCaseStudy.title, href: `/case-studies/${relatedCaseStudy.slug}` }]
                : [],
            },
          ]}
        />

        {/* CTA */}
        <Reveal>
          <div
            className="mt-14 rounded-2xl border p-10 text-center"
            style={{
              background: "linear-gradient(135deg,#060e1f 0%,#0c1f3f 50%,#082218 100%)",
              borderColor: "rgba(14,165,160,0.2)",
            }}
          >
            <h2 className="mb-4 text-2xl font-extrabold text-white">
              Need expert compliance support?
            </h2>
            <p className="mx-auto mb-7 max-w-lg text-base text-slate-400 leading-relaxed">
              Call {SITE.phone} or get in touch to discuss how we can keep your
              portfolio compliant and audit-ready.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#0c1f3f,#0ea5a0)" }}
              >
                {CTA_PRIMARY_LABEL} &rarr;
              </Link>
              <Link
                href={CTA_SECONDARY_HREF}
                className="inline-flex items-center rounded-full border border-white/20 bg-white/8 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/15"
              >
                {CTA_SECONDARY_LABEL}
              </Link>
            </div>
          </div>
        </Reveal>

        <p className="mt-8 text-center text-sm">
          <Link href="/insights" className="font-semibold text-teal-700 hover:underline">
            ← All insights
          </Link>
        </p>
      </div>
    </article>
  );
}
