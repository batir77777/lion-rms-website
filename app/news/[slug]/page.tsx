import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MDXContent from "@/components/MDXContent";
import RelatedContent from "@/components/RelatedContent";
import NewsCard from "@/components/NewsCard";
import CorrectionHistory from "@/components/CorrectionHistory";
import {
  publishedNews,
  getNewsItem,
  archiveYears,
  newsInYear,
  isYearParam,
  buildNewsBreadcrumbs,
  buildYearBreadcrumbs,
  formatLabel,
  categoryLabel,
  sectionLabel,
  datedFacts,
  wasCorrected,
  formatDate,
  lastModified,
  guidesReferencedBy,
  standardsReferencedBy,
  legislationReferencedBy,
  termsReferencedBy,
  relatedNewsItems,
  newsReferencing,
  NEWS_PATH,
} from "@/lib/news";
import { displayTerm, GLOSSARY_PATH } from "@/lib/glossary";
import { designation, STANDARDS_PATH } from "@/lib/standards";
import { LEGISLATION_PATH } from "@/lib/legislation";
import { downloadsForNews, DOWNLOADS_PATH } from "@/lib/downloads";
import { buildNewsArticleSchema, buildCollectionPageSchema, DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";
import { getAuthor, getReviewer } from "@/lib/people";
import { SITE, getCategory, getSector } from "@/lib/site";

export const dynamicParams = false;

/**
 * One route serves both /news/[slug] and /news/[year].
 *
 * Next rejects two different dynamic slug names at the same path depth, so
 * `[slug]` and `[year]` cannot be siblings. Rather than pushing archives down
 * to /news/archive/[year] — a URL nobody would guess — this route branches on
 * the shape of the parameter. Rule N9 in lib/editorial-validation.ts makes a
 * year-shaped news slug a build error, so the two can never collide.
 */
export function generateStaticParams() {
  return [
    ...publishedNews().map((n) => ({ slug: n.slug })),
    ...archiveYears().map((y) => ({ slug: y.year })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (isYearParam(slug)) {
    const count = newsInYear(slug).length;
    if (count === 0) return { title: "News" };
    const title = `${slug} news archive`;
    const description = `Every fire and health & safety item Lion Risk Management Solutions published in ${slug} — ${count} ${count === 1 ? "report" : "reports"}, each cited to its primary source.`;
    return {
      title,
      description,
      alternates: { canonical: `${NEWS_PATH}/${slug}` },
      openGraph: {
        type: "website",
        title,
        description,
        url: `${NEWS_PATH}/${slug}`,
        images: [DEFAULT_OG_IMAGE],
      },
      /*
       * The year archives need their own twitter block for the same reason
       * every other route does: a page that declares openGraph but not twitter
       * still inherits the ROOT LAYOUT's twitter card, so /news/2025 shipped
       * the homepage title and description. This branch returns early, so it
       * cannot borrow the twitter block on the news-item return below — the
       * two are separate metadata objects and each needs its own.
       */
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [DEFAULT_OG_IMAGE],
      },
    };
  }

  const item = getNewsItem(slug);
  if (!item) return { title: "News" };
  const path = `${NEWS_PATH}/${item.slug}`;

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

export default async function NewsRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (isYearParam(slug)) return <YearArchive year={slug} />;
  return <NewsDetail slug={slug} />;
}

// ---------------------------------------------------------------------------
// Year archive
// ---------------------------------------------------------------------------

function YearArchive({ year }: { year: string }) {
  const items = newsInYear(year);
  if (items.length === 0) notFound();

  const crumbs = buildYearBreadcrumbs(year);
  const jsonLd = buildCollectionPageSchema({
    name: `${year} news archive — Lion Risk Management Solutions`,
    description: `Fire and health & safety items published in ${year}.`,
    path: `${NEWS_PATH}/${year}`,
    items: items.map((i) => ({ name: i.title, path: `${NEWS_PATH}/${i.slug}` })),
  });

  return (
    <section className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd items={crumbs} />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-40 sm:px-6">
        <div className="mb-8">
          <Breadcrumbs items={crumbs} />
        </div>

        <h1 className="text-[clamp(1.8rem,4vw,2.7rem)] font-extrabold leading-[1.12] text-navy-900">
          {year} news archive
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
          {items.length} {items.length === 1 ? "item" : "items"} published in {year}.
          Round-ups are kept unedited, so they still say what was true at the time.
        </p>

        <div className="mt-6">
          <Link
            href={NEWS_PATH}
            className="font-semibold text-teal-700 underline underline-offset-4 hover:text-teal-800"
          >
            ← All news
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {items.map((i, n) => (
            <NewsCard
              key={i.slug}
              slug={i.slug}
              title={i.title}
              summary={i.summary}
              formatLabel={formatLabel(i)}
              categoryLabel={categoryLabel(i)}
              format={i.newsFormat}
              publishedLabel={formatDate(i.publishedDate)}
              publishedIso={i.publishedDate?.slice(0, 10)}
              leadFact={datedFacts(i)[0]}
              corrected={wasCorrected(i)}
              sourceOrganisation={i.sourceOrganisation}
              delay={n * 60}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// News item
// ---------------------------------------------------------------------------

function NewsDetail({ slug }: { slug: string }) {
  const item = getNewsItem(slug);
  if (!item) notFound();

  const crumbs = buildNewsBreadcrumbs(item);
  const author = getAuthor(item.authorId);
  const reviewer = item.reviewerId ? getReviewer(item.reviewerId) : undefined;
  const path = `${NEWS_PATH}/${item.slug}`;
  const facts = datedFacts(item);
  const corrected = wasCorrected(item);

  const jsonLd = buildNewsArticleSchema({
    headline: item.seoTitle ?? item.title,
    description: item.seoDescription ?? item.summary,
    path,
    authorId: item.authorId,
    datePublished: item.publishedDate,
    dateModified: lastModified(item),
    articleSection: sectionLabel(item),
    image: item.featuredImageSrc,
  });

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
  const peerItemsRaw = relatedNewsItems(item).map((n) => ({
    label: n.title,
    href: `${NEWS_PATH}/${n.slug}`,
  }));
  const followUpItems = newsReferencing(item.slug).map((n) => ({
    label: n.title,
    href: `${NEWS_PATH}/${n.slug}`,
  }));
  const peerItems = withoutDuplicatesOf(peerItemsRaw, followUpItems);
  const downloadItems = downloadsForNews(item.slug).map((d) => ({
    label: d.title,
    href: `${DOWNLOADS_PATH}/${d.slug}`,
  }));

  const serviceItems = (item.relatedServices ?? [])
    .map((s) => getCategory(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.title, href: `/services/${s.slug}` }));

  const sectorItems = (item.relatedSectors ?? [])
    .map((s) => getSector(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.title, href: s.hasPage ? `/sectors/${s.slug}` : undefined }));

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
                {formatLabel(item)}
              </p>
              <p className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-teal-800">
                {categoryLabel(item)}
              </p>
              {corrected && (
                <p className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-amber-900">
                  Corrected
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

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/*
          FIXED ORDER, set by the template rather than left to the author:
          1. the general-information notice
          2. the verified record — dates and primary source
          3. our report
          4. the correction history, which only makes sense after the report
        */}
        <aside
          role="note"
          aria-label="General information notice"
          className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5"
        >
          <p className="text-sm leading-relaxed text-slate-700">
            This is a report of a development in fire or health &amp; safety regulation,
            written for general information. It is not legal advice, and it does not
            replace the primary source it cites.
          </p>
        </aside>

        <section
          aria-labelledby="news-record-heading"
          className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6"
        >
          <h2
            id="news-record-heading"
            className="mb-4 text-sm font-extrabold uppercase tracking-[0.12em] text-navy-900"
          >
            The record
          </h2>
          <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="font-semibold text-navy-900">{f.label}</dt>
                <dd className="text-slate-600">
                  <time dateTime={f.iso}>{f.value}</time>
                </dd>
              </div>
            ))}
            <div>
              <dt className="font-semibold text-navy-900">Primary source</dt>
              <dd className="text-slate-600">{item.sourceOrganisation}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-900">Source checked</dt>
              <dd className="text-slate-600">
                <time dateTime={item.sourceCheckedDate.slice(0, 10)}>
                  {formatDate(item.sourceCheckedDate)}
                </time>
              </dd>
            </div>
            {item.publishedDate && (
              <div>
                <dt className="font-semibold text-navy-900">Published</dt>
                <dd className="text-slate-600">
                  <time dateTime={item.publishedDate.slice(0, 10)}>
                    {formatDate(item.publishedDate)}
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

          <p className="mt-5 text-sm leading-relaxed text-slate-600">
            <Link
              href={item.sourceUrl}
              className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
              rel="noopener noreferrer"
              target="_blank"
            >
              Read the primary source
              <span className="sr-only"> (opens in a new tab)</span>
            </Link>
            {item.sourcePubliclyAccessible === false && (
              <span className="block text-slate-600">
                Note: this source is not freely available to the public.
              </span>
            )}
          </p>

          {item.newsFormat === "monthly-roundup" && (
            <p className="mt-4 rounded-xl border border-navy-200 bg-white p-4 text-sm leading-relaxed text-slate-600">
              This is a monthly round-up. It is a dated record of that month and is not
              rewritten as events move on — later developments are reported in later
              items rather than edited into this one.
            </p>
          )}
        </section>

        <Reveal>
          <div>
            <MDXContent code={item.body} />
          </div>
        </Reveal>

        <CorrectionHistory
          correctionNote={item.correctionNote}
          entries={item.changelog ?? []}
          updatedLabel={formatDate(item.updatedDate)}
          updatedIso={item.updatedDate?.slice(0, 10)}
        />

        <RelatedContent
          groups={[
            { heading: "Guides this affects", items: guideItems },
            { heading: "Standards mentioned", items: standardItems },
            { heading: "Legislation mentioned", items: legislationItems },
            { heading: "Related news", items: peerItems },
            { heading: "Later items referring to this", items: followUpItems },
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
              Need help acting on this?
            </h2>
            <p className="mx-auto mb-7 max-w-lg text-base leading-relaxed text-slate-400">
              Call {SITE.phone} or get in touch to discuss what this means for your
              premises and your duties.
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
                href={NEWS_PATH}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
              >
                All news
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
