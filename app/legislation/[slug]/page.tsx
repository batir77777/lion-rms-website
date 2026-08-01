import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MDXContent from "@/components/MDXContent";
import RelatedContent from "@/components/RelatedContent";
import LegislationStatusBanner, {
  LegalAdviceNotice,
  OutstandingEffectsNotice,
  ForceStatusBadge,
} from "@/components/LegislationStatusBanner";
import {
  getLegislation,
  publishedLegislation,
  buildLegislationBreadcrumbs,
  forceStatusLabel,
  tierLabel,
  formLabel,
  typeLabel,
  jurisdictionList,
  extentDiffersFromApplication,
  sourceTextTrailsConfirmation,
  categoryLabel,
  guidesReferencing,
  standardsReferencing,
  termsUsedBy,
  standardsUsedBy,
  relatedLegislation,
  amendsInstruments,
  amendedByInstruments,
  formatDate,
  lastModified,
  LEGISLATION_PATH,
} from "@/lib/legislation";
import { displayTerm, GLOSSARY_PATH } from "@/lib/glossary";
import { designation, STANDARDS_PATH } from "@/lib/standards";
import { buildLegislationSchema, DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";
import { getAuthor, getReviewer } from "@/lib/people";
import {
  SITE,
  getCategory,
  getSector,
  CTA_PRIMARY_LABEL,
  CTA_SECONDARY_LABEL,
  CTA_SECONDARY_HREF,
} from "@/lib/site";
import { newsMentioningLegislation, NEWS_PATH } from "@/lib/news";
import { downloadsForLegislation, DOWNLOADS_PATH } from "@/lib/downloads";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedLegislation().map((l) => ({ slug: l.slug }));
}

/** schema.org LegislationType, from the instrument form. */
function schemaLegislationType(form: string): string {
  return form.includes("act") || form.includes("order-in-council")
    ? "Act"
    : "StatutoryInstrument";
}

/**
 * schema.org legislationLegalForce, from forceStatus.
 *
 * Deliberately returns undefined where no schema.org value fits.
 * "Partially repealed" and "spent" have no counterpart, and mapping either to
 * NotInForce would state something untrue about an instrument that still bites.
 */
