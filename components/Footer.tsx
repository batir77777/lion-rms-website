import Link from "next/link";
import Logo from "@/components/Logo";
import { NAV, SITE, CREDENTIALS, COMPANY_INFO_PATH, COVERAGE_FULL, CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF, FOOTER_SERVICE_LINKS, LION_DIGITAL_URL } from "@/lib/site";
import { KNOWLEDGE_SECTIONS } from "@/components/KnowledgeCentreNav";

export default function Footer() {
  return (
    <footer style={{ background: "#060e1f" }} className="text-slate-400">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-32 sm:px-6 md:pb-10">
        {/*
         * pb-32 (mobile only, reverting to the original pb-10 at md: and
         * up): the floating Contact/WhatsApp buttons in FloatingContact.tsx
         * are `fixed bottom-4 right-4` and `md:hidden`, so on mobile they sit
         * outside document flow and overlap whatever is scrolled to the
         * bottom of the page — which, without this, is the footer's bottom
         * bar (Company information / Privacy Policy / Lion Digital links).
         * Extra bottom padding here keeps that content clear of the fixed
         * buttons' footprint (~124px of stacked 56px buttons + gap, from
         * 16px off the bottom) so every footer link stays fully tappable.
         * Desktop is untouched: the buttons don't render there at all.
         */}
        {/* Top strip */}
        <div className="mb-12 grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <div className="mb-4">
              <Logo className="h-12 w-auto" dark />
            </div>
            <p className="mb-5 max-w-xs text-sm leading-relaxed text-slate-400">
              Fire safety, fire engineering, health &amp; safety and construction safety consultancy across London and the Home Counties.
            </p>
            <div className="flex flex-wrap gap-2">
              {CREDENTIALS.slice(0, 4).map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-slate-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/*
           * Services (repositioning PR1). FOOTER_SERVICE_LINKS is derived
           * from SERVICE_CATEGORIES in lib/site.ts — labels and hrefs cannot
           * drift from the pages they link to. Two of the five links are
           * anchors into /services/fire-safety rather than dedicated pages;
           * see the ServiceSection note in lib/site.ts for why.
           */}
          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Services
            </h2>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_SERVICE_LINKS.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-slate-400 transition hover:text-white">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Pages
            </h2>
            <ul className="space-y-2.5 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-slate-400 transition hover:text-white">
                    {n.label}
                  </Link>
                  {/*
                    Knowledge Centre sections, nested under their parent
                    (Phase 5A PR 5). The header deliberately carries one entry
                    for the whole section rather than one per vertical — see
                    components/KnowledgeCentreNav.tsx — which until now left the
                    Glossary with no route into it from global navigation at
                    all. This is the other half of that fix.
                  */}
                  {n.href === "/guides" && (
                    <ul className="mt-2.5 space-y-2.5 border-l border-slate-800 pl-4">
                      {KNOWLEDGE_SECTIONS.map((section) => (
                        <li key={section.href}>
                          <Link
                            href={section.href}
                            className="text-slate-400 transition hover:text-white"
                          >
                            {section.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Coverage */}
          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Coverage
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">{COVERAGE_FULL}</p>
            <Link href="/sectors" className="mt-3 inline-block text-sm font-semibold text-teal-400 transition hover:text-teal-300">
              Sectors we serve &rarr;
            </Link>
          </div>

          {/* Contact */}
          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Contact
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={SITE.phoneHref} className="text-slate-300 transition hover:text-white font-semibold">
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={SITE.emailHref} className="text-slate-400 transition hover:text-white">
                  {SITE.email}
                </a>
              </li>
              <li className="text-slate-400">{SITE.location}</li>
            </ul>
            <div className="mt-5 space-y-2.5 text-sm">
              <Link href="/contact" className="block font-semibold text-teal-400 transition hover:text-teal-300">
                {CTA_PRIMARY_LABEL} &rarr;
              </Link>
              <Link href={CTA_SECONDARY_HREF} className="block text-slate-400 transition hover:text-white">
                {CTA_SECONDARY_LABEL} &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-800 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Lion Risk Management Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/*
             * "UK Hosted" and "UK GDPR Compliant" were removed here. The first
             * was not accurate — the site is statically served from a global
             * edge network and form submissions go to a third-party processor.
             * The second was a self-declaration sitting in a row of externally
             * verifiable credentials, which read as certification. The privacy
             * policy states the lawful bases and transfer safeguards properly,
             * so this links there instead of asserting an outcome.
             */}
            {/*
             * Links to the statutory particulars rather than printing them. The
             * registered office is a residential address; rendering it here
             * would repeat it on every page of the site. COMPANY_INFO_PATH is
             * the single place that address appears — see lib/site.ts.
             */}
            <Link
              href={COMPANY_INFO_PATH}
              className="text-xs font-medium text-slate-300 transition hover:text-white"
            >
              Company information
            </Link>
            <span className="text-slate-700" aria-hidden>&middot;</span>
            <Link href="/privacy" className="text-xs text-slate-400 transition hover:text-white">
              Privacy Policy — how we handle your data
            </Link>
            <span className="text-slate-700" aria-hidden>&middot;</span>
            <p className="text-xs text-slate-400">
              MIFireE &middot; CMIOSH Chartered
            </p>
            <span className="text-slate-700" aria-hidden>&middot;</span>
            {/*
             * Discreet cross-link to Lion Digital, our separate sister
             * business (AI/software). Deliberately placed in the bottom bar
             * rather than the Services or Pages columns, and not added to
             * NAV, so it reads as an administrative/related-business link
             * rather than part of the Lion RMS service offering — see
             * LION_DIGITAL_FOOTER_LINK_INVESTIGATION.md for the rationale.
             */}
            <a
              href={LION_DIGITAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 transition hover:text-white"
            >
              Digital &amp; AI solutions — visit Lion Digital &rarr;
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
