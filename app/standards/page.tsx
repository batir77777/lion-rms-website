import type { Metadata } from "next";
import PhotoHero from "@/components/PhotoHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import KnowledgeCentreNav from "@/components/KnowledgeCentreNav";
import StandardFilter, { type FilterableStandard } from "@/components/StandardFilter";
import {
  publishedStandards,
  usedDocumentClasses,
  designation,
  documentStatusLabel,
  isCurrentDocument,
  STANDARDS_PATH,
  STANDARDS_INDEX_CRUMBS,
} from "@/lib/standards";
import { buildCollectionPageSchema, DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

const TITLE = "Standards and guidance";
const DESCRIPTION =
  "The British Standards, PAS documents and official guidance UK fire safety and health & safety compliance is measured against — and where each one currently stands.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: STANDARDS_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: STANDARDS_PATH,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function StandardsPage() {
  const standards = publishedStandards();
  const classes = usedDocumentClasses();

  const collectionJsonLd = buildCollectionPageSchema({
    name: "Standards and guidance — Lion Risk Management Solutions",
    description: DESCRIPTION,
    path: STANDARDS_PATH,
    items: standards.map((s) => ({
      name: designation(s),
      path: `${STANDARDS_PATH}/${s.slug}`,
    })),
  });

  const cards: FilterableStandard[] = standards.map((s) => ({
    slug: s.slug,
    designation: designation(s),
    documentTitle: s.title,
    summary: s.summary,
    publisher: s.publisher,
    currentEdition: s.currentEdition,
    documentStatus: s.documentStatus,
    statusLabel: documentStatusLabel(s),
    documentClass: s.documentClass,
    isCurrent: isCurrentDocument(s),
  }));

  const notCurrent = standards.filter((s) => !isCurrentDocument(s)).length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <BreadcrumbJsonLd items={STANDARDS_INDEX_CRUMBS} />

      <PhotoHero
        eyebrow="Knowledge Centre"
        title="Standards &amp; guidance"
        body="The documents UK fire safety and health &amp; safety compliance is measured against — what each one covers, how it relates to legal duty, and whether it still stands."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-8">
            <Breadcrumbs items={STANDARDS_INDEX_CRUMBS} />
          </div>

          <KnowledgeCentreNav current={STANDARDS_PATH} />

          {standards.length === 0 ? (
            <p className="text-lg text-slate-600">
              No standards have been published yet.
            </p>
          ) : (
            <>
              {/*
                Withdrawn and superseded documents are listed by default, not
                hidden. Somebody arriving from an old assessment that cites a
                withdrawn document needs to find the page AND find out it has
                been withdrawn — filtering it away would defeat the purpose of
                publishing it. This line explains that up front rather than
                leaving a reader to wonder why a withdrawn document appears in
                a compliance reference.
              */}
              <p className="mb-8 max-w-3xl text-base leading-relaxed text-slate-600">
                {standards.length} {standards.length === 1 ? "document" : "documents"}.
                {notCurrent > 0 && (
                  <>
                    {" "}
                    {notCurrent === 1 ? "One is" : `${notCurrent} are`} no longer
                    current and {notCurrent === 1 ? "is" : "are"} kept here
                    deliberately, because assessments and reports written while
                    {notCurrent === 1 ? " it was" : " they were"} in force still
                    cite {notCurrent === 1 ? "it" : "them"}.
                  </>
                )}{" "}
                These pages describe each document in our own words; they are not
                a substitute for reading it.
              </p>

              <StandardFilter standards={cards} classes={classes} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
