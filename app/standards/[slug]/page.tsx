import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MDXContent from "@/components/MDXContent";
import RelatedContent from "@/components/RelatedContent";
import StandardStatusBanner, {
  StandardStatusBadge,
} from "@/components/StandardStatusBanner";
import {
  getStandard,
  publishedStandards,
  buildStandardBreadcrumbs,
  designation,
  documentClassLabel,
  documentStatusLabel,
  categoryLabel,
  guidesReferencing,
  termsUsedBy,
  relatedStandards,
  successors,
  predecessors,
  formatDate,
  lastModified,
  STANDARDS_PATH,
} from "@/lib/standards";
import { displayTerm, GLOSSARY_PATH } from "@/lib/glossary";
import {
  getLegislation,
  legislationUsingStandard,
  LEGISLATION_PATH,
} from "@/lib/legislation";
import { buildStandardSchema, DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";
import { getAuthor, getReviewer } from "@/lib/people";
import {
  SITE,
  getCategory,
  getSector,
  CTA_PRIMARY_LABEL,
  CTA_SECONDARY_LABEL,
  CTA_SECONDARY_HREF,
} from "@/lib/site";
import { newsMentioningStandard, NEWS_PATH } from "@/lib/news";
import { downloadsForStandard, DOWNLOADS_PATH } from "@/lib/downloads";

// Only published standards are generated, and `dynamicParams = false` means a
// slug outside that set returns a genuine 404 rather than being rendered on
// demand — so an unpublished slug is not reachable by guessing it.
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedStandards().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const standard = getStandard(slug);
  if (!standard) return { title: "Standards" };

  const path = `${STANDARDS_PATH}/${standard.slug}`;

  return {
    title: standard.seoTitle ?? standard.title,
    description: standard.seoDescription ?? standard.summary,
    alternates: { canonical: standard.canonicalUrl ?? path },
    ...(standard.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "article",
      title: standard.seoTitle ?? standard.title,
      description: standard.seoDescription ?? standard.summary,
      url: path,
      publishedTime: standard.publishedDate,
      modifiedTime: lastModified(standard),
      images: [standard.featuredImageSrc ?? DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: standard.seoTitle ?? standard.title,
      description: standard.seoDescription ?? standard.summary,
      images: [standard.featuredImageSrc ?? DEFAULT_OG_IMAGE],
    },
  };
}

/*
 * Relationship de-duplication (site-quality PR).
 *
 * A genuine two-way relationship lands in BOTH the generic outbound group and
 * the derived inverse group, so the same item rendered twice, adjacently, under
 * headings that did not obviously differ. Measured on production before this
 * change: four of eight Standards pages repeated legislation this way.
 *
 * The specific group is authoritative — "legislation that cites this standard"
 * says strictly more than "related legislation" — so the duplicate is removed
 * from the GENERIC group only. Nothing that appears in just one group is
 * touched, and the direction of the relationship survives.
 *
 * tests/site-quality.test.mjs asserts the two sets are disjoint by href for
 * every published item in all four templates.
 */
const withoutDuplicatesOf = (
  generic: { label: string; href?: string }[],
  specific: { label: string; href?: string }[],
) => generic.filter((g) => !specific.some((s) => s.href === g.href));

export default async function StandardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const standard = getStandard(slug);
  if (!standard) notFound();

  const crumbs = buildStandardBreadcrumbs(standard);
  const author = getAuthor(standard.authorId);
  const reviewer = standard.reviewerId ? getReviewer(standard.reviewerId) : undefined;

  const path = `${STANDARDS_PATH}/${standard.slug}`;

  // The structured data says, explicitly, that this page is OUR commentary and
  // the document is somebody else's work. See buildStandardSchema.
  const jsonLd = buildStandardSchema({
    headline: standard.seoTitle ?? standard.title,
    description: standard.seoDescription ?? standard.summary,
    path,
    authorId: standard.authorId,
    datePublished: standard.publishedDate,
    dateModified: lastModified(standard),
    articleSection: categoryLabel(standard),
    document: {
      name: standard.title,
      identifier: standard.officialReference,
      version: standard.currentEdition,
      publisher: standard.publisher,
      url: standard.officialSourceUrl,
    },
  });

  const successorItems = successors(standard).map((s) => ({
    designation: designation(s),
    href: `${STANDARDS_PATH}/${s.slug}`,
  }));

  const predecessorItems = predecessors(standard).map((s) => ({
    label: designation(s),
    href: `${STANDARDS_PATH}/${s.slug}`,
  }));

  const guideItems = guidesReferencing(standard.slug).map((g) => ({
    label: g.title,
    href: `/guides/${g.slug}`,
  }));

  const termItems = termsUsedBy(standard).map((t) => ({
    label: displayTerm(t),
    href: `${GLOSSARY_PATH}/${t.slug}`,
  }));

  const peerItems = relatedStandards(standard).map((s) => ({
    label: designation(s),
    href: `${STANDARDS_PATH}/${s.slug}`,
  }));

  const serviceItems = (standard.relatedServices ?? [])
    .map((s) => getCategory(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.title, href: `/services/${s.slug}` }));

  // Sectors without a live page render as plain, unlinked text — that is
  // RelatedContent's documented behaviour for an item with no href, not a
  // workaround.
  const sectorItems = (standard.relatedSectors ?? [])
    .map((s) => getSector(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({
      label: s.title,
      href: s.hasPage ? `/sectors/${s.slug}` : undefined,
    }));

  // Phase 5A PR 6: legislation pages now exist, so these resolve to real links
  // rather than the unlinked labels PR 5 rendered.
  const legislationItemsRaw = (standard.relatedLegislation ?? [])
    .map((s) => getLegislation(s))
    .filter((l): l is NonNullable<typeof l> => Boolean(l))
    .map((l) => ({ label: l.shortTitle, href: `${LEGISLATION_PATH}/${l.slug}` }));

  // The inverse: legislation pages that declare this standard.
  const legislationUsingThis = legislationUsingStandard(standard.slug).map((l) => ({
    label: l.shortTitle,
    href: `${LEGISLATION_PATH}/${l.slug}`,
  }));
  const legislationItems = withoutDuplicatesOf(legislationItemsRaw, legislationUsingThis);

  const withdrawnLabel = formatDate(standard.withdrawnDate);

  const newsItems = newsMentioningStandard(standard.slug).map((n) => ({
    label: n.title,
    href: `${NEWS_PATH}/${n.slug}`,
  }));
  const downloadItems = downloadsForStandard(standard.slug).map((d) => ({
    label: d.title,
    href: `${DOWNLOADS_PATH}/${d.slug}`,
  }));

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
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-700">
                {documentClassLabel(standard)}
              </p>
              <StandardStatusBadge
                documentStatus={standard.documentStatus}
                statusLabel={documentStatusLabel(standard)}
              />
            </div>

            <h1 className="text-[clamp(1.85rem,4vw,2.75rem)] font-extrabold leading-[1.12] text-navy-900">
              {standard.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{standard.summary}</p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/*
          The status banner comes BEFORE the provenance block and before the
          body. A screen-reader user should meet the caveat before the
          substance, not discover after a page of commentary that the document
          it describes no longer stands.
        */}
        <StandardStatusBanner
          documentStatus={standard.documentStatus}
          statusLabel={documentStatusLabel(standard)}
          withdrawnLabel={withdrawnLabel}
          successors={successorItems}
          revisionInProgress={standard.revisionInProgress}
          revisionNote={standard.revisionNote}
        />

        {/* Document provenance. A definition list rather than free text, so
            each label is programmatically associated with its value. */}
        <section
          aria-labelledby="document-provenance-heading"
          className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6"
        >
          <h2 id="document-provenance-heading" className="sr-only">
            Document reference and verification record
          </h2>
          <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-navy-900">Reference</dt>
              <dd className="text-slate-600">{standard.officialReference}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-900">Publisher</dt>
              <dd className="text-slate-600">{standard.publisher}</dd>
            </div>
            {standard.currentEdition && (
              <div>
                <dt className="font-semibold text-navy-900">Current edition</dt>
                <dd className="text-slate-600">{standard.currentEdition}</dd>
              </div>
            )}
            <div>
              <dt className="font-semibold text-navy-900">Status</dt>
              <dd className="text-slate-600">{documentStatusLabel(standard)}</dd>
            </div>
            {withdrawnLabel && (
              <div>
                <dt className="font-semibold text-navy-900">Withdrawn</dt>
                <dd className="text-slate-600">
                  <time dateTime={standard.withdrawnDate}>{withdrawnLabel}</time>
                </dd>
              </div>
            )}
            {formatDate(standard.lastCheckedDate) && (
              <div>
                <dt className="font-semibold text-navy-900">Last checked against source</dt>
                <dd className="text-slate-600">
                  <time dateTime={standard.lastCheckedDate}>
                    {formatDate(standard.lastCheckedDate)}
                  </time>
                </dd>
              </div>
            )}
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
            {reviewer && formatDate(standard.reviewedDate) && (
              <div>
                <dt className="font-semibold text-navy-900">Reviewed by</dt>
                <dd className="text-slate-600">
                  {reviewer.name}, {formatDate(standard.reviewedDate)}
                </dd>
              </div>
            )}
          </dl>
        </section>

        <Reveal>
          <div>
            <MDXContent code={standard.body} />
          </div>
        </Reveal>

        {standard.amendments.length > 0 && (
          <Reveal>
            <section aria-labelledby="amendments-heading" className="mt-12">
              <h2 id="amendments-heading" className="text-2xl font-bold text-navy-900">
                Amendments and corrigenda
              </h2>
              <dl className="mt-5 space-y-4">
                {standard.amendments.map((a) => (
                  <div
                    key={`${a.reference}-${a.date}`}
                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-5"
                  >
                    <dt className="text-base font-semibold text-navy-900">
                      {a.reference}
                      {formatDate(a.date) ? ` — ${formatDate(a.date)}` : ""}
                    </dt>
                    <dd className="mt-1 text-base leading-relaxed text-slate-600">
                      {a.summary}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </Reveal>
        )}

        {/* Official source and the copyright position. Deliberately prominent
            and deliberately near the end: it is the link a reader should follow
            for anything authoritative, and the notice that governs what this
            page may and may not say. */}
        <Reveal>
          <section
            aria-labelledby="official-source-heading"
            className="mt-12 rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h2 id="official-source-heading" className="text-2xl font-bold text-navy-900">
              Official source
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              <Link
                href={standard.officialSourceUrl}
                className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
                rel="noopener noreferrer"
                target="_blank"
              >
                {standard.publisher} — {standard.officialReference}
                <span className="sr-only"> (opens in a new tab)</span>
              </Link>
            </p>
            <p className="mt-5 text-sm leading-relaxed text-slate-600">
              {standard.copyrightNotice}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {standard.disclaimer}
            </p>
          </section>
        </Reveal>

        <RelatedContent
          groups={[
            { heading: "Guides that reference this document", items: guideItems },
            { heading: "Replaces", items: predecessorItems },
            { heading: "Related standards", items: peerItems },
            { heading: "Legislation this standard supports", items: legislationItems },
            { heading: "Other legislation that cites this standard", items: legislationUsingThis },
            { heading: "News mentioning this document", items: newsItems },
            { heading: "Checklists and templates", items: downloadItems },
            { heading: "Terms used on this page", items: termItems },
            { heading: "Related service", items: serviceItems },
            { heading: "Related sector", items: sectorItems },
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
          <Link href={STANDARDS_PATH} className="font-semibold text-teal-700 hover:underline">
            ← All standards and guidance
          </Link>
        </p>
      </div>
    </article>
  );
}
