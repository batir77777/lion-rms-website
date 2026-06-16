import Reveal from "@/components/Reveal";
import { Card, SectionLabel, GradientText } from "./MwsUi";
import { FlameIcon, ShieldCheckIcon, CapIcon } from "./MwsIcons";

const GROUPS = [
  {
    title: "Fire Safety Services",
    Icon: FlameIcon,
    items: [
      "Fire Risk Assessments",
      "Fire Strategies",
      "Compartmentation Surveys",
      "Fire Door Inspections",
      "Construction Fire Safety",
      "Fire Safety Audits",
      "Emergency Planning",
      "Evacuation Strategy Reviews",
    ],
  },
  {
    title: "Health & Safety Services",
    Icon: ShieldCheckIcon,
    items: [
      "Health & Safety Audits",
      "Workplace Risk Assessments",
      "Construction Safety Support",
      "CDM Compliance",
      "Method Statement Reviews",
      "Contractor Management",
      "Health & Safety Consultancy",
      "Compliance Inspections",
    ],
  },
  {
    title: "Training & Competency Support",
    Icon: CapIcon,
    items: [
      "Fire Warden Training",
      "Fire Awareness Training",
      "Health & Safety Training",
      "Responsible Person Support",
      "Compliance Management Guidance",
      "Competency Development Programmes",
      "Ongoing Advisory Services",
    ],
  },
];

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-slate-600">
      <svg className="mt-0.5 h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="10" fill="rgba(14,165,160,0.12)" />
        <path d="M6.5 10.3l2.3 2.3 4.7-4.7" stroke="#0ea5a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </li>
  );
}

export default function MwsServices() {
  return (
    <section className="bg-white py-28 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Our Services</SectionLabel>
            <h2 className="mb-5 text-4xl font-extrabold leading-tight text-navy-900 sm:text-5xl">
              More than just a<br />
              <GradientText>fire risk assessment.</GradientText>
            </h2>
            <p className="mb-16 text-lg leading-relaxed text-slate-500">
              Most consultants provide a report and leave you to manage the actions. We combine
              expert consultancy, ongoing support and compliance technology into one complete
              solution.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {GROUPS.map((g, i) => (
            <Reveal key={g.title} delay={i * 70}>
              <Card className="p-8">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <g.Icon className="h-6 w-6" />
                </span>
                <h3 className="mb-5 text-lg font-extrabold text-navy-900">{g.title}</h3>
                <ul className="space-y-2.5">
                  {g.items.map((it) => (
                    <Check key={it}>{it}</Check>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
