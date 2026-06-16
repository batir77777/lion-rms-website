import type { MetadataRoute } from "next";
import { SERVICE_CATEGORIES } from "@/lib/site";
import { POSTS } from "@/lib/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.lionrms.uk";
  const routes = ["", "/services", "/about", "/case-studies", "/faq", "/areas", "/resources/fire-safety-checklist", "/check", "/contact"];
  const serviceRoutes = SERVICE_CATEGORIES.map((c) => `/services/${c.slug}`);
  const insightRoutes = ["/insights", ...POSTS.map((p) => `/insights/${p.slug}`)];
  return [...routes, ...serviceRoutes, ...insightRoutes].map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
