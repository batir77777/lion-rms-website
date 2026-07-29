import Link from "next/link";

// Shared secondary navigation for the Knowledge Centre sections
// (Phase 5A, PR 5).
//
// Approved in place of a tenth top-level header item. Two reasons.
//
// The header already carries nine items and the logo collapsed to zero width
// at 1280px during PR 3 QA when "Knowledge Centre" was added — fixed with
// shrink-0 and responsive padding, but with little headroom left. A tenth item
// would very likely reopen that at exactly the widths that were hardest to fix.
//
// The second reason is the more important one. The Glossary launched in PR 4
// with NO navigation entry anywhere: not in the header, and not in the footer,
// which carried only Sectors, Contact and Privacy. It has been reachable only
// from Guide pages, the sitemap and search. Adding a third vertical to a
// section that cannot be navigated to would have compounded that rather than
// fixed it.
//
// Legislation joins by adding one entry here in PR 6. When the /knowledge hub
// lands in PR 9 this becomes its child navigation rather than being discarded.

export interface KnowledgeSection {
  label: string;
  href: string;
}

export const KNOWLEDGE_SECTIONS: KnowledgeSection[] = [
  { label: "Guides", href: "/guides" },
  { label: "Glossary", href: "/glossary" },
  { label: "Standards", href: "/standards" },
];

export default function KnowledgeCentreNav({ current }: { current: string }) {
  return (
    <nav aria-label="Knowledge Centre sections" className="mb-10">
      <ul className="flex flex-wrap gap-2">
        {KNOWLEDGE_SECTIONS.map((section) => {
          const isCurrent = section.href === current;
          return (
            <li key={section.href}>
              {/*
                The current section is still a link rather than a disabled
                span: it is a real destination, and removing it from the tab
                order would make the set inconsistent as a reader moves
                between sections. aria-current carries the state instead,
                and the styling never relies on colour alone — the current
                item is also the only one with a solid fill and a border.
              */}
              <Link
                href={section.href}
                aria-current={isCurrent ? "page" : undefined}
                className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
                  isCurrent
                    ? "border-teal-700 bg-teal-700 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:text-teal-700"
                }`}
              >
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
