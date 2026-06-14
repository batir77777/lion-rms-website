"use client";

// NOTE: Removed pending real figures / consented client quotes — re-add when
// available. Confirm the STATS values in lib/site.ts before re-mounting.
//
// Credibility band with animated stat counters — counts up once when scrolled
// into view. Values live in lib/site.ts (STATS) for easy editing.

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { STATS } from "@/lib/site";
import useRevealGuard from "./useRevealGuard";

function Counter({
  value,
  suffix,
  start,
}: {
  value: number;
  suffix: string;
  start: boolean;
}) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!start || reduced) {
      if (start || reduced) setN(value);
      return;
    }
    const dur = 1600;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      // easeOutExpo — fast start, settles precisely on the target.
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value, reduced]);

  return (
    <span className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

export default function StatsBand() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.25, margin: "0px 0px -10% 0px" });
  const forced = useRevealGuard(ref, seen);
  const inView = seen || forced;

  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(45% 90% at 12% 0%, rgba(194, 75, 8, 0.22) 0%, transparent 70%)," +
            "radial-gradient(45% 90% at 88% 100%, rgba(249, 127, 17, 0.14) 0%, transparent 70%)",
        }}
      />
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-ink-950/70 p-7 text-center backdrop-blur sm:text-left"
            >
              <div className="bg-gradient-to-r from-white to-teal-300 bg-clip-text font-display text-4xl font-bold text-transparent sm:text-5xl">
                <Counter value={s.value} suffix={s.suffix} start={inView} />
              </div>
              <div className="mt-2 text-sm leading-snug text-ink-300">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
