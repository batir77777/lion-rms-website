"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/components/Logo";
import { NAV, SITE } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [spy, setSpy] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav]"),
    );
    if (sections.length === 0) {
      setSpy(null);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        setSpy(
          visible ? (visible.target as HTMLElement).dataset.nav ?? null : null,
        );
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [pathname]);

  const isActive = (href: string) => {
    if (spy) return spy === href;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Logo className="h-11 w-auto" dark />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`relative py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "text-teal-600"
                    : "text-slate-600 hover:text-teal-600"
                }`}
              >
                {n.label}
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-teal-500"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href={SITE.phoneHref}
            className="text-sm font-semibold text-slate-700 transition hover:text-teal-600"
          >
            {SITE.phone}
          </a>
          <Link
            href="/contact"
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #0c1f3f, #0ea5a0)",
              boxShadow: "0 4px 20px rgba(14,165,160,0.3)",
            }}
          >
            Request a Consultation
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-slate-200 bg-white md:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={`border-b border-slate-100 py-3 text-sm font-medium ${
                    isActive(n.href)
                      ? "text-teal-600"
                      : "text-slate-700 hover:text-teal-600"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
              <div className="flex items-center justify-between pb-2 pt-4">
                <a
                  href={SITE.phoneHref}
                  className="text-sm font-semibold text-slate-700 hover:text-teal-600"
                >
                  {SITE.phone}
                </a>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #0c1f3f, #0ea5a0)" }}
                >
                  Request a Consultation
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
