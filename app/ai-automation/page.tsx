import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Business AI Automation — Eliminate Repetitive Work",
  description:
    "Lion RMS helps businesses automate repetitive workflows using AI — document generation, report automation, CRM updates, and more. Book a free productivity call.",
};

const SERVICES = [
  {
    icon: "📄",
    title: "Document Automation",
    desc: "Auto-generate reports, letters, risk assessments, and compliance documents from templates — populated with live data in seconds.",
  },
  {
    icon: "📊",
    title: "Report Generation & Distribution",
    desc: "Scheduled reports built and emailed automatically — weekly summaries, compliance status, client updates — without manual effort.",
  },
  {
    icon: "🗂️",
    title: "CRM & Data Entry Automation",
    desc: "Eliminate copy-paste between systems. New enquiries, job updates, and client records sync automatically across your tools.",
  },
  {
    icon: "📧",
    title: "Email & Calendar Management",
    desc: "Triage inboxes, draft replies, schedule follow-ups, and manage calendars — AI handles the admin, you handle the decisions.",
  },
  {
    icon: "✅",
    title: "Compliance Checklist Automation",
    desc: "Digital checklists that populate, track completion, chase outstanding items, and log results — automatically.",
  },
  {
    icon: "🧾",
    title: "Invoice & Expense Processing",
    desc: "Invoices read, coded, and logged automatically. Expense submissions processed without the spreadsheet shuffle.",
  },
  {
    icon: "🤝",
    title: "Client Onboarding Workflows",
    desc: "New client? The welcome sequence, document requests, and task assignments happen automatically — consistent every time.",
  },
  {
    icon: "📝",
    title: "Meeting Notes & Action Tracking",
    desc: "Meeting notes transcribed, summarised, and actions assigned automatically. No more chasing minutes from last week.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Free Productivity Call",
    desc: "30 minutes to understand your business, your current workflows, and where time is being lost.",
  },
  {
    n: "02",
    title: "AI Workflow Audit",
    desc: "We map your top time-consuming tasks and identify which are best suited to automation.",
  },
  {
    n: "03",
    title: "Pilot Automation",
    desc: "We build and test one workflow end-to-end — so you see exactly what's possible before committing further.",
  },
  {
    n: "04",
    title: "Roll Out & Support",
    desc: "We expand automation across your business with ongoing support, refinement, and training.",
  },
];

const SECTORS = [
  { icon: "🏗️", label: "Construction & Developers" },
  { icon: "🏥", label: "Healthcare & Clinics" },
  { icon: "🏨", label: "Hospitality & Events" },
  { icon: "🏢", label: "Professional Services" },
  { icon: "🏠", label: "Property & Landlords" },
  { icon: "⚙️", label: "Engineering & Manufacturing" },
];

const PACKAGES = [
  {
    name: "AI Productivity Call",
    price: "FREE",
    period: "",
    desc: "30-minute call to identify your top time-wasting tasks and automation opportunities.",
    features: ["No obligation", "Immediate insights", "Tailored to your business"],
    featured: false,
    cta: "Book Now",
  },
  {
    name: "AI Workflow Audit",
    price: "£500",
    period: "one-time",
    desc: "Deep-dive audit of your top 3–5 workflows with a full automation roadmap and ROI estimate.",
    features: ["Process mapping", "Automation roadmap", "ROI projection", "Tool recommendations"],
    featured: false,
    cta: "Get Started",
  },
  {
    name: "One Workflow Pilot",
    price: "£995",
    period: "one-time",
    priceNote: "from £995 – £1,250",
    desc: "We build and deploy one complete automated workflow — tested, documented, and handed over.",
    features: ["Full build & testing", "Staff training", "Documentation", "30-day support"],
    featured: true,
    cta: "Start Your Pilot",
  },
  {
    name: "Standard Automation Project",
    price: "£3,000",
    period: "one-time",
    priceNote: "from £3,000 – £7,500",
    desc: "Multi-workflow automation project covering 3–8 processes across your business.",
    features: ["3–8 automated workflows", "Integration across tools", "Full training", "3-month support"],
    featured: false,
    cta: "Get a Quote",
  },
  {
    name: "Ongoing AI Support",
    price: "£395",
    period: "/month",
    priceNote: "£395 – £995+/month",
    desc: "Continuous AI automation support — new workflows, refinements, and a dedicated automation partner.",
    features: ["Monthly new automations", "Priority support", "Regular reviews", "Dedicated consultant"],
    featured: false,
    cta: "Enquire Now",
  },
];

