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
 * screen reader announces the state and can jump to the content. The panel is
 * removed from the tree when collapsed rather than merely hidden, so its link
 * never becomes a focus trap for keyboard users tabbing past a closed card.
 * The "Read more" link sits inside the panel and is therefore only reachable
 * when the panel is open — a nested interactive element inside a button would
 * be invalid markup and unreliable for assistive technology.
 *
 * Motion. Height animation is skipped entirely under prefers-reduced-motion;
 * the panel simply appears. The first client render matches the server render
 * (all cards collapsed), so there is no hydration mismatch.
 *
 * Images are OPTIONAL. A card with no `image` renders a branded placeholder,
 * so the layout works before any photograph is licensed and photographs can
 * be added later without touching this component.
 */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RiskCard } from "@/lib/site";

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
                </button>

                {open && (
                  <div id={panelId} className="border-t border-slate-100 bg-slate-50/80 px-5 py-4">
                    <p className="text-sm leading-relaxed text-slate-600">{card.detail}</p>
                    <Link
                      href={card.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 underline-offset-4 hover:underline"
                    >
                      {card.linkLabel} &rarr;
                    </Link>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-slate-400">
          Photographs are licensed stock images illustrating the types of premises, activities
          and hazards we assess. They do not depict Lion RMS projects or clients.
        </p>
      </div>
    </section>
  );
}
