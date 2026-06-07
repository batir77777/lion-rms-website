import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import PrintButton from "@/components/PrintButton";

export const metadata: Metadata = {
  title: "Fire Safety Checklist for Landlords & Responsible Persons",
  description:
    "A free fire safety self-check for landlords and Responsible Persons — a starting point before your professional fire risk assessment.",
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
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
          Free resource
        </p>
        <h1 className="mt-2 text-3xl font-bold text-ink-950 sm:text-4xl">
          Fire Safety Checklist
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          A practical starting point for landlords and Responsible Persons. This
          is a self-check to help you spot obvious issues — it does{" "}
          <strong>not</strong> replace a professional fire risk assessment, which
          is a legal requirement under the Fire Safety Order.
        </p>

        <PrintButton />

        <div className="mt-10 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-semibold text-ink-950">{s.title}</h2>
              <ul className="mt-3 space-y-2">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-700">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-ink-300 text-transparent">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-ink-50 p-6 text-center print:hidden">
          <h2 className="text-xl font-bold text-ink-950">
            Want a professional assessment?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-ink-600">
            We carry out fully compliant fire risk assessments across East London. Call {SITE.phone} or request one online.
          </p>
          <Link
            href="/contact?service=fire-risk-assessment"
            className="mt-5 inline-block rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
          >
            Book a Fire Risk Assessment
          </Link>
        </div>
      </div>
    </article>
  );
}
