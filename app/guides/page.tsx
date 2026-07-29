import type { Metadata } from "next";
import PhotoHero from "@/components/PhotoHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import KnowledgeCentreNav from "@/components/KnowledgeCentreNav";
import GuideFilter, { type FilterableGuide } from "@/components/GuideFilter";
import {
  publishedGuides,
  usedCategories,
  categoryLabel,
  tagLabels,
  formatDate,
} from "@/lib/guides";
import { buildCollectionPageSchema, DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

const TITLE = "Guides";
const DESCRIPTION =
  "Practical fire safety and health & safety guidance for duty holders — fire risk assessments, fire doors, statutory responsibilities and day-to-day compliance.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/guides" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: "/guides",
    images: [DEFAULT_OG_IMAGE],
  },
};

const CRUMBS = [{ name: "Home", path: "/" }, { name: "Knowledge Centre" }];

export default function GuidesPage() {
  const guides = publishedGuides();
  const categories = usedCategories();

  const collectionJsonLd = buildCollectionPageSchema({
    name: "Guides — Lion Risk Management Solutions",
    description: DESCRIPTION,
    path: "/guides",
    items: guides.map((g) => ({ name: g.title, path: `/guides/${g.slug}` })),
  });

  const cards: FilterableGuide[] = guides.map((g) => ({
    slug: g.slug,
    title: g.title,
    summary: g.summary,
    categorySlug: g.category,
    categoryLabel: categoryLabel(g),
    publishedLabel: formatDate(g.publishedDate) ?? "",
    reviewedLabel: formatDate(g.reviewedDate),
    tagLabels: tagLabels(g),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <BreadcrumbJsonLd items={CRUMBS} />

      <PhotoHero
        eyebrow="Knowledge Centre"
        title="Fire &amp; safety guides"
        body="Practical guidance for duty holders on fire risk assessments, fire doors, statutory responsibilities and day-to-day compliance — written and reviewed in-house."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-8">
            <Breadcrumbs items={CRUMBS} />
          </div>

          <KnowledgeCentreNav current="/guides" />

          {guides.length === 0 ? (
            <p className="text-lg text-slate-600">
              No guides have been published yet.
            </p>
          ) : (
            <GuideFilter guides={cards} categories={categories} />
          )}
        </div>
      </section>
    </>
  );
}
