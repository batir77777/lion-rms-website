import Link from "next/link";

export interface GlossaryEntryProps {
  slug: string;
  term: string;
  shortDefinition: string;
  /** Synonyms plus any abbreviation expansion — rendered so the index is scannable by them. */
  alternateNames: string[];
}

// One term as it appears on the Glossary index (Phase 5A, PR 4).
//
// Rendered as a description list pair rather than styled divs, because <dt>
// and <dd> give assistive technology the term-to-definition relationship
// structurally instead of leaving it as a visual convention. The surrounding
// <dl> lives on the index page so a whole letter group is one list.
//
// The link is named by the term itself. A column of "read more" links is a
// meaningless link list to anyone navigating by links.
export default function GlossaryEntry({
  slug,
  term,
  shortDefinition,
  alternateNames,
}: GlossaryEntryProps) {
  return (
    <div className="border-b border-slate-100 py-5 last:border-b-0">
      <dt className="text-lg font-bold text-navy-900">
        <Link
          href={`/glossary/${slug}`}
          className="transition hover:text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          {term}
        </Link>
      </dt>
      <dd className="mt-2 text-base leading-relaxed text-slate-600">
        {shortDefinition}
        {alternateNames.length > 0 && (
          <span className="mt-1.5 block text-sm text-slate-500">
            Also known as: {alternateNames.join(", ")}
          </span>
        )}
      </dd>
    </div>
  );
}
