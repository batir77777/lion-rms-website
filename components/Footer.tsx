import Link from "next/link";
import Logo from "@/components/Logo";
import { NAV, SITE, CREDENTIALS } from "@/lib/site";
import { AREAS } from "@/lib/areas";

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
              Compliance management software and expert consultancy for fire safety
              and health &amp; safety professionals across London.
            </p>
            <div className="flex flex-wrap gap-2">
              {CREDENTIALS.slice(0, 4).map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-slate-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-slate-400 transition hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Areas Covered
            </h3>
            <ul className="space-y-2.5 text-sm">
              {AREAS.slice(0, 6).map((a) => (
                <li key={a.slug}>
                  <Link href={`/areas/${a.slug}`} className="text-slate-400 transition hover:text-white">
                    {a.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/areas" className="font-semibold text-teal-400 transition hover:text-teal-300">
                  All London areas →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
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
              <li className="text-slate-500">{SITE.location}</li>
            </ul>
            <div className="mt-5 space-y-2 text-sm">
              <a href={SITE.community.training} target="_blank" rel="noopener noreferrer"
                className="block text-teal-400 transition hover:text-teal-300">
                Free Safety Training →
              </a>
              <a href={SITE.community.forum} target="_blank" rel="noopener noreferrer"
                className="block text-teal-400 transition hover:text-teal-300">
                UK Safety Community →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-800 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Lion Risk Management Solutions. All rights reserved.
          </p>
          <p className="text-xs text-slate-700">
            BAFE SP205 Registered &middot; CMIOSH Chartered &middot; UK Hosted &middot; GDPR Compliant
          </p>
        </div>
      </div>
    </footer>
  );
}
