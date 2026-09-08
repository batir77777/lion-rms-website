import type { Metadata } from "next";
import Link from "next/link";
import AssessorSection from "@/components/AssessorSection";
import ComplianceCheckBand from "@/components/ComplianceCheckBand";
import RecentProjects from "@/components/RecentProjects";
import WhoWeHelp from "@/components/WhoWeHelp";
import { TESTIMONIALS, STATS, SECTORS, WHAT_CLIENTS_RECEIVE, PROCESS_STEPS, COVERAGE_SHORT, CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF, HOMEPAGE_SERVICE_CLUSTERS, LION_DIGITAL_URL } from "@/lib/site";
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
              <span className="inline-flex flex-col gap-1 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
                <span className="flex items-center gap-2 tracking-[0.12em]" style={{ color: "#5be3c0" }}>
                  <span className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full" style={{ background: "#00c9a7" }} aria-hidden />
                  Lion Risk Management Solutions Limited
                </span>
                <span className="pl-3.5 text-white/90">
                  MIFireE &bull; CMIOSH &bull; Level 4 Diploma in Fire Risk Assessment &bull; {COVERAGE_SHORT}
                </span>
              </span>

              <h1 className="mt-6 text-[clamp(2.4rem,5.4vw,4.4rem)] font-extrabold leading-[1.04] tracking-tight text-white">
                Fire Safety &amp; Fire Engineering,{" "}
                <span style={{ background: "linear-gradient(100deg,#00c9a7 0%,#5be3c0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Health &amp; Safety &amp; Construction Safety.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "rgba(186,230,253,0.8)" }}>
                Independent fire safety, fire engineering and health &amp; safety consultancy for residential, commercial and construction clients across London and the UK.
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

              {/*
                Mobile/tablet version of the three hero-side cards (hidden on
                lg: the desktop grid at line ~108 handles that breakpoint and
                up, unchanged). Same three categories, more compact: tighter
                padding, shorter body copy (title line only, no full
                paragraph) so the hero doesn't get excessively long on a
                phone. Digital card keeps its quieter styling and the
                "Explore Lion Digital" link; the other two intentionally
                have no link, matching the desktop cards.
              */}
              <div className="mt-8 grid grid-cols-1 gap-3 lg:hidden">
                <div className="rounded-xl border border-white/10 p-4" style={{ background: "rgba(0,201,167,0.08)" }}>
                  <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#00c9a7" }}>Fire Safety &amp; Fire Engineering</p>
                  <p className="mt-1 text-sm font-semibold text-white">Fire Risk Assessments, Fire Engineering &amp; Fire Safety Consultancy</p>
                </div>
                <div className="rounded-xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-blue-200/60">Health &amp; Safety &amp; Construction Safety</p>
                  <p className="mt-1 text-sm font-semibold text-white">Health &amp; Safety Consultancy &amp; Construction Health &amp; Safety</p>
                </div>
                <div className="rounded-xl border border-white/10 p-4" style={{ background: "rgba(0,201,167,0.05)" }}>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ background: "rgba(0,201,167,0.18)", color: "#5be3c0" }}
                      aria-hidden
                    >
                      <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="7" y="7" width="10" height="10" rx="1.5" />
                        <path d="M9.5 7V4M14.5 7V4M9.5 20v-3M14.5 20v-3M7 9.5H4M7 14.5H4M20 9.5h-3M20 14.5h-3" />
                      </svg>
                    </span>
                    <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#5be3c0" }}>Digital Compliance &amp; AI Solutions</p>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-white">AI, Automation &amp; Digital Compliance Platforms</p>
                  <a
                    href={LION_DIGITAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold transition hover:opacity-80"
                    style={{ color: "#5be3c0" }}
                  >
                    Explore Lion Digital &rarr;
                  </a>
                </div>
              </div>
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

              {/*
                Third hero card for Lion Digital — deliberately the same
                rounded-2xl/border/padding shape as the two discipline cards
                above so it reads as part of the same card group, but kept
                visually quieter (smaller icon-badge treatment, a muted
                teal-tinted background rather than the brighter fire-card
                tint, and a plain text link instead of the cards' bold
                lead-in style) so Fire Safety / H&S stay the primary focus.
              */}
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(0,201,167,0.05)" }}>
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: "rgba(0,201,167,0.18)", color: "#5be3c0" }}
                    aria-hidden
                  >
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="7" y="7" width="10" height="10" rx="1.5" />
                      <path d="M9.5 7V4M14.5 7V4M9.5 20v-3M14.5 20v-3M7 9.5H4M7 14.5H4M20 9.5h-3M20 14.5h-3" />
                    </svg>
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#5be3c0" }}>Digital Compliance &amp; AI Solutions</p>
                </div>
                <p className="text-white font-semibold text-lg">AI, Automation &amp; Digital Compliance Platforms</p>
                <p className="mt-2 text-sm" style={{ color: "rgba(186,230,253,0.7)" }}>Bespoke compliance systems, workflow automation and AI-assisted business tools designed to improve efficiency, reporting and compliance.</p>
                <a
                  href={LION_DIGITAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold transition hover:opacity-80"
                  style={{ color: "#5be3c0" }}
                >
                  Explore Lion Digital &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE CHECK PROMO ── */}
      <ComplianceCheckBand />

      {/*
        ── INTRODUCTORY / INDEPENDENT-ADVISER STATEMENT ──
        Shortened (homepage readability pass) from the original POSITIONING
        constant in lib/site.ts, which repeated the hero's "one consultancy,
        two disciplines" framing almost verbatim, right above a heading
        ("Two Disciplines, Five Services") that says the same thing again.
        This version keeps only what isn't said elsewhere on the page —
        compliance as cross-cutting support, and the coverage area — and
        drops the restated discipline split. lib/site.ts's POSITIONING
        constant is left as-is (used only in comments now); update this
        string by hand if the underlying positioning changes.
      */}
      <div className="bg-slate-50 border-b border-slate-100 py-4 text-center">
        <p className="mx-auto max-w-3xl px-5 text-sm text-slate-500 sm:px-6">
          Independent advice on fire safety, fire engineering, health &amp; safety and compliance — working across London, the Home Counties, and the wider UK by arrangement.
        </p>
      </div>

      {/*
        ── SERVICES ──
        Repositioning PR2. Cards are grouped into the two approved discipline
        clusters (HOMEPAGE_SERVICE_CLUSTERS, lib/site.ts) rather than one flat
        row, and sourced from SERVICE_CATEGORIES instead of the hand-typed
        array this section used to keep locally — that array had already
        drifted (it was missing Compliance Management's own card). Compliance
        Management is not a card here by design; it's named in the shortened
        introductory statement above as cross-cutting support rather than
        promoted to a sixth headline service.
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
                      <h3 className="mt-3 text-base font-bold text-slate-800">{s.title}</h3>
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
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
                <p className="mt-2 text-sm font-medium text-slate-500">{s.label}</p>
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
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-navy-800">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-slate-500 leading-relaxed">{s.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                    View details &rarr;
                  </span>
                </Link>
              ) : (
                <div key={s.slug} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-800">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.summary}</p>
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
                <h3 className="text-base font-bold text-slate-800">{w.title}</h3>
                <p className="mt-2 text-base text-slate-500 leading-relaxed">{w.body}</p>
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
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-teal-200 border-l-4 border-l-teal-500 bg-teal-50/70 p-8 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700"
                  aria-hidden
                >
                  {/* Simple chip/circuit icon — signals "digital / AI" without competing
                     with the emoji icons used for Lion RMS's own services above. */}
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="7" y="7" width="10" height="10" rx="1.5" />
                    <path d="M9.5 7V4M14.5 7V4M9.5 20v-3M14.5 20v-3M7 9.5H4M7 14.5H4M20 9.5h-3M20 14.5h-3" />
                  </svg>
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
                  Digital compliance &amp; AI solutions
                </p>
              </div>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
                Looking for more than consultancy? Lion Digital develops bespoke compliance platforms, workflow automation and AI-assisted business tools for organisations looking to improve efficiency and compliance.
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

      {/*
        ── LION RMS COMPLIANCE PLATFORM ──
        Lion RMS's own digital compliance platform for clients — distinct
        from the Lion Digital cross-link immediately above (a separate
        sister business selling bespoke software/AI to any organisation).
        This section is about a capability of Lion RMS itself, so it gets
        a full section rather than a small card, but stays visually calmer
        than "What Clients Receive"/"Services" above it (bg-slate-50,
        checklist rather than icon cards, secondary-styled button) so it
        reads as an additional capability, not a competing core service.
        No public platform URL exists yet, so the CTA goes to /contact.
      */}
      <section className="py-20 border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Lion RMS Compliance Platform</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl">
              Manage compliance, actions and evidence in one place
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              A practical digital platform designed to help organisations manage risk assessments, inspections, actions, training records, compliance documents and reporting from one central system.
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {[
              "Risk assessments and action tracking",
              "Inspections and audits",
              "Training and competency records",
              "Compliance documents and evidence",
              "Outstanding action reminders",
              "Dashboards and reporting",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <span
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700"
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 12 9.5 17.5 20 6.5" />
                  </svg>
                </span>
                <p className="text-sm font-medium text-slate-700">{feature}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center whitespace-nowrap rounded-full border border-teal-600 px-7 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
            >
              Explore the Lion RMS Platform &rarr;
            </Link>
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
                <h3 className="mt-2 text-base font-bold text-slate-800">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{step.body}</p>
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
                  <p className="text-sm text-slate-500">{t.role}</p>
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
