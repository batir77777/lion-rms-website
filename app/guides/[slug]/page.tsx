import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MDXContent from "@/components/MDXContent";
import RelatedContent from "@/components/RelatedContent";
import {
  getGuide,
  publishedGuides,
  buildGuideBreadcrumbs,
  categoryLabel,
  tagLabels,
  formatDate,
  lastModified,
} from "@/lib/guides";
import { buildArticleSchema, DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";
import { getAuthor, getReviewer } from "@/lib/people";
import {
  SITE,
  getCategory,
  CTA_PRIMARY_LABEL,
  CTA_SECONDARY_LABEL,
  CTA_SECONDARY_HREF,
} from "@/lib/site";
import { getCaseStudy } from "@/lib/case-studies";
import { getTerm, displayTerm, GLOSSARY_PATH } from "@/lib/glossary";

// Only published guides are generated, and `dynamicParams = false` means a slug
// outside that set returns a genuine 404 rather than being rendered on demand —
// so an unpublished slug is not reachable by guessing it.
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guides" };

  const path = `/guides/${guide.slug}`;
  const author = getAuthor(guide.authorId);

  return {
    // seoTitle where the editorial headline is longer than a search result can
    // show; the visible h1 always remains the full headline.
    title: guide.seoTitle ?? guide.title,
    description: guide.seoDescription ?? guide.summary,
    alternates: { canonical: guide.canonicalUrl ?? path },
    // The schema's noindex flag is wired through rather than left decorative.
    ...(guide.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "article",
      title: guide.seoTitle ?? guide.title,
      description: guide.seoDescription ?? guide.summary,
      url: path,
      publishedTime: guide.publishedDate,
      modifiedTime: lastModified(guide),
      authors: author ? [author.name] : undefined,
      images: [guide.featuredImageSrc ?? DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.seoTitle ?? guide.title,
      description: guide.seoDescription ?? guide.summary,
      images: [guide.featuredImageSrc ?? DEFAULT_OG_IMAGE],
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const crumbs = buildGuideBreadcrumbs(guide);
  const author = getAuthor(guide.authorId);
  const reviewer = guide.reviewerId ? getReviewer(guide.reviewerId) : undefined;

  const publishedLabel = formatDate(guide.publishedDate);
  const reviewedLabel = formatDate(guide.reviewedDate);
  const nextReviewLabel = formatDate(guide.nextReviewDue);
  const updatedLabel = guide.updatedDate ? formatDate(guide.updatedDate) : undefined;

  const jsonLd = buildArticleSchema({
    schemaType: guide.schemaType,
    headline: guide.title,
    description: guide.seoDescription ?? guide.summary,
    path: `/guides/${guide.slug}`,
    authorId: guide.authorId,
    datePublished: guide.publishedDate,
    dateModified: lastModified(guide),
    articleSection: categoryLabel(guide),
    image: guide.featuredImageSrc,
  });

  const relatedServices = guide.relatedServices
    .map((s) => getCategory(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.title, href: `/services/${s.slug}` }));

  const relatedCaseStudies = guide.relatedCaseStudies
    .map((s) => getCaseStudy(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({ label: c.title, href: `/case-studies/${c.slug}` }));

  // The Guide side of the Glossary relation. The term pages derive their
  // "Guides that use this term" list by inverting this same declaration, so the
  // link is authored once and surfaced on both.
  const relatedTerms = guide.relatedGlossaryTerms
    .map((s) => getTerm(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .map((t) => ({ label: displayTerm(t), href: `${GLOSSARY_PATH}/${t.slug}` }));

  return (
    <article className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd items={crumbs} />

      <div className="relative isolate overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(14,165,160,0.09) 0%, transparent 65%)" }}
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-40 sm:px-6">
          <div className="mb-6">
            <Breadcrumbs items={crumbs} />
          </div>
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
              {categoryLabel(guide)}
            </p>
            <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.1] text-navy-900">
              {guide.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{guide.summary}</p>

            {guide.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {tagLabels(guide).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Publication and review record. A definition list rather than free
            text, so each date label is programmatically associated with the
            value it describes rather than merely sitting next to it. */}
        <section
          aria-labelledby="guide-provenance-heading"
          className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6"
        >
          <h2 id="guide-provenance-heading" className="sr-only">
            Publication and review record
          </h2>
          <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            {author && (
              <div>
                <dt className="font-semibold text-navy-900">Written by</dt>
                <dd className="text-slate-600">
                  <Link
                    href="/about"
                    className="text-teal-700 underline underline-offset-2 hover:text-teal-800"
                  >
                    {author.name}
                  </Link>
                  {author.jobTitle ? `, ${author.jobTitle}` : ""}
                </dd>
              </div>
            )}
            {reviewer && reviewedLabel && (
              <div>
                <dt className="font-semibold text-navy-900">Reviewed by</dt>
                <dd className="text-slate-600">
                  {reviewer.name}, {reviewedLabel}
                </dd>
              </div>
            )}
            {publishedLabel && (
              <div>
                <dt className="font-semibold text-navy-900">Published</dt>
                <dd className="text-slate-600">
                  <time dateTime={guide.publishedDate}>{publishedLabel}</time>
                </dd>
              </div>
            )}
            {updatedLabel && (
              <div>
                <dt className="font-semibold text-navy-900">Last updated</dt>
                <dd className="text-slate-600">
                  <time dateTime={guide.updatedDate}>{updatedLabel}</time>
                </dd>
              </div>
            )}
            {nextReviewLabel && (
              <div>
                <dt className="font-semibold text-navy-900">Next review due</dt>
                <dd className="text-slate-600">
                  <time dateTime={guide.nextReviewDue}>{nextReviewLabel}</time>
                </dd>
              </div>
            )}
          </dl>
        </section>

        <Reveal>
          <div>
            <MDXContent code={guide.body} />
          </div>
        </Reveal>

        <RelatedContent
          groups={[
            { heading: "Related service", items: relatedServices },
            { heading: "Related case study", items: relatedCaseStudies },
            { heading: "Terms used in this guide", items: relatedTerms },
          ]}
        />

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
            <p className="mx-auto mb-7 max-w-lg text-base leading-relaxed text-slate-400">
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
          <Link href="/guides" className="font-semibold text-teal-700 hover:underline">
            ← All guides
          </Link>
        </p>
      </div>
    </article>
  );
}
