import Link from "next/link";
import type { ReactNode } from "react";

// Explicit in-body link to a News item (Phase 5A, PR 7).
//
// The controlled alternative to automatic linking, for the reasons set out in
// GlossaryLink, StandardLink and LegislationLink. The case for control is
// strongest in a round-up, where a month's worth of items are summarised in
// sequence and a scanner would have no way to tell which mention is the one
// worth linking.
//
// Usage in MDX:  <NewsLink slug="march-2026-round-up">our March round-up</NewsLink>
export default function NewsLink({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/news/${slug}`}
      className="font-semibold text-teal-700 underline decoration-dotted underline-offset-4 hover:text-teal-800"
    >
      {children}
    </Link>
  );
}
