import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { SECTORS, CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sectors",
  description:
    "Fire safety and health & safety consultancy across residential, commercial, and construction sectors — with dedicated expertise in residential blocks & HMOs, offices & commercial workplaces, and education.",
  alternates: { canonical: "/sectors" },
};

export default function SectorsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Sectors" }]} />
      <PhotoHero
        eyebrow="Sectors"
        title="Fire safety and health & safety expertise across nine sectors"
        body="Lion Risk Management Solutions works across residential, commercial, and construction environments. Below are the sectors we support most often — with dedicated guidance for the three we're asked about most."
      />
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((s, i) =>
              s.hasPage ? (
                <Reveal key={s.slug} delay={i * 50}>
                  <Link
                    href={`/sectors/${s.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl"
                  >
                    <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
                      Dedicated guidance
                    </p>
                    <h2 className="text-lg font-bold text-navy-900 leading-snug group-hover:text-navy-800">
                      {s.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{s.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 group-hover:gap-2.5 transition-all">
                      View details
                      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                </Reveal>
              ) : (
                <Reveal key={s.slug} delay={i * 50}>
                  <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-slate-50 p-7">
                    <h2 className="text-lg font-bold text-navy-900 leading-snug">{s.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{s.summary}</p>
                  </div>
                </Reveal>
              ),
            )}
          </div>

          <Reveal>
            <div
              className="mt-16 rounded-2xl border p-10 text-center"
              style={{
                background: "linear-gradient(135deg,#060e1f 0%,#0c1f3f 50%,#082218 100%)",
                borderColor: "rgba(14,165,160,0.2)",
              }}
            >
              <h2 className="mb-4 text-2xl font-extrabold text-white">
                Not sure which sector fits your premises?
              </h2>
              <p className="mx-auto mb-7 max-w-xl text-base text-slate-400 leading-relaxed">
                Get in touch and we&apos;ll recommend a proportionate, compliant way forward — with a clear, fixed-fee quote.
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
    </>
  );
}
