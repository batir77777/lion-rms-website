"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { NAV, SITE } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-ink-100 bg-white/90 backdrop-blur-md"
          : "border-b border-transparent bg-white/60 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Logo className="h-11 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`relative text-sm font-medium transition ${
                isActive(n.href) ? "text-brand-700" : "text-ink-600 hover:text-ink-950"
              }`}
            >
              {n.label}
              {isActive(n.href) && (
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-brand-600" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={SITE.phoneHref}
            className="text-sm font-semibold text-ink-700 transition hover:text-brand-700"
          >
            {SITE.phone}
          </a>
          <Link
            href="/contact"
            className="rounded-full bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Request a Consultation
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-800 hover:bg-ink-50 md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`border-b border-ink-50 py-3 text-sm font-medium ${
                  isActive(n.href) ? "text-brand-700" : "text-ink-700"
                }`}
              >
                {n.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-4">
              <a href={SITE.phoneHref} className="text-sm font-semibold text-ink-700">
                {SITE.phone}
              </a>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="rounded-full bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Request a Consultation
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
