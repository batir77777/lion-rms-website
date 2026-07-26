import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PhotoHero from "@/components/PhotoHero";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import CaseStudyDetail from "@/components/CaseStudyDetail";
import { CASE_STUDIES, getCaseStudy } from "@/lib/case-studies";
import { SITE, SITE_URL, getCategory, COVERAGE_COUNTIES } from "@/lib/site";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Case Study" };
  return {
    title: study.title,
    description: study.excerpt,
    alternates: { canonical: `/case-studies/${slug}` },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const serviceTypes = study.servicesProvided
    .map((s) => getCategory(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => c.title);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: study.title,
    description: study.excerpt,
    serviceType: serviceTypes,
    url: `${SITE_URL}/case-studies/${study.slug}`,
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
          { name: "Case Studies", path: "/case-studies" },
          { name: study.title },
        ]}
      />
      <PhotoHero eyebrow={study.sectorLabel} title={study.title} body={study.excerpt} />
      <CaseStudyDetail study={study} />
    </>
  );
}
