import type { MetadataRoute } from "next";
import { SERVICE_CATEGORIES, SECTORS } from "@/lib/site";
import { CASE_STUDIES } from "@/lib/case-studies";
import { publishedGuides, lastModified } from "@/lib/guides";
import { publishedTerms, lastModified as termLastModified, GLOSSARY_PATH } from "@/lib/glossary";
import {
  publishedStandards,
  lastModified as standardLastModified,
  STANDARDS_PATH,
} from "@/lib/standards";
import {
  publishedLegislation,
  isFullyInForce,
  lastModified as legislationLastModified,
  LEGISLATION_PATH,
} from "@/lib/legislation";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.lionrms.uk";
  const buildDate = new Date();

  const routes = [
    "",
    "/services",
    "/about",
    "/case-studies",
    "/faq",
    "/sectors",
    "/resources/fire-safety-checklist",
    "/check",
    "/contact",
  ];
  const serviceRoutes = SERVICE_CATEGORIES.map((c) => `/services/${c.slug}`);
  const sectorRoutes = SECTORS.filter((s) => s.hasPage).map((s) => `/sectors/${s.slug}`);
  const caseStudyRoutes = CASE_STUDIES.map((c) => `/case-studies/${c.slug}`);

  // Phase 5A PR 3: /insights and its seven article URLs are gone from here.
  // They now 308 to /guides, and a redirecting URL must never appear in a
  // sitemap.
  const staticEntries: MetadataRoute.Sitemap = [
    ...routes,
    ...serviceRoutes,
    ...sectorRoutes,
    ...caseStudyRoutes,
  ].map((r) => ({
    url: `${base}${r}`,
    lastModified: buildDate,
    changeFrequency: "monthly" as const,
    priority: r === "" ? 1 : 0.7,
  }));

  // Guides carry a real per-item date — updatedDate falling back to
  // publishedDate — rather than the build timestamp, which tells Google
  // nothing. Correcting lastModified sourcing for the routes above is PR 10's
  // scope, not this PR's.
  const guideEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/guides`,
      lastModified: buildDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...publishedGuides().map((g) => ({
      url: `${base}/guides/${g.slug}`,
      lastModified: new Date(`${(lastModified(g) ?? "").slice(0, 10)}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // Phase 5A PR 4. Same treatment as Guides: a real per-item date rather than
  // the build timestamp.
  const glossaryEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}${GLOSSARY_PATH}`,
      lastModified: buildDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...publishedTerms().map((t) => ({
      url: `${base}${GLOSSARY_PATH}/${t.slug}`,
      lastModified: new Date(`${(termLastModified(t) ?? "").slice(0, 10)}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];

  // Phase 5A PR 5. Monthly rather than the Glossary's yearly: standards
  // genuinely do change, and the six-month source-currency cycle reflects that.
  //
  // Withdrawn and superseded documents STAY in the sitemap. They are live,
  // canonical, useful pages — removing the PAS 79-2 page would remove the
  // answer for the reader most likely to be looking for it.
  const standardEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}${STANDARDS_PATH}`,
      lastModified: buildDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...publishedStandards().map((s) => ({
      url: `${base}${STANDARDS_PATH}/${s.slug}`,
      lastModified: new Date(`${(standardLastModified(s) ?? "").slice(0, 10)}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  // Phase 5A PR 6. Repealed and revoked instruments STAY in the sitemap: they
  // are live, canonical, useful pages, and the reader arriving from a 2019
  // assessment that cites a since-revoked instrument is who they exist for.
  // Priority drops slightly for anything not wholly in force — an honest signal
  // of relative importance, not a suppression.
  const legislationEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}${LEGISLATION_PATH}`,
      lastModified: buildDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...publishedLegislation().map((l) => ({
      url: `${base}${LEGISLATION_PATH}/${l.slug}`,
      lastModified: new Date(`${(legislationLastModified(l) ?? "").slice(0, 10)}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: isFullyInForce(l) ? 0.6 : 0.5,
    })),
  ];

  return [
    ...staticEntries,
    ...guideEntries,
    ...glossaryEntries,
    ...standardEntries,
    ...legislationEntries,
  ];
}
