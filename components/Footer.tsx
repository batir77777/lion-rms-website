import Link from "next/link";
import Logo from "@/components/Logo";
import { NAV, SITE, CREDENTIALS } from "@/lib/site";

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
              Expert fire safety and health &amp; safety consultancy across London and the UK.
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
              Pages
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

          {/* Coverage */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Coverage
            </h3>
            <p className="text-sm text-slate-400">London and UK-wide.</p>
            <Link href="/areas" className="mt-3 inline-block text-sm font-semibold text-teal-400 transition hover:text-teal-300">
              Coverage areas &rarr;
            </Link>
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
            <div className="mt-5 text-sm">
              <Link href="/contact" className="block text-teal-400 transition hover:text-teal-300">
                Book a free call &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-800 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Lion Risk Management Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-slate-600 transition hover:text-slate-400">
              Privacy Policy
            </Link>
            <span className="text-slate-800" aria-hidden>&middot;</span>
            <p className="text-xs text-slate-700">
              CMIOSH Chartered &middot; UK Hosted &middot; UK GDPR Compliant
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
