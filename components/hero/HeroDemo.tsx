"use client";

// Hero placement of the product demo. Desktop (lg+): the full animated
// DemoStage, autoplaying on load (above the fold) and deep-linking to the
// service pages. Mobile/SSR: a compact STATIC final-state card so the demo
// never pushes the primary CTA below the first screen, with a "See how it
// works →" link to the digital compliance section.
//
// The wrapper reserves desktop height via CSS so the post-hydration swap from
// the static card to the live demo causes no layout shift.

import Link from "next/link";
import { useEffect, useState } from "react";
import DemoStage, { DEMO_FINDINGS } from "../showcase/DemoStage";

function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

/** Static final-state mini dashboard for small screens (and pre-hydration). */
function StaticCard() {
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <div data-anim-demo>
      <div
        className="rounded-3xl bg-ink-950/80 p-4 ring-1 ring-white/10 backdrop-blur"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 85% 10%, rgba(194, 75, 8, 0.12) 0%, transparent 60%)",
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 truncate text-[10px] font-medium text-ink-400">
            Lion RMS · Compliance Dashboard
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Static 94% gauge */}
          <div className="relative h-14 w-14 flex-shrink-0">
            <svg viewBox="0 0 64 64" className="h-14 w-14 -rotate-90">
              <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
              <circle
                cx="32"
                cy="32"
                r={R}
                fill="none"
                stroke="#f97f11"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - 0.94)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-xs font-bold text-white">94%</span>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white">
              Assessment → live compliance dashboard
            </p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-ink-400">
              Findings become tracked actions with automated reminders.
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          {DEMO_FINDINGS.slice(0, 2).map((f) => (
            <div
              key={f.text}
              className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.04] px-2.5 py-1.5"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/90 text-white">
                  <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 10.5l4 4 8-8.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="min-w-0 truncate text-[10px] text-ink-200">{f.text}</p>
              </div>
              <span className="flex-shrink-0 text-[9px] font-semibold text-emerald-400">
                Complete
              </span>
            </div>
          ))}
        </div>

        <Link
          href="#digital-compliance"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 transition hover:text-brand-300"
        >
          See how it works <span aria-hidden>→</span>
        </Link>
      </div>
      <p className="mt-1.5 text-center text-[10px] text-ink-500">
        Illustrative product demo — not live client data.
      </p>
    </div>
  );
}

export default function HeroDemo() {
  const desktop = useIsDesktop();
  return (
    // The DemoStage reserves its own height via CSS aspect-ratio (correct from
    // SSR, no layout shift at any width).
    <div className="w-full">
      {desktop ? <DemoStage autoStart navigational /> : <StaticCard />}
    </div>
  );
}
