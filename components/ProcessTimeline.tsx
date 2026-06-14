"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { PROCESS_STEPS } from "@/lib/site";
import useRevealGuard from "./useRevealGuard";

export default function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const forced = useRevealGuard(ref, inView);
  const show = reduced || inView || forced;

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">
          How we work
        </p>
        <h2 className="max-w-2xl text-3xl font-bold text-navy-900 sm:text-5xl">
          A clear, joined-up process from first call to ongoing compliance
        </h2>

        <div ref={ref} className="relative mt-16">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-slate-200 lg:block" aria-hidden />
          <motion.div
            className="absolute left-0 top-7 hidden h-px origin-left lg:block"
            style={{ right: 0, background: "linear-gradient(to right, #0ea5a0, #5eead4, #10b981)" }}
            initial={{ scaleX: 0 }}
            animate={show ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            aria-hidden
          />

          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {PROCESS_STEPS.map((s, i) => (
              <motion.li
                key={s.n}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                animate={show ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: reduced ? 0 : 0.25 + i * 0.18,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-teal-200 bg-white font-display text-base font-bold text-teal-600 shadow-sm">
                  {s.n}
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {s.body}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
