"use client";

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
