import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Reveal from "@/components/Reveal";
import { COMPANY, SITE } from "@/lib/site";
import { DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

const TITLE = "Company information";
const DESCRIPTION =
  "Statutory company details for Lion Risk Management Solutions — registered name, company number, place of registration and registered office.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/company-information" },
  /*
   * noindex, follow — deliberate, and not a secrecy measure. The particulars are
   * already public on the Companies House register and this page is publicly
   * accessible and crawlable; the directive simply avoids amplifying a
   * residential registered-office address through search results, snippets and
   * caches. `follow` keeps the outbound links live, and robots.txt does NOT
   * disallow this path — a crawler has to fetch the page to read the directive.
   *
   * If the registered office is later changed to a service address, this can
   * become `index: true` and the route can be added to app/sitemap.ts.
   */
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: "/company-information",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-4 sm:flex-row sm:gap-6 sm:py-5">
      <dt className="w-full text-sm font-semibold text-slate-500 sm:w-56 sm:shrink-0">{label}</dt>
      <dd className="text-base font-medium text-navy-900">{value}</dd>
    </div>
  );
}

export default function CompanyInformationPage() {
  return (
    <div className="bg-white">
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Company information" }]}
      />

      <div className="mx-auto max-w-3xl px-4 pb-24 pt-40 sm:px-6">
        <Reveal>
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-extrabold leading-tight text-navy-900">
            Company information
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-500">
            The statutory details of the company behind {SITE.name}, as registered at
            Companies House.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="mt-14 text-xl font-bold text-navy-900">Registered details</h2>
          <dl className="mt-4 border-t border-slate-100">
            <Row label="Registered name" value={COMPANY.legalName} />
            <Row label="Company number" value={COMPANY.number} />
            <Row label="Registered in" value={COMPANY.jurisdiction} />
            <Row label="Registered office" value={COMPANY.registeredOffice} />
            <Row label="Trading name" value={COMPANY.tradingName} />
          </dl>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-base font-bold text-navy-900">
              The registered office is not a visitor address
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              The registered office is the address at which documents may be formally served
              on the company. It is not an office open to visitors, and it is not an
              operational or inspection address. For enquiries, site visits and assessments,
              please use the contact details below.
            </p>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <h2 className="mt-12 text-xl font-bold text-navy-900">Contact</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Email{" "}
            <a
              href={SITE.emailHref}
              className="font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800"
            >
              {SITE.email}
            </a>{" "}
            or call{" "}
            <a
              href={SITE.phoneHref}
              className="font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800"
            >
              {SITE.phone}
            </a>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#0c1f3f,#0ea5a0)" }}
            >
              Contact us &rarr;
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-navy-900 transition hover:border-teal-200 hover:bg-slate-50"
            >
              Privacy Policy
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
