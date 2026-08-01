"use client";

import { useEffect, useRef, useState } from "react";
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
  // framer-motion's useReducedMotion() reads the OS preference synchronously
  // on the client's first render, but the server always renders assuming
  // "not reduced" (it has no window to check). Branching the JSX directly on
  // that hook's return value made every reduced-motion visitor hit a
  // server/client mismatch on every Reveal instance — which React does not
  // patch up, and could leave the section's real content unrendered.
  //
  // Fix: keep the first client render identical to the server render (start
  // `reduced` at false always), then flip it in an effect, which only runs
  // after hydration has already committed. Non-reduced-motion users are
  // completely unaffected — this only changes how the reduced branch is reached.
  const prefersReducedMotion = useReducedMotion();
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const forced = useRevealGuard(ref, seen);

  useEffect(() => {
    if (prefersReducedMotion) setReduced(true);
  }, [prefersReducedMotion]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      // "reveal-root" is a hook for the print stylesheet, not a style.
      //
      // framer-motion sets opacity as an INLINE style, so anything below the
      // fold at the moment a reader hits print has opacity: 0 and prints blank.
      // A class is the only way for CSS to reach it, and `!important` in a
      // stylesheet does beat an inline declaration. This matters because the
      // Downloads library treats printing as a real delivery mode: for an
      // HTML-native resource, what comes out of the printer IS the document.
      className={`reveal-root ${className}`.trim()}
      initial={{ opacity: 0, y: 26 }}
      whileInView={SHOWN}
      animate={forced ? SHOWN : undefined}
      onViewportEnter={() => setSeen(true)}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: 0.65,
        delay: forced ? 0 : delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
