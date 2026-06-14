import Link from "next/link";
import Reveal from "@/components/Reveal";
import MwsDashboardCard from "@/components/mywebsuite/MwsDashboardCard";
import MwsBenefits from "@/components/mywebsuite/MwsBenefits";
import MwsModules from "@/components/mywebsuite/MwsModules";
import MwsHowItWorks from "@/components/mywebsuite/MwsHowItWorks";
import MwsOutcomes from "@/components/mywebsuite/MwsOutcomes";
import MwsPlatformPreview from "@/components/mywebsuite/MwsPlatformPreview";
import MwsFinalCta from "@/components/mywebsuite/MwsFinalCta";
import { GradientText, PrimaryBtn } from "@/components/mywebsuite/MwsUi";

const CHECKS = [
  "No more switching between tools",
  "Live from day one — no developer needed",
  "UK-hosted, GDPR-ready, always on",
];

const TRUST_LABELS = ["Consultancy", "Health & Safety", "Property", "Legal", "Trade", "Compliance"];

export default function HomePage() {
  return (
    <div className="bg-white text-slate-800">

      {/* HERO */}
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-white">
        {/* Subtle teal glow — works on white */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-40"
            style={{ background: "radial-gradient(ellipse, rgba(14,165,160,0.12) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-36 sm:px-6 lg:pb-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,50%)]">

            <div className="animate-fade-up">
              <p
                className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-600"
                style={{ borderColor: "rgba(14,165,160,0.25)", background: "rgba(14,165,160,0.06)" }}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" aria-hidden />
                MyWebSuite — Now Live
              </p>

              <h1 className="text-[clamp(2.4rem,5vw,3.75rem)] font-extrabold leading-[1.04] tracking-tight text-navy-900">
                Run your entire<br />business from<br />
                <GradientText>one platform.</GradientText>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-500">
                Websites, client enquiries, service workflows, documents and
                reporting — all connected, all in one place.
              </p>

              <ul className="mt-6 space-y-2">
                {CHECKS.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <circle cx="8" cy="8" r="8" fill="rgba(14,165,160,0.12)" />
                      <path d="M5 8.2l2 2 4-4" stroke="#0ea5a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-3">
                <PrimaryBtn href="/contact" large>Start free trial</PrimaryBtn>
                <Link
                  href="/contact"
                  className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Book a demo
                </Link>
              </div>
              <p className="mt-4 text-xs text-slate-400">14-day free trial &middot; No credit card required</p>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "0.12s" }}>
              <MwsDashboardCard />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Trusted across professional services
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {TRUST_LABELS.map((l) => (
              <span key={l} className="text-[12px] font-bold uppercase tracking-widest text-slate-300">{l}</span>
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
