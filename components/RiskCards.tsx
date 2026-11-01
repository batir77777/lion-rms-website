"use client";

/*
 * The "what we assess" band on a service page: a grid of photograph-led
 * cards, each of which expands IN PLACE to show what we actually assess and
 * a link into the section that covers it.
 *
 * Why not a lightbox. A lightbox enlarges the photograph, which serves
 * decoration. Expanding in place reveals information, which is what a reader
 * deciding whether to call us wants, and it avoids trapping focus on a phone.
 *
 * Accessibility. The whole card is one <button> carrying aria-expanded and
 * aria-controls; the panel it controls is a sibling with a matching id, so a
 * screen reader announces the state and can jump to the content.
 *
 * The panel is ALWAYS rendered and carries the `hidden` attribute when
 * collapsed. An earlier version removed it from the tree instead, which left
 * aria-controls pointing at an id that did not exist — invalid per ARIA, and
 * some screen readers drop the relationship entirely rather than recover.
 * `hidden` keeps the reference resolvable while taking the panel out of both
 * the accessibility tree and the tab order, so the link inside it still
 * cannot be tabbed into behind a closed card.
 *
 * The link sits inside the panel rather than beside the title because a
 * nested interactive element inside a button is invalid markup and behaves
 * unpredictably with assistive technology.
 *
 * Motion. Height animation is skipped entirely under prefers-reduced-motion;
 * the panel simply appears. The first client render matches the server render
 * (all cards collapsed), so there is no hydration mismatch.
 *
 * Images are OPTIONAL. A card with no `image` renders a branded placeholder,
 * so the layout works before any photograph is licensed and photographs can
 * be added later without touching this component.
 *
 * Icons are the THIRD state, for bands where a photograph would be wrong
 * rather than merely absent — training sessions, where any stock photograph
 * of people in a room implies a course we ran. A card with an `icon` renders
 * no media band at all: the icon sits as a badge beside the title, which
 * keeps eight cards compact instead of stacking eight 4:3 blocks. `icon`
 * wins over `image` if both are somehow set, and the stock-photograph note
 * below the grid is suppressed when no card actually shows a photograph —
 * otherwise a band of icons carries a disclaimer about images it has none of.
 */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RiskCard } from "@/lib/site";

/*
 * Inline so the icons ship in the same chunk as the only component that uses
 * them, and so they inherit `currentColor` from the badge. Each is decorative
 * — the course name is the accessible name — so the <svg> is aria-hidden at
 * the badge and carries no <title>.
 */
const CARD_ICONS: Record<string, React.ReactNode> = {
  flame: <path d="M12 3c.6 3 3.5 4.2 3.5 7a3.5 3.5 0 0 1-7 0c0-1 .4-1.8 1-2.5C8 8.8 6.5 10.6 6.5 13a5.5 5.5 0 0 0 11 0c0-4.2-3.3-7-5.5-10Z" />,
  warden: <><circle cx="12" cy="5.5" r="2.5" /><path d="M8 21v-5l-1.5-1.5a2 2 0 0 1-.5-1.3V11a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2.2a2 2 0 0 1-.5 1.3L16 16v5M12 9v7" /></>,
  lifting: <><path d="M4 9.5 12 6l8 3.5-8 3.5-8-3.5Z" /><path d="M4 9.5V15l8 3.5 8-3.5V9.5" /></>,
  height: <><path d="M8 3v18M16 3v18" /><path d="M8 7h8M8 12h8M8 17h8" /></>,
  clipboard: <><path d="M9 4h6v2.5H9z" /><path d="M7.5 5.5H6a1.5 1.5 0 0 0-1.5 1.5V19A1.5 1.5 0 0 0 6 20.5h12A1.5 1.5 0 0 0 19.5 19V7A1.5 1.5 0 0 0 18 5.5h-1.5" /><path d="M8.5 11h7M8.5 15h4.5" /></>,
  hazard: <><path d="M10 3h4v4.2l4.2 9.1A2 2 0 0 1 16.4 19H7.6a2 2 0 0 1-1.8-2.7L10 7.2V3Z" /><path d="M7.4 13.5h9.2" /></>,
  induction: <><path d="M4 20V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15" /><path d="M14 9h5a1 1 0 0 1 1 1v10M3 20h18" /><path d="M10.5 12h.01" /></>,
  talk: <><path d="M20 4.5H8A1.5 1.5 0 0 0 6.5 6v6A1.5 1.5 0 0 0 8 13.5h2.5V17l3.5-3.5H20A1.5 1.5 0 0 0 21.5 12V6A1.5 1.5 0 0 0 20 4.5Z" /><path d="M6.5 16.5H4A1.5 1.5 0 0 1 2.5 15v-.5" /></>,
  // Added November 2026 for the construction page.
  checklist: <><path d="M7.5 5.5H6A1.5 1.5 0 0 0 4.5 7v12A1.5 1.5 0 0 0 6 20.5h12a1.5 1.5 0 0 0 1.5-1.5V7a1.5 1.5 0 0 0-1.5-1.5h-1.5" /><path d="M9 3.5h6V6H9z" /><path d="m8.5 11.5 1.8 1.8 3.7-3.7M8.5 16.5h7" /></>,
  calendar: <><rect x="4" y="5.5" width="16" height="14.5" rx="1.5" /><path d="M4 10h16M8.5 3.5V7M15.5 3.5V7" /><path d="M8.5 13.5h.01M12 13.5h.01M15.5 13.5h.01M8.5 16.8h.01M12 16.8h.01" /></>,
  shield: <><path d="M12 3.2 5 6v5.6c0 4 2.9 7.6 7 9.2 4.1-1.6 7-5.2 7-9.2V6l-7-2.8Z" /><path d="m9 12 2.2 2.2L15.3 10" /></>,
  contractors: <><circle cx="9" cy="7.5" r="2.6" /><path d="M3.8 20v-2.4A3.6 3.6 0 0 1 7.4 14h3.2a3.6 3.6 0 0 1 3.6 3.6V20" /><path d="M16.2 5.4a2.6 2.6 0 0 1 0 4.9M17.6 14h.6a3.6 3.6 0 0 1 3.6 3.6V20" /></>,
  cdm: <><path d="M12 4.5v15M5 8h14" /><path d="M5 8 2.8 13.2a3.1 3.1 0 0 0 4.4 0L5 8ZM19 8l-2.2 5.2a3.1 3.1 0 0 0 4.4 0L19 8Z" /><path d="M8.5 20h7" /></>,
  flag: <><path d="M6 21V4" /><path d="M6 4.8h10.8l-2.1 3.6 2.1 3.6H6" /></>,
  magnifier: <><circle cx="10.8" cy="10.8" r="5.8" /><path d="m15.2 15.2 4.4 4.4" /><path d="M8.6 10.8h4.4" /></>,
};

