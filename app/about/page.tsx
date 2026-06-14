import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import { IMAGES } from "@/lib/site";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Lion Risk Management Solutions is a London-based fire safety, health & safety, and digital compliance platform serving clients across London.",
};

const VALUES = [
  ["Competence", "Assessments and advice grounded in current UK legislation and recognised standards."],
  ["Proportionality", "Recommendations matched to real risk — never gold-plated, never cutting corners."],
  ["Clarity", "Plain-English reports and digital tools that duty holders can actually act on."],
  ["Continuity", "One platform across fire, health & safety, and digital compliance — no gaps, no handoffs."],
];

export default function AboutPage() {
  return (
    <>
      <PhotoHero
        image={IMAGES.office}
        eyebrow="About"
        title="Purpose-built for fire & safety compliance"
        body="Lion Risk Management Solutions combines specialist consultancy expertise with a digital compliance platform — giving you professional assessments and the tools to manage them ongoing."
      />
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <Reveal>
            <div className="space-y-5 text-base leading-relaxed text-slate-600">
              <p>
                Lion Risk Management Solutions provides fire safety, health &amp;
                safety, and digital compliance services to residential,
                commercial, and construction clients across London. We
                work with landlords, managing agents, property developers,
                contractors, and businesses of all sizes.
              </p>
              <p>
                Our work is grounded in UK fire safety legislation — including the
                Regulatory Reform (Fire Safety) Order 2005 — and health and safety
                law under the Health and Safety at Work etc. Act 1974. Every
                recommendation is tailored to the specific circumstances of
                your premises and operations.
              </p>
              <p>
                Alongside our consultancy work, our MyWebSuite digital compliance
                platform helps clients centralise records, track remedial actions,
                and maintain audit-ready documentation — built around how each
                business actually operates.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {VALUES.map(([title, body], i) => (
              <Reveal key={title} delay={i * 60}>
                <div className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 rounded-2xl p-8 text-center" style={{ background: "#0f172a" }}>
            <h2 className="text-2xl font-bold text-white">
              Let&apos;s discuss your requirements
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
              Tell us about your premises or project and we&apos;ll recommend a
              proportionate, compliant way forward.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #0ea5a0, #10b981)" }}
            >
              Request a Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
