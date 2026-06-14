import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import { IMAGES, POSITIONING, SERVICE_CATEGORIES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Fire risk assessments, health & safety support, and digital compliance tools from Lion Risk Management Solutions — one platform across London.",
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
                  className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
                    {cat.eyebrow}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">
                    {cat.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                    {cat.short}
                  </p>
                  <span className="mt-5 text-sm font-semibold text-teal-600">
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
