"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { ASSESSOR } from "@/lib/site";

export default function AssessorSection() {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = ASSESSOR.name
    .replace(/[[\]]/g, "")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "LR";

  return (
    <section className="bg-ink-50">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 sm:grid-cols-[auto_1fr] sm:gap-12">
          <Reveal>
            <div className="mx-auto h-40 w-40 overflow-hidden rounded-2xl bg-teal-700 shadow-lg">
              {imgFailed ? (
                <div className="flex h-full w-full items-center justify-center font-display text-4xl font-bold text-white">
                  {initials}
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ASSESSOR.photo}
                  alt={ASSESSOR.name}
                  className="h-full w-full object-cover"
                  onError={() => setImgFailed(true)}
                />
              )}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-700">
                Your assessor
              </p>
              <h2 className="text-2xl font-bold text-ink-950 sm:text-3xl">
                {ASSESSOR.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-ink-500">{ASSESSOR.role}</p>
              <p className="mt-4 text-base leading-relaxed text-ink-600">{ASSESSOR.bio}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {ASSESSOR.credentials.map((c) => (
                  <span key={c} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-teal-800 ring-1 ring-teal-100">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
