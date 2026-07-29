import Link from "next/link";
import type { Crumb } from "@/components/BreadcrumbJsonLd";

// Visible breadcrumb trail (Phase 5A, PR 3).
//
// The site already emitted BreadcrumbList JSON-LD with no corresponding visible
// UI. Structured data should describe content a reader can actually see, so
// this renders the trail itself. Both components take the same `Crumb[]`, built
// once by `buildGuideBreadcrumbs()` in lib/guides.ts, so the visible trail and
// the structured data cannot drift apart.
//
// The terminal crumb omits `path` and is rendered as unlinked text with
// aria-current="page" — a link to the page you are already on is noise for
// keyboard and screen-reader users.
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-500">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.name}-${i}`} className="flex items-center gap-x-2">
              {item.path && !isLast ? (
                <Link
                  href={item.path}
                  className="font-medium text-teal-700 transition hover:text-teal-800 hover:underline"
                >
                  {item.name}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-slate-500">
                  {item.name}
                </span>
              )}
              {!isLast && (
                <span aria-hidden className="text-slate-300">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
