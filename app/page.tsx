import Link from "next/link";
import Reveal from "@/components/Reveal";
import CredentialsBand from "@/components/CredentialsBand";
import WhoWeHelp from "@/components/WhoWeHelp";
import AssessorSection from "@/components/AssessorSection";
import ResourcesSection from "@/components/ResourcesSection";
import FaqAccordion from "@/components/FaqAccordion";
import FaqJsonLd from "@/components/FaqJsonLd";
import CtaButtons from "@/components/CtaButtons";
import AuthorityStrip from "@/components/AuthorityStrip";
import ServiceSection from "@/components/ServiceSection";
import ProcessSection from "@/components/ProcessSection";
import StatsBand from "@/components/StatsBand";
import { FAQS, IMAGES, POSITIONING, SERVICE_CATEGORIES, SITE, WHY_US } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — full-bleed photo */}
      <section className="relative isolate overflow-hidden bg-ink-950">
        <div
          className="photo-overlay absolute inset-0 animate-slow-zoom bg-cover bg-center"
          style={{ backgroundImage: `url('${IMAGES.hero}')` }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-28 sm:px-6 sm:py-36 lg:py-44">
          <div className="max-w-3xl animate-fade-up">
            <p className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur">
              Fire · Health &amp; Safety · Digital Compliance
            </p>
            <h1 className="text-4xl font-bold leading-[1.03] text-white sm:text-6xl lg:text-7xl">
              Fire Safety, Health &amp; Safety, and Digital Compliance Solutions
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-200 sm:text-xl">
              We help residential, commercial, and construction clients manage
              fire safety, health and safety, and ongoing compliance through
              practical consultancy, training, and bespoke digital systems.
            </p>
            <p className="mt-3 text-sm text-ink-300">
              Trusted by businesses, landlords, managing agents, and construction
              clients across East London.
            </p>
            <div className="mt-9">
              <CtaButtons />
            </div>
          </div>
        </div>
      </section>

      <CredentialsBand />

      <AuthorityStrip />

      {/* Positioning statement */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
          <Reveal>
            <p className="font-display text-2xl font-medium leading-snug tracking-tight text-ink-950 sm:text-3xl">
              {POSITIONING}
            </p>
          </Reveal>
        </div>
      </section>

      <WhoWeHelp />

      {/* 2–4. Service categories with photos */}
      {SERVICE_CATEGORIES.map((cat, i) => (
        <ServiceSection key={cat.slug} cat={cat} index={i} />
      ))}

      {/* How we work */}
      <ProcessSection />

      <AssessorSection />

      {/* Credibility band */}
      <StatsBand />

      {/* Why Choose Us */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-700">
              Why Choose Us
            </p>
            <h2 className="max-w-3xl text-3xl font-bold text-ink-950 sm:text-4xl">
              Why Choose Lion Risk Management Solutions
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="group h-full rounded-2xl border border-ink-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
                  <div className="mb-4 h-1 w-10 rounded-full bg-brand-600 transition-all group-hover:w-16" />
                  <h3 className="text-base font-semibold text-ink-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqJsonLd />
      <section className="bg-ink-50">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-700">
              FAQ
            </p>
            <h2 className="text-3xl font-bold text-ink-950 sm:text-4xl">
              Frequently asked questions
            </h2>
          </Reveal>
          <div className="mt-10">
            <FaqAccordion items={FAQS.slice(0, 6)} />
          </div>
          <div className="mt-6 text-center">
            <Link href="/faq" className="text-sm font-semibold text-brand-700 hover:underline">
              See all questions →
            </Link>
          </div>
        </div>
      </section>

      <ResourcesSection />

      {/* Final CTA — photo background */}
      <section className="relative isolate overflow-hidden bg-ink-950">
        <div
          className="photo-overlay absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${IMAGES.city}')` }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6">
          <Reveal>
            <h2 className="text-3xl font-bold text-white sm:text-5xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-200 sm:text-lg">
              Whether you need a fire risk assessment, health and safety support,
              or a bespoke digital compliance platform, we are here to help.
            </p>
            <div className="mt-9 flex justify-center">
              <CtaButtons variant="final" />
            </div>
            <p className="mt-8 text-sm text-ink-300">
              Prefer to talk?{" "}
              <a href={SITE.phoneHref} className="font-semibold text-white underline">
                {SITE.phone}
              </a>{" "}
              ·{" "}
              <a href={SITE.emailHref} className="font-semibold text-white underline">
                {SITE.email}
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
