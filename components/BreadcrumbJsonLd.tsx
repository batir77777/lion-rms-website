import { SITE_URL } from "@/lib/site";

export interface Crumb {
  name: string;
  /** Path relative to the site root, e.g. "/services". Omit for the current page. */
  path?: string;
}

// BreadcrumbList JSON-LD — reflects the visible breadcrumb trail on a page.
// Pass the full trail starting with Home; the current page can omit `path`
// (schema.org allows the terminal item's URL to be omitted).
export default function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: `${SITE_URL}${item.path}` } : {}),
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
