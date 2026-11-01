"use client";

/*
 * The mobile contact bar: Call and WhatsApp, fixed to the bottom of the
 * viewport on phones only.
 *
 * WHY IT IS A BAR AND NOT TWO FLOATING CIRCLES. Until 1 November 2026 this
 * rendered two 56px circles stacked in the bottom-right corner — a 60x132
 * block sitting permanently on top of whatever was underneath. Scanning every
 * scroll position at 390px showed what that meant in practice: on /contact
 * the circles covered, at one scroll offset or another, the name, email and
 * phone fields, the service select, the message textarea and the Send button
 * (1145px² of it). Elsewhere they covered "Request a Quote", "Free Compliance
 * Check", every service card and every expandable card on the Manufacturing
 * page. A visitor filling in the form could tap WhatsApp instead of Send.
 *
 * WHAT A BAR DOES AND DOES NOT FIX — measured, not assumed. A fixed bar is
 * still a fixed element, so content still passes behind it as the page
 * scrolls; scanning every 150px of scroll, the worst instantaneous overlap
 * went UP, from 1,145px² under the circles to about 24,000px² under a
 * full-width bar, simply because the bar is wider. No persistent contact
 * control can avoid covering something. What this arrangement changes is the
 * part that actually harmed visitors:
 *
 *   - it is never over a form field, because it hides while one has focus;
 *   - it is absent during the act of scrolling, so nothing is obscured while
 *     the visitor is reading their way down the page;
 *   - the page reserves its height (see app/layout.tsx), so the end of the
 *     document is clear rather than permanently tucked underneath;
 *   - and what it does cover is the predictable bottom edge of the screen,
 *     where people expect a toolbar, rather than the middle-right of the
 *     content where they expect to tap.
 *
 * WHY BOTH BUTTONS SURVIVED. The header's phone number is hidden below the
 * xl breakpoint — measured 0x0 at 390px — and only appears inside the opened
 * menu. So Call is not a duplicate of anything a phone visitor can see, and
 * dropping it would have cost one-tap calling.
 *
 * THE THREE CASES WHERE IT GETS OUT OF THE WAY. All handled here rather than
 * by the pages:
 *
 *   1. A form field has focus. On iOS a fixed bottom element rides the visual
 *      viewport above the on-screen keyboard, landing it back on top of the
 *      field being typed into — the very problem this component exists to
 *      remove. While focus is in an input, textarea or select, the bar goes.
 *   2. The visitor is scrolling down. It slides away and comes back when they
 *      scroll up or stop, so it is absent while the page is moving.
 *   3. The mobile navigation is open. Header sets `data-nav-open` on <body>;
 *      the visitor is navigating, not calling, and the expanded menu should
 *      own the screen.
 *
 * Cases 1 and 3 use `hidden`, so the links leave the tab order along with the
 * bar. Case 2 slides it out with a transform instead and pairs that with
 * `focus-within:translate-y-0`, so a keyboard user who tabs to a control that
 * happens to be off-screen brings it straight back rather than chasing a
 * focus ring they cannot see. Keyboard users are not the ones scrolling it
 * away in the first place.
 *
 * The page's reserved bottom padding never moves, in any of the three cases:
 * releasing it would reflow the document under the visitor's thumb the
 * instant a field took focus, which trades one annoyance for a worse one.
 */

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

const WA = "https://wa.me/447766317818";

export default function FloatingContact() {
  const [fieldFocused, setFieldFocused] = useState(false);
  const [scrolledAway, setScrolledAway] = useState(false);

  /*
   * Slide away while the page is scrolling down, return on scroll up or when
   * it stops. The 8px step keeps rubber-banding and sub-pixel settling from
   * flipping it, and the idle timer is what brings it back when a visitor
   * simply stops rather than scrolling back up. Always present near the top
   * of the page, where there is nothing to obscure yet.
   */
  useEffect(() => {
    let last = window.scrollY;
    let idle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      const y = window.scrollY;
      const d = y - last;
      if (Math.abs(d) > 8) {
        setScrolledAway(d > 0 && y > 120);
        last = y;
      }
      clearTimeout(idle);
      idle = setTimeout(() => setScrolledAway(false), 220);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const isField = (t: EventTarget | null) =>
      t instanceof HTMLElement &&
      (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT");

    const onIn = (e: FocusEvent) => {
      if (isField(e.target)) setFieldFocused(true);
    };
    const onOut = (e: FocusEvent) => {
      // relatedTarget is where focus is going. Moving between two fields must
      // not flash the bar back in between them.
      if (isField(e.target) && !isField(e.relatedTarget)) setFieldFocused(false);
    };

    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  return (
    <div
      data-mobile-action-bar
      data-hidden={fieldFocused ? "true" : undefined}
      hidden={fieldFocused}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm transition-transform duration-200 focus-within:translate-y-0 md:hidden [body[data-nav-open='true']_&]:hidden ${
        scrolledAway ? "translate-y-full" : "translate-y-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center gap-2.5 px-4 py-2.5">
        <a
          href={SITE.phoneHref}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition active:bg-teal-800"
        >
          <svg
            className="h-[18px] w-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
          </svg>
          Call
        </a>
        <a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-sm transition active:bg-[#1da851]"
        >
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.523 5.26l-.999 3.648 3.964-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  );
}
