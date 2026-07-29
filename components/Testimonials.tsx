"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/site";

const INTERVAL = 7500;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % TESTIMONIALS.length),
    [],
  );

  useEffect(() => {
    if (reduced || paused) return;
    timer.current = setInterval(next, INTERVAL);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduced, paused, next]);

  const t = TESTIMONIALS[index];

  return (
    <section
      className="bg-slate-50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:py-28">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
          What clients say
        </p>
        <span
          aria-hidden
          className="mx-auto block font-display text-7xl leading-none text-teal-100"
        >
          &ldquo;
        </span>

        <div className="relative min-h-[14rem] sm:min-h-[11rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mx-auto max-w-3xl font-display text-xl font-medium leading-snug tracking-tight text-slate-900 sm:text-3xl">
                {t.quote}
              </p>
              <footer className="mt-7">
                <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                <div className="mt-0.5 text-sm text-slate-500">{t.role}</div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-9 flex items-center justify-center gap-2.5">
          {TESTIMONIALS.map((item, i) => (
            <button
              key={item.role}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1} of ${TESTIMONIALS.length}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-7 bg-teal-500"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
