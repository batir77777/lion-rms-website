import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import KnowledgeCentreNav from "@/components/KnowledgeCentreNav";
import SiteSearch from "@/components/SiteSearch";
import {
  KNOWLEDGE_PATH,
  KNOWLEDGE_SECTIONS,
  KNOWLEDGE_INDEX_CRUMBS,
  SEARCH_PATH,
  recentlyUpdated,
  totalKnowledgeItems,
  formatUpdateDate,
} from "@/lib/knowledge";
import { buildCollectionPageSchema, DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

const TITLE = "Knowledge Centre — fire safety and health & safety reference";
const DESCRIPTION =
  "Guides, a plain-English glossary, standards, legislation, regulatory news and free downloadable templates for fire safety and health & safety duties in the UK.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: KNOWLEDGE_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: KNOWLEDGE_PATH,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

/*
 * The Knowledge Centre hub (Phase 5A, PR 9).
 *
 * Six sections have shipped one at a time, and "Knowledge Centre" has until now
 * been a header label pointing at /guides — so the whole thing was reachable
 * only through whichever section happened to be first, and a reader who wanted
 * the glossary had to know it existed. This page is the front door.
 *
 * It is editorial rather than a directory listing. Each section gets a sentence
 * saying what it is FOR, because the labels alone do not distinguish them:
 * "Standards" and "Legislation" both sound like rules, and a reader who picks
 * wrong wastes a click. Nothing here moves or replaces an existing URL — every
 * section keeps the address it has always had.
 */
export default function KnowledgePage() {
  const sections = KNOWLEDGE_SECTIONS.map((section) => ({ section, count: section.count() }));
  const updates = recentlyUpdated(6);
  const total = totalKnowledgeItems();

  const jsonLd = buildCollectionPageSchema({
    name: "Knowledge Centre — Lion Risk Management Solutions",
    description: DESCRIPTION,
    path: KNOWLEDGE_PATH,
    items: KNOWLEDGE_SECTIONS.map((s) => ({ name: s.label, path: s.path })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd items={KNOWLEDGE_INDEX_CRUMBS} />

      <PhotoHero
        eyebrow="Knowledge Centre"
        title="Fire &amp; health and safety, explained properly"
        body={`${total} pages of reference material written and reviewed by a practising fire risk assessor — the duties, the terms, the documents behind them, what has changed recently, and templates to take away and use.`}
      />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-8">
            <Breadcrumbs items={KNOWLEDGE_INDEX_CRUMBS} />
          </div>

          <KnowledgeCentreNav current={KNOWLEDGE_PATH} />

          {/* --- Search ------------------------------------------------- */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy-900">Search the Knowledge Centre</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Full-text search across every page in all six sections. Search as a report would
              phrase it — &ldquo;flat entrance doors&rdquo;, &ldquo;stay put&rdquo;,
              &ldquo;responsible person&rdquo; — and you will find the passage, not just the title.
            </p>
            <div className="mt-5">
              <SiteSearch variant="compact" />
            </div>
            <p className="mt-4 text-sm">
              <Link href={SEARCH_PATH} className="font-semibold text-teal-700 hover:underline">
                Open the full search page
              </Link>
            </p>
          </div>

          {/* --- The six sections --------------------------------------- */}
          <h2 className="mt-16 text-2xl font-bold text-navy-900">What is in here</h2>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600">
            Six sections, each answering a different kind of question. Start wherever your question
            sits.
          </p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {sections.map(({ section, count }) => (
              <li key={section.path}>
                <Link
                  href={section.path}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-teal-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-lg font-bold text-navy-900 group-hover:text-teal-700">
                      {section.label}
                    </span>
                    {/*
                      The count is a plain span, not a badge with its own
                      colour: it is information about the section, and the
                      only thing a badge would add is a second thing to read.
                    */}
                    <span className="shrink-0 text-sm font-semibold text-slate-500">
                      {count} {count === 1 ? section.noun[0] : section.noun[1]}
                    </span>
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-slate-600">{section.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* --- Recently updated --------------------------------------- */}
          <h2 className="mt-16 text-2xl font-bold text-navy-900">Recently updated</h2>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600">
            The most recent item from each section, so this reflects the whole Knowledge Centre
            rather than whichever part was worked on last.
          </p>

          <ul className="mt-8 divide-y divide-slate-100 border-t border-slate-100">
            {updates.map((update) => (
              <li key={update.href} className="py-5">
                <Link
                  href={update.href}
                  className="group block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
                      {update.section.label}
                    </span>
                    <time
                      dateTime={update.date}
                      className="text-xs font-medium text-slate-500"
                    >
                      {formatUpdateDate(update.date)}
                    </time>
                  </span>
                  <span className="mt-1.5 block text-lg font-bold text-navy-900 group-hover:text-teal-700">
                    {update.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                    {update.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* --- How to read it ----------------------------------------- */}
          <div className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy-900">How to use this material</h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
              Everything here is general reference, written to be accurate on the day it was
              reviewed and dated so you can see when that was. None of it is a fire risk
              assessment, and none of it can tell you what your particular building needs — that
              is what an assessment of the premises is for. Where a page states a legal duty it
              cites the instrument it comes from, so you can check the source rather than take our
              word for it.
            </p>
            <p className="mt-4 text-sm">
              <Link href="/contact" className="font-semibold text-teal-700 hover:underline">
                Ask about an assessment for your premises
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
