import type { Metadata } from "next";
import { Suspense } from "react";
import PhotoHero from "@/components/PhotoHero";
import ContactForm from "@/components/ContactForm";
import { IMAGES, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Lion Risk Management Solutions to discuss fire risk assessments, health & safety support, or a bespoke digital compliance solution in London and the UK.",
};

export default function ContactPage() {
  return (
    <>
      <PhotoHero
        image={IMAGES.city}
        eyebrow="Contact"
        title="Get in touch"
        body="Whether you need a fire risk assessment, health and safety support, or a bespoke digital compliance platform, we're here to help. Tell us about your requirements and we'll be in touch."
      />
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Details */}
          <div>
            <h2 className="text-lg font-semibold text-ink-900">Speak to us directly</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Prefer to talk it through? Call or email and we&apos;ll respond
              quickly.
            </p>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-ink-500">Phone</dt>
                <dd>
                  <a href={SITE.phoneHref} className="font-semibold text-brand-700 hover:underline">
                    {SITE.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-ink-500">Email</dt>
                <dd>
                  <a href={SITE.emailHref} className="font-semibold text-brand-700 hover:underline">
                    {SITE.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-ink-500">Coverage</dt>
                <dd className="text-ink-800">{SITE.location} &amp; across the UK</dd>
              </div>
            </dl>

            <div className="mt-8 rounded-2xl border border-ink-100 bg-ink-50 p-5">
              <h3 className="text-sm font-semibold text-ink-900">Free resources</h3>
              <div className="mt-3 space-y-2 text-sm">
                <a href={SITE.community.training} target="_blank" rel="noopener noreferrer" className="block font-medium text-brand-700 hover:underline">
                  Free Fire &amp; Health Safety Training →
                </a>
                <a href={SITE.community.forum} target="_blank" rel="noopener noreferrer" className="block font-medium text-brand-700 hover:underline">
                  UK Fire &amp; Safety Community →
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-ink-100 bg-white p-7 shadow-sm">
            <Suspense fallback={<p className="text-sm text-ink-500">Loading form…</p>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
