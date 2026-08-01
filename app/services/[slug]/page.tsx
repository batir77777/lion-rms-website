import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ServiceCheckCTA from "@/components/ServiceCheckCTA";
import RelatedContent from "@/components/RelatedContent";
import { SERVICE_CATEGORIES, SITE, SITE_URL, getCategory, COVERAGE_COUNTIES, CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF } from "@/lib/site";
import { getCaseStudiesForService } from "@/lib/case-studies";
import { getGuidesForService } from "@/lib/guides";
import { DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

export function generateStaticParams() {
  return SERVICE_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return { title: "Service" };
  return {
    title: cat.title,
    description: cat.intro,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      type: "website",
      title: cat.title,
      description: cat.intro,
      url: `/services/${slug}`,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: cat.title,
      description: cat.intro,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const relatedCaseStudies = getCaseStudiesForService(slug);
  const relatedGuides = getGuidesForService(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: cat.title,
    description: cat.intro,
    serviceType: cat.eyebrow,
    url: `${SITE_URL}/services/${cat.slug}`,
    provider: {
      "@type": "ProfessionalService",
      name: SITE.name,
      url: SITE_URL,
    },
    areaServed: [
      { "@type": "City", name: "London" },
      ...COVERAGE_COUNTIES.map((c) => ({ "@type": "AdministrativeArea", name: c })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: cat.title },
        ]}
      />
      <PhotoHero eyebrow={cat.eyebrow} title={cat.title} body={cat.intro} />
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">

          {/* Service items grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {cat.items.map((item, i) => (
              <Reveal key={item.name} delay={i * 50}>
                <div className="h-full rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition hover:shadow-md hover:border-teal-100">
                  <h2 className="mb-2 text-lg font-bold text-navy-900">{item.name}</h2>
                  <p className="text-base leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Other services */}
          <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-8">
            <p className="text-sm font-medium text-slate-500">Also available:</p>
            {SERVICE_CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/services/${c.slug}`}
                className="rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"
              >
                {c.title}
              </Link>
            ))}
          </div>

          <RelatedContent
            groups={[
              {
                heading: "Related case studies",
                items: relatedCaseStudies.map((c) => ({ label: c.title, href: `/case-studies/${c.slug}` })),
              },
              {
                heading: "Related guides",
                items: relatedGuides.map((g) => ({ label: g.title, href: `/guides/${g.slug}` })),
              },
            ]}
          />

          {/* Compliance Check promo */}
          <div className="mt-12">
            <ServiceCheckCTA />
          </div>

          {/* Consultation CTA */}
          <Reveal>
            <div
              className="mt-10 rounded-2xl border p-10 text-center"
              style={{
                background: "linear-gradient(135deg,#060e1f 0%,#0c1f3f 50%,#082218 100%)",
                borderColor: "rgba(14,165,160,0.2)",
              }}
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-teal-400">
                Ongoing Compliance Support
              </p>
              <h2 className="mb-4 text-2xl font-extrabold text-white">
                Discuss your {cat.eyebrow.toLowerCase()} requirements
              </h2>
              <p className="mx-auto mb-7 max-w-xl text-base text-slate-400 leading-relaxed">
                Tell us about your premises or project and we&apos;ll recommend a
                proportionate, compliant way forward — backed by expert consultancy and
                ongoing compliance support.
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
