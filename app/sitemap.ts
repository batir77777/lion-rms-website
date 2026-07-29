import type { MetadataRoute } from "next";
import { SERVICE_CATEGORIES, SECTORS } from "@/lib/site";
import { CASE_STUDIES } from "@/lib/case-studies";
import { publishedGuides, lastModified } from "@/lib/guides";

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

  return [...staticEntries, ...guideEntries];
}
