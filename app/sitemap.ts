import type { MetadataRoute } from "next";
import { SERVICE_CATEGORIES, SECTORS } from "@/lib/site";
import { POSTS } from "@/lib/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.lionrms.uk";
  const routes = ["", "/services", "/about", "/case-studies", "/faq", "/sectors", "/resources/fire-safety-checklist", "/check", "/contact"];
  const serviceRoutes = SERVICE_CATEGORIES.map((c) => `/services/${c.slug}`);
  const sectorRoutes = SECTORS.filter((s) => s.hasPage).map((s) => `/sectors/${s.slug}`);
  const insightRoutes = ["/insights", ...POSTS.map((p) => `/insights/${p.slug}`)];
  return [...routes, ...serviceRoutes, ...sectorRoutes, ...insightRoutes].map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
