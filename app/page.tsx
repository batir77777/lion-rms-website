import type { Metadata } from "next";
import Link from "next/link";
import AssessorSection from "@/components/AssessorSection";
import ComplianceCheckBand from "@/components/ComplianceCheckBand";
import RecentProjects from "@/components/RecentProjects";
import { CREDENTIALS, TESTIMONIALS, STATS, SECTORS, WHAT_CLIENTS_RECEIVE, PROCESS_STEPS, COVERAGE_SHORT, CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fire Risk Assessment & H&S Consultancy London — Lion RMS",
  description:
    "Expert fire risk assessments and health & safety consultancy across London and the Home Counties. Led by Batir Turakulov, CMIOSH, Level 4 DipFRA, Level 5 Fire Engineering Design. Book a consultation.",
  alternates: { canonical: "/" },
};

const SERVICES_FS = [
  { icon: "🔥", title: "Fire Risk Assessments", desc: "PAS 79-compliant assessments for residential and commercial premises — clear, prioritised, and proportionate." },
  { icon: "📐", title: "Fire Safety Consultancy", desc: "Specialist fire safety advice for new developments, change-of-use, complex buildings, and ongoing compliance support." },
  { icon: "🏗️", title: "Health & Safety Audits", desc: "Risk assessments, audits, RAMS, policies, and competent person support." },
  { icon: "📋", title: "Compliance Management", desc: "Actions tracked, reviews scheduled, documentation audit-ready — one consultancy from assessment to ongoing compliance." },
];

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
                CMIOSH &bull; Level 4 Diploma in Fire Risk Assessment &bull; Level 5 Diploma in Fire Engineering Design &bull; {COVERAGE_SHORT}
              </span>

              <h1 className="mt-6 text-[clamp(2.4rem,5.4vw,4.4rem)] font-extrabold leading-[1.04] tracking-tight text-white">
                Expert Fire Safety &amp;{" "}
                <span style={{ background: "linear-gradient(100deg,#00c9a7 0%,#5be3c0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Health &amp; Safety Consultancy.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "rgba(186,230,253,0.8)" }}>
                From fire risk assessments and fire safety consultancy to health &amp; safety support and compliance management —
                clear, proportionate advice for landlords, managing agents, businesses, and developers across London and the Home Counties.
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
                Led by Batir Turakulov, Fire Engineer &amp; Chartered Health &amp; Safety Professional (CMIOSH), holding a Level 4 Diploma in Fire Risk Assessment and a Level 5 Diploma in Fire Engineering Design.
              </p>
            </div>

            {/* Right — service pillars */}
            <div className="hidden lg:grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(0,201,167,0.08)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#00c9a7" }}>Fire Safety</p>
                <p className="text-white font-semibold text-lg">Fire Risk Assessments &amp; Fire Safety Consultancy</p>
                <p className="mt-2 text-sm" style={{ color: "rgba(186,230,253,0.7)" }}>PAS 79-compliant assessments, fire strategies, door inspections, compartmentation reviews, and training.</p>
                              </div>
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.04)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-200/60">Health &amp; Safety</p>
                <p className="text-white font-semibold text-lg">H&amp;S consultancy &amp; compliance</p>
                <p className="mt-2 text-sm" style={{ color: "rgba(186,230,253,0.7)" }}>Risk assessments, audits, RAMS, policies, and competent person support — practical and proportionate.</p>
                <p className="mt-4 text-sm font-semibold" style={{ color: "rgba(186,230,253,0.6)" }}>Fire Engineer &amp; Chartered Health &amp; Safety Professional (CMIOSH)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE CHECK PROMO ── */}
      <ComplianceCheckBand />

      {/* ── TRUST STATEMENT ── */}
<div className="bg-slate-50 border-b border-slate-100 py-4 text-center">
  <p className="text-sm text-slate-500">
    Trusted by landlords, managing agents, commercial organisations and developers across London and the Home Counties.
  </p>
</div>

{/* ── CREDENTIALS STRIP ── */}
      <div className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="mb-5 text-center text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            Delivered by qualified UK compliance professionals
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {CREDENTIALS.map((c) => (
              <span key={c} className="text-xs font-bold uppercase tracking-widest text-slate-400">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">Our Services</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl">
              Fire Safety &amp; Health and Safety Services
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              Practical, proportionate consultancy — from initial assessment through to ongoing compliance management.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            {SERVICES_FS.map((s) => (
              <div key={s.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
                <span className="text-2xl">{s.icon}</span>
                <h3 className="mt-3 text-sm font-bold text-slate-800">{s.title}</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{s.desc}</p>
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
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">Sectors We Serve</span>
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
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600">
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
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">What Clients Receive</span>
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

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">Our Process</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl">How It Works</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <div key={step.n} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-3xl font-black" style={{ color: "#0a1628", opacity: 0.15 }}>{step.n}</p>
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
          <p className="mb-10 text-center text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            What clients say
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-600 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
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
            Batir Turakulov, CMIOSH &bull; Level 4 DipFRA &bull; Level 5 Fire Engineering Design &bull; Lion Risk Management Solutions
          </p>
        </div>
      </section>

    </div>
  );
}
