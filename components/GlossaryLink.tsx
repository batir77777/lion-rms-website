import Link from "next/link";
import type { ReactNode } from "react";

// Explicit in-body link to a Glossary term (Phase 5A, PR 4).
//
// This is the controlled alternative to automatic first-mention linking, which
// PR 4 deliberately does not implement. Render-time scanning of body text has
// to avoid linking inside headings, inside existing links, inside code, on
// repeated occurrences and on the term's own page — and every one of those
// failures is invisible in a diff, because it happens after the source is
// compiled. It also silently rewrites the accessible name of whatever it
// wraps.
//
// So the trigger stays with the author: they write the link where it genuinely
// helps, and it is visible in the source and reviewable in a pull request. If
// automatic linking is ever wanted, it becomes a change of trigger rather than
// a change of mechanism.
//
// Usage in MDX:  <GlossaryLink slug="fire-door">fire door</GlossaryLink>
export default function GlossaryLink({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/glossary/${slug}`}
      className="font-semibold text-teal-700 underline decoration-dotted underline-offset-4 hover:text-teal-800"
    >
      {children}
    </Link>
  );
}
