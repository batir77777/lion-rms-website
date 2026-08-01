import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import KnowledgeCentreNav from "@/components/KnowledgeCentreNav";
import SiteSearch from "@/components/SiteSearch";
import {
  KNOWLEDGE_PATH,
  KNOWLEDGE_SECTIONS,
  SEARCH_PATH,
  SEARCH_CRUMBS,
  totalKnowledgeItems,
} from "@/lib/knowledge";
import { DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

const TITLE = "Search the Knowledge Centre";
const DESCRIPTION =
  "Full-text search across the Lion RMS guides, glossary, standards, legislation, news and downloadable templates.";

/*
 * Search results pages are the classic thin-content trap: every query is a
 * distinct URL, none of them has content of its own, and left alone they get
 * crawled in their thousands. So:
 *
 *   noindex  — no query, and not the parameterless page either. There is
 *              nothing here for a search engine that the /knowledge hub does
 *              not carry better.
 *   follow   — the links out of a result set are real internal links to real
 *              pages, and there is no reason to waste them.
 *   canonical to /search with NO query string — so that if a ?q= URL is ever
 *              linked to from outside, it consolidates rather than
 *              multiplying.
 *
 * There is no sitemap entry: a sitemap listing a noindexed URL sends two
 * contradictory instructions, which is the same reasoning applied to withdrawn
 * downloads in PR 8A.
 *
 * The page is also fully static. ?q= is read in the browser rather than from
 * searchParams, because touching searchParams here would opt the route into
 * dynamic rendering and put a server function in front of a page whose entire
 * job happens client-side.
 *
 * Open Graph and Twitter metadata is present despite the noindex. The two are
 * unrelated mechanisms: robots governs whether a crawler indexes the page,
 * Open Graph governs what a link preview shows when somebody pastes the URL
 * into a message. Without its own block this page would inherit the homepage's
 * card — the exact defect PR 24 was opened to fix — and every page on this site
 * declares its own.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
  alternates: { canonical: SEARCH_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: SEARCH_PATH,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function SearchPage() {
  const total = totalKnowledgeItems();

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 pb-20 pt-32 sm:px-6 sm:pt-36">
          <div className="mb-8">
            <Breadcrumbs items={SEARCH_CRUMBS} />
          </div>

          <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.08] tracking-tight text-navy-900">
            Search the Knowledge Centre
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Full text of all {total} pages across the six sections — not just titles. Search for a
            phrase as it would appear in a report and you will find the passage that uses it.
          </p>

          <div className="mt-10">
            <SiteSearch variant="full" />
          </div>

          <h2 className="mt-16 text-xl font-bold text-navy-900">Browse instead</h2>
          <p className="mt-2 text-base leading-relaxed text-slate-600">
            If you would rather look through a section than search it:
          </p>
          <div className="mt-6">
            <KnowledgeCentreNav current={SEARCH_PATH} />
          </div>
          <p className="text-sm">
            <Link href={KNOWLEDGE_PATH} className="font-semibold text-teal-700 hover:underline">
              Back to the Knowledge Centre
            </Link>
          </p>

          <p className="mt-10 text-sm leading-relaxed text-slate-500">
            Search covers {KNOWLEDGE_SECTIONS.map((s) => s.label.toLowerCase()).join(", ")}. It
            does not cover service or case study pages, which are reached from the main
            navigation.
          </p>
        </div>
      </section>
    </>
  );
}
