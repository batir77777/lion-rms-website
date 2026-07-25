"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    <section className="border-b border-slate-100 bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="grid items-center gap-10 sm:grid-cols-[auto_1fr] sm:gap-12">
          <Reveal>
            <div className="mx-auto h-40 w-40 overflow-hidden rounded-2xl bg-navy-900 shadow-lg">
              {imgFailed ? (
                <div className="flex h-full w-full items-center justify-center font-display text-4xl font-bold text-white">
                  {initials}
                </div>
              ) : (
                <Image
                  src={ASSESSOR.photo}
                  alt={`${ASSESSOR.name}, ${ASSESSOR.role} at Lion Risk Management Solutions`}
                  width={320}
                  height={320}
                  className="h-full w-full object-cover"
                  sizes="160px"
                  quality={85}
                  onError={() => setImgFailed(true)}
                />
              )}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-teal-600">
                About the Founder
              </p>
              <h2 className="text-2xl font-extrabold text-slate-800 sm:text-3xl">
                Led by {ASSESSOR.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-teal-700">{ASSESSOR.role}</p>
              <p className="mt-4 text-base leading-relaxed text-slate-500">{ASSESSOR.bio}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {ASSESSOR.credentials.map((c) => (
                  <span key={c} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-navy-700">
                    {c}
                  </span>
                ))}
              </div>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:gap-2.5 transition-all"
              >
                More about Batir &rarr;
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
