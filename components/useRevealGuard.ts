"use client";

// Fail-safe for scroll-reveal animations: content must NEVER stay hidden if
// IntersectionObserver fails to fire (fast scrolling, anchor jumps, browser
// quirks). Returns `forced` — when true, the caller must render its content
// fully visible regardless of observer state.
//
// Behaviour:
//  1. 1.5s after mount: if the reveal still hasn't triggered AND the element
//     is within the viewport or above it (e.g. an anchor jump landed past it),
//     force it visible.
//  2. If it is still below the fold at that point, a passive scroll backstop
//     keeps checking; it fires slightly LATER than the observer's natural
//     trigger point (85% vs 90% of viewport height) so the animated path wins
//     whenever the observer is working — the backstop only catches failures.

import { useEffect, useState, type RefObject } from "react";

const GRACE_MS = 1500;

export default function useRevealGuard(
  ref: RefObject<HTMLElement | null>,
  triggered: boolean,
): boolean {
  const [forced, setForced] = useState(false);

  useEffect(() => {
    if (triggered || forced) return;

    const within = (fraction: number) => {
      const el = ref.current;
      if (!el) return false;
      return el.getBoundingClientRect().top < window.innerHeight * fraction;
    };

    let onScroll: (() => void) | null = null;
    const timer = setTimeout(() => {
      // In view or above it → the observer should have fired by now. Force.
      if (within(1)) {
        setForced(true);
        return;
      }
      // Still below the fold: arm the scroll backstop.
      onScroll = () => {
        if (within(0.85)) {
          setForced(true);
          if (onScroll) window.removeEventListener("scroll", onScroll);
          onScroll = null;
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }, GRACE_MS);

    return () => {
      clearTimeout(timer);
      if (onScroll) window.removeEventListener("scroll", onScroll);
    };
  }, [triggered, forced, ref]);

  return forced;
}
