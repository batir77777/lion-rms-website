import { buildBreadcrumbListSchema, type BreadcrumbItem } from "@/lib/content-jsonld";

/*
 * BreadcrumbList JSON-LD, mirroring the visible breadcrumb trail.
 *
 * Used by 25 pages, so the component stays exactly as it was from the caller's
 * point of view; only the object construction moved to lib/content-jsonld.ts
 * in Phase 5A PR 10, alongside every other schema on the site.
 *
 * Crumb is re-exported rather than redefined: it is imported by name from this
 * module in seven accessor files, and having the type live in one place while
 * the builder lives in another would be the kind of split that drifts.
 */
export type Crumb = BreadcrumbItem;

// Pass the full trail starting with Home; the current page omits `path`.
export default function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbListSchema(items)) }}
    />
  );
}
