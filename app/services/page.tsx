import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ServiceCheckCTA from "@/components/ServiceCheckCTA";
import ProcessTimeline from "@/components/ProcessTimeline";
import { SERVICE_CATEGORIES, CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Fire engineering consultancy, fire risk assessments, fire safety consultancy, fire strategies, fire door inspections, compartmentation, health & safety consultancy and training from Lion RMS.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Services" }]} />
      <PhotoHero
        eyebrow="Services"
        title="Fire engineering, health & safety and fire risk assessment services"
        body="Fire engineering consultancy, fire risk assessments, fire safety consultancy, fire strategies, fire door inspections, compartmentation, health & safety consultancy and training — practical, proportionate advice for landlords, managing agents, businesses, and developers."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-7 md:grid-cols-3">
            {SERVICE_CATEGORIES.map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 70}>
                <Link
                  href={`/services/${cat.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl"
                >
                  <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-teal-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
                    {cat.eyebrow}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-navy-900 leading-snug group-hover:text-navy-800">
                    {cat.title}
                  </h2>
                  <p className="mt-4 flex-1 text-base leading-relaxed text-slate-500">
                    {cat.short}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 group-hover:gap-2.5 transition-all">
                    View details
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Compliance Check promo */}
          <div className="mt-16">
            <ServiceCheckCTA />
          </div>

          {/* Compliance CTA */}
          <Reveal>
            <div
              className="mt-8 rounded-2xl border p-8 text-center"
              style={{
                background: "linear-gradient(135deg,#060e1f 0%,#0c1f3f 50%,#082218 100%)",
                borderColor: "rgba(14,165,160,0.2)",
              }}
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-teal-400">
                Ongoing Compliance
              </p>
              <h3 className="mb-4 text-2xl font-extrabold text-white">
                Assessment to ongoing compliance — one consultancy
              </h3>
              <p className="mx-auto mb-6 max-w-xl text-base text-slate-400 leading-relaxed">
                Every assessment we deliver feeds into ongoing compliance management:
                actions tracked to completion, review dates scheduled, and your
                documentation kept audit-ready. No gaps, no handoffs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#0c1f3f,#0ea5a0)" }}
                >
                  {CTA_PRIMARY_LABEL} &rarr;
                </Link>
                <Link
                  href={CTA_SECONDARY_HREF}
                  className="inline-flex items-center rounded-full border border-white/20 bg-white/8 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/15"
                >
                  {CTA_SECONDARY_LABEL}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Assessment Process — reused, unmodified component */}
      <ProcessTimeline />
    </>
  );
}
