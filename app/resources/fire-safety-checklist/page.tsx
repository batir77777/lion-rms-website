import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import PrintButton from "@/components/PrintButton";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Fire Safety Checklist for Landlords & Responsible Persons",
  description:
    "A free fire safety self-check for landlords and Responsible Persons — a starting point before your professional fire risk assessment.",
  alternates: { canonical: "/resources/fire-safety-checklist" },
};

const SECTIONS = [
  {
    title: "Means of escape",
    items: [
      "Escape routes are clear, unobstructed, and adequately wide.",
      "Final exit doors open easily from the inside without a key.",
      "Escape routes have emergency lighting where needed.",
      "Travel distances to a place of safety are reasonable.",
    ],
  },
  {
    title: "Fire doors & compartmentation",
    items: [
      "Fire doors are fitted with intumescent strips and (where required) cold smoke seals.",
      "Fire doors close fully onto the frame and are not wedged open.",
      "Gaps around fire doors are within tolerance (around 3mm).",
      "Penetrations through walls/floors (services, cables) are properly fire-stopped.",
    ],
  },
  {
    title: "Detection & warning",
    items: [
      "Smoke/heat detection is provided appropriate to the building.",
      "The fire alarm (if fitted) is tested regularly and records kept.",
      "Occupants know how the alarm sounds and what to do.",
    ],
  },
  {
    title: "Firefighting & signage",
    items: [
      "Appropriate fire extinguishers are provided, serviced, and accessible.",
      "Fire action notices and escape signage are displayed and legible.",
      "Emergency lighting is tested and maintained.",
    ],
  },
  {
    title: "Management & records",
    items: [
      "A current fire risk assessment is in place and acted upon.",
      "Remedial actions have owners and target dates.",
      "Testing, servicing, and training records are kept up to date.",
      "Occupants/residents have clear fire safety information.",
    ],
  },
];

export default function ChecklistPage() {
  return (
    <article className="bg-white">
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Fire Safety Checklist" }]}
      />
      {/* White header matching site style */}
      <div className="relative isolate overflow-hidden bg-white print:bg-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden print:hidden" aria-hidden>
          <div
            className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30"
            style={{ background: "radial-gradient(ellipse, rgba(14,165,160,0.15) 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-36 sm:px-6 sm:pt-44 print:pt-8">
          <p className="mb-4 inline-block rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-700 print:hidden">
            Free resource
          </p>
          <h1 className="text-3xl font-bold text-navy-900 sm:text-4xl">
            Fire Safety Checklist
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-500 print:text-slate-600">
            A practical starting point for landlords and Responsible Persons. This
            is a self-check to help you spot obvious issues — it does{" "}
            <strong className="text-slate-900">not</strong> replace a
            professional fire risk assessment, which is a legal requirement under the
            Fire Safety Order.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <PrintButton />
        <div className="mt-10 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-semibold text-navy-900">{s.title}</h2>
              <ul className="mt-3 space-y-2">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-slate-300 text-transparent">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 text-center print:hidden">
          <h2 className="text-xl font-bold text-navy-900">
            Want a professional assessment?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
            We carry out fully compliant fire risk assessments across London. Call {SITE.phone} or request one online.
          </p>
          <Link
            href="/contact?service=fire-risk-assessment"
            className="mt-5 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #0ea5a0, #10b981)" }}
          >
            Book a Fire Risk Assessment
          </Link>
        </div>
      </div>
    </article>
  );
}
