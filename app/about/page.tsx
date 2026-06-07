import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import { IMAGES } from "@/lib/site";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Lion Risk Management Solutions is a London-based fire safety, health & safety, and digital compliance consultancy serving clients across London.",
};

const VALUES = [
  ["Competence", "Assessments and advice grounded in current UK legislation and recognised standards."],
  ["Proportionality", "Recommendations matched to real risk — never gold-plated, never cutting corners."],
  ["Clarity", "Plain-English reports and guidance that duty holders can actually act on."],
  ["Continuity", "One consultancy across fire, health & safety, and digital compliance."],
];

export default function AboutPage() {
  return (
    <>
      <PhotoHero
        image={IMAGES.office}
        eyebrow="About"
        title="About Lion Risk Management Solutions"
        body="A specialist consultancy helping organisations meet their fire and health & safety obligations with practical, proportionate, and reliable support."
      />
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <Reveal>
            <div className="space-y-5 text-base leading-relaxed text-ink-700">
              <p>
                Lion Risk Management Solutions provides fire safety, health &amp;
                safety, and digital compliance consultancy to residential,
                commercial, and construction clients across London. We
                work with landlords, managing agents, property developers,
                contractors, and businesses of all sizes.
              </p>
              <p>
                Our work is grounded in UK fire safety legislation — including the
                Regulatory Reform (Fire Safety) Order 2005 — and health and safety
                law under the Health and Safety at Work etc. Act 1974. Every
                recommendation we make is tailored to the specific circumstances of
                your premises and operations.
              </p>
              <p>
                Alongside traditional consultancy, we design bespoke digital
                compliance systems that help clients centralise records, track
                actions, and maintain audit-ready documentation — built around how
                each business actually operates.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {VALUES.map(([title, body], i) => (
              <Reveal key={title} delay={i * 60}>
                <div className="h-full rounded-2xl border border-ink-100 bg-ink-50 p-6">
                  <h3 className="text-base font-semibold text-ink-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-brand-800 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">
              Let&apos;s discuss your requirements
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-brand-100">
              Tell us about your premises or project and we&apos;ll recommend a
              proportionate, compliant way forward.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition hover:bg-ink-100"
            >
              Request a Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
