import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import KnowledgeCentreNav from "@/components/KnowledgeCentreNav";
import NewsFilter, { type FilterableNews } from "@/components/NewsFilter";
import {
  publishedNews,
  archiveYears,
  formatLabel,
  categoryLabel,
  datedFacts,
  wasCorrected,
  formatDate,
  FORMAT_LABELS,
  CATEGORY_LABELS,
  NEWS_PATH,
  NEWS_INDEX_CRUMBS,
} from "@/lib/news";
import { buildCollectionPageSchema, DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

const TITLE = "Fire and health & safety news";
const DESCRIPTION =
  "Enforcement, prosecutions, consultations, standards updates, recalls and regulatory change in UK fire and health & safety — each reported from its primary source.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: NEWS_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: NEWS_PATH,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function NewsPage() {
  const items = publishedNews();
  const years = archiveYears();

  const countBy = (key: "newsFormat" | "newsCategory", value: string) =>
    items.filter((i) => i[key] === value).length;

  const formats = Object.keys(FORMAT_LABELS)
    .map((slug) => ({ slug, label: FORMAT_LABELS[slug], count: countBy("newsFormat", slug) }))
    .filter((f) => f.count > 0);

  const categories = Object.keys(CATEGORY_LABELS)
    .map((slug) => ({ slug, label: CATEGORY_LABELS[slug], count: countBy("newsCategory", slug) }))
    .filter((c) => c.count > 0);

  const collectionJsonLd = buildCollectionPageSchema({
    name: "Fire and health & safety news — Lion Risk Management Solutions",
    description: DESCRIPTION,
    path: NEWS_PATH,
    items: items.map((i) => ({ name: i.title, path: `${NEWS_PATH}/${i.slug}` })),
  });

  const cards: FilterableNews[] = items.map((i) => ({
    slug: i.slug,
    title: i.title,
    summary: i.summary,
    formatLabel: formatLabel(i),
    categoryLabel: categoryLabel(i),
    format: i.newsFormat,
    category: i.newsCategory,
    publishedLabel: formatDate(i.publishedDate),
    publishedIso: i.publishedDate?.slice(0, 10),
    leadFact: datedFacts(i)[0],
    corrected: wasCorrected(i),
    sourceOrganisation: i.sourceOrganisation,
  }));

  const roundUps = items.filter((i) => i.newsFormat === "monthly-roundup").length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <BreadcrumbJsonLd items={NEWS_INDEX_CRUMBS} />

      <PhotoHero
        eyebrow="Knowledge Centre"
        title="News &amp; regulatory updates"
        body="What has actually changed in UK fire and health &amp; safety regulation — enforcement, prosecutions, consultations, standards, recalls and new duties, each reported from its primary source."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-8">
            <Breadcrumbs items={NEWS_INDEX_CRUMBS} />
          </div>

          <KnowledgeCentreNav current={NEWS_PATH} />

          {items.length === 0 ? (
            <p className="text-lg text-slate-600">No news has been published yet.</p>
          ) : (
            <>
              <p className="mb-8 max-w-3xl text-base leading-relaxed text-slate-600">
                {items.length} {items.length === 1 ? "item" : "items"}
                {roundUps > 0 && (
                  <>
                    , of which {roundUps === 1 ? "one is a" : `${roundUps} are`} monthly
                    round-{roundUps === 1 ? "up" : "ups"} — dated records of a month, kept
                    unedited so they still say what was true at the time
                  </>
                )}
                . Every item cites the primary source it came from and the date we
                checked it. These pages are general information, not legal advice.
              </p>

              {years.length > 0 && (
                <nav aria-label="News archive by year" className="mb-10">
                  <h2 className="sr-only">Browse by year</h2>
                  <ul className="flex flex-wrap gap-2">
                    {years.map((y) => (
                      <li key={y.year}>
                        <Link
                          href={`${NEWS_PATH}/${y.year}`}
                          className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-teal-200 hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                        >
                          {y.year} ({y.count})
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              <NewsFilter items={cards} formats={formats} categories={categories} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
