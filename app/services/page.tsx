import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import { IMAGES, POSITIONING, SERVICE_CATEGORIES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Fire safety, health & safety, and digital compliance services from Lion Risk Management Solutions — joined-up consultancy across East London.",
};

export default function ServicesPage() {
  return (
    <>
      <PhotoHero
        image={IMAGES.office}
        eyebrow="Services"
        title="Joined-up fire, health & safety, and compliance"
        body={POSITIONING}
      />
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {SERVICE_CATEGORIES.map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 70}>
                <Link
                  href={`/services/${cat.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-7 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
                    {cat.eyebrow}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-ink-900">
                    {cat.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">
                    {cat.short}
                  </p>
                  <span className="mt-5 text-sm font-semibold text-brand-700">
                    View details →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