function schemaLegalForce(forceStatus: string): string | undefined {
  if (forceStatus === "in-force") return "InForce";
  if (forceStatus === "partially-in-force") return "PartiallyInForce";
  if (forceStatus === "not-yet-in-force") return "NotInForce";
  if (forceStatus === "repealed" || forceStatus === "revoked") return "NotInForce";
  return undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getLegislation(slug);
  if (!item) return { title: "Legislation" };

  const path = `${LEGISLATION_PATH}/${item.slug}`;

  return {
    title: item.seoTitle ?? item.title,
    description: item.seoDescription ?? item.summary,
    alternates: { canonical: item.canonicalUrl ?? path },
    ...(item.noindex ? { robots: { index: false, follow: true } } : {}),
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

export default async function LegislationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getLegislation(slug);
  if (!item) notFound();

  const crumbs = buildLegislationBreadcrumbs(item);
  const author = getAuthor(item.authorId);
  const reviewer = item.reviewerId ? getReviewer(item.reviewerId) : undefined;
  const path = `${LEGISLATION_PATH}/${item.slug}`;

  const jsonLd = buildLegislationSchema({
    headline: item.seoTitle ?? item.title,
    description: item.seoDescription ?? item.summary,
    path,
    authorId: item.authorId,
    datePublished: item.publishedDate,
    dateModified: lastModified(item),
    articleSection: categoryLabel(item),
    instrument: {
      name: item.shortTitle,
      identifier: item.officialReference,
      legislationType: schemaLegislationType(item.instrumentForm),
      legislationDate: item.inForceDate,
      // APPLICATION, not extent — application is the operative statement.
      jurisdiction: jurisdictionList(item.application),
      legalForce: schemaLegalForce(item.forceStatus),
      publisher: item.publisher,
      url: item.officialSourceUrl,
    },
  });

  const successorItems = (item.supersededBy ?? [])
    .map((s) => getLegislation(s))
    .filter((l): l is NonNullable<typeof l> => Boolean(l))
    .map((l) => ({ label: l.shortTitle, href: `${LEGISLATION_PATH}/${l.slug}` }));

  const guideItems = guidesReferencing(item.slug).map((g) => ({
    label: g.title,
    href: `/guides/${g.slug}`,
  }));
  const standardsReferencingItems = standardsReferencing(item.slug).map((s) => ({
    label: designation(s),
    href: `${STANDARDS_PATH}/${s.slug}`,
  }));
  const standardItemsRaw = standardsUsedBy(item).map((s) => ({
    label: designation(s),
    href: `${STANDARDS_PATH}/${s.slug}`,
  }));
  const standardItems = withoutDuplicatesOf(standardItemsRaw, standardsReferencingItems);
  const termItems = termsUsedBy(item).map((t) => ({
    label: displayTerm(t),
    href: `${GLOSSARY_PATH}/${t.slug}`,
  }));
  const peerItems = relatedLegislation(item).map((l) => ({
    label: l.shortTitle,
    href: `${LEGISLATION_PATH}/${l.slug}`,
  }));
  const amendsItems = amendsInstruments(item).map((l) => ({
    label: l.shortTitle,
    href: `${LEGISLATION_PATH}/${l.slug}`,
  }));
  const amendedByItems = amendedByInstruments(item).map((l) => ({
    label: l.shortTitle,
    href: `${LEGISLATION_PATH}/${l.slug}`,
  }));

  const serviceItems = (item.relatedServices ?? [])
    .map((s) => getCategory(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.title, href: `/services/${s.slug}` }));

  const sectorItems = (item.relatedSectors ?? [])
    .map((s) => getSector(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.title, href: s.hasPage ? `/sectors/${s.slug}` : undefined }));

  const terminationLabel =
    formatDate(item.repealedDate) ?? formatDate(item.revokedDate);
  const asAtLabel = formatDate(item.sourceTextAsAtDate);
  const territoryDiffers = extentDiffersFromApplication(item);
  const sourceBehind = sourceTextTrailsConfirmation(item);

  const newsItems = newsMentioningLegislation(item.slug).map((n) => ({
    label: n.title,
    href: `${NEWS_PATH}/${n.slug}`,
  }));
  const downloadItems = downloadsForLegislation(item.slug).map((d) => ({
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
              <p className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-700">
                {tierLabel(item)}
              </p>
              <ForceStatusBadge
                forceStatus={item.forceStatus}
                statusLabel={forceStatusLabel(item)}
              />
            </div>

            <h1 className="text-[clamp(1.8rem,4vw,2.7rem)] font-extrabold leading-[1.12] text-navy-900">
              {item.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{item.summary}</p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/*
          FIXED ORDER, set by the template rather than left to the author.
          1. the legal-advice notice
          2. the force-status banner
          3. the outstanding-effects warning
          4. verified official metadata
          5. our summary and commentary
          A screen-reader user meets every caveat before the substance, and the
          reader cannot reach the body without passing the warning that the
          official text may be incomplete.
        */}
        <LegalAdviceNotice text={item.disclaimer} />

        <LegislationStatusBanner
          forceStatus={item.forceStatus}
          statusLabel={forceStatusLabel(item)}
          statusNote={item.statusNote}
          terminationLabel={terminationLabel}
          successors={successorItems}
        />

        <OutstandingEffectsNotice
          effects={item.outstandingEffects}
          asAtLabel={asAtLabel}
          asAtStated={item.sourceTextAsAtDateStated}
        />

        {/* VERIFIED OFFICIAL METADATA — kept visually and semantically apart
            from our commentary, per the editorial requirement. */}
        <section
          aria-labelledby="legislation-metadata-heading"
          className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6"
        >
          <h2
            id="legislation-metadata-heading"
            className="mb-4 text-sm font-extrabold uppercase tracking-[0.12em] text-navy-900"
          >
            Verified official record
          </h2>
          <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-navy-900">Short title</dt>
              <dd className="text-slate-600">{item.shortTitle}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-900">Citation</dt>
              <dd className="text-slate-600">{item.officialReference}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-900">Type</dt>
              <dd className="text-slate-600">
                {tierLabel(item)} · {formLabel(item)} · {typeLabel(item)}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-900">Status</dt>
              <dd className="text-slate-600">{forceStatusLabel(item)}</dd>
            </div>
            {/* Extent and application always shown as separate rows, with the
                terms of art glossed — they mean nothing to a duty holder
                otherwise, and the difference between them is the whole point. */}
            <div>
              <dt className="font-semibold text-navy-900">Extent (part of the law of)</dt>
              <dd className="text-slate-600">{jurisdictionList(item.extent)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-900">Applies in</dt>
              <dd className="text-slate-600">{jurisdictionList(item.application)}</dd>
            </div>
            {item.enablingPower && (
              <div className="sm:col-span-2">
                <dt className="font-semibold text-navy-900">Made under</dt>
                <dd className="text-slate-600">{item.enablingPower}</dd>
              </div>
            )}
            <div className="sm:col-span-2">
              <dt className="font-semibold text-navy-900">
                {item.sourceTextAsAtDateStated
                  ? "Official text current to"
                  : "Position verified on"}
              </dt>
              <dd className="text-slate-600">
                <time dateTime={item.sourceTextAsAtDate}>{asAtLabel}</time>
                {!item.sourceTextAsAtDateStated && (
                  <span className="block">
                    The official source did not display a currency date, so this is the
                    date we verified it rather than one the source vouched for.
                  </span>
                )}
                {sourceBehind && item.sourceTextAsAtDateStated && (
                  <span className="block">
                    Note that the official revised text is itself behind our last check on{" "}
                    {formatDate(item.sourceCurrencyConfirmedDate)}.
                  </span>
                )}
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
                  {author.jobTitle ? `, ${author.jobTitle}` : ""}
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
          </dl>

          {territoryDiffers && item.extentNote && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-navy-900">
                Extent and application are not the same here
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {item.extentNote}
              </p>
            </div>
          )}
          {!territoryDiffers && item.extentNote && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm leading-relaxed text-slate-600">{item.extentNote}</p>
            </div>
          )}
        </section>

        {/* OUR COMMENTARY — from here on, the words are Lion RMS's. */}
        <Reveal>
          <div>
            <MDXContent code={item.body} />
          </div>
        </Reveal>

        {(item.commencement.length > 0 || item.notYetInForce.length > 0) && (
          <Reveal>
            <section aria-labelledby="commencement-heading" className="mt-12">
              <h2 id="commencement-heading" className="text-2xl font-bold text-navy-900">
                Commencement
              </h2>

              {item.commencement.length > 0 && (
                <dl className="mt-5 space-y-4">
                  {item.commencement.map((c) => (
                    <div
                      key={`${c.date}-${c.scope}`}
                      className="rounded-xl border border-slate-100 bg-slate-50/60 p-5"
                    >
                      <dt className="text-base font-semibold text-navy-900">
                        <time dateTime={c.date}>{formatDate(c.date)}</time>
                        {c.jurisdiction ? ` — ${jurisdictionList([c.jurisdiction])}` : ""}
                      </dt>
                      <dd className="mt-1 text-base leading-relaxed text-slate-600">
                        {c.scope}
                        {c.broughtInBy ? ` (${c.broughtInBy})` : ""}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {item.notYetInForce.length > 0 && (
                <>
                  <h3 className="mt-8 text-xl font-bold text-navy-900">
                    Provisions not yet in force
                  </h3>
                  <dl className="mt-4 space-y-4">
                    {item.notYetInForce.map((n) => (
                      <div
                        key={n.provision}
                        className="rounded-xl border border-amber-200 bg-amber-50/60 p-5"
                      >
                        <dt className="text-base font-semibold text-navy-900">
                          {n.provision}
                        </dt>
                        <dd className="mt-1 text-base leading-relaxed text-slate-700">
                          {n.note}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}

              {item.commencementNote && (
                <p className="mt-5 text-sm leading-relaxed text-slate-600">
                  {item.commencementNote}
                </p>
              )}
            </section>
          </Reveal>
        )}

        {item.amendments.length > 0 && (
          <Reveal>
            <section aria-labelledby="amendments-heading" className="mt-12">
              <h2 id="amendments-heading" className="text-2xl font-bold text-navy-900">
                Amendments
              </h2>
              <dl className="mt-5 space-y-4">
                {item.amendments.map((a) => (
                  <div
                    key={`${a.reference}-${a.date}`}
                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-5"
                  >
                    <dt className="text-base font-semibold text-navy-900">
                      {a.reference}
                      {formatDate(a.date) ? ` — ${formatDate(a.date)}` : ""}
                      {!a.inForce && " (not yet in force)"}
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
                href={item.officialSourceUrl}
                className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.shortTitle} on legislation.gov.uk
                <span className="sr-only"> (opens in a new tab)</span>
              </Link>
            </p>
            <p className="mt-5 text-sm leading-relaxed text-slate-600">
              {item.copyrightNotice}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.disclaimer}</p>
          </section>
        </Reveal>

        <RelatedContent
          groups={[
            { heading: "Guides that discuss this", items: guideItems },
            { heading: "Standards that support this", items: standardsReferencingItems },
            { heading: "Amends", items: amendsItems },
            { heading: "Amended by", items: amendedByItems },
            { heading: "Related legislation", items: peerItems },
            { heading: "News about this instrument", items: newsItems },
            { heading: "Checklists and templates", items: downloadItems },
            { heading: "Related standards", items: standardItems },
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
              Call {SITE.phone} or get in touch to discuss how we can keep your portfolio
              compliant and audit-ready.
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
          <Link
            href={LEGISLATION_PATH}
            className="font-semibold text-teal-700 hover:underline"
          >
            ← All legislation
          </Link>
        </p>
      </div>
    </article>
  );
}
