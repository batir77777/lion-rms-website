import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import { AREAS } from "@/lib/areas";
import { IMAGES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Areas We Cover Across London",
  description:
    "Fire risk assessments and fire & health & safety consultancy across East London — Stratford, Canary Wharf, Hackney, Tower Hamlets, Newham, Walthamstow and every East London area.",
};

export default function AreasPage() {
  return (
    <>
      <PhotoHero
        image={IMAGES.city}
        eyebrow="Areas we cover"
        title="Fire & safety services across East London"
        body="We provide fire risk assessments, fire strategies and health & safety support to clients across East London. Find your area below."
      />
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((a, i) => (
              <Reveal key={a.slug} delay={i * 40}>
                <Link
                  href={`/areas/${a.slug}`}
                  className="block rounded-2xl border border-ink-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-md"
                >
                  <h2 className="text-base font-semibold text-ink-950">
                    Fire Risk Assessment in {a.name}
                  </h2>
                  <p className="mt-1 text-sm text-ink-600">View {a.name} →</p>
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-ink-500">
            Don&apos;t see your area? We cover all of East London —{" "}
            <Link href="/contact" className="font-semibold text-brand-700 hover:underline">
              get in touch
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
