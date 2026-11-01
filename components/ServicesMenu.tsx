"use client";

/*
 * The desktop Services dropdown.
 *
 * WHY A BUTTON, NOT A HOVER MENU. A hover-only menu is unreachable by
 * keyboard and unusable on a touch screen that reports as a desktop. This is
 * a disclosure: a button carrying aria-expanded and aria-controls, and a
 * panel with a matching id. It opens on click or Enter/Space, closes on
 * Escape with focus returned to the button, closes on a click outside, and
 * closes when focus leaves the group entirely.
 *
 * WHY "All services" IS THE FIRST ITEM. The top-level control is a button
 * rather than a link, so /services would otherwise become unreachable from
 * the header. It leads the panel instead.
 *
 * WIDTH. The header row had 25px of spare width at 1280px after the Stage 1
 * fix, so this control must not be wider than the "Services" link it
 * replaces by more than that. The chevron is 12px inside the existing
 * padding and the label is unchanged; measured at 1280 after the change, the
 * quote button still ends inside the viewport. If a future nav item eats
 * that margin, reduce xl padding on the nav links before widening anything.
 */

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { SERVICE_MENU } from "@/lib/site";

export default function ServicesMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const groupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape closes and returns focus to the button, so a keyboard user is not
  // dropped at the top of the document.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // A pointer press anywhere outside the group closes it. `mousedown` rather
  // than `click` so the panel is gone before a click lands on what is behind
  // it.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!groupRef.current?.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  /*
   * Deliberate scrolling closes the panel. A dropdown left hanging while the
   * page moves under it reads as stuck.
   *
   * Two guards, both of which exist to protect keyboard users rather than to
   * tune the feel:
   *
   *   1. If focus is inside the PANEL, the scroll is almost certainly the
   *      browser bringing a just-focused link into view as someone tabs
   *      through it. Closing then would snatch the menu away mid-tab and
   *      strand the focus, so that scroll is ignored outright. The panel
   *      specifically, not the whole group: clicking the button leaves focus
   *      on the button, and guarding on the group would have meant the menu
   *      never closed on scroll for a mouse user at all. That is exactly what
   *      the first version did, and the test caught it.
   *   2. A small threshold, because trackpad momentum and the one or two
   *      pixels a browser settles by are not a visitor scrolling. Below it
   *      the panel stays open.
   *
   * Passive, and registered only while open, like the two effects above.
   */
  useEffect(() => {
    if (!open) return;
    const startY = window.scrollY;
    const onScroll = () => {
      if (panelRef.current?.contains(document.activeElement)) return;
      if (Math.abs(window.scrollY - startY) < 12) return;
      setOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // Tabbing out of the last link closes the panel rather than leaving it open
  // behind the page. relatedTarget is null when focus leaves the window, which
  // should not close it.
  const onBlurCapture = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && !groupRef.current?.contains(next)) setOpen(false);
  };

  return (
    <div ref={groupRef} className="relative" onBlurCapture={onBlurCapture}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`relative flex items-center gap-1 rounded-lg px-2.5 py-2 text-[15px] font-medium whitespace-nowrap transition-colors 2xl:px-3.5 ${
          active ? "text-teal-700" : "text-slate-600 hover:bg-slate-50 hover:text-navy-900"
        }`}
      >
        Services
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        {active && (
          <span className="absolute -bottom-3.5 left-2 right-2 h-0.5 rounded-full bg-teal-500 2xl:left-3 2xl:right-3" aria-hidden />
        )}
      </button>

      {/*
        Always rendered, hidden when closed. Removing it would leave
        aria-controls pointing at an id that does not exist, which is invalid
        and which some screen readers drop entirely rather than recover from —
        the same reasoning as the expandable cards in RiskCards.
      */}
      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="absolute left-0 top-full z-50 mt-3 w-[34rem] rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
      >
        <Link
          href="/services"
          onClick={() => setOpen(false)}
          className="mb-4 block rounded-lg px-3 py-2 text-sm font-bold text-navy-900 hover:bg-slate-50 hover:text-teal-700"
        >
          All services &rarr;
        </Link>
        <div className="grid grid-cols-2 gap-x-4">
          {SERVICE_MENU.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700">
                {group.label}
              </p>
              <ul>
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm leading-snug text-slate-600 transition hover:bg-slate-50 hover:text-navy-900"
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
    </div>
  );
}
