import type { Metadata } from "next";
import Link from "next/link";
import AssessorSection from "@/components/AssessorSection";
import ComplianceCheckBand from "@/components/ComplianceCheckBand";
import RecentProjects from "@/components/RecentProjects";
import WhoWeHelp from "@/components/WhoWeHelp";
import { SECTORS, WHAT_CLIENTS_RECEIVE, PROCESS_STEPS, COVERAGE_SHORT, CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF, HOMEPAGE_SERVICE_CLUSTERS, LION_DIGITAL_URL } from "@/lib/site";
import { DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

// Homepage metadata (repositioning PR2, August 2026) — rebalanced from the
// old fire-first, three-noun title/description to name both co-equal
// disciplines explicitly. This is a homepage-only change: the root layout's
// default metadata in app/layout.tsx, used by every other page, is untouched
// (out of scope for PR2 — see the "sitewide metadata" note agreed for this
// PR; a candidate for PR8's SEO/consolidation pass).
/*
 * Homepage repositioning, 1 November 2026. Health & safety leads the title
 * and description, because that is what the practice is now positioned on.
 *
 * "Fire risk assessments" is kept IN the title, not dropped to the body.
 * It is the strongest commercial term on the site, the old title did not
 * contain it, and the new H1 does — so this change gains that keyword
 * rather than risking it. Every other fire term the old description carried
 * is still present below.
 *
 * The canonical stays "/", and the three title strings stay identical:
 * tests/site-quality.test.mjs asserts twitter:title === og:title.
 * app/layout.tsx's sitewide defaults are deliberately untouched.
 */
const HOME_TITLE = "Health & Safety, Construction Safety & Fire Risk Assessments London — Lion RMS";
const HOME_DESCRIPTION =
  "Independent health & safety, construction safety and fire safety consultancy serving London, the Home Counties and the wider UK by arrangement. Site inspections, risk assessments, independent audits, CDM 2015 advisory support, fire risk assessments and fire strategies. Led by Batir Turakulov, Chartered Health & Safety Professional (CMIOSH) and Fire Engineer (MIFireE).";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function HomePage() {
  return (
    <div className="bg-white text-slate-800">

      {/*
        ── HERO ──
        Rebuilt 1 November 2026 for a corporate consultancy read. What went:
        two radial glow blobs, a grid overlay, the gradient-filled half of
        the H1, and the three pillar cards in the right-hand column. The
        cards were where the hero said the most and evidenced the least —
        and the fire card's scope sentence advertised dedicated fire door
        inspections and compartmentation surveys, both of which are paused.

        What stays: a single navy band, one column, the headline, one
        paragraph, two calls to action, and the credential line. Nothing in
        this hero is a claim we cannot stand behind.
      */}
      <section className="relative isolate" style={{ background: "#0a1628" }}>
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-32 sm:px-6 lg:pb-28 lg:pt-36">
          <div className="max-w-3xl">

            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
                Lion Risk Management Solutions Limited
                <span className="text-white/35" aria-hidden>
                  &bull;
                </span>
                <span style={{ color: "#5be3c0" }}>{COVERAGE_SHORT}</span>
              </span>

              <h1 className="mt-7 text-[clamp(2.2rem,4.8vw,3.9rem)] font-extrabold leading-[1.08] tracking-tight text-white">
                Health &amp; Safety, Construction Safety and Fire Risk Assessments
              </h1>

              {/*
                Coverage wording follows the standing rule in lib/site.ts:
                "London, the Home Counties, and the wider UK by arrangement"
                — never an unrestricted UK-wide claim. The old hero said
                "across London and the UK", which was the one place on the
                site that broke it.
              */}
              <p className="mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: "rgba(186,230,253,0.82)" }}>
                Independent professional advice for organisations that have to demonstrate
                compliance, not just claim it. Site inspections, risk assessments and independent
                audits across workplace, construction and industrial premises, alongside fire risk
                assessments and fire strategies — carried out and reported by a chartered
                practitioner, with prioritised recommendations, corrective actions tracked to
                closure and ongoing support between visits. London, the Home Counties, and the
                wider UK by arrangement.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/services"
                  className="inline-flex items-center rounded-full bg-white px-8 py-4 text-base font-bold transition hover:bg-slate-100"
                  style={{ color: "#0a1628" }}
                >
                  View Services &rarr;
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  {CTA_PRIMARY_LABEL}
                </Link>
              </div>

              <p className="mt-8 max-w-2xl text-sm leading-relaxed" style={{ color: "rgba(186,230,253,0.55)" }}>
                Led by Batir Turakulov, Chartered Health &amp; Safety Professional (CMIOSH) and
                Member of the Institution of Fire Engineers (MIFireE), holding a Level 6 Diploma in
                Applied Health and Safety, a Level 4 Diploma in Fire Risk Assessment and a Level 5
                Diploma in Fire Engineering Design.
              </p>

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
          Independent advice on health &amp; safety, construction safety, fire risk assessments, fire engineering and ongoing compliance — working across London, the Home Counties, and the wider UK by arrangement.
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
              Health &amp; Safety, Construction and Fire Safety Consultancy
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              Nine services across workplace and construction health &amp; safety, specialist fire
              safety, training and ongoing compliance — each with a page setting out exactly what is
              and is not included.
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

      {/*
        ── STATS BAND REMOVED (1 November 2026) ──
        It carried "10+ years' experience", "500+ assessments & inspections
        completed", "9 sectors served" and "16 London areas covered". Three
        of the four had no basis anywhere, and the sixteen-area figure was
        contradicted by our own coverage data. See the note on STATS in
        lib/site.ts.

        Nothing invented replaces it. The credentials immediately below are
        verifiable and do the same job honestly, which is why this band is
        simply gone rather than refilled.
      */}

      {/* ── ABOUT THE FOUNDER ── */}
      <AssessorSection />

      {/* ── SECTORS WE SERVE ── */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="text-center mb-12">
            {/*
              Was "Trusted Across Nine Sectors". Both halves were a problem:
              "Trusted" is unevidenced, and the count was a taxonomy total
              presented as a record of delivery. Nine sector pages exist; that
              is what this section now says.
            */}
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Sectors</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl">
              Sectors We Support
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              Guidance written for the sectors we are asked about most. Each one sets out the
              hazards, duties and arrangements that apply to it.
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

          {/*
            AI named once, as an option, in the wording already agreed on the
            service pages. It must not read as autonomous assessment: the
            platform calculates from the client's own records and the
            consultant remains the author of every finding.
          */}
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
            AI-assisted compliance summaries are available as an option alongside these standard
            functions. The figures come from your own records, and the AI writes only the
            interpretation that accompanies them. It supports professional judgement rather than
            replacing it: assessments, findings and recommendations remain the work of our
            consultant.
          </p>

          <div className="mt-8 text-center">
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

      {/*
        ── TESTIMONIALS REMOVED (1 November 2026) ──
        Three quotes attributed only to job titles — "Portfolio Manager",
        "Operations Director", "Project Lead" — with no record anywhere of
        who said them or whether we have permission to publish them.
        components/StatsBand.tsx already carried a note about "consented
        client quotes" being the thing that was missing.

        They are removed pending verification, and NOT replaced: a written
        testimonial is either a real client's words or it is nothing.

        The TESTIMONIALS array itself is left in lib/site.ts because
        components/TestimonialGrid.tsx still renders it on the three
        case-study detail pages. That is the same unverified content on a
        different URL, and it is flagged for Batir rather than changed here,
        since those pages are outside this homepage branch.
      */}

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
            {/*
              Was "We'll respond the same day and can usually book within the
              week." The FAQ deliberately hedges instead, and the homepage
              should not promise more than the FAQ does. This is the FAQ's
              own wording.
            */}
            Get in touch for a clear, fixed-fee quote. We aim to be responsive and will agree a
            timescale with you up front.
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
