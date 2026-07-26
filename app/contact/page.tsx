import type { Metadata } from "next";
import { Suspense } from "react";
import PhotoHero from "@/components/PhotoHero";
import ContactForm from "@/components/ContactForm";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { SITE, CREDENTIALS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about a fire risk assessment, health & safety audit, fire strategy, or compliance support. We respond the same day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Contact" }]} />
      <PhotoHero
        eyebrow="Contact"
        title="Get in Touch"
        body="Get in touch about a fire risk assessment, health & safety audit, fire strategy, or compliance support. We respond the same day and can usually book within the week."
      />

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Left column: contact info + trust */}
          <div>
            <h2 className="text-xl font-bold text-navy-900">Speak to us directly</h2>
            <p className="mt-2 text-base leading-relaxed text-slate-500">
              Call or email and we&apos;ll respond promptly — usually the same day.
            </p>
            <dl className="mt-6 space-y-5 text-base">
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone</dt>
                <dd className="mt-1">
                  <a href={SITE.phoneHref} className="text-lg font-bold text-teal-600 hover:text-teal-700">
                    {SITE.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</dt>
                <dd className="mt-1">
                  <a href={SITE.emailHref} className="font-semibold text-teal-600 hover:underline">
                    {SITE.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-slate-400">Coverage</dt>
                <dd className="mt-1 text-slate-700">London and UK-wide</dd>
              </div>
            </dl>

            {/* Credentials */}
            <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Qualifications</p>
              <div className="flex flex-wrap gap-2">
                {CREDENTIALS.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-navy-700 shadow-sm"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Training & competency support */}
            <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50 p-6">
              <h3 className="mb-2 text-sm font-bold text-navy-900">Training &amp; competency support</h3>
              <p className="text-sm text-slate-600">
                Fire warden, fire awareness and health &amp; safety training, plus Responsible Person
                and competency support. Use the form to speak to us about training and competency
                support for your team.
              </p>
            </div>
          </div>

          {/* Right column: form */}
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
            <h2 className="mb-1 text-xl font-bold text-navy-900">Send us a message</h2>
            <p className="mb-6 text-sm text-slate-500">Fill in your details and we&apos;ll be in touch shortly.</p>
            <Suspense fallback={<p className="text-sm text-slate-400">Loading form…</p>}>
              <ContactForm />
            </Suspense>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-400">
              <span>CMIOSH Chartered</span>
              <span aria-hidden>&middot;</span>
              <span>PI Insured</span>
              <span aria-hidden>&middot;</span>
              <span>Usually respond the same day</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
