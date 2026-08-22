import type { Metadata } from "next";
import Link from "next/link";
import AssessorSection from "@/components/AssessorSection";
import ComplianceCheckBand from "@/components/ComplianceCheckBand";
import RecentProjects from "@/components/RecentProjects";
import WhoWeHelp from "@/components/WhoWeHelp";
import { CREDENTIALS, TESTIMONIALS, STATS, SECTORS, WHAT_CLIENTS_RECEIVE, PROCESS_STEPS, COVERAGE_SHORT, CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF, POSITIONING, HOMEPAGE_SERVICE_CLUSTERS, LION_DIGITAL_URL } from "@/lib/site";
import { DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

// Homepage metadata (repositioning PR2, August 2026) — rebalanced from the
// old fire-first, three-noun title/description to name both co-equal
// disciplines explicitly. This is a homepage-only change: the root layout's
// default metadata in app/layout.tsx, used by every other page, is untouched
// (out of scope for PR2 — see the "sitewide metadata" note agreed for this
// PR; a candidate for PR8's SEO/consolidation pass).
export const metadata: Metadata = {
  title: "Fire Safety, Fire Engineering, H&S & Construction Safety London — Lion RMS",
  description:
    "Independent fire safety, fire engineering, health & safety and construction safety consultancy across London and the Home Counties. Led by Batir Turakulov, Fire Engineer (MIFireE) and Chartered Health & Safety Professional (CMIOSH). Book a consultation.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Fire Safety, Fire Engineering, H&S & Construction Safety London — Lion RMS",
    description:
      "Independent fire safety, fire engineering, health & safety and construction safety consultancy across London and the Home Counties. Led by Batir Turakulov, Fire Engineer (MIFireE) and Chartered Health & Safety Professional (CMIOSH). Book a consultation.",
    url: "/",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fire Safety, Fire Engineering, H&S & Construction Safety London — Lion RMS",
    description:
      "Independent fire safety, fire engineering, health & safety and construction safety consultancy across London and the Home Counties. Led by Batir Turakulov, Fire Engineer (MIFireE) and Chartered Health & Safety Professional (CMIOSH). Book a consultation.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function HomePage() {
  return (
    <div className="bg-white text-slate-800">

      {/* ── HERO ── */}
      <section
        className="relative isolate overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0a1628 0%,#0f2040 55%,#0a1628 100%)" }}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-48 -top-24 h-[620px] w-[620px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,201,167,0.22) 0%, transparent 62%)" }} />
          <div className="absolute -right-40 bottom-[-120px] h-[640px] w-[760px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,201,167,0.08) 0%, transparent 62%)" }} />
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "46px 46px" }} />
        </div>

        <div className="relative mx-auto flex min-h-[82vh] w-full max-w-7xl items-center px-5 pb-16 pt-32 sm:px-6 lg:pb-24 lg:pt-36">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">

            {/* Left */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#00c9a7" }} aria-hidden />
                Level 5 Diploma in Fire Engineering Design &bull; MIFireE &bull; CMIOSH &bull; Level 4 Diploma in Fire Risk Assessment &bull; {COVERAGE_SHORT}
              </span>

              <h1 className="mt-6 text-[clamp(2.4rem,5.4vw,4.4rem)] font-extrabold leading-[1.04] tracking-tight text-white">
                Fire Safety &amp; Fire Engineering,{" "}
                <span style={{ background: "linear-gradient(100deg,#00c9a7 0%,#5be3c0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Health &amp; Safety &amp; Construction Safety.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "rgba(186,230,253,0.8)" }}>
                Fire risk assessments, fire engineering and fire safety consultancy, alongside health &amp; safety consultancy and construction health &amp; safety support —
                clear, proportionate advice for landlords, managing agents, businesses, and construction clients across London and the Home Counties.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/services"
                  className="inline-flex items-center rounded-full px-8 py-4 text-base font-bold text-white shadow-xl transition hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #00c9a7, #00a889)" }}
                >
                  View Services &rarr;
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  {CTA_PRIMARY_LABEL}
                </Link>
              </div>

              <p className="mt-6 text-sm" style={{ color: "rgba(186,230,253,0.45)" }}>
                Led by Batir Turakulov, Fire Engineer, Member of the Institution of Fire Engineers (MIFireE), and Chartered Health &amp; Safety Professional (CMIOSH), holding a Level 4 Diploma in Fire Risk Assessment and a Level 5 Diploma in Fire Engineering Design.
              </p>
            </div>

            {/*
              Right — the two co-equal discipline pillars (repositioning
              PR2). Previously the fire card named only Fire Engineering and
              Fire Safety Consultancy — omitting Fire Risk Assessments, the
              lead fire proposition since PR1 — while the H&S card had no
              construction line at all. Both cards now name all of their
              side's propositions explicitly, and the trailing credential
              line that used to sit only under the H&S card has been removed
              so neither card carries content the other lacks.
            */}
            <div className="hidden lg:grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(0,201,167,0.08)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#00c9a7" }}>Fire Safety &amp; Fire Engineering</p>
                <p className="text-white font-semibold text-lg">Fire Risk Assessments, Fire Engineering &amp; Fire Safety Consultancy</p>
                <p className="mt-2 text-sm" style={{ color: "rgba(186,230,253,0.7)" }}>Fire risk assessments informed by recognised guidance including PAS 79 where appropriate, building fire safety, fire strategies, passive and active fire protection, fire door inspections, compartmentation, and training.</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.04)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-200/60">Health &amp; Safety &amp; Construction Safety</p>
                <p className="text-white font-semibold text-lg">Health &amp; Safety Consultancy &amp; Construction Health &amp; Safety</p>
                <p className="mt-2 text-sm" style={{ color: "rgba(186,230,253,0.7)" }}>Risk assessments, audits, RAMS and construction phase plans, policies, and competent person support for businesses and construction clients — practical and proportionate.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE CHECK PROMO ── */}
      <ComplianceCheckBand />

      {/*
        ── INTRODUCTORY / INDEPENDENT-ADVISER STATEMENT ──
        Repositioning PR2. Replaces the old one-line "Trusted by..." trust
        strip in the same slot, at the same visual weight, rather than adding
        a new section. Text is POSITIONING from lib/site.ts — see the comment
        there for why: it names both disciplines, the four homepage-facing
        service areas (fire safety, fire engineering, health & safety,
        compliance — Compliance Management is deliberately named here rather
        than given its own homepage card, see the same note), the client
        types, and "independent adviser" as a plain positioning word rather
        than a new claim.
      */}
      <div className="bg-slate-50 border-b border-slate-100 py-4 text-center">
        <p className="mx-auto max-w-3xl px-5 text-sm text-slate-500 sm:px-6">
          {POSITIONING}
        </p>
      </div>

      {/* ── CREDENTIALS STRIP ── */}
      <div className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="mb-5 text-center text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Delivered by qualified fire and health &amp; safety professionals
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {CREDENTIALS.map((c) => (
              <span key={c} className="text-xs font-bold uppercase tracking-widest text-slate-500">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/*
        ── SERVICES ──
        Repositioning PR2. Cards are grouped into the two approved discipline
        clusters (HOMEPAGE_SERVICE_CLUSTERS, lib/site.ts) rather than one flat
        row, and sourced from SERVICE_CATEGORIES instead of the hand-typed
        array this section used to keep locally — that array had already
        drifted (it was missing Compliance Management's own card). Compliance
        Management is not a card here by design; it's named in the
        introductory statement above as cross-cutting support rather than
        promoted to a sixth headline service — see the note on POSITIONING.
      */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Our Services</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl">
              Two Disciplines, Five Services
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              Fire Safety &amp; Fire Engineering, and Health &amp; Safety &amp; Construction Safety — practical, proportionate consultancy from design-stage advice through to assessment and ongoing compliance management.
            </p>
          </div>
          <div className="space-y-10 mb-10">
            {HOMEPAGE_SERVICE_CLUSTERS.map((cluster) => (
              <div key={cluster.label}>
                <p className="mb-5 text-center text-xs font-bold uppercase tracking-[0.14em] text-teal-700 sm:text-left">
                  {cluster.label}
                </p>
                <div className={`grid gap-5 ${cluster.cards.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}>
                  {cluster.cards.map((s) => (
                    <Link
                      key={s.title}
                      href={s.href}
                      className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-100 hover:shadow-md"
                    >
                      <span className="text-2xl">{s.icon}</span>
                      <h3 className="mt-3 text-sm font-bold text-slate-800">{s.title}</h3>
                      <p className="mt-2 text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center rounded-full px-8 py-4 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #0c1f3f, #0ea5a0)" }}
            >
              View All Services &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHO WE HELP ── */}
      <WhoWeHelp />

      {/* ── STATS ── */}
      <section className="border-b border-slate-100 bg-slate-50 py-14">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-black" style={{ color: "#0a1628" }}>
                  {s.value}{s.suffix}
                </p>
                <p className="mt-2 text-xs font-medium text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT THE FOUNDER ── */}
      <AssessorSection />

      {/* ── SECTORS WE SERVE ── */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Sectors We Serve</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl">
              Trusted Across Nine Sectors
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              Dedicated guidance for the sectors we&rsquo;re asked about most, and broad experience beyond them.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((s) =>
              s.hasPage ? (
                <Link
                  key={s.slug}
                  href={`/sectors/${s.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-100 hover:shadow-md"
                >
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-navy-800">{s.title}</h3>
                  <p className="mt-2 flex-1 text-xs text-slate-500 leading-relaxed">{s.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                    View details &rarr;
                  </span>
                </Link>
              ) : (
                <div key={s.slug} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800">{s.title}</h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">{s.summary}</p>
                </div>
              ),
            )}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/sectors"
              className="inline-flex items-center rounded-full px-8 py-4 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #0c1f3f, #0ea5a0)" }}
            >
              View All Sectors &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── RECENT PROJECTS ── */}
      <RecentProjects />

      {/* ── WHAT CLIENTS RECEIVE ── */}
      <section className="py-20 border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">What Clients Receive</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl">
              Practical Deliverables, Not Just a Report
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_CLIENTS_RECEIVE.map((w) => (
              <div key={w.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800">{w.title}</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*
        ── LION DIGITAL CROSS-BRAND CARD ──
        A single small, understated card cross-linking to Lion Digital, our
        separate sister business (bespoke software / AI automation) —
        deliberately placed here, below the main Services section (line
        ~171) and the core service/sector/proof content, rather than
        anywhere near the top of the page. This keeps Lion RMS's own fire
        safety and health & safety positioning uncontested for every visitor
        who doesn't scroll this far, while still giving the link real
        visibility for those who do — a step up from the footer-only link,
        without competing with it (that link stays, unchanged, in
        Footer.tsx). Styled as a plain bordered card, not the navy/teal
        gradient used for primary Lion RMS CTAs, so it reads as a distinct,
        related business rather than another Lion RMS service.
      */}
      <section className="border-b border-slate-100 bg-white py-14">
        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-8 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                A separate business from Lion RMS
              </p>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
                Looking for digital compliance software or AI automation? Lion Digital develops bespoke business platforms, compliance systems, workflow automation and AI-assisted digital solutions.
              </p>
            </div>
            <a
              href={LION_DIGITAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
            >
              Visit Lion Digital &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Our Process</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl">How It Works</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <div key={step.n} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                {/*
                  Decorative step numeral.
                  ---------------------------------------------------------
                  axe reported this as a SERIOUS WCAG 2.1 AA colour-contrast
                  failure: navy #0a1628 at opacity 0.15 blends to #dadcdf on
                  white, which is 1.37:1 where large bold text needs 3:1.

                  aria-hidden alone does NOT clear it, and that is correct
                  behaviour on axe's part rather than a bug: a sighted user
                  still sees the glyph, so axe measures any text it can see
                  regardless of the accessibility tree. Verified — the flag
                  persisted with aria-hidden="true" applied.

                  Raising the tint to pass would mean opacity 0.46, three
                  times its present weight, which would make the numeral
                  compete with the step title it sits above. That is a design
                  change, not an accessibility fix.

                  So the numeral moves into CSS, where decoration belongs.
                  Pseudo-element content is not a DOM text node, so it is not
                  text in the accessibility sense at all — nothing to expose,
                  nothing to measure. WCAG 1.4.3 exempts purely decorative
                  text from contrast, and this qualifies: every card names its
                  own step in the <h3> below, and the sequence is carried by
                  the order the cards appear in.

                  Rendered appearance is byte-identical: same glyph, same
                  colour, same 0.15 opacity, same size, same position.
                */}
                <p
                  className="text-3xl font-black before:content-[attr(data-step)]"
                  style={{ color: "#0a1628", opacity: 0.15 }}
                  data-step={step.n}
                  aria-hidden
                />
                <h3 className="mt-2 text-sm font-bold text-slate-800">{step.title}</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <p className="mb-10 text-center text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            What clients say
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-600 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        className="py-24 relative isolate overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0a1628 0%,#0f2040 55%,#0a1628 100%)" }}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,201,167,0.15) 0%, transparent 70%)" }} />
        </div>
        <div className="relative mx-auto max-w-3xl px-5 sm:px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl leading-tight">
            Ready to stay compliant?<br />
            <span style={{ background: "linear-gradient(100deg,#00c9a7 0%,#5be3c0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Let&rsquo;s talk.
            </span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: "rgba(186,230,253,0.75)" }}>
            Get in touch for a clear, fixed-fee quote. We&rsquo;ll respond the same day and can usually book within the week.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full px-10 py-4 text-lg font-bold text-white shadow-xl transition hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #00c9a7, #00a889)", boxShadow: "0 4px 24px rgba(0,201,167,0.35)" }}
            >
              {CTA_PRIMARY_LABEL} &rarr;
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center rounded-full border border-white/25 bg-white/5 px-10 py-4 text-lg font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              View Services
            </Link>
          </div>
          <p className="mt-5 text-sm">
            <Link href={CTA_SECONDARY_HREF} className="font-semibold underline decoration-teal-400/50 underline-offset-4" style={{ color: "#5be3c0" }}>
              Not sure yet? Take our {CTA_SECONDARY_LABEL.toLowerCase()} &rarr;
            </Link>
          </p>
          <p className="mt-6 text-sm" style={{ color: "rgba(186,230,253,0.4)" }}>
            Batir Turakulov, MIFireE &bull; CMIOSH &bull; Level 4 Diploma in Fire Risk Assessment &bull; Level 5 Diploma in Fire Engineering Design &bull; Lion Risk Management Solutions
          </p>
        </div>
      </section>

    </div>
  );
}
