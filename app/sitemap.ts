import type { MetadataRoute } from "next";
import { SERVICE_CATEGORIES } from "@/lib/site";
import { AREAS } from "@/lib/areas";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.lionrms.uk";
  const routes = ["", "/services", "/about", "/case-studies", "/faq", "/resources/fire-safety-checklist", "/contact"];
  const serviceRoutes = SERVICE_CATEGORIES.map((c) => `/services/${c.slug}`);
  const areaRoutes = ["/areas", ...AREAS.map((a) => `/areas/${a.slug}`)];
  return [...routes, ...serviceRoutes, ...areaRoutes].map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
