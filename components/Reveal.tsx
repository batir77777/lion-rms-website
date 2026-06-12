"use client";

// Scroll-triggered reveal built on Framer Motion, with a hard guarantee that
// content can never stay hidden:
//  - whileInView with a forgiving viewport config fires reliably, including
//    for elements already in view on initial load (the observer reports the
//    initial intersection state on mount — no interaction required).
//  - useRevealGuard force-shows the content if the observer has not fired
//    within 1.5s of mount while the element is in/above the viewport, and a
//    scroll backstop catches anything the observer misses after that.
// Keeps the original API ({ children, className, delay }) used across the
// site. Respects prefers-reduced-motion (renders fully visible, no animation).

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import useRevealGuard from "./useRevealGuard";

const SHOWN = { opacity: 1, y: 0 };

export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const forced = useRevealGuard(ref, seen);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={SHOWN}
      // Fail-safe: if the observer never fires, animate to visible anyway.
      animate={forced ? SHOWN : undefined}
      onViewportEnter={() => setSeen(true)}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: 0.65,
        // Forced reveals have waited long enough — no stagger delay.
        delay: forced ? 0 : delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