export default function AiAutomationPage() {
  return (
    <div className="bg-white text-slate-800">

      {/* HERO */}
      <section
        className="relative isolate overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0a1628 0%,#0f2040 55%,#0a1628 100%)" }}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-48 -top-24 h-[620px] w-[620px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,201,167,0.22) 0%, transparent 62%)" }} />
          <div className="absolute right-0 bottom-0 h-[500px] w-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,201,167,0.1) 0%, transparent 62%)" }} />
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "46px 46px" }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-36 sm:px-6 lg:pb-28 lg:pt-40">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/90 backdrop-blur mb-6">
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#00c9a7" }} />
              Business AI Automation · Lion RMS
            </span>
            <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[1.06] tracking-tight text-white">
              Eliminate Repetitive Work.{" "}
              <span style={{ background: "linear-gradient(100deg,#00c9a7 0%,#5be3c0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Free Up Time for What Actually Matters.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: "rgba(186,230,253,0.8)" }}>
              We automate the workflows that drain your team's time — document generation, data entry,
              reporting, email management, compliance checklists, and more — using AI tools built around
              how your business actually works.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full px-8 py-4 text-base font-bold text-white shadow-xl transition hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #00c9a7, #00a889)" }}
              >
                Book Your Free Productivity Call →
              </Link>
              <a
                href="#packages"
                className="inline-flex items-center rounded-full border border-white/25 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                View Packages
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="border-b border-slate-100 bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <p className="mb-10 text-center text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            Real example — fire risk assessment report workflow
          </p>
          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] items-center">
            {/* Before */}
            <div className="rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-red-400">Before AI</p>
              <p className="text-5xl font-black text-slate-800">85 min</p>
              <p className="mt-2 text-base text-slate-500">per report, manually</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-500">
                <li>• Open template, copy from notes</li>
                <li>• Cross-reference previous reports</li>
                <li>• Format, check, re-format</li>
                <li>• Email client, chase signature</li>
                <li>• Update CRM manually</li>
              </ul>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="rounded-full px-4 py-2 text-sm font-bold text-white shadow-lg"
                style={{ background: "linear-gradient(135deg,#00c9a7,#00a889)" }}>
                AI
              </div>
              <svg className="h-8 w-8 text-teal-500" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-xs font-bold text-teal-600 text-center">85% less<br />time</p>
            </div>

            {/* After */}
            <div className="rounded-2xl border-2 p-8 shadow-sm"
              style={{ borderColor: "#00c9a7", background: "rgba(0,201,167,0.04)" }}>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: "#00a889" }}>After AI</p>
              <p className="text-5xl font-black" style={{ color: "#0a1628" }}>12 min</p>
              <p className="mt-2 text-base text-slate-500">per report, AI-assisted</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li>• AI drafts report from site notes</li>
                <li>• Auto-populates client data</li>
                <li>• You review and approve</li>
                <li>• Sends automatically</li>
                <li>• CRM updates itself</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM STRIP */}
      <section className="border-b border-slate-100 py-12">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            If your team spends hours each week on tasks a computer could do — that's not a staffing problem. It's a systems problem.
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-3xl mx-auto">
            Most businesses waste 10–25% of their working week on manual, repetitive admin.
            AI automation eliminates it — not by replacing people, but by removing the work no one should be doing in the first place.
          </p>
        </div>
      </section>

      {/* ORIGIN STORY */}
      <section className="py-16 border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2 items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">Why we built this</span>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl leading-tight">
                We built it in our own business first.
              </h2>
              <p className="mt-5 text-slate-600 leading-relaxed">
                As fire risk assessors running a growing consultancy, we were drowning in admin — report writing, client
                follow-ups, CRM updates, scheduling, compliance tracking. The work was important but the process was brutal.
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                So we automated it. Not with expensive enterprise software, but with AI workflows built around exactly how
                we worked. The results changed our business: more capacity, fewer errors, faster turnaround, happier clients.
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Now we build the same systems for other businesses — any sector, any size.
              </p>
            </div>
            <div className="rounded-2xl p-8 text-white"
              style={{ background: "linear-gradient(135deg, #0a1628, #0f2040)" }}>
              <p className="text-lg font-medium leading-relaxed" style={{ color: "rgba(186,230,253,0.9)" }}>
                &ldquo;We didn&rsquo;t build this in a lab. We built it in our business.
                Now we help other businesses get the same results.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: "#00c9a7" }}>BT</div>
                <div>
                  <p className="text-sm font-semibold text-white">Batir Turakulov</p>
                  <p className="text-xs" style={{ color: "rgba(186,230,253,0.6)" }}>CMIOSH · Founder, Lion RMS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 SERVICES */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">What we automate</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl">
              8 Workflows We Automate for Businesses
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              Each one is built around your tools, your data, and your team's actual process.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div key={s.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-4 text-base font-bold text-slate-800">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">The process</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl">How It Works</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
                <p className="text-4xl font-black" style={{ color: "#00c9a7" }}>{s.n}</p>
                <h3 className="mt-3 text-base font-bold text-slate-800">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="py-16 border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">Results</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl">What Businesses Get</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["⏱️", "10–25 hours saved per week across your team"],
              ["📉", "Fewer errors from manual copy-paste and data entry"],
              ["⚡", "Faster turnaround on client deliverables"],
              ["📈", "More capacity without more headcount"],
              ["😌", "Staff doing meaningful work, not admin"],
              ["🔒", "Consistent, auditable processes every time"],
            ].map(([icon, text]) => (
              <div key={text as string} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <span className="text-2xl">{icon}</span>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">Sectors</span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl mb-10">Who We Work With</h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {SECTORS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm text-center">
                <span className="text-3xl">{s.icon}</span>
                <p className="mt-2 text-xs font-semibold text-slate-700">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="packages" className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">Pricing</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl">
              AI Automation Packages
            </h2>
            <p className="mt-4 text-lg text-slate-500">All prices in GBP. No hidden fees.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  pkg.featured
                    ? "text-white shadow-2xl"
                    : "bg-white border border-slate-100 shadow-sm text-slate-800"
                }`}
                style={pkg.featured ? { background: "linear-gradient(160deg, #0a1628 0%, #0f2040 100%)", border: "2px solid #00c9a7" } : {}}
              >
                {pkg.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full px-4 py-1 text-xs font-bold text-white"
                      style={{ background: "#00c9a7" }}>Most Popular</span>
                  </div>
                )}
                <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${pkg.featured ? "text-teal-400" : "text-slate-400"}`}>
                  {pkg.name}
                </p>
                <div className="mb-1">
                  <span className={`text-3xl font-black ${pkg.featured ? "text-white" : "text-slate-800"}`}>
                    {pkg.price}
                  </span>
                  {pkg.period && (
                    <span className={`ml-1 text-sm ${pkg.featured ? "text-blue-200/70" : "text-slate-400"}`}>
                      {pkg.period}
                    </span>
                  )}
                </div>
                {pkg.priceNote && (
                  <p className={`text-xs mb-3 ${pkg.featured ? "text-blue-200/60" : "text-slate-400"}`}>
                    {pkg.priceNote}
                  </p>
                )}
                <p className={`text-sm leading-relaxed mb-5 ${pkg.featured ? "text-blue-100/80" : "text-slate-500"}`}>
                  {pkg.desc}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${pkg.featured ? "text-blue-100/80" : "text-slate-600"}`}>
                      <span style={{ color: "#00c9a7" }} className="mt-0.5 shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`mt-auto block rounded-full px-5 py-3 text-center text-sm font-bold transition hover:-translate-y-0.5 ${
                    pkg.featured
                      ? "text-white"
                      : "text-white"
                  }`}
                  style={pkg.featured
                    ? { background: "linear-gradient(135deg, #00c9a7, #00a889)" }
                    : { background: "linear-gradient(135deg, #0a1628, #0f2040)" }
                  }
                >
                  {pkg.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Founding Client */}
          <div className="mt-10 rounded-2xl p-8 grid md:grid-cols-2 gap-8 items-center"
            style={{ background: "linear-gradient(135deg, #0a1628, #0f2040)", border: "2px solid rgba(0,201,167,0.3)" }}>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#00c9a7" }}>
                🎯 Founding Client Programme
              </span>
              <h3 className="mt-3 text-2xl font-extrabold text-white">
                First 10 businesses get founding client pricing
              </h3>
              <p className="mt-3 text-blue-100/70 text-sm leading-relaxed">
                In exchange for honest feedback and a case study, founding clients receive
                significantly reduced rates on any package. We get proof. You get automation at cost.
              </p>
            </div>
            <div className="rounded-xl p-5" style={{ background: "rgba(0,201,167,0.08)", border: "1px solid rgba(0,201,167,0.2)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#00c9a7" }}>
                ⏳ Limited Spots
              </p>
              <p className="text-white font-semibold">
                Only 10 founding client spots available — strictly first come, first served.
              </p>
              <p className="mt-2 text-sm text-blue-100/60">
                Once filled, standard pricing applies. Ask about availability on your call.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-block rounded-full px-6 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #00c9a7, #00a889)" }}
              >
                Claim a Founding Spot →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BRIDGE TO FIRE & H&S */}
      <section className="py-16 border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            We also do Fire Safety &amp; Health &amp; Safety
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Lion RMS delivers CMIOSH-chartered fire risk assessments, fire strategies, H&amp;S audits,
            and compliance consultancy — alongside AI automation. One consultancy, joined-up.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/services"
              className="rounded-full px-8 py-4 text-base font-bold text-white shadow-md transition hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #0c1f3f, #0ea5a0)" }}
            >
              View Fire &amp; H&amp;S Services
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
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
            Ready to stop doing work<br />
            <span style={{ background: "linear-gradient(100deg,#00c9a7 0%,#5be3c0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              a computer could do for you?
            </span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: "rgba(186,230,253,0.75)" }}>
            Book a free 30-minute productivity call. We&rsquo;ll identify your top automation opportunities
            and give you a clear picture of what&rsquo;s possible — no obligation, no hard sell.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full px-10 py-4 text-lg font-bold text-white shadow-xl transition hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #00c9a7, #00a889)", boxShadow: "0 4px 24px rgba(0,201,167,0.35)" }}
            >
              Book Your Free Productivity Call →
            </Link>
          </div>
          <p className="mt-5 text-sm" style={{ color: "rgba(186,230,253,0.45)" }}>
            Led by Batir Turakulov, CMIOSH · Lion Risk Management Solutions
          </p>
        </div>
      </section>

    </div>
  );
}
