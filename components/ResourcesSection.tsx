import Link from "next/link";
import Reveal from "./Reveal";
import { RESOURCES } from "@/lib/site";

export default function ResourcesSection() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-600">
            Free resources
          </p>
          <h2 className="max-w-2xl text-3xl font-bold text-navy-900 sm:text-4xl">
            Helpful tools, training, and community
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {RESOURCES.map((r, i) => (
            <Reveal key={r.title} delay={i * 70}>
              {r.external ? (
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-navy-900">{r.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{r.body}</p>
                  <span className="mt-4 text-sm font-semibold text-teal-600">Open →</span>
                </a>
              ) : (
                <Link
                  href={r.href}
                  className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-navy-900">{r.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{r.body}</p>
                  <span className="mt-4 text-sm font-semibold text-teal-600">View →</span>
                </Link>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