export default function RiskCards({
  cards,
  heading,
  intro,
}: {
  cards: RiskCard[];
  heading: string;
  intro?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="bg-slate-50/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">{heading}</h2>
          {intro && <p className="mt-3 text-base leading-relaxed text-slate-500">{intro}</p>}
        </div>

        <ul className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const open = openId === card.id;
            const panelId = `${card.id}-panel`;
            return (
              <li
                key={card.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-teal-200 hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : card.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="group block w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                >
                  {!card.icon && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      {card.image ? (
                        <Image
                          src={card.image}
                          alt={card.alt ?? ""}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        // Placeholder until a licensed photograph is in place.
                        // Branded, not a grey box, so the layout reads correctly
                        // in review. aria-hidden because it carries no meaning.
                        <div
                          aria-hidden
                          className="flex h-full w-full items-center justify-center"
                          style={{ background: "linear-gradient(135deg,#0c1f3f 0%,#0ea5a0 100%)" }}
                        >
                          <span className="px-6 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                            {card.title}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/*
                   * Two text layouts, deliberately not one with an optional
                   * wrapper. The photograph layout is reproduced here exactly
                   * as it shipped, because wrapping it in the icon row's flex
                   * container would change the Manufacturing page's HTML — and
                   * so its recorded content hash — for a page that gained
                   * nothing.
                   */}
                  {card.icon ? (
                    <div className="flex items-start gap-4 p-5">
                      <span
                        aria-hidden
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100 transition group-hover:bg-teal-100"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="22"
                          height="22"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {CARD_ICONS[card.icon]}
                        </svg>
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-base font-bold leading-snug text-navy-900">{card.title}</h3>
                          <span
                            aria-hidden
                            className={`mt-0.5 shrink-0 text-teal-700 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
                          >
                            +
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">{card.caption}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-bold leading-snug text-navy-900">{card.title}</h3>
                        <span
                          aria-hidden
                          className={`mt-0.5 shrink-0 text-teal-700 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
                        >
                          +
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">{card.caption}</p>
                    </div>
                  )}
                </button>

                <div
                  id={panelId}
                  hidden={!open}
                  className="border-t border-slate-100 bg-slate-50/80 px-5 py-4"
                >
                    <p className="text-sm leading-relaxed text-slate-600">{card.detail}</p>
                    <Link
                      href={card.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 underline-offset-4 hover:underline"
                    >
                      {card.linkLabel} &rarr;
                    </Link>
                </div>
              </li>
            );
          })}
        </ul>

        {/*
          Widened 1 November 2026 to cover both kinds of image on the band.
          Four of the six industrial cards are licensed stock photographs;
          two are AI-generated illustrations. Saying only "photographs" would
          have been inaccurate the moment the second kind appeared, and the
          part that matters — that none of them is our work or a client's
          premises — is true of both and stays.
        */}
        {cards.some((c) => c.image) && (
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-slate-400">
            Images are licensed stock photographs or AI-generated illustrations, used to show the
            types of premises, activities and hazards we assess. None of them depicts a Lion RMS
            project or a client&rsquo;s premises.
          </p>
        )}
      </div>
    </section>
  );
}
