import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import CaseStudyCard from "@/components/CaseStudyCard";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { CASE_STUDIES } from "@/lib/case-studies";
import { CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF, SITE_URL } from "@/lib/site";
import { DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Examples of fire safety, health & safety, and compliance management work delivered by Lion RMS for clients across London.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    type: "website",
    title: "Case Studies",
    description: "Examples of fire safety, health & safety, and compliance management work delivered by Lion RMS for clients across London.",
    url: "/case-studies",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies",
    description: "Examples of fire safety, health & safety, and compliance management work delivered by Lion RMS for clients across London.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function CaseStudiesPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: CASE_STUDIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/case-studies/${c.slug}`,
      name: c.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Case Studies" }]} />
      <PhotoHero
        eyebrow="Case Studies"
        title="Trusted by clients across London"
        body="A snapshot of the fire safety, health & safety, and compliance management work we deliver — from individual assessments to full ongoing compliance support."
      />
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-7 md:grid-cols-2">
            {CASE_STUDIES.map((c, i) => (
              <CaseStudyCard
                key={c.slug}
                href={`/case-studies/${c.slug}`}
                sectorLabel={c.sectorLabel}
                title={c.title}
                body={c.excerpt}
                tags={c.tags}
                delay={i * 60}
              />
            ))}
            {/*
              OTHER_CASES is deliberately NOT rendered.

              Three summary-only entries — RAMS & construction phase plans,
              the property management company, and the consultancy firm — used
              to appear here through the same CaseStudyCard as the three real
              case studies. They carried the identical card styling and the
              identical hover lift, but no `href`, so they rendered as
              <article> rather than <a>: they rose under the cursor, could not
              be focused by keyboard, and led nowhere. A card that behaves like
              a link and is not one is worse than an absent card.

              The data stays in lib/case-studies.ts. Restoring any of these is
              a matter of writing its detail page and adding it to
              CASE_STUDIES — not of rendering a destination-less card again.
              tests/case-studies-cards.test.mjs fails if one comes back
              without somewhere to go.
            */}
          </div>

          <Reveal>
            <div
              className="mt-16 rounded-2xl border p-10 text-center"
              style={{
                background: "linear-gradient(135deg,#060e1f 0%,#0c1f3f 50%,#082218 100%)",
                borderColor: "rgba(14,165,160,0.2)",
              }}
            >
              <h2 className="mb-4 text-2xl font-extrabold text-white">
                Ready to manage your compliance better?
              </h2>
              <p className="mx-auto mb-7 max-w-xl text-base text-slate-400 leading-relaxed">
                Get in touch to discuss how we can support compliance across your portfolio.
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
        </div>
      </section>
    </>
  );
}
