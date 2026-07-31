import Link from "next/link";
import type { ReactNode } from "react";

// Explicit in-body link to a Legislation page (Phase 5A, PR 6).
//
// The controlled alternative to automatic first-mention linking, for the
// reasons set out in components/GlossaryLink.tsx and components/StandardLink.tsx.
// Those reasons apply with most force here: statutory citations appear inside
// quoted titles, inside amendment records and inside lists of instruments a
// page is explicitly NOT about, and a render-time scanner cannot tell those
// apart from a genuine reference.
//
// Usage in MDX:  <LegislationLink slug="fire-safety-act-2021">Fire Safety Act 2021</LegislationLink>
export default function LegislationLink({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/legislation/${slug}`}
      className="font-semibold text-teal-700 underline decoration-dotted underline-offset-4 hover:text-teal-800"
    >
      {children}
    </Link>
  );
}
