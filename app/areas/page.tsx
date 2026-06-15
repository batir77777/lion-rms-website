import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import { AREAS } from "@/lib/areas";

export const metadata: Metadata = {
  title: "Areas We Cover Across London",
  description:
    "Fire risk assessments and fire & health & safety consultancy across London — Stratford, Canary Wharf, Hackney, Tower Hamlets, Newham, Walthamstow and every London area.",
};

export default function AreasPage() {
  return (
    <>
      <PhotoHero
        eyebrow="Areas we cover"
        title="Fire & safety services across London"
        body="We provide fire risk assessments, fire strategies and health & safety support to clients across London. Find your area below."
      />
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((a, i) => (
              <Reveal key={a.slug} delay={i * 40}>
                <Link
                  href={`/areas/${a.slug}`}
                  className="group block rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-lg"
                >
                  <h2 className="text-base font-bold text-navy-900 group-hover:text-navy-700">
                    Fire Risk Assessment in {a.name}
                  </h2>
                  <p className="mt-1.5 text-sm font-semibold text-teal-600">View details →</p>
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-slate-500">
            Don&apos;t see your area? We cover all of London —{" "}
            <Link href="/contact" className="font-semibold text-teal-600 hover:underline">
              get in touch
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
