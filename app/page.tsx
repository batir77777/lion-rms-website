import Link from "next/link";
import Reveal from "@/components/Reveal";
import ComplianceDashboard from "@/components/mywebsuite/MwsDashboardCard";
import MwsBenefits from "@/components/mywebsuite/MwsBenefits";
import MwsModules from "@/components/mywebsuite/MwsModules";
import MwsHowItWorks from "@/components/mywebsuite/MwsHowItWorks";
import MwsOutcomes from "@/components/mywebsuite/MwsOutcomes";
import MwsPlatformPreview from "@/components/mywebsuite/MwsPlatformPreview";
import MwsFinalCta from "@/components/mywebsuite/MwsFinalCta";
import { GradientText, PrimaryBtn, SectionLabel } from "@/components/mywebsuite/MwsUi";
import { CREDENTIALS } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="bg-white text-slate-800">

      {/* HERO */}
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-white">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="absolute left-1/2 top-0 h-[700px] w-[1000px] -translate-x-1/2 -translate-y-1/3 rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(14,165,160,0.09) 0%, transparent 65%)" }}
          />
          <div
            className="absolute right-0 top-1/4 h-96 w-80 rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(12,31,63,0.05) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-40 sm:px-6 lg:pb-28 lg:pt-44">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_minmax(0,48%)]">

            {/* Left: headline + CTAs */}
            <div className="animate-fade-up">

              {/* Live badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" aria-hidden />
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">
                  Compliance Management Platform
                </span>
              </div>

              {/* Big headline */}
              <h1 className="text-[clamp(2.75rem,6.5vw,5rem)] font-extrabold leading-[1.03] tracking-tight text-navy-900">
                Fire Safety &amp;<br className="hidden sm:block" />
                H&amp;S Compliance,<br />
                <GradientText>Managed Better.</GradientText>
              </h1>

              <p className="mt-7 max-w-xl text-xl leading-relaxed text-slate-500">
                Digital compliance management for fire safety and health &amp; safety
                professionals. Track actions, manage audits, generate reports, and stay
                audit-ready — all in one connected platform.
              </p>

              {/* Checklist */}
              <ul className="mt-7 space-y-2.5">
                {[
                  "Real-time compliance dashboards across your entire portfolio",
                  "Action tracking from raised to closed — with full audit trail",
                  "Automated reminders, document control, and inspection scheduling",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-base text-slate-600">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden>
                      <circle cx="10" cy="10" r="10" fill="rgba(14,165,160,0.12)" />
                      <path d="M6.5 10.3l2.3 2.3 4.7-4.7" stroke="#0ea5a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <PrimaryBtn href="/contact" large>Book a Free Demo</PrimaryBtn>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-700 shadow-sm transition hover:border-navy-200 hover:bg-slate-50"
                >
                  Request a Consultation
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              <p className="mt-5 text-sm text-slate-400">
                No commitment required &middot; Demo tailored to your portfolio
              </p>
            </div>

            {/* Right: compliance dashboard */}
            <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
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

      <MwsBenefits />
      <MwsModules />
      <MwsHowItWorks />
      <MwsOutcomes />
      <MwsPlatformPreview />
      <MwsFinalCta />

    </div>
  );
}
