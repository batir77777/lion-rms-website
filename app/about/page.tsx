import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import PersonJsonLd from "@/components/PersonJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { ASSESSOR, CREDENTIALS, CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF } from "@/lib/site";
import { DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

/*
 * Reordered 1 November 2026 to lead with health & safety, matching the
 * homepage. "Fire risk assessment" stays in the description explicitly —
 * dropping it to make room for the health & safety terms would have cost the
 * strongest commercial phrase on the site for no gain. The canonical, the
 * URL and the title tag's "About" are unchanged.
 *
 * One constant, three consumers: tests/site-quality.test.mjs asserts
 * og:description and twitter:description match, and a single source makes
 * that structurally true rather than a thing to remember.
 */
const ABOUT_DESCRIPTION =
  "Lion Risk Management Solutions — a UK health & safety and fire safety consultancy led by Batir Turakulov, Chartered Health & Safety Professional (CMIOSH) and Fire Engineer (MIFireE). Health & safety consultancy, independent inspections and audits, construction health & safety and CDM advisory support, fire risk assessments and fire strategies.";

export const metadata: Metadata = {
  title: "About",
  description:
    ABOUT_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    title: "About",
    description: ABOUT_DESCRIPTION,
    url: "/about",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "About",
    description: ABOUT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

const VALUES = [
  {
    icon: "🎯",
    title: "Competence",
    // Reordered to match the rest of the page. Same credentials, same
    // wording, health & safety first.
    body: "Health & safety and fire safety work grounded in UK legislation — a Level 6 Diploma in Applied Health and Safety and CMIOSH Chartered status on the health & safety side; a Level 5 Diploma in Fire Engineering Design, a Level 4 Diploma in Fire Risk Assessment and MIFireE membership on the fire side.",
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
      <PersonJsonLd />
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "About" }]} />
      {/*
        The hero body was previously a near-verbatim copy of ASSESSOR.bio,
        which renders again in the credential card a few hundred words below
        on this same page. It is now three sentences that say what the
        practice does; the biography stays where it belongs, next to the
        photograph and the credentials.

        It also carried "every assessment personally undertaken" — the
        absolute that has been replaced site-wide. See the note on
        ASSESSOR.bio in lib/site.ts.
      */}
      <PhotoHero
        eyebrow="About"
        title="Health &amp; safety, construction safety and fire risk assessment"
        body="Lion Risk Management Solutions is a UK health & safety and fire safety consultancy, led by Batir Turakulov. We advise organisations that have to demonstrate compliance rather than assert it — through site inspections, risk assessments, independent audits, CDM 2015 advisory support, fire risk assessments and fire strategies. The work is practical and proportionate: clear priorities, plain-English reports, and recommendations matched to the risk actually present."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">

          {/* Intro text */}
          <Reveal>
            <div className="mb-12 space-y-5 text-lg leading-relaxed text-slate-600">
              {/*
                Reordered 1 November 2026 so health & safety leads, matching
                the homepage. Nothing about fire was deleted: the fire
                engineering and fire risk assessment paragraphs are intact,
                in the same words, and keep their place as the established
                specialism rather than the opening claim. "Fire risk
                assessment", "PAS 79", "fire strategies" and
                "compartmentation strategy" all survive.

                Coverage follows the standing rule in lib/site.ts — London,
                the Home Counties, and the wider UK by arrangement. The old
                wording said "across London", which was narrower than the
                rule and narrower than the truth.
              */}
              <p>
                Lion Risk Management Solutions is a health &amp; safety and fire
                safety consultancy serving commercial, residential, industrial and
                construction clients across London, the Home Counties, and the wider
                UK by arrangement. We work with landlords, managing agents, property
                developers, contractors, manufacturers and businesses of all sizes.
              </p>
              <p>
                Health &amp; safety consultancy is the core of the practice. That
                covers risk assessments, policies and arrangements for workplaces of
                every kind; independent inspections and audits carried out separately
                from the people delivering the work; construction health &amp; safety
                and advisory support on duties under the Construction (Design and
                Management) Regulations 2015; manufacturing and industrial safety,
                including machinery, hazardous substances and safe systems of work;
                incident and near-miss investigation; and practical health &amp;
                safety and fire safety training delivered on your premises.
              </p>
              <p>
                Batir holds a Level 6 Diploma in Applied Health and Safety from NCRQ
                (National Compliance and Risk Qualifications), is a Chartered Member
                of the Institution of Occupational Safety and Health (CMIOSH), a
                Member of the International Institute of Risk and Safety Management
                (MIIRSM), and an Associate Member of the Institute of Environmental
                Management and Assessment (AIEMA).
              </p>
              <p>
                Fire risk assessment is an established discipline of the consultancy
                and represents a substantial part of its work. Assessments are
                undertaken with reference to relevant recognised guidance, including
                PAS 79 where appropriate, and the applicable fire safety legislation
                for the premises and jurisdiction. They are informed by the same
                engineering understanding of how a building is designed to perform in
                fire — which is what allows recommendations to be proportionate,
                addressing the things that genuinely affect life safety rather than
                defaulting to a checklist. Batir holds a Level 4 Diploma in Fire Risk
                Assessment alongside his fire engineering qualifications.
              </p>
              <p>
                Our fire engineering work covers building fire safety in use and at
                design stage — means of escape, passive and active fire protection,
                compartmentation strategy, fire safety compliance, and fire safety
                design review for new build, refurbishment and change-of-use schemes.
                Batir holds a Level 5 Diploma in Fire Engineering Design and is a
                Member of the Institution of Fire Engineers (MIFireE).
              </p>
              <p>
                Our work is grounded in health and safety law under the Health and
                Safety at Work etc. Act 1974 and the regulations made under it, and in
                UK fire safety legislation — including the Regulatory Reform (Fire
                Safety) Order 2005 and the Building Regulations. Every recommendation
                is tailored to the specific circumstances of your premises and
                operations.
              </p>
              <p>
                From pre-construction planning and initial assessment through to
                ongoing compliance management, we provide a consistent, professional
                service — with clear priorities, plain-English reports, and reliable
                follow-through. Suitable international assignments may also be
                considered by arrangement, subject to applicable local requirements
                and the availability of appropriate specialist support.
              </p>
            </div>
          </Reveal>

          {/* Values grid */}
          <div className="grid gap-5 sm:grid-cols-2 mb-14">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 60}>
                <div className="h-full rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition hover:shadow-md hover:border-teal-100">
                  <div className="mb-3 text-2xl">{v.icon}</div>
                  <h2 className="mb-2 text-lg font-bold text-navy-900">{v.title}</h2>
                  <p className="text-base leading-relaxed text-slate-500">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Assessor credentials */}
          <Reveal>
            <div className="mb-12 flex flex-col gap-6 rounded-2xl border border-slate-100 bg-slate-50 p-8 sm:flex-row sm:items-start">
              <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl shadow-md sm:h-40 sm:w-40">
                <Image
                  src={ASSESSOR.photo}
                  alt={`${ASSESSOR.name}, ${ASSESSOR.shortRole} at Lion Risk Management Solutions`}
                  width={320}
                  height={320}
                  className="h-full w-full object-cover"
                  sizes="(min-width: 640px) 160px, 128px"
                  quality={85}
                />
              </div>
              <div>
                <p className="text-lg font-bold text-navy-900">{ASSESSOR.name}</p>
                <p className="mb-3 text-sm font-medium text-teal-700">{ASSESSOR.role}</p>
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
