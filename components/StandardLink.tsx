import Link from "next/link";
import type { ReactNode } from "react";

// Explicit in-body link to a Standards library page (Phase 5A, PR 5).
//
// The controlled alternative to automatic first-mention linking, which this PR
// deliberately does not implement — for the reasons set out in
// components/GlossaryLink.tsx, which apply with more force here.
//
// Render-time scanning for a designation like "BS 9999" would have to avoid
// linking inside headings, inside existing links, inside code, on repeated
// occurrences, and on the page about that very document. It would also have to
// avoid linking designations that appear inside a quoted document title or a
// reference list, where a link is actively wrong. Every one of those failures
// happens after the source is compiled and is therefore invisible in a diff.
//
// So the trigger stays with the author: they write the link where it genuinely
// helps, it is visible in the source, and it is reviewable in a pull request.
//
// Usage in MDX:  <StandardLink slug="bs-9999-fire-safety-buildings">BS 9999</StandardLink>
export default function StandardLink({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/standards/${slug}`}
      className="font-semibold text-teal-700 underline decoration-dotted underline-offset-4 hover:text-teal-800"
    >
      {children}
    </Link>
  );
}
