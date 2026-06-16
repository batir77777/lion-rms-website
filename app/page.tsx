import Link from "next/link";
import ComplianceDashboard from "@/components/mywebsuite/MwsDashboardCard";
import MwsServices from "@/components/mywebsuite/MwsServices";
import MwsShowcase from "@/components/mywebsuite/MwsShowcase";
import MwsWhyChoose from "@/components/mywebsuite/MwsWhyChoose";
import MwsBenefits from "@/components/mywebsuite/MwsBenefits";
import MwsModules from "@/components/mywebsuite/MwsModules";
import MwsHowItWorks from "@/components/mywebsuite/MwsHowItWorks";
import MwsComparison from "@/components/mywebsuite/MwsComparison";
import MwsOutcomes from "@/components/mywebsuite/MwsOutcomes";
import MwsPlatformPreview from "@/components/mywebsuite/MwsPlatformPreview";
import MwsFinalCta from "@/components/mywebsuite/MwsFinalCta";
import { CREDENTIALS } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="bg-white text-slate-800">

      {/* HERO — premium full-bleed coded hero (Stripe/Monday/Procore style) */}
      <section
        className="relative isolate overflow-hidden"
        style={{ background: "linear-gradient(135deg,#082B5C 0%,#233E99 52%,#082B5C 100%)" }}
      >
        {/* Decorative brand glows + subtle grid */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-48 -top-24 h-[620px] w-[620px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,166,126,0.28) 0%, transparent 62%)" }} />
          <div className="absolute -right-40 bottom-[-120px] h-[640px] w-[760px] rounded-full" style={{ background: "radial-gradient(circle, rgba(35,62,153,0.55) 0%, transparent 62%)" }} />
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "46px 46px" }} />
        </div>

        <div className="relative mx-auto flex min-h-[82vh] w-full max-w-7xl items-center px-5 pb-16 pt-32 sm:px-6 lg:pb-24 lg:pt-36">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_minmax(0,45%)]">

            {/* Left — message */}
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#00A67E" }} aria-hidden />
                CMIOSH Chartered · DipFRA · London &amp; UK-wide
              </span>

              <h1 className="mt-6 text-[clamp(2.4rem,5.4vw,4.4rem)] font-extrabold leading-[1.04] tracking-tight text-white">
                Fire Safety. Health &amp; Safety.
                <br />
                <span
                  style={{
                    background: "linear-gradient(100deg,#00A67E 0%,#5be3c0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Digital Compliance.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-blue-100/80">
                Expert consultancy and a live compliance platform in one — Fire Risk Assessments,
                Fire Strategies, Health &amp; Safety services and Training &amp; Competency support,
                managed end to end.
              </p>

              {/* Offer callout */}
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-4 backdrop-blur">
                <div>
                  <p className="text-2xl font-extrabold text-white">£250 <span className="text-base font-semibold text-blue-100/70">+ VAT</span></p>
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-100/60">Fire Risk Assessment</p>
                </div>
                <span className="hidden h-10 w-px bg-white/15 sm:block" aria-hidden />
                <div>
                  <p className="text-lg font-extrabold" style={{ color: "#5be3c0" }}>3 Months Free</p>
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-100/60">Lion RMS platform access</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full px-8 py-4 text-base font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:opacity-95"
                  style={{ background: "#00A67E" }}
                >
                  Get a Quote
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  Book a Demo
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              <p className="mt-6 text-sm text-blue-100/55">
                Led by Batir Turakulov, CMIOSH DipFRA · proportionate advice, no gold-plating.
              </p>
            </div>

            {/* Right — product mockup */}
            <div className="hidden animate-fade-up lg:block" style={{ animationDelay: "0.1s" }}>
              <ComplianceDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* CREDENTIALS STRIP */}
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

      <MwsServices />
      <MwsShowcase />
      <MwsBenefits />
      <MwsModules />
      <MwsHowItWorks />
      <MwsComparison />
      <MwsOutcomes />
      <MwsPlatformPreview />
      <MwsWhyChoose />
      <MwsFinalCta />

    </div>
  );
}
