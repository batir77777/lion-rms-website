// Digital Compliance section: heading, static dashboard mock, stat captions
// and CTA. The LIVE animated demo runs in the hero (components/hero/HeroDemo
// → showcase/DemoStage); this section deliberately uses the static mock so
// the page doesn't repeat the same animation twice.

import Link from "next/link";
import Reveal from "../Reveal";
import DashboardMockup from "../DashboardMockup";

export default function ComplianceShowcase() {
  return (
    <section id="digital-compliance" data-nav="/services" className="scroll-mt-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
              Digital Compliance
            </p>
            <h2 className="text-3xl font-bold text-ink-950 sm:text-5xl">
              From site visit to living compliance
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-600">
              The assessment is the start, not the end. Reports become live
              dashboards — actions tracked, reminders automated, records
              audit-ready.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mx-auto mt-12 max-w-3xl">
            <DashboardMockup />
            <p className="mt-2 text-center text-[10px] text-ink-400">
              Illustrative product visual — not live client data.
            </p>
          </div>
        </Reveal>

        {/* Stat-style captions — no invented numbers. */}
        <Reveal delay={180}>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 text-center sm:grid-cols-3">
            {[
              { title: "One visit", body: "Fire and H&S assessed together, on site" },
              { title: "One report pack", body: "Prioritised findings in plain English" },
              { title: "One live dashboard", body: "Actions, reminders and records, synced" },
            ].map((s) => (
              <div key={s.title} className="rounded-2xl border border-ink-100 bg-ink-50 px-5 py-5">
                <p className="font-display text-lg font-semibold text-ink-950">{s.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">{s.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 text-center">
            <Link
              href="/contact?service=digital-compliance"
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-teal-600 hover:shadow-ember"
            >
              Discuss a digital compliance solution <span aria-hidden>→</span>
            </Link>
            <p className="mt-3 text-xs text-ink-500">
              <Link href="/services/digital-compliance" className="font-semibold text-teal-700 hover:underline">
                Explore Digital Compliance Solutions →
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
