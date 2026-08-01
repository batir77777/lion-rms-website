import type { Metadata } from "next";
import PhotoHero from "@/components/PhotoHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import KnowledgeCentreNav from "@/components/KnowledgeCentreNav";
import LegislationFilter, { type FilterableLegislation } from "@/components/LegislationFilter";
import {
  publishedLegislation,
  usedJurisdictions,
  forceStatusLabel,
  tierLabel,
  formLabel,
  jurisdictionList,
  extentDiffersFromApplication,
  isFullyInForce,
  LEGISLATION_PATH,
  LEGISLATION_INDEX_CRUMBS,
} from "@/lib/legislation";
import { statusGroupOf } from "@/lib/legislation-filtering";
import { buildCollectionPageSchema, DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

const TITLE = "Fire and health & safety legislation";
const DESCRIPTION =
  "The Acts and regulations UK fire safety and health & safety duties come from — what each requires, where it applies, and exactly where it currently stands.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: LEGISLATION_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: LEGISLATION_PATH,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function LegislationPage() {
  const items = publishedLegislation();
  const jurisdictions = usedJurisdictions();

  const tiers = [
    { slug: "primary", label: "Primary legislation", count: items.filter((i) => i.legislationTier === "primary").length },
    { slug: "secondary", label: "Secondary legislation", count: items.filter((i) => i.legislationTier === "secondary").length },
  ].filter((t) => t.count > 0);

  const collectionJsonLd = buildCollectionPageSchema({
    name: "Fire and health & safety legislation — Lion Risk Management Solutions",
    description: DESCRIPTION,
    path: LEGISLATION_PATH,
    items: items.map((i) => ({ name: i.shortTitle, path: `${LEGISLATION_PATH}/${i.slug}` })),
  });

  const cards: FilterableLegislation[] = items.map((i) => ({
    slug: i.slug,
    shortTitle: i.shortTitle,
    citation: i.officialReference,
    summary: i.summary,
    tierLabel: tierLabel(i),
    formLabel: formLabel(i),
    extentLabel: jurisdictionList(i.extent),
    applicationLabel: jurisdictionList(i.application),
    territoryDiffers: extentDiffersFromApplication(i),
    forceStatus: i.forceStatus,
    statusLabel: forceStatusLabel(i),
    outstandingEffectCount: i.outstandingEffects.length,
    application: [...i.application],
    tier: i.legislationTier,
    statusGroup: statusGroupOf(i.forceStatus),
  }));

  const notFullyInForce = items.filter((i) => !isFullyInForce(i)).length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <BreadcrumbJsonLd items={LEGISLATION_INDEX_CRUMBS} />

      <PhotoHero
        eyebrow="Knowledge Centre"
        title="Legislation"
        body="The Acts and regulations UK fire safety and health &amp; safety duties actually come from — what each requires, where it applies, and where it currently stands."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-8">
            <Breadcrumbs items={LEGISLATION_INDEX_CRUMBS} />
          </div>

          <KnowledgeCentreNav current={LEGISLATION_PATH} />

          {items.length === 0 ? (
            <p className="text-lg text-slate-600">No legislation has been published yet.</p>
          ) : (
            <>
              <p className="mb-8 max-w-3xl text-base leading-relaxed text-slate-600">
                {items.length} {items.length === 1 ? "instrument" : "instruments"}.
                {notFullyInForce > 0 && (
                  <>
                    {" "}
                    {notFullyInForce === 1 ? "One is" : `${notFullyInForce} are`} not
                    wholly in force — partially commenced, partially repealed, or with
                    provisions still to be brought in — and the status on each card says
                    which.
                  </>
                )}{" "}
                These pages describe each instrument in our own words. They are general
                information, not legal advice, and not a substitute for the official text.
              </p>

              <LegislationFilter items={cards} jurisdictions={jurisdictions} tiers={tiers} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
