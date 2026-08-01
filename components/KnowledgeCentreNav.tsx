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
// Legislation joined in PR 6 by adding one entry, News in PR 7 and Downloads in
// PR 8A — which is exactly the change this component was built to absorb. When the /knowledge hub lands in PR 9
// this becomes its child navigation rather than being discarded.

export interface KnowledgeSection {
  label: string;
  href: string;
}

// PR 9 adds the hub itself at the head of the list, labelled "Overview" rather
// than "Knowledge Centre": inside a navigation that is already titled
// "Knowledge Centre sections", repeating the name would read as a link back to
// the thing you are looking at. "Overview" says what the page is.
export const KNOWLEDGE_SECTIONS: KnowledgeSection[] = [
  { label: "Overview", href: "/knowledge" },
  { label: "Guides", href: "/guides" },
  { label: "Glossary", href: "/glossary" },
  { label: "Standards", href: "/standards" },
  { label: "Legislation", href: "/legislation" },
  { label: "News", href: "/news" },
  { label: "Downloads", href: "/downloads" },
];

export const SEARCH_HREF = "/search";

export default function KnowledgeCentreNav({ current }: { current: string }) {
  return (
    <nav aria-label="Knowledge Centre sections" className="mb-10">
      <ul className="flex flex-wrap items-center gap-2">
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

        {/*
          Search sits in the same row but is not a section — it is an action —
          so it is separated by a rule and carries an icon. The icon is
          aria-hidden and the word "Search" is always present: an icon-only
          control here would be smaller than the rest of the row and would rely
          on a magnifying glass being universally understood.

          Measured at every approved width before it was kept. The row is
          flex-wrap, so it cannot overflow; the question was whether the extra
          item crowds. It does not: it joins an existing wrap point rather than
          creating a new one at 1280, 1024 and 768, and at 375 and 320 the row
          was already wrapping to multiple lines, where one more pill neither
          orphans a line nor changes the wrap pattern of the sections above it.
        */}
        <li className="ml-1 border-l border-slate-200 pl-3">
          <Link
            href={SEARCH_HREF}
            aria-current={SEARCH_HREF === current ? "page" : undefined}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
              SEARCH_HREF === current
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:text-teal-700"
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden
              className="shrink-0"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            Search
          </Link>
        </li>
      </ul>
    </nav>
  );
}
