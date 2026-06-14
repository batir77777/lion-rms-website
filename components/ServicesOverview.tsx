import Link from "next/link";
import Reveal from "./Reveal";

const CARDS: {
  title: string;
  body: string;
  href: string;
  icon: React.ReactNode;
}[] = [
  {
    title: "Fire Risk Assessments",
    body: "Suitable and sufficient assessments to PAS 79 — prioritised actions that satisfy the Fire Safety Order and protect occupants.",
    href: "/services/fire-safety",
    icon: (
      <path d="M12 2.5c1.2 3 3.4 4.2 3.4 7.1 0 1-.4 1.9-1 2.6.7.3 2.1 1.4 2.1 3.6A4.5 4.5 0 0 1 12 20a4.5 4.5 0 0 1-4.5-4.2c0-3.4 2.6-4.3 2.6-7.2 0 1.3.7 2 1.5 2.4-.2-2.6 0-4.7.9-6.5Z" />
    ),
  },
  {
    title: "Fire Strategy",
    body: "Design-stage strategies that carry planning and Building Regulations approvals for new-build and change-of-use projects.",
    href: "/services/fire-safety",
    icon: (
      <>
        <path d="M4 20V8l8-4.5L20 8v12" />
        <path d="M9.5 20v-6h5v6M4 12h16" />
      </>
    ),
  },
  {
    title: "Health & Safety",
    body: "Risk assessments, audits, RAMS, and competent-person support that keep your people safe and your duties met.",
    href: "/services/health-safety",
    icon: (
      <>
        <path d="M12 3l7 3v5c0 4.4-3 8-7 9-4-1-7-4.6-7-9V6l7-3Z" />
        <path d="M12 8.5v5M9.5 11h5" />
      </>
    ),
  },
  {
    title: "Training",
    body: "On-site fire and safety training that turns staff and marshals into your first line of defence — practical, not box-ticking.",
    href: "/services/fire-safety",
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19.5c.6-3.1 2.8-5 5.5-5s4.9 1.9 5.5 5M16 4.5c1.6.6 2.5 2 2.5 3.5S17.6 11 16 11.5M18 14.8c1.8.7 2.9 2.4 3.3 4.7" />
      </>
    ),
  },
  {
    title: "Digital Compliance Tools",
    body: "Bespoke portals and dashboards that track inspections, actions, and records — audit-ready visibility across your portfolio.",
    href: "/services/digital-compliance",
    icon: (
      <>
        <rect x="3" y="4.5" width="18" height="12" rx="1.5" />
        <path d="M3 9h18M8 20h8M12 16.5V20" />
      </>
    ),
  },
];

export default function ServicesOverview() {
  return (
    <section className="bg-white" data-nav="/services">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">
            What we do
          </p>
          <h2 className="max-w-2xl text-3xl font-bold text-navy-900 sm:text-5xl">
            One platform. Every angle of compliance covered.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 70}>
              <Link
                href={c.href}
                className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-md"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                    aria-hidden
                  >
                    {c.icon}
                  </svg>
                </span>
                <h3 className="font-display text-lg font-semibold text-navy-900">
                  {c.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-500">
                  {c.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 transition-transform group-hover:translate-x-1">
                  Learn more <span aria-hidden>→</span>
                </span>
              </Link>
            </Reveal>
          ))}
          <Reveal delay={CARDS.length * 70}>
            <Link
              href="/contact"
              className="group flex h-full flex-col justify-between rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1.5"
              style={{ background: "linear-gradient(135deg, #0ea5a0, #10b981)" }}
            >
              <div>
                <h3 className="font-display text-lg font-semibold text-white">
                  Not sure what you need?
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/80">
                  Describe the building or project and we&apos;ll tell you exactly
                  what applies — no obligation, no jargon.
                </p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-transform group-hover:translate-x-1">
                Talk it through <span aria-hidden>→</span>
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
