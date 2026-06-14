import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import FaqAccordion from "@/components/FaqAccordion";
import FaqJsonLd from "@/components/FaqJsonLd";
import { FAQS, IMAGES } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about fire risk assessments, fire strategies, and health & safety compliance in London.",
};

export default function FaqPage() {
  return (
    <>
      <FaqJsonLd />
      <PhotoHero
        image={IMAGES.office}
        eyebrow="FAQ"
        title="Fire safety questions, answered"
        body="Straightforward answers to the questions landlords, managing agents, and businesses ask us most."
      />
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <FaqAccordion items={FAQS} />
          <div className="mt-10 rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg,#060e1f 0%,#0c1f3f 50%,#082218 100%)" }}>
            <h2 className="text-2xl font-bold text-white">Still have a question?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
              Tell us about your premises or project and we&apos;ll point you in the right direction.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #0ea5a0, #10b981)" }}
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
