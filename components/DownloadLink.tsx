import Link from "next/link";
import type { ReactNode } from "react";

// Explicit in-body link to a Downloads resource (Phase 5A, PR 8A).
//
// The controlled alternative to automatic linking, for the reasons set out in
// GlossaryLink, StandardLink, LegislationLink and NewsLink.
//
// Usage in MDX:  <DownloadLink slug="fire-safety-checklist">our checklist</DownloadLink>
export default function DownloadLink({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/downloads/${slug}`}
      className="font-semibold text-teal-700 underline decoration-dotted underline-offset-4 hover:text-teal-800"
    >
      {children}
    </Link>
  );
}
