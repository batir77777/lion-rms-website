import type { Metadata } from "next";
import Link from "next/link";
import { CREDENTIALS, TESTIMONIALS, STATS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Business AI Automation & Fire Safety Consultancy — Lion RMS",
  description:
    "Lion RMS automates business workflows using AI and delivers expert fire risk assessments and health & safety consultancy across London and the UK. Led by Batir Turakulov, CMIOSH.",
};

const SERVICES_AI = [
  { icon: "📄", title: "Document Automation", desc: "Reports, letters, risk assessments generated from templates in seconds." },
  { icon: "📊", title: "Report Generation", desc: "Scheduled reports built and emailed automatically — no manual effort." },
  { icon: "🗂️", title: "CRM & Data Entry", desc: "New enquiries and client records sync automatically across your tools." },
  { icon: "✅", title: "Compliance Checklists", desc: "Digital checklists that populate, track, and chase outstanding items." },
  { icon: "📧", title: "Email Management", desc: "Triage inboxes, draft replies, schedule follow-ups — AI handles the admin." },
  { icon: "🤝", title: "Client Onboarding", desc: "Welcome sequences and document requests triggered automatically." },
];

const SERVICES_FS = [
  { title: "Fire Risk Assessments", desc: "PAS 79-compliant assessments for residential and commercial premises." },
  { title: "Fire Strategies", desc: "Bespoke fire strategies for new developments and complex buildings." },
  { title: "Health & Safety Audits", desc: "Risk assessments, audits, RAMS, policies, and competent person support." },
  { title: "Digital Compliance", desc: "Live compliance dashboards — reports, actions, and audit trails in one place." },
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
                CMIOSH Chartered · DipFRA · London &amp; UK-wide
              </span>

              <h1 className="mt-6 text-[clamp(2.4rem,5.4vw,4.4rem)] font-extrabold leading-[1.04] tracking-tight text-white">
                Automate Your Business.{" "}
                <span style={{ background: "linear-gradient(100deg,#00c9a7 0%,#5be3c0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Stay Compliant. Grow Faster.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "rgba(186,230,253,0.8)" }}>
                Lion RMS combines <strong className="text-white">business AI automation</strong> with expert
                fire safety and health &amp; safety consultancy — helping businesses eliminate repetitive
                work and stay fully compliant across the UK.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/ai-automation"
                  className="inline-flex items-center rounded-full px-8 py-4 text-base font-bold text-white shadow-xl transition hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #00c9a7, #00a889)" }}
                >
                  ⚡ Explore AI Automation →
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  Book a Free Call
                </Link>
              </div>

              <p className="mt-6 text-sm" style={{ color: "rgba(186,230,253,0.45)" }}>
                Led by Batir Turakulov, CMIOSH DipFRA · proportionate advice, no gold-plating.
              </p>
            </div>

            {/* Right — two service pillars */}
            <div className="hidden lg:grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(0,201,167,0.08)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#00c9a7" }}>⚡ AI Automation</p>
                <p className="text-white font-semibold text-lg">Eliminate repetitive admin</p>
                <p className="mt-2 text-sm" style={{ color: "rgba(186,230,253,0.7)" }}>Document generation, CRM sync, report automation, compliance checklists — built around your workflow.</p>
                <p className="mt-4 text-2xl font-black text-white">85% <span className="text-base font-normal" style={{ color: "rgba(186,230,253,0.6)" }}>less time on reports</span></p>
              </div>
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.04)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-200/60">🔥 Fire &amp; H&amp;S</p>
                <p className="text-white font-semibold text-lg">Expert compliance consultancy</p>
                <p className="mt-2 text-sm" style={{ color: "rgba(186,230,253,0.7)" }}>Fire risk assessments, fire strategies, H&amp;S audits, and live digital compliance dashboards.</p>
                <p className="mt-4 text-lg font-bold text-white">From <span style={{ color: "#00c9a7" }}>£250 + VAT</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* ── BEFORE / AFTER ── */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">AI Automation</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl">
              Stop Doing Work a Computer Could Do
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              Most businesses waste 10–25% of their week on manual admin. We automate it — built around your tools and team.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] items-center max-w-3xl mx-auto mb-12">
            <div className="rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-400">Before AI</p>
              <p className="text-5xl font-black text-slate-800">85 min</p>
              <p className="mt-1 text-sm text-slate-500">per report, manually</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full px-4 py-2 text-sm font-bold text-white shadow-lg"
                style={{ background: "linear-gradient(135deg,#00c9a7,#00a889)" }}>AI</div>
              <svg className="h-8 w-8 text-teal-500" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-xs font-bold text-teal-600 text-center">85% less<br />time</p>
            </div>
            <div className="rounded-2xl border-2 p-8 shadow-sm"
              style={{ borderColor: "#00c9a7", background: "rgba(0,201,167,0.04)" }}>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "#00a889" }}>After AI</p>
              <p className="text-5xl font-black" style={{ color: "#0a1628" }}>12 min</p>
              <p className="mt-1 text-sm text-slate-500">AI-assisted</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {[
              ["📄", "Document Automation", "Auto-generate reports, letters, and assessments from templates."],
              ["📊", "Report Distribution", "Scheduled reports built and emailed without manual effort."],
              ["🗂️", "CRM Sync", "Client records and job updates sync automatically across your tools."],
              ["📧", "Email Management", "AI triages inboxes, drafts replies, schedules follow-ups."],
              ["✅", "Compliance Checklists", "Checklists that populate, track, and chase items automatically."],
              ["🤝", "Client Onboarding", "Welcome sequences and document requests triggered on new clients."],
            ].map(([icon, title, desc]) => (
              <div key={title as string} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
                <span className="text-2xl">{icon}</span>
                <h3 className="mt-3 text-sm font-bold text-slate-800">{title as string}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{desc as string}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/ai-automation"
              className="inline-flex items-center rounded-full px-8 py-4 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #00c9a7, #00a889)" }}
            >
              See All 8 Automations + Pricing →
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

      {/* ── FIRE & H&S ── */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">Fire &amp; H&amp;S Consultancy</span>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl leading-tight">
                Expert Fire Safety &amp; Health &amp; Safety — CMIOSH Chartered
              </h2>
              <p className="mt-5 text-lg text-slate-500 leading-relaxed">
                Alongside AI automation, Lion RMS delivers practical, proportionate fire and health &amp; safety
                consultancy across London and the UK — with every assessment backed by a live digital compliance dashboard.
              </p>
              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3">
                <div>
                  <p className="text-2xl font-extrabold text-slate-800">£250 <span className="text-sm font-medium text-slate-500">+ VAT</span></p>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Fire Risk Assessment</p>
                </div>
                <span className="h-10 w-px bg-slate-200" aria-hidden />
                <div>
                  <p className="text-lg font-extrabold" style={{ color: "#00c9a7" }}>2 Months Free</p>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Platform access</p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/services"
                  className="rounded-full px-7 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #0c1f3f, #0ea5a0)" }}>
                  View Services
                </Link>
                <Link href="/contact"
                  className="rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                  Get a Quote
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {SERVICES_FS.map((s) => (
                <div key={s.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800">{s.title}</h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
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
            One consultancy.<br />
            <span style={{ background: "linear-gradient(100deg,#00c9a7 0%,#5be3c0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              AI automation + full compliance.
            </span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: "rgba(186,230,253,0.75)" }}>
            Book a free 30-minute call. We&rsquo;ll identify your top automation opportunities
            and answer any fire or H&amp;S compliance questions — no obligation.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/ai-automation"
              className="inline-flex items-center rounded-full px-10 py-4 text-lg font-bold text-white shadow-xl transition hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #00c9a7, #00a889)", boxShadow: "0 4px 24px rgba(0,201,167,0.35)" }}
            >
              ⚡ Explore AI Automation →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-white/25 bg-white/5 px-10 py-4 text-lg font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Book a Free Call
            </Link>
          </div>
          <p className="mt-6 text-sm" style={{ color: "rgba(186,230,253,0.4)" }}>
            Led by Batir Turakulov, CMIOSH · Lion Risk Management Solutions
          </p>
        </div>
      </section>

    </div>
  );
}
