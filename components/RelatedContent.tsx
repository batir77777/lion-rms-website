import Link from "next/link";

export interface RelatedItem {
  label: string;
  href: string;
}

export interface RelatedGroup {
  /** e.g. "Related services", "Related sectors", "Related case studies", "Related insights" */
  heading: string;
  items: RelatedItem[];
}

// Generic related-links block — used on sector pages, service pages, case
// study pages and insight articles so the internal-linking logic lives in
// one place (Phase 4B PR 2) instead of being duplicated per page type.
// Groups with no items are simply omitted, so callers can pass every
// possible group unconditionally.
export default function RelatedContent({ groups }: { groups: RelatedGroup[] }) {
  const visible = groups.filter((g) => g.items.length > 0);
  if (visible.length === 0) return null;

  return (
    <section
      aria-labelledby="related-content-heading"
      className="mt-14 border-t border-slate-100 pt-10"
    >
      <h2 id="related-content-heading" className="sr-only">
        Related content
      </h2>
      <div className="space-y-6">
        {visible.map((group) => (
          <div key={group.heading} className="flex flex-wrap items-center gap-4">
            <p className="text-sm font-medium text-slate-500">{group.heading}:</p>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
