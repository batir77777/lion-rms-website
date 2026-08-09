import type { Metadata } from "next";
import Link from "next/link";
import { KNOWLEDGE_PATH, SEARCH_PATH } from "@/lib/knowledge-sections";

/*
 * Branded 404.
 *
 * WHAT WAS THERE BEFORE. No app/not-found.tsx existed, so Next.js fell back to
 * its built-in default component. That was not as broken as it sounds — the
 * status was a correct 404 and the root layout still supplied the header,
 * navigation, footer, skip link and <main> landmark. What it lacked was
 * everything a lost reader actually needs: the heading was the bare numeral
 * "404", the document title was "404: This page could not be found." (which
 * also bypasses the site's "%s | Lion Risk Management Solutions" template),
 * and there was no explanation and no route onward beyond the standard header.
 *
 * WHY THIS PAGE HAS NO SEARCH FIELD. Rendering SiteSearch here would put the
 * Pagefind client on a route that is reached by accident, downloading a search
 * engine and its index for someone who mistyped a URL. A link to /search costs
 * one click and nothing else. Deliberate, and not an oversight to correct
 * later without thinking about it.
 *
 * The heading says what happened in words rather than a numeral. "404" means
 * nothing to most readers and is announced as a bare number by a screen
 * reader; the numeral is kept, smaller and decorative, above the real heading.
 */

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page could not be found. Browse our fire safety and health & safety services, the sectors we work in, or search the Knowledge Centre.",
  /* A 404 must not be indexed, and must not be treated as a canonical URL for
     whatever address produced it. */
  robots: { index: false, follow: true },
};

const DESTINATIONS = [
  {
    href: "/",
    label: "Home",
    description: "Fire engineering, health & safety and fire risk assessment across London and the Home Counties.",
  },
  {
    href: "/services",
    label: "Services",
    description: "Fire safety, health & safety and compliance management support.",
  },
  {
    href: "/sectors",
    label: "Sectors",
    description: "Residential blocks and HMOs, offices and commercial workplaces, and education.",
  },
  {
    href: KNOWLEDGE_PATH,
    label: "Knowledge Centre",
    description: "Guides, glossary, standards, legislation, news and free downloads.",
  },
  {
    href: SEARCH_PATH,
    label: "Search",
    description: "Full-text search across every page in the Knowledge Centre.",
  },
];

export default function NotFound() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Error 404</p>

        <h1 className="mt-3 text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.1] text-navy-900">
          We could not find that page
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          The address may have been mistyped, or the page may have been moved or retired. Nothing is
          wrong with your connection, and the rest of the site is working normally.
        </p>

        <h2 className="mt-12 text-xl font-bold text-navy-900">Where to go instead</h2>

        <ul className="mt-6 divide-y divide-slate-100 border-t border-slate-100">
          {DESTINATIONS.map((d) => (
            <li key={d.href} className="py-5">
              <Link
                href={d.href}
                className="group block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                <span className="block text-lg font-bold text-navy-900 group-hover:text-teal-700">
                  {d.label}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                  {d.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-base leading-relaxed text-slate-600">
          If you followed a link from elsewhere on this site and reached this page, please{" "}
          <Link href="/contact" className="font-semibold text-teal-700 underline">
            let us know
          </Link>{" "}
          so we can fix it.
        </p>
      </div>
    </section>
  );
}
