import Link from "next/link";
import Logo from "@/components/Logo";
import { NAV, SITE } from "@/lib/site";
import { AREAS } from "@/lib/areas";

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-950 text-ink-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="mb-3">
            <Logo className="h-14 w-auto" dark />
          </div>
          <p className="text-sm leading-relaxed text-ink-300">
            Fire safety, health &amp; safety, and digital compliance consultancy
            across London — every borough.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-400">
            Pages
          </h3>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-ink-300 transition hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-400">
            Areas we cover
          </h3>
          <ul className="space-y-2 text-sm">
            {AREAS.slice(0, 6).map((a) => (
              <li key={a.slug}>
                <Link href={`/areas/${a.slug}`} className="text-ink-300 transition hover:text-white">
                  {a.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/areas" className="font-medium text-brand-300 transition hover:text-white">
                All London areas →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-400">
            Contact
          </h3>
          <ul className="space-y-2 text-sm text-ink-300">
            <li>
              <a href={SITE.phoneHref} className="transition hover:text-white">
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={SITE.emailHref} className="transition hover:text-white">
                {SITE.email}
              </a>
            </li>
            <li>{SITE.location}</li>
          </ul>
          <div className="mt-4 space-y-1.5 text-sm">
            <a href={SITE.community.training} target="_blank" rel="noopener noreferrer" className="block text-brand-300 transition hover:text-white">
              Free Fire &amp; Safety Training →
            </a>
            <a href={SITE.community.forum} target="_blank" rel="noopener noreferrer" className="block text-brand-300 transition hover:text-white">
              UK Fire &amp; Safety Community →
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-900">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-ink-400 sm:px-6">
          © {new Date().getFullYear()} Lion Risk Management Solutions. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
