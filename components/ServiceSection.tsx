import Link from "next/link";
import Image from "next/image";
import Reveal from "./Reveal";
import ServiceIcon from "./ServiceIcon";
import DashboardMockup from "./DashboardMockup";
import type { ServiceCategory } from "@/lib/site";

export default function ServiceSection({
  cat,
  index,
}: {
  cat: ServiceCategory;
  index: number;
}) {
  const flip = index % 2 === 1;
  return (
    <section
      id={cat.slug}
      data-nav="/services"
      className={`scroll-mt-24 ${flip ? "bg-slate-50" : "bg-white"}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className={flip ? "lg:order-2" : ""}>
            {cat.slug === "digital-compliance" ? (
              <DashboardMockup />
            ) : (
              <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl ring-1 ring-slate-900/5">
                <Image
                  src={cat.image}
                  alt={cat.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
              </div>
            )}
          </Reveal>

          <Reveal className={flip ? "lg:order-1" : ""}>
            <div>
              <div className="mb-5 inline-flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(135deg, #0ea5a0, #10b981)" }}>
                  <ServiceIcon slug={cat.slug} className="h-6 w-6" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">
                  {cat.eyebrow}
                </span>
              </div>
              <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                {cat.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-500">
                {cat.short}
              </p>
              <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {cat.items.map((item) => (
                  <li key={item.name} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{item.name}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/services/${cat.slug}`}
                className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #0ea5a0, #10b981)" }}
              >
                Explore {cat.title}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
