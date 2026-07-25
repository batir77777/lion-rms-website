import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import { ASSESSOR, CREDENTIALS } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Lion Risk Management Solutions — specialist fire safety and health & safety consultancy led by Batir Turakulov, CMIOSH, DipFRA, and Level 5 Fire Engineering Design.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    icon: "🎯",
    title: "Competence",
    body: "Assessments grounded in UK legislation, CMIOSH Chartered status, Level 4 DipFRA, and Level 5 Fire Engineering Design — depth of expertise few UK consultancies can match.",
  },
  {
    icon: "⚖️",
    title: "Proportionality",
    body: "Recommendations matched to real risk — never gold-plated, never cutting corners. Clear priorities, plain-English reports.",
  },
  {
    icon: "📋",
    title: "Audit-ready",
    body: "Every assessment feeds into clear, organised records — actions tracked, reviews scheduled, documentation kept audit-ready.",
  },
  {
    icon: "🔗",
    title: "Continuity",
    body: "Fire and health & safety through one consultancy — no gaps, no handoffs, no repeated briefings.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PhotoHero
        eyebrow="About"
        title="Expert fire safety and health & safety consultancy"
        body="Lion Risk Management Solutions provides specialist fire safety and health & safety consultancy — led by Batir Turakulov, CMIOSH. Holding the Level 4 Diploma in Fire Risk Assessment (DipFRA) and Level 5 Diploma in Fire Engineering Design, Batir brings fire engineering expertise that few UK consultancies can match."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">

          {/* Intro text */}
          <Reveal>
            <div className="mb-12 space-y-5 text-lg leading-relaxed text-slate-600">
              <p>
                Lion Risk Management Solutions provides fire safety and health &amp;
                safety consultancy to residential, commercial, and construction clients
                across London. We work with landlords, managing agents, property
                developers, contractors, and businesses of all sizes.
              </p>
              <p>
                Our work is grounded in UK fire safety legislation — including the
                Regulatory Reform (Fire Safety) Order 2005 — and health and safety
                law under the Health and Safety at Work etc. Act 1974. Every
                recommendation is tailored to the specific circumstances of your
                premises and operations.
              </p>
              <p>
                From the initial assessment through to ongoing compliance management,
                we provide a consistent, professional service — with clear priorities,
                plain-English reports, and reliable follow-through.
              </p>
            </div>
          </Reveal>

          {/* Values grid */}
          <div className="grid gap-5 sm:grid-cols-2 mb-14">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 60}>
                <div className="h-full rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition hover:shadow-md hover:border-teal-100">
                  <div className="mb-3 text-2xl">{v.icon}</div>
                  <h3 className="mb-2 text-lg font-bold text-navy-900">{v.title}</h3>
                  <p className="text-base leading-relaxed text-slate-500">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Assessor credentials */}
          <Reveal>
            <div className="mb-12 flex flex-col gap-6 rounded-2xl border border-slate-100 bg-slate-50 p-8 sm:flex-row sm:items-start">
              <div
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white"
                style={{ background: "linear-gradient(135deg,#0c1f3f,#0ea5a0)" }}
              >
                {ASSESSOR.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-lg font-bold text-navy-900">{ASSESSOR.name}</p>
                <p className="mb-3 text-sm font-medium text-teal-600">{ASSESSOR.role}</p>
                <p className="mb-4 text-base leading-relaxed text-slate-500">{ASSESSOR.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {CREDENTIALS.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-navy-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal>
            <div
              className="rounded-2xl border p-10 text-center"
              style={{
                background: "linear-gradient(135deg,#060e1f 0%,#0c1f3f 50%,#082218 100%)",
                borderColor: "rgba(14,165,160,0.2)",
              }}
            >
              <h2 className="mb-4 text-2xl font-extrabold text-white">
                Let&apos;s discuss your compliance requirements
              </h2>
              <p className="mx-auto mb-7 max-w-xl text-base text-slate-400 leading-relaxed">
                Tell us about your premises or project and we&apos;ll recommend a
                proportionate, compliant way forward — with a clear, fixed-fee quote.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#0c1f3f,#0ea5a0)" }}
              >
                Book a Consultation &rarr;
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
