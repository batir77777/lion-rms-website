import Link from "next/link";
import Logo from "@/components/Logo";
import { NAV, SITE, CREDENTIALS, COVERAGE_FULL, CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF } from "@/lib/site";
import { KNOWLEDGE_SECTIONS } from "@/components/KnowledgeCentreNav";

export default function Footer() {
  return (
    <footer style={{ background: "#060e1f" }} className="text-slate-400">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6">
        {/* Top strip */}
        <div className="mb-12 grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <div className="mb-4">
              <Logo className="h-12 w-auto" dark />
            </div>
            <p className="mb-5 max-w-xs text-sm leading-relaxed text-slate-400">
              Fire engineering, health &amp; safety and fire risk assessment consultancy across London and the Home Counties.
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

          {/* Pages */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Pages
            </h3>
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
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Coverage
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">{COVERAGE_FULL}</p>
            <Link href="/sectors" className="mt-3 inline-block text-sm font-semibold text-teal-400 transition hover:text-teal-300">
              Sectors we serve &rarr;
            </Link>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Contact
            </h3>
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
            <Link href="/privacy" className="text-xs text-slate-400 transition hover:text-white">
              Privacy Policy
            </Link>
            <span className="text-slate-700" aria-hidden>&middot;</span>
            <p className="text-xs text-slate-400">
              CMIOSH Chartered &middot; UK Hosted &middot; UK GDPR Compliant
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
