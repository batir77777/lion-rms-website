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

          {/*
           * Two render paths. Most categories carry a flat `items` list and
           * render as before — a single grid, each item an <h2>. A category
           * with `sections` (currently only fire-safety, see ServiceSection
           * in lib/site.ts) renders each section as its own <h2> with a
           * stable, deep-linkable `id`, and its items as <h3> children —
           * correct heading nesting for a page that now covers two distinct
           * propositions rather than one. `scroll-mt-28` matches the anchor
           * convention already used for in-page headings in
           * components/MDXContent.tsx, so a linked section isn't hidden
           * under the fixed header when the browser jumps to it.
           */}
          {cat.sections ? (
            <div className="space-y-14">
              {cat.sections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-28">
                  <div className="mb-6 max-w-2xl">
                    <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
                      {section.eyebrow}
                    </p>
                    <h2 className="text-2xl font-extrabold text-navy-900">{section.title}</h2>
                    <p className="mt-3 text-base leading-relaxed text-slate-500">{section.intro}</p>
                  </div>
                  <div className={section.featured ? "grid gap-6" : "grid gap-6 sm:grid-cols-2"}>
                    {section.items.map((item, i) => (
                      <Reveal key={item.name} delay={i * 50}>
                        <div
                          className={`h-full rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md hover:border-teal-100 ${
                            section.featured ? "p-8" : "p-7"
                          }`}
                        >
                          <h3 className={section.featured ? "mb-2 text-xl font-bold text-navy-900" : "mb-2 text-lg font-bold text-navy-900"}>
                            {item.name}
                          </h3>
                          <p className="text-base leading-relaxed text-slate-500">{item.desc}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {(cat.items ?? []).map((item, i) => (
                <Reveal key={item.name} delay={i * 50}>
                  {/*
                    `item.id` (repositioning PR2) exists only on the
                    "RAMS and Construction Phase Plans" item today — the
                    homepage's Construction Health & Safety card deep-links
                    here rather than to a page that doesn't exist yet.
                    `scroll-mt-28` matches the anchor convention used
                    elsewhere on this site (see the ServiceSection note above)
                    so the linked item isn't hidden under the fixed header.

                    The `id` prop is spread in only when present, rather than
                    written as `id={item.id}`, so that items without one don't
                    serialise an explicit `"id":"$undefined"` into the RSC
                    payload — that would move every other flat-item category's
                    (fire-engineering, compliance-support) recorded content
                    hash in lib/page-dates.ts for no reader-visible reason.
                    With the spread, only health-safety's payload changes,
                    which is the one page that legitimately gained an anchor.
                  */}
                  <div
                    {...(item.id ? { id: item.id } : {})}
                    className={`h-full rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition hover:shadow-md hover:border-teal-100${item.id ? " scroll-mt-28" : ""}`}
                  >
                    <h2 className="mb-2 text-lg font-bold text-navy-900">{item.name}</h2>
                    <p className="text-base leading-relaxed text-slate-500">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {/*
           * The "also available" pointer (repositioning PR3) — present only
           * on `fire-safety`, at the anchor Fire Safety Consultancy used to
           * occupy when it shared this page. Deliberately NOT a section: one
           * summary sentence and a link, never the item cards that used to
           * render here, so this block cannot drift into duplicating the
           * content that now lives at `cat.pointer.href`. See ServicePointer
           * in lib/site.ts.
           */}
          {cat.pointer && (
            <div id={cat.pointer.id} className="mt-14 scroll-mt-28">
              <Reveal>
                <div className="flex flex-col items-start gap-4 rounded-2xl border border-teal-100 bg-teal-50/60 p-7 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="mb-1.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
                      {cat.pointer.eyebrow}
                    </p>
                    <h2 className="text-lg font-bold text-navy-900">{cat.pointer.title}</h2>
                    <p className="mt-1.5 max-w-xl text-base leading-relaxed text-slate-600">{cat.pointer.body}</p>
                  </div>
                  <Link
                    href={cat.pointer.href}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                  >
                    {cat.pointer.linkLabel} &rarr;
                  </Link>
                </div>
              </Reveal>
            </div>
          )}

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
