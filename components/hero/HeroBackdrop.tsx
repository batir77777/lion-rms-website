"use client";

// Gates the 3D ember scene:
//  - prefers-reduced-motion  → static gradient, no 3D bundle downloaded
//  - small screens / coarse pointers / low-core devices → static gradient
//  - otherwise: lazy-load the Three.js scene after mount (zero impact on LCP)
// The static gradient also renders underneath the canvas as its base layer, so
// there is no flash and no layout shift either way.

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const EmberScene = dynamic(() => import("./EmberScene"), {
  ssr: false,
  loading: () => null,
});

function useCanRender3D(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const lowCpu = (navigator.hardwareConcurrency ?? 8) <= 4;
    const lowMem =
      "deviceMemory" in navigator &&
      ((navigator as { deviceMemory?: number }).deviceMemory ?? 8) < 4;
    setOk(!reduced && !small && !(coarse && (lowCpu || lowMem)) && !lowCpu);
  }, []);
  return ok;
}

export default function HeroBackdrop() {
  const can3D = useCanRender3D();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  // Pause the render loop entirely once the hero scrolls out of view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden>
      {/* Static base: near-black ink with low ember glows. Always present. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 65% at 70% 15%, rgba(46, 42, 36, 0.55) 0%, transparent 60%)," +
            "radial-gradient(60% 50% at 25% 95%, rgba(194, 75, 8, 0.16) 0%, transparent 65%)," +
            "radial-gradient(40% 40% at 80% 100%, rgba(249, 127, 17, 0.10) 0%, transparent 70%)," +
            "linear-gradient(180deg, #0e0c09 0%, #14110d 55%, #0e0c09 100%)",
        }}
      />
      {/* Faint grid etch — engineered, precise. */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(248,246,242,0.6) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(248,246,242,0.6) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(80% 70% at 50% 40%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(80% 70% at 50% 40%, black 30%, transparent 100%)",
        }}
      />
      {can3D && <EmberScene active={inView} />}
      {/* Bottom fade into the next section. */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink-950" />
    </div>
  );
}
