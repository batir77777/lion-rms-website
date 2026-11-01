"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/components/Logo";
import ServicesMenu from "@/components/ServicesMenu";
import { NAV, SITE, CTA_PRIMARY_LABEL, LION_DIGITAL_URL, SERVICE_MENU } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  // Mobile services disclosure. Collapses whenever the whole menu closes, so
  // reopening the menu does not restore a half-expanded state.
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [spy, setSpy] = useState<string | null>(null);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) setServicesOpen(false);
  }, [open]);

  // Close the mobile menu on Escape and return focus to the toggle button.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Keep keyboard focus within the mobile menu while it's open: if focus
  // tabs past the last link inside it, wrap back to the toggle button
  // rather than letting focus fall through into the page content behind it.
  useEffect(() => {
    if (!open) return;
    function onFocusOut(e: FocusEvent) {
      const next = e.relatedTarget as Node | null;
      if (!next) return;
      const withinMenu = mobileNavRef.current?.contains(next);
      const isToggle = toggleRef.current?.contains(next);
      if (!withinMenu && !isToggle) {
        toggleRef.current?.focus();
      }
    }
    const nav = mobileNavRef.current;
    nav?.addEventListener("focusout", onFocusOut);
    return () => nav?.removeEventListener("focusout", onFocusOut);
  }, [open]);

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
        /*
         * bg-white/95, not /96. Tailwind only generates opacity modifiers for
         * steps in its scale — multiples of 5 — so `bg-white/96` compiled to
         * NOTHING and this bar had no background at all whenever it was
         * scrolled or the mobile menu was open. On the homepage that meant a
         * slate-700 close icon sitting directly on the dark navy hero, which
         * is the "close icon is invisible" defect. Verified by grepping the
         * built stylesheet: .bg-white\/85, \/10 and \/5 are present, \/96 is
         * not. Keep opacity values on multiples of 5.
         */
        scrolled || open
          ? "border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-white/85 backdrop-blur-sm"
      }`}
    >
      {/*
        The row's intrinsic width, measured at 1280px: logo 49 + nav 824 +
        right group 503 = 1376px, inside a container whose usable width is
        1232px. Nothing shrank, because every item is whitespace-nowrap, so
        "Request a Quote" simply ran off the screen — by 121px at 1280, 38px
        at 1366 and 1px at 1440. It only looked fine at 1920 because the
        overflow still landed inside a wider viewport.

        Two changes fix it without touching the design. The Lion Digital pill
        (201px plus its gap) now waits for 2xl, where there is room for it;
        below that it is still reachable from the mobile menu and the footer.
        And at 2xl the container widens, because the nav itself grows there
        (2xl:px-3.5 on each of nine links) and 1280px could not hold it
        either.
      */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 2xl:max-w-[96rem]">
        {/* shrink-0: without it the logo is the flex item that gives way when
            the row is over-constrained, and it silently compresses to nothing
            rather than the layout visibly breaking. Found at 1280px during the
            Phase 5A PR 3 header QA, when the longer "Knowledge Centre" nav
            label widened the nav by 78px. */}
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Logo className="h-12 w-auto" dark />
        </Link>

        {/*
         * Desktop nav. Labelled because it was the one unnamed navigation
         * landmark on the site — every other <nav> already carries one
         * (Breadcrumb, Mobile, Knowledge Centre sections, Jump to letter, News
         * archive by year). On /guides there are three navigation landmarks,
         * and the unnamed one was the primary.
         */}
        <nav aria-label="Primary" className="hidden items-center gap-1 xl:flex">
          {NAV.map((n) => {
            const active = isActive(n.href);
            /*
             * Services becomes a dropdown rather than a plain link, because
             * six of the nine service pages were reachable from the header
             * only by landing on /services first and reading the grid. The
             * NAV array is untouched: the footer's "Pages" column is driven
             * by the same array, and the entry still points at /services for
             * every other consumer — only the header renders it differently.
             */
            if (n.href === "/services") {
              return <ServicesMenu key={n.href} active={active} />;
            }
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`relative rounded-lg px-2.5 py-2 text-[15px] font-medium whitespace-nowrap transition-colors 2xl:px-3.5 ${
                  active
                    ? "text-teal-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-navy-900"
                }`}
              >
                {n.label}
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-3.5 left-2 right-2 h-0.5 rounded-full bg-teal-500 2xl:left-3 2xl:right-3"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right */}
        <div className="hidden items-center gap-5 xl:flex">
          {/*
           * Cross-link to Lion Digital, our separate sister business
           * (bespoke software / AI automation). Deliberately kept OUT of the
           * `NAV`-driven Primary nav above — that nav is Lion RMS's own page
           * structure (Services, Sectors, etc.), and adding Lion Digital
           * there would read as a Lion RMS service and would also propagate
           * into the footer's "Pages" column, which is driven by the same
           * `NAV` array. This sits beside it instead: visible at a glance,
           * but styled as an outlined pill rather than the solid CTA
           * gradient, so it doesn't compete with "Request a Quote" or read
           * as part of the Lion RMS service offering. Opens in a new tab so
           * a visitor never loses their place on the Lion RMS site.
           */}
          <a
            href={LION_DIGITAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden whitespace-nowrap rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-teal-200 hover:text-teal-700 2xl:inline-flex"
          >
            AI &amp; Digital Solutions &#8599;
          </a>
          <a
            href={SITE.phoneHref}
            className="whitespace-nowrap text-[15px] font-semibold text-slate-700 transition hover:text-teal-700"
          >
            {SITE.phone}
          </a>
          <Link
            href="/contact"
            className="whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #0c1f3f, #0ea5a0)",
              boxShadow: "0 4px 20px rgba(14,165,160,0.28)",
            }}
          >
            {CTA_PRIMARY_LABEL}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          ref={toggleRef}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 xl:hidden"
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
            id="mobile-nav"
            ref={mobileNavRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-slate-100 bg-white xl:hidden"
          >
            <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
              {NAV.map((n) => {
                /*
                 * Mobile equivalent of the desktop dropdown. The Services row
                 * keeps its link to /services and gains a separate disclosure
                 * button beside it, rather than becoming a button outright:
                 * on a phone, tapping a nav item you recognise should still
                 * take you to the page. The two targets are side by side and
                 * each is a full-height tap target.
                 */
                if (n.href === "/services") {
                  return (
                    <div key={n.href} className="border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <Link
                          href={n.href}
                          onClick={() => setOpen(false)}
                          className={`flex-1 py-3.5 text-[15px] font-medium ${
                            isActive(n.href) ? "text-teal-700" : "text-slate-700 hover:text-teal-700"
                          }`}
                        >
                          {n.label}
                        </Link>
                        <button
                          type="button"
                          aria-expanded={servicesOpen}
                          aria-controls="mobile-services"
                          aria-label={servicesOpen ? "Hide services" : "Show services"}
                          onClick={() => setServicesOpen((v) => !v)}
                          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-navy-900"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                            className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>
                      </div>
                      {/*
                        Always rendered and `hidden` when collapsed, so
                        aria-controls always resolves and the links inside
                        cannot be tabbed into while the section is closed.
                      */}
                      <div id="mobile-services" hidden={!servicesOpen} className="pb-2">
                        {SERVICE_MENU.map((group) => (
                          <div key={group.label} className="mb-1">
                            <p className="px-1 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700">
                              {group.label}
                            </p>
                            <ul>
                              {group.items.map((item) => (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="block py-2.5 pl-3 pr-1 text-sm leading-snug text-slate-600 hover:text-teal-700"
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`border-b border-slate-100 py-3.5 text-[15px] font-medium ${
                      isActive(n.href)
                        ? "text-teal-700"
                        : "text-slate-700 hover:text-teal-700"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
              {/*
               * Same cross-link as the desktop right-side pill, and the same
               * reasoning for keeping it out of the NAV-driven list above it:
               * visible on mobile, but visually distinct from Lion RMS's own
               * page links rather than mixed into them.
               */}
              <a
                href={LION_DIGITAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-3 flex items-center justify-center gap-1.5 rounded-full border border-slate-200 py-3 text-[15px] font-semibold text-slate-600 hover:border-teal-200 hover:text-teal-700"
              >
                AI &amp; Digital Solutions &#8599;
              </a>
              <div className="flex items-center justify-between pb-4 pt-4">
                <a
                  href={SITE.phoneHref}
                  className="text-[15px] font-semibold text-slate-700 hover:text-teal-700"
                >
                  {SITE.phone}
                </a>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #0c1f3f, #0ea5a0)" }}
                >
                  {CTA_PRIMARY_LABEL}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
