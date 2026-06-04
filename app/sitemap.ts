import type { MetadataRoute } from "next";
import { SERVICE_CATEGORIES } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.lionrms.uk";
  const routes = ["", "/services", "/about", "/case-studies", "/contact"];
  const serviceRoutes = SERVICE_CATEGORIES.map((c) => `/services/${c.slug}`);
  return [...routes, ...serviceRoutes].map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
