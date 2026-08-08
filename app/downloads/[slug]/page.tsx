import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MDXContent from "@/components/MDXContent";
import RelatedContent from "@/components/RelatedContent";
import CorrectionHistory from "@/components/CorrectionHistory";
import PrintButton from "@/components/PrintButton";
import {
  routableDownloads,
  getDownload,
  isWithdrawn,
  deliveryFormats,
  hasPrintableHtml,
  successorsOf,
  recordFacts,
  resourceTypeLabel,
  sectionLabel,
  formatDate,
  lastModified,
  guidesReferencedBy,
  standardsReferencedBy,
  legislationReferencedBy,
  termsReferencedBy,
  newsReferencedBy,
  relatedDownloadResources,
  downloadsReferencing,
  DOWNLOADS_PATH,
  buildDownloadBreadcrumbs,
} from "@/lib/downloads";
import { displayTerm, GLOSSARY_PATH } from "@/lib/glossary";
import { designation, STANDARDS_PATH } from "@/lib/standards";
import { LEGISLATION_PATH } from "@/lib/legislation";
import { NEWS_PATH } from "@/lib/news";
import { buildDigitalDocumentSchema, DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";
import { getAuthor, getReviewer } from "@/lib/people";
import { SITE, getCategory, getSector } from "@/lib/site";

export const dynamicParams = false;

/**
 * Withdrawn resources are built too.
 *
 * A withdrawn checklist keeps its URL at 200 forever, because a completed
 * record in a client's fire safety file cites the version it was printed from,
 * and 404ing that URL would destroy the record rather than correct it. The page
 * explains its own withdrawal and goes noindex; it does not disappear.
 */
export function generateStaticParams() {
  return routableDownloads().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getDownload(slug);
  if (!item) return { title: "Downloads" };

  const path = `${DOWNLOADS_PATH}/${item.slug}`;
  const withdrawn = isWithdrawn(item);

  return {
    title: item.seoTitle ?? item.title,
    description: item.seoDescription ?? item.summary,
    alternates: { canonical: item.canonicalUrl ?? path },
    // noindex, follow — reachable and still passing link equity to the
    // replacement, but no longer competing in search with the resource that
    // superseded it.
    ...(withdrawn || item.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "article",
      title: item.seoTitle ?? item.title,
      description: item.seoDescription ?? item.summary,
      url: path,
      publishedTime: item.publishedDate,
      modifiedTime: lastModified(item),
      images: [item.featuredImageSrc ?? DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: item.seoTitle ?? item.title,
      description: item.seoDescription ?? item.summary,
      images: [item.featuredImageSrc ?? DEFAULT_OG_IMAGE],
    },
  };
}

const ACCESSIBILITY_STATEMENTS: Record<string, string> = {
  "html-native":
    "This resource is a web page, not a file. It uses real headings, lists and landmarks, works with a screen reader and a keyboard, and prints from your browser.",
  "checked-accessible":
    "This document has been checked for accessibility: it is tagged, has a reading order that matches the visual order, carries a document title and language, and its tables have header cells.",
  "checked-limitations":
    "This document has been checked for accessibility and has known limitations, set out below.",
};

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

export default async function DownloadRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getDownload(slug);
  if (!item) notFound();

  const crumbs = buildDownloadBreadcrumbs(item);
  const author = getAuthor(item.authorId);
  const reviewer = item.reviewerId ? getReviewer(item.reviewerId) : undefined;
  const path = `${DOWNLOADS_PATH}/${item.slug}`;

  const withdrawn = isWithdrawn(item);
  const files = deliveryFormats(item);
  const printable = hasPrintableHtml(item);
  const facts = recordFacts(item);
  const successors = successorsOf(item);

  const guideItems = guidesReferencedBy(item).map((g) => ({
    label: g.title,
    href: `/guides/${g.slug}`,
  }));
  const standardItems = standardsReferencedBy(item).map((s) => ({
    label: designation(s),
    href: `${STANDARDS_PATH}/${s.slug}`,
  }));
  const legislationItems = legislationReferencedBy(item).map((l) => ({
    label: l.shortTitle,
    href: `${LEGISLATION_PATH}/${l.slug}`,
  }));
  const termItems = termsReferencedBy(item).map((t) => ({
    label: displayTerm(t),
    href: `${GLOSSARY_PATH}/${t.slug}`,
  }));
  const newsItems = newsReferencedBy(item).map((n) => ({
    label: n.title,
    href: `${NEWS_PATH}/${n.slug}`,
  }));
  const peerItemsRaw = relatedDownloadResources(item).map((d) => ({
    label: d.title,
    href: `${DOWNLOADS_PATH}/${d.slug}`,
  }));
  const referringItems = downloadsReferencing(item.slug).map((d) => ({
    label: d.title,
    href: `${DOWNLOADS_PATH}/${d.slug}`,
  }));
  const peerItems = withoutDuplicatesOf(peerItemsRaw, referringItems);

  const serviceItems = (item.relatedServices ?? [])
    .map((s) => getCategory(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.title, href: `/services/${s.slug}` }));

  const sectorItems = (item.relatedSectors ?? [])
    .map((s) => getSector(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.title, href: s.hasPage ? `/sectors/${s.slug}` : undefined }));

  const jsonLd = buildDigitalDocumentSchema({
    name: item.seoTitle ?? item.title,
    description: item.seoDescription ?? item.summary,
    path,
    authorId: item.authorId,
    version: item.version,
    datePublished: item.publishedDate,
    dateModified: lastModified(item),
    encodings: files.map((f) => ({
      format: f.format,
      url: f.url,
      sizeBytes: f.sizeBytes,
    })),
    about: [...guideItems, ...standardItems, ...legislationItems].map((g) => ({
      name: g.label,
      path: g.href,
    })),
  });

  return (
    <article className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd items={crumbs} />

      <div className="relative isolate overflow-hidden bg-white print:bg-white">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden print:hidden"
          aria-hidden
        >
          <div
            className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full"
            style={{
              background: "radial-gradient(ellipse, rgba(14,165,160,0.09) 0%, transparent 65%)",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-40 sm:px-6 print:pt-8">
          <div className="mb-6 print:hidden">
            <Breadcrumbs items={crumbs} />
          </div>
          <Reveal>
            <div className="mb-5 flex flex-wrap items-center gap-3 print:hidden">
              <p className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-teal-800">
                {resourceTypeLabel(item)}
              </p>
              <p className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-700">
                Version {item.version}
              </p>
              {withdrawn && (
                <p className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-amber-900">
                  Withdrawn
                </p>
              )}
            </div>

            <h1 className="text-[clamp(1.8rem,4vw,2.7rem)] font-extrabold leading-[1.12] text-navy-900">
              {item.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{item.summary}</p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 print:py-0">
        {/*
          FIXED ORDER, set by the template rather than left to the author:
          1. the withdrawal notice, if any — nothing below it matters until the
             reader knows the document is no longer current
          2. the general-information and adaptation notice
          3. the record — version, dates, file facts
          4. the download actions
          5. the resource itself, or its description
          6. accessibility
          7. licence and permitted use
          8. correction history
        */}
        {withdrawn && (
          <aside
            role="note"
            aria-labelledby="withdrawn-heading"
            className="mb-6 rounded-2xl border-2 border-amber-400 bg-amber-50 p-6"
          >
            <h2
              id="withdrawn-heading"
              className="text-lg font-extrabold text-amber-900"
            >
              This resource has been withdrawn
            </h2>
            {item.withdrawnDate && (
              <p className="mt-2 text-sm text-amber-900">
                Withdrawn on{" "}
                <time dateTime={item.withdrawnDate.slice(0, 10)}>
                  {formatDate(item.withdrawnDate)}
                </time>
                .
              </p>
            )}
            {item.withdrawalReason && (
              <p className="mt-2 text-base leading-relaxed text-amber-900">
                {item.withdrawalReason}
              </p>
            )}
            <p className="mt-3 text-base font-semibold leading-relaxed text-amber-900">
              Do not use this version for current work.
            </p>
            {successors.length > 0 ? (
              <p className="mt-3 text-base leading-relaxed text-amber-900">
                Use{" "}
                {successors.map((s, i) => (
                  <span key={s.slug}>
                    {i > 0 && ", "}
                    <Link
                      href={`${DOWNLOADS_PATH}/${s.slug}`}
                      className="font-semibold underline underline-offset-2"
                    >
                      {s.title}
                    </Link>
                  </span>
                ))}{" "}
                instead.
              </p>
            ) : (
              <p className="mt-3 text-base leading-relaxed text-amber-900">
                There is no direct replacement. This page remains available so that
                records completed on the earlier version still make sense.
              </p>
            )}
          </aside>
        )}

        <aside
          role="note"
          aria-label="General information notice"
          className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5"
        >
          <p className="text-sm leading-relaxed text-slate-700">
            This is a <strong className="font-semibold">general template</strong> published
            for general information. It must be adapted to the premises it is used in. It
            is not legal advice, and it does not replace a fire risk assessment,
            professional fire-engineering advice, a fire door survey, or the statutory
            inspection and maintenance your premises require.
          </p>
        </aside>

        <section
          aria-labelledby="download-record-heading"
          className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6"
        >
          <h2
            id="download-record-heading"
            className="mb-4 text-sm font-extrabold uppercase tracking-[0.12em] text-navy-900"
          >
            The record
          </h2>
          <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="font-semibold text-navy-900">{f.label}</dt>
                <dd className="text-slate-600">
                  {f.iso ? <time dateTime={f.iso}>{f.value}</time> : f.value}
                </dd>
              </div>
            ))}
            <div>
              <dt className="font-semibold text-navy-900">Format</dt>
              <dd className="text-slate-600">
                {files.length > 0
                  ? files.map((f) => `${f.label} (${f.sizeLabel})`).join(", ")
                  : "Web page — read and print from this page"}
              </dd>
            </div>
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
                </dd>
              </div>
            )}
            {reviewer && formatDate(item.reviewedDate) && (
              <div>
                <dt className="font-semibold text-navy-900">Reviewed by</dt>
                <dd className="text-slate-600">
                  {reviewer.name}, {formatDate(item.reviewedDate)}
                </dd>
              </div>
            )}
            <div>
              <dt className="font-semibold text-navy-900">Section</dt>
              <dd className="text-slate-600">{sectionLabel(item)}</dd>
            </div>
          </dl>
        </section>

        {!withdrawn && (files.length > 0 || printable) && (
          <section aria-labelledby="download-actions-heading" className="mt-8 print:hidden">
            <h2
              id="download-actions-heading"
              className="mb-4 text-sm font-extrabold uppercase tracking-[0.12em] text-navy-900"
            >
              Get this resource
            </h2>
            <div className="flex flex-wrap gap-3">
              {files.map((f) => (
                <a
                  key={f.url}
                  href={f.url}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  {/*
                    Format and size are INSIDE the link text, not in an adjacent
                    icon or badge. A screen-reader user moving by links hears the
                    whole label and nothing else, so anything that matters before
                    deciding to download has to be in it.
                  */}
                  Download {item.title} ({f.label}, {f.sizeLabel})
                </a>
              ))}
              {printable && <PrintButton label="Print this resource" />}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              No sign-up, no email address, and no tracking. Take it and use it.
            </p>
          </section>
        )}

        <Reveal>
          <div>
            <MDXContent code={item.body} />
          </div>
        </Reveal>

        <section
          aria-labelledby="accessibility-heading"
          className="mt-12 rounded-2xl border border-slate-100 bg-slate-50/60 p-6 print:hidden"
        >
          <h2
            id="accessibility-heading"
            className="mb-3 text-sm font-extrabold uppercase tracking-[0.12em] text-navy-900"
          >
            Accessibility
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            {ACCESSIBILITY_STATEMENTS[item.accessibilityStatus] ??
              "The accessibility of this document has not yet been recorded."}
          </p>
          {item.accessibilityNotes && (
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {item.accessibilityNotes}
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            If you need this resource in another format, ask us and we will provide one.
          </p>
        </section>

        <section
          id="licence"
          aria-labelledby="licence-heading"
          className="mt-8 rounded-2xl border border-slate-100 bg-white p-6"
        >
          <h2
            id="licence-heading"
            className="mb-3 text-sm font-extrabold uppercase tracking-[0.12em] text-navy-900"
          >
            Licence and permitted use
          </h2>
          {/*
            THE canonical licence statement for every Downloads page.
            ---------------------------------------------------------------
            Until F1 this block was rendered on all seven landing pages AND six
            of them carried their own "## Licence and permitted use" section in
            MDX prose, so those six showed the licence twice, under two <h2>
            headings with the same text. The prose versions had drifted into
            five different wordings — one of them ("Free to use and adapt for
            your own premises. Not for resale or republication.") stating the
            terms considerably more loosely than the block sitting beside it.

            The six prose sections were removed rather than harmonised. Six
            copies kept in step by hand drift again at the first edit; one copy
            cannot. `fire-safety-checklist` had always worked this way, so this
            makes the other six match it rather than inventing a pattern.

            The "No registration, payment or attribution" sentence is the one
            thing the prose said that this block did not, so it moved here
            rather than being lost.

            The DigitalDocument JSON-LD points `license` at this section's
            #licence anchor, which is now the only licence block on the page.

            The PDF, DOCX and XLSX footers carry a shorter summary. That is
            deliberate and out of F1's scope: they are published artefacts and
            regenerating them is a separate decision.
          */}
          <p className="text-sm leading-relaxed text-slate-600">
            © {SITE.name}. You may download, print, complete and adapt this resource for
            use in your own premises or organisation, including by your staff and
            contractors working on those premises. No registration, payment or attribution
            is required for that use. You may not resell it, license it, distribute it for
            a fee, republish it elsewhere, present an adapted version as our work, or
            remove the attribution.
          </p>
          {item.thirdPartyMaterial && item.thirdPartyAttribution && (
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {item.thirdPartyAttribution}
            </p>
          )}
        </section>

        <CorrectionHistory
          correctionNote={item.correctionNote}
          entries={item.changelog ?? []}
          updatedLabel={formatDate(item.updatedDate)}
          updatedIso={item.updatedDate?.slice(0, 10)}
        />

        {(item.previousVersions ?? []).length > 0 && (
          <section
            aria-labelledby="previous-versions-heading"
            className="mt-8 print:hidden"
          >
            <h2
              id="previous-versions-heading"
              className="mb-3 text-sm font-extrabold uppercase tracking-[0.12em] text-navy-900"
            >
              Previous versions
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              Earlier versions stay available so that records already completed on them
              still make sense. They are superseded and should not be used for new work.
            </p>
            <ul className="space-y-2 text-sm">
              {(item.previousVersions ?? []).map((v) => (
                <li key={v.version}>
                  <a
                    href={v.fileUrl}
                    download
                    className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
                  >
                    Version {v.version}
                  </a>
                  <span className="text-slate-600">
                    {" "}
                    — superseded{" "}
                    <time dateTime={v.supersededDate.slice(0, 10)}>
                      {formatDate(v.supersededDate)}
                    </time>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="print:hidden">
          <RelatedContent
            groups={[
              { heading: "Guides this supports", items: guideItems },
              { heading: "Standards referenced", items: standardItems },
              { heading: "Legislation referenced", items: legislationItems },
              { heading: "Related news", items: newsItems },
              { heading: "Related resources", items: peerItems },
              { heading: "Resources referring to this", items: referringItems },
              { heading: "Terms used on this page", items: termItems },
              { heading: "Related service", items: serviceItems },
              { heading: "Related sector", items: sectorItems },
            ]}
          />
        </div>

        <Reveal>
          <div
            className="mt-14 rounded-2xl border p-10 text-center print:hidden"
            style={{
              background: "linear-gradient(135deg,#060e1f 0%,#0c1f3f 50%,#082218 100%)",
              borderColor: "rgba(14,165,160,0.2)",
            }}
          >
            <h2 className="mb-4 text-2xl font-extrabold text-white">
              Need this done properly, not just recorded?
            </h2>
            <p className="mx-auto mb-7 max-w-lg text-base leading-relaxed text-slate-400">
              A template records what you found. Call {SITE.phone} or get in touch if you
              need someone competent to assess what it means for your premises.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#0f766e,#0e7490)" }}
              >
                Request a Quote
              </Link>
              <Link
                href={DOWNLOADS_PATH}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
              >
                All resources
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
