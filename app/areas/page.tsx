import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Coverage — London Based, UK Wide",
  description:
    "Lion Risk Management Solutions provides fire risk assessments, fire strategies, health & safety consultancy and compliance management support across London and throughout the UK.",
  alternates: { canonical: "/areas" },
};

const SECTORS = [
  "Residential",
  "Property Management",
  "Commercial Offices",
  "Construction",
  "Education",
  "Retail & Hospitality",
  "Healthcare",
  "Industrial & Warehousing",
];

export default function AreasPage() {
  return (
    <>
      <PhotoHero
        eyebrow="Coverage"
        title="London Based. UK Wide Coverage."
        body="Lion Risk Management Solutions provides fire risk assessments, fire strategies, health & safety consultancy and compliance management support across London and throughout the UK."
      />
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <Reveal>
            <p className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-teal-600">
              Sectors we work with
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SECTORS.map((s, i) => (
              <Reveal key={s} delay={i * 40}>
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
                  <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden>
                    <circle cx="10" cy="10" r="10" fill="rgba(14,165,160,0.12)" />
                    <path d="M6.5 10.3l2.3 2.3 4.7-4.7" stroke="#0ea5a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm font-semibold text-navy-900">{s}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-12 text-center text-sm text-slate-500">
            Wherever you are in the UK,{" "}
            <Link href="/contact" className="font-semibold text-teal-600 hover:underline">get in touch</Link>{" "}
            to discuss your requirements.
          </p>
        </div>
      </section>
    </>
  );
}
