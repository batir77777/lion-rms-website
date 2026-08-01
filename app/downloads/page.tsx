import type { Metadata } from "next";
import PhotoHero from "@/components/PhotoHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import KnowledgeCentreNav from "@/components/KnowledgeCentreNav";
import DownloadFilter, { type FilterableDownload } from "@/components/DownloadFilter";
import {
  publishedDownloads,
  deliveryFormats,
  hasPrintableHtml,
  resourceTypeLabel,
  formatDate,
  lastModified,
  RESOURCE_TYPE_LABELS,
  FORMAT_LABELS,
  DOWNLOADS_PATH,
  DOWNLOADS_INDEX_CRUMBS,
} from "@/lib/downloads";
import { buildCollectionPageSchema, DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

const TITLE = "Fire and health & safety checklists, records and templates";
const DESCRIPTION =
  "Free checklists, record forms, logbooks and templates for fire and health & safety duties — no sign-up, no email required. General templates to adapt to your premises.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: DOWNLOADS_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: DOWNLOADS_PATH,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function DownloadsPage() {
  const items = publishedDownloads();

  /** Every format a resource can be obtained as, printable HTML included. */
  const formatsOf = (item: (typeof items)[number]): string[] => {
    const out = deliveryFormats(item).map((f) => f.format);
    if (hasPrintableHtml(item)) out.push("html");
    return [...new Set(out)];
  };

  const typeCounts = Object.keys(RESOURCE_TYPE_LABELS)
    .map((slug) => ({
      slug,
      label: RESOURCE_TYPE_LABELS[slug],
      count: items.filter((i) => i.resourceType === slug).length,
    }))
    .filter((t) => t.count > 0);

  const formatCounts = Object.keys(FORMAT_LABELS)
    .map((slug) => ({
      slug,
      label: FORMAT_LABELS[slug],
      count: items.filter((i) => formatsOf(i).includes(slug)).length,
    }))
    .filter((f) => f.count > 0);

  const collectionJsonLd = buildCollectionPageSchema({
    name: "Fire and health & safety resources — Lion Risk Management Solutions",
    description: DESCRIPTION,
    path: DOWNLOADS_PATH,
    items: items.map((i) => ({ name: i.title, path: `${DOWNLOADS_PATH}/${i.slug}` })),
  });

  const cards: FilterableDownload[] = items.map((i) => ({
    slug: i.slug,
    title: i.title,
    summary: i.summary,
    typeLabel: resourceTypeLabel(i),
    formatLabels: formatsOf(i).map((f) => FORMAT_LABELS[f] ?? f.toUpperCase()),
    version: i.version,
    updatedLabel: formatDate(lastModified(i)),
    updatedIso: lastModified(i)?.slice(0, 10),
    printable: hasPrintableHtml(i),
    resourceType: i.resourceType,
    formats: formatsOf(i),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <BreadcrumbJsonLd items={DOWNLOADS_INDEX_CRUMBS} />

      <PhotoHero
        eyebrow="Knowledge Centre"
        title="Checklists, records &amp; templates"
        body="Practical resources for the fire and health &amp; safety duties that come round weekly, monthly and annually. Free to download and adapt — no sign-up, and no email address required."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-8">
            <Breadcrumbs items={DOWNLOADS_INDEX_CRUMBS} />
          </div>

          <KnowledgeCentreNav current={DOWNLOADS_PATH} />

          {items.length === 0 ? (
            <p className="text-lg text-slate-600">No resources have been published yet.</p>
          ) : (
            <>
              <p className="mb-8 max-w-3xl text-base leading-relaxed text-slate-600">
                {items.length} {items.length === 1 ? "resource" : "resources"}, free to
                download, print and adapt for your own premises. Every one is a{" "}
                <strong className="font-semibold text-navy-900">general template</strong>{" "}
                that needs adapting to the building it is used in, and none of them
                replaces a fire risk assessment, a fire door survey, statutory inspection
                and maintenance, or premises-specific advice. Each page shows the version,
                when it was last reviewed, and what we have checked about its
                accessibility.
              </p>

              <DownloadFilter items={cards} types={typeCounts} formats={formatCounts} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
