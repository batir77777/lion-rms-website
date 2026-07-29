import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MDXContent from "@/components/MDXContent";
import RelatedContent from "@/components/RelatedContent";
import {
  getTerm,
  publishedTerms,
  displayTerm,
  alternateNames,
  relatedTerms,
  guidesUsingTerm,
  buildTermBreadcrumbs,
  categoryLabel,
  tagLabels,
  GLOSSARY_PATH,
} from "@/lib/glossary";
import { formatDate } from "@/lib/guides";
import { standardsUsingTerm, designation, STANDARDS_PATH } from "@/lib/standards";
import { buildDefinedTermSchema, DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";
import { getAuthor, getReviewer } from "@/lib/people";
import { SITE, SITE_URL, CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedTerms().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) return { title: "Glossary" };

  const path = `${GLOSSARY_PATH}/${term.slug}`;
  const description = term.seoDescription ?? term.shortDefinition;

  return {
    title: term.seoTitle ?? term.title,
    description,
    alternates: { canonical: term.canonicalUrl ?? path },
    ...(term.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "article",
      title: term.seoTitle ?? term.title,
      description,
      url: path,
      publishedTime: term.publishedDate,
      modifiedTime: term.updatedDate ?? term.publishedDate,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: term.seoTitle ?? term.title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) notFound();

  const crumbs = buildTermBreadcrumbs(term);
  const heading = displayTerm(term);
  const alternates = alternateNames(term);
  const related = relatedTerms(term);
  const guides = guidesUsingTerm(term.slug);

  const author = getAuthor(term.authorId);
  const reviewer = term.reviewerId ? getReviewer(term.reviewerId) : undefined;
  const publishedLabel = formatDate(term.publishedDate);
  const reviewedLabel = formatDate(term.reviewedDate);
  const nextReviewLabel = formatDate(term.nextReviewDue);

  const jsonLd = buildDefinedTermSchema({
    name: heading,
    description: term.shortDefinition,
    path: `${GLOSSARY_PATH}/${term.slug}`,
    alternateNames: alternates,
    inDefinedTermSet: `${SITE_URL}${GLOSSARY_PATH}`,
  });

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
        <div className="relative mx-auto max-w-3xl px-4 pb-12 pt-40 sm:px-6">
          <div className="mb-6">
            <Breadcrumbs items={crumbs} />
          </div>
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
              Glossary &middot; {categoryLabel(term)}
            </p>

            {/* The term itself is the h1 — this page exists to define it. */}
            <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.1] text-navy-900">
              {heading}
            </h1>

            {/* The definition comes immediately, not behind a decorative band. */}
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{term.shortDefinition}</p>

            {alternates.length > 0 && (
              <p className="mt-4 text-base text-slate-500">
                <span className="font-semibold text-navy-900">Also known as:</span>{" "}
                {alternates.join(", ")}
              </p>
            )}

            {term.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {tagLabels(term).map((tag) => (
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

      <div className="mx-auto max-w-3xl px-4 pb-12 sm:px-6">
        <section
          aria-labelledby="term-provenance-heading"
          className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6"
        >
          <h2 id="term-provenance-heading" className="sr-only">
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
                  <time dateTime={term.publishedDate}>{publishedLabel}</time>
                </dd>
              </div>
            )}
            {nextReviewLabel && (
              <div>
                <dt className="font-semibold text-navy-900">Next review due</dt>
                <dd className="text-slate-600">
                  <time dateTime={term.nextReviewDue}>{nextReviewLabel}</time>
                </dd>
              </div>
            )}
            {term.jurisdiction && (
              <div>
                <dt className="font-semibold text-navy-900">Applies in</dt>
                <dd className="text-slate-600">{JURISDICTION_LABELS[term.jurisdiction] ?? term.jurisdiction}</dd>
              </div>
            )}
          </dl>
        </section>

        <Reveal>
          <div>
            <MDXContent code={term.extendedDefinition} />
          </div>
        </Reveal>

        <RelatedContent
          groups={[
            {
              heading: "Related terms",
              items: related.map((t) => ({
                label: displayTerm(t),
                href: `${GLOSSARY_PATH}/${t.slug}`,
              })),
            },
            {
              heading: "Guides that use this term",
              items: guides.map((g) => ({ label: g.title, href: `/guides/${g.slug}` })),
            },
            {
              // Phase 5A PR 5. Derived by inverting each standard's
              // relatedGlossaryTerms — declared once on the standard, surfaced
              // on both. A term like "fire resistance rating" is materially
              // more useful when it names the documents that define it.
              heading: "Standards that use this term",
              items: standardsUsingTerm(term.slug).map((s) => ({
                label: designation(s),
                href: `${STANDARDS_PATH}/${s.slug}`,
              })),
            },
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
          <Link href={GLOSSARY_PATH} className="font-semibold text-teal-700 hover:underline">
            ← All glossary terms
          </Link>
        </p>
      </div>
    </article>
  );
}

// Jurisdiction is a genuine content-accuracy field on this schema, not
// decoration — fire safety legislation differs materially by nation — so it is
// surfaced in readable form rather than as a raw slug.
const JURISDICTION_LABELS: Record<string, string> = {
  england: "England",
  wales: "Wales",
  "england-and-wales": "England and Wales",
  scotland: "Scotland",
  "northern-ireland": "Northern Ireland",
  "uk-wide": "UK-wide",
};
