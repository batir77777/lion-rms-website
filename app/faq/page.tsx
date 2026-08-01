import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import FaqAccordion from "@/components/FaqAccordion";
import FaqJsonLd from "@/components/FaqJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { FAQS, CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF } from "@/lib/site";
import { DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about fire risk assessments, health & safety compliance, and Lion RMS's compliance management service.",
  alternates: { canonical: "/faq" },
  openGraph: {
    type: "website",
    title: "FAQ",
    description: "Answers to common questions about fire risk assessments, health & safety compliance, and Lion RMS's compliance management service.",
    url: "/faq",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function FaqPage() {
  return (
    <>
      <FaqJsonLd />
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "FAQ" }]} />
      <PhotoHero
        eyebrow="FAQ"
        title="Compliance questions, answered"
        body="Straightforward answers to the questions landlords, managing agents, and businesses ask us most about fire safety, health & safety, and our compliance management service."
      />
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <FaqAccordion items={FAQS} />
          <div
            className="mt-14 rounded-2xl border p-10 text-center"
            style={{ background: "linear-gradient(135deg,#060e1f 0%,#0c1f3f 50%,#082218 100%)", borderColor: "rgba(14,165,160,0.2)" }}
          >
            <h2 className="mb-4 text-2xl font-extrabold text-white">Still have a question?</h2>
            <p className="mx-auto mb-7 max-w-xl text-base text-slate-400 leading-relaxed">
              Tell us about your premises or project and we will point you in the right direction.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#0c1f3f,#0ea5a0)" }}
              >
                {CTA_PRIMARY_LABEL}
              </Link>
              <Link
                href={CTA_SECONDARY_HREF}
                className="inline-flex items-center rounded-full border border-white/20 bg-white/8 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/15"
              >
                {CTA_SECONDARY_LABEL}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
