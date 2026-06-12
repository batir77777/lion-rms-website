import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import HeroBackdrop from "@/components/hero/HeroBackdrop";
import MagneticButton from "@/components/MagneticButton";
import CredibilityMarquee from "@/components/CredibilityMarquee";
import ServicesOverview from "@/components/ServicesOverview";
import WhoWeHelp from "@/components/WhoWeHelp";
import AssessorSection from "@/components/AssessorSection";
import ResourcesSection from "@/components/ResourcesSection";
import FaqAccordion from "@/components/FaqAccordion";
import FaqJsonLd from "@/components/FaqJsonLd";
import CtaButtons from "@/components/CtaButtons";
import ServiceSection from "@/components/ServiceSection";
import ProcessTimeline from "@/components/ProcessTimeline";
// StatsBand & Testimonials: removed pending real figures / consented client
// quotes — re-add when available (components kept in components/).
import { FAQS, IMAGES, POSITIONING, SERVICE_CATEGORIES, SITE, WHY_US } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — signature ember field (3D, gated & lazy-loaded) */}
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink-950">
        <HeroBackdrop />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6">
          <div className="max-w-3xl animate-fade-up">
            <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden />
              Fire · Health &amp; Safety · Digital Compliance
            </p>
            <h1 className="text-4xl font-bold leading-[0.98] text-white sm:text-6xl lg:text-[5.25rem]">
              Fire Safety, Health &amp;&nbsp;Safety, and Digital Compliance Solutions
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-200 sm:text-xl">
              Practical, joined-up consultancy for residential, commercial, and
              construction clients — assessed, advised, and digitised by one
              accountable expert.
            </p>
            <p className="mt-3 text-sm text-ink-300">
              Trusted by businesses, landlords, managing agents, and construction
              clients across East London.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <MagneticButton href="/contact">
                Book a consultation
                <span aria-hidden>→</span>
              </MagneticButton>
              <MagneticButton href="/services" variant="ghost">
                Our services
              </MagneticButton>
            </div>
          </div>
        </div>
        {/* Scroll cue */}
        <div
          className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 sm:block"
          aria-hidden
        >
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1.5">
            <div className="h-2 w-[3px] animate-bounce rounded-full bg-brand-500" />
          </div>
        </div>
      </section>

      <CredibilityMarquee />

      {/* Positioning statement */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:py-24">
          <Reveal>
            <p className="font-display text-2xl font-medium leading-snug tracking-tight text-ink-950 sm:text-3xl">
              {POSITIONING}
            </p>
          </Reveal>
        </div>
      </section>

      <ServicesOverview />

      <WhoWeHelp />

      {/* 2–4. Service categories with photos */}
      {SERVICE_CATEGORIES.map((cat, i) => (
        <ServiceSection key={cat.slug} cat={cat} index={i} />
      ))}

      {/* How we work */}
      <ProcessTimeline />

      <AssessorSection />

      {/* StatsBand removed pending real figures — re-add when available. */}

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

      {/* Testimonials removed pending consented client quotes — re-add when available. */}

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

      {/* Final CTA — photo background with slow Ken Burns zoom */}
      <section className="relative isolate overflow-hidden bg-ink-950">
        <div className="absolute inset-0 animate-kenburns" aria-hidden>
          <Image
            src={IMAGES.city}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 30%, rgba(249, 127, 17, 0.08), transparent 70%)," +
                "linear-gradient(180deg, rgba(14, 12, 9, 0.86) 0%, rgba(14, 12, 9, 0.94) 100%)",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 py-28 text-center sm:px-6 lg:py-36">
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
