import Link from "next/link";
import Reveal from "@/components/Reveal";
import { RECENT_PROJECTS } from "@/lib/site";

// Homepage authority-building section — anonymised recent-work highlights,
// condensed from the fuller entries on /case-studies.
export default function RecentProjects() {
  return (
    <section className="border-b border-slate-100 bg-white py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
            Recent Projects
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-800 sm:text-4xl">
            Recent Work
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            A snapshot of what we&apos;ve delivered recently — from individual
            assessments to full ongoing compliance support.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {RECENT_PROJECTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <div className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-100 hover:shadow-md">
                <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
                  {p.sector}
                </p>
                <h3 className="text-sm font-bold text-slate-800">{p.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:underline"
          >
            View all case studies &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
