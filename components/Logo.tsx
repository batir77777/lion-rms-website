"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

// Shows the logo image from /public/logo.png. If it's not present yet,
// it falls back to a clean "LR" wordmark so the site never looks broken.
export default function Logo({
  className = "h-10 w-auto",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-sm font-bold text-white">
          LR
        </span>
        <span className="leading-tight">
          <span className={`block text-sm font-bold ${dark ? "text-white" : "text-ink-900"}`}>
            Lion Risk Management
          </span>
          <span className="block text-[11px] uppercase tracking-widest text-brand-500">
            Solutions
          </span>
        </span>
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SITE.logo}
      alt="Lion Risk Management Solutions"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
