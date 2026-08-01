import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { SITE } from "@/lib/site";
import { DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Lion Risk Management Solutions collects, uses, and protects your personal data under UK GDPR.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    title: "Privacy Policy",
    description: "How Lion Risk Management Solutions collects, uses, and protects your personal data under UK GDPR.",
    url: "/privacy",
    images: [DEFAULT_OG_IMAGE],
  },
};

const LAST_UPDATED = "27 June 2026";

export default function PrivacyPage() {
  return (
    <div className="bg-white text-slate-800">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Privacy Policy" }]} />

      {/* Header */}
      <section
        className="relative isolate overflow-hidden py-20 pt-36"
        style={{ background: "linear-gradient(135deg,#0a1628 0%,#0f2040 55%,#0a1628 100%)" }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "46px 46px" }} />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: "#00c9a7" }}>Legal</span>
          <h1 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-base" style={{ color: "rgba(186,230,253,0.7)" }}>
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6">
        <div className="prose prose-slate max-w-none">

          <Section title="1. Who we are">
            <p>
              Lion Risk Management Solutions (&ldquo;Lion RMS&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is the data controller responsible for your personal data.
            </p>
            <p className="mt-3">
              <strong>Registered business:</strong> Lion Risk Management Solutions<br />
              <strong>Email:</strong> <a href={SITE.emailHref} className="text-teal-700 underline underline-offset-2 hover:text-teal-800">{SITE.email}</a><br />
              <strong>Phone:</strong> <a href={SITE.phoneHref} className="text-teal-700 underline underline-offset-2 hover:text-teal-800">{SITE.phone}</a>
            </p>
          </Section>

          <Section title="2. What data we collect">
            <p>We may collect the following categories of personal data:</p>
            <ul className="mt-3 space-y-1.5 list-disc pl-5">
              <li><strong>Contact data:</strong> name, email address, phone number</li>
              <li><strong>Business data:</strong> company name, job title, premises address</li>
              <li><strong>Enquiry data:</strong> the content of messages you send us via our contact form or email</li>
              <li><strong>Technical data:</strong> IP address, browser type, pages visited, time spent on pages (via analytics)</li>
              <li><strong>Communication data:</strong> records of emails and calls between us</li>
            </ul>
            <p className="mt-3">
              We do not collect special category data (such as health, racial or ethnic origin, or criminal records) unless specifically required and agreed with you for a particular service.
            </p>
          </Section>

          <Section title="3. How we collect your data">
            <ul className="space-y-1.5 list-disc pl-5">
              <li>When you fill in our contact form</li>
              <li>When you email or call us directly</li>
              <li>When you book a call or demo</li>
              <li>Automatically when you visit our website (analytics and cookies)</li>
              <li>When we carry out a site visit or assessment and you provide us with information</li>
            </ul>
          </Section>

          <Section title="4. How we use your data">
            <p>We use your personal data for the following purposes:</p>
            <table className="mt-3 w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-4 text-left font-semibold text-slate-700">Purpose</th>
                  <th className="py-2 text-left font-semibold text-slate-700">Lawful basis (UK GDPR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Responding to your enquiry", "Legitimate interests / Contract"],
                  ["Providing consultancy services", "Contract"],
                  ["Sending you a quote or proposal", "Contract / Legitimate interests"],
                  ["Maintaining a record of assessments carried out", "Legal obligation / Legitimate interests"],
                  ["Sending service-related updates (non-marketing)", "Legitimate interests"],
                  ["Improving our website and services", "Legitimate interests"],
                  ["Complying with legal or regulatory obligations", "Legal obligation"],
                ].map(([purpose, basis]) => (
                  <tr key={purpose}>
                    <td className="py-2 pr-4 text-slate-600">{purpose}</td>
                    <td className="py-2 text-slate-500">{basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm text-slate-500">
              We do not use your data for automated decision-making or profiling.
            </p>
          </Section>

          <Section title="5. Marketing">
            <p>
              We will only send you marketing communications if you have given us your explicit consent, or if you are an existing client and the communication relates to similar services (&ldquo;soft opt-in&rdquo; under PECR).
            </p>
            <p className="mt-3">
              You can opt out at any time by emailing <a href={SITE.emailHref} className="text-teal-700 underline underline-offset-2 hover:text-teal-800">{SITE.email}</a> or clicking the unsubscribe link in any marketing email.
            </p>
          </Section>

          <Section title="6. Who we share your data with">
            <p>We do not sell your personal data. We may share it with:</p>
            <ul className="mt-3 space-y-1.5 list-disc pl-5">
              <li><strong>Service providers:</strong> email/CRM tools, website hosting (Vercel), form processing (Formspree) — under data processing agreements</li>
              <li><strong>Professional advisors:</strong> accountants, insurers, legal advisors where necessary</li>
              <li><strong>Regulators or authorities:</strong> where required by law (e.g. HSE, local fire authority)</li>
            </ul>
            <p className="mt-3">
              All third-party processors are required to handle your data securely and only for the purposes we specify.
            </p>
          </Section>

          <Section title="7. International transfers">
            <p>
              Some of our service providers are based outside the UK. Where data is transferred outside the UK, we ensure appropriate safeguards are in place in accordance with UK GDPR Article 46 (e.g. Standard Contractual Clauses or adequacy decisions).
            </p>
          </Section>

          <Section title="8. How long we keep your data">
            <table className="mt-3 w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-4 text-left font-semibold text-slate-700">Data type</th>
                  <th className="py-2 text-left font-semibold text-slate-700">Retention period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Enquiry / contact form data (no contract)", "12 months"],
                  ["Client records and assessment reports", "7 years from end of contract"],
                  ["Invoices and financial records", "7 years (HMRC requirement)"],
                  ["Website analytics data", "26 months"],
                  ["Email correspondence", "7 years"],
                ].map(([type, period]) => (
                  <tr key={type}>
                    <td className="py-2 pr-4 text-slate-600">{type}</td>
                    <td className="py-2 text-slate-500">{period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-sm text-slate-500">
              After the retention period, data is securely deleted or anonymised.
            </p>
          </Section>

          <Section title="9. Your rights under UK GDPR">
            <p>You have the following rights in relation to your personal data:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li><strong>Right of access</strong> — request a copy of the data we hold about you</li>
              <li><strong>Right to rectification</strong> — ask us to correct inaccurate or incomplete data</li>
              <li><strong>Right to erasure</strong> — ask us to delete your data in certain circumstances</li>
              <li><strong>Right to restrict processing</strong> — ask us to pause processing of your data</li>
              <li><strong>Right to data portability</strong> — receive your data in a portable format where applicable</li>
              <li><strong>Right to object</strong> — object to processing based on legitimate interests or for direct marketing</li>
              <li><strong>Rights related to automated decision-making</strong> — we do not carry out automated decision-making, so this is unlikely to apply</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, email us at{" "}
              <a href={SITE.emailHref} className="text-teal-700 underline underline-offset-2 hover:text-teal-800">{SITE.email}</a>. We will respond within one calendar month.
            </p>
          </Section>

          <Section title="10. Cookies">
            <p>Our website uses the following types of cookies:</p>
            <ul className="mt-3 space-y-1.5 list-disc pl-5">
              <li><strong>Essential cookies:</strong> required for the website to function — no consent needed</li>
              <li><strong>Analytics cookies:</strong> help us understand how visitors use the site — only set with your consent</li>
            </ul>
            <p className="mt-3">
              You can control cookies through your browser settings at any time.
            </p>
          </Section>

          <Section title="11. How to make a complaint">
            <p>
              If you are unhappy with how we have handled your data, please contact us first at{" "}
              <a href={SITE.emailHref} className="text-teal-700 underline underline-offset-2 hover:text-teal-800">{SITE.email}</a> so we can try to resolve it.
            </p>
            <p className="mt-3">
              You also have the right to lodge a complaint with the UK supervisory authority:
            </p>
            <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">
              <strong>Information Commissioner&rsquo;s Office (ICO)</strong><br />
              Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline underline-offset-2 hover:text-teal-800">ico.org.uk</a><br />
              Helpline: 0303 123 1113
            </div>
          </Section>

          <Section title="12. Changes to this policy">
            <p>
              We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at the top of this page will reflect any changes. We will notify existing clients of material changes by email.
            </p>
          </Section>

          <div className="mt-12 rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-700">Questions about this policy?</p>
            <p className="mt-1 text-sm text-slate-500">
              Contact us at <a href={SITE.emailHref} className="text-teal-700 underline underline-offset-2 hover:text-teal-800">{SITE.email}</a> or call <a href={SITE.phoneHref} className="text-teal-700 underline underline-offset-2 hover:text-teal-800">{SITE.phone}</a>.
            </p>
            <Link href="/contact" className="mt-4 inline-flex rounded-full px-6 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #0a1628, #0f2040)" }}>
              Get in Touch →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">{title}</h2>
      <div className="text-slate-600 leading-relaxed">{children}</div>
    </div>
  );
}
