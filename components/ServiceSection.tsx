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
      className={`scroll-mt-24 ${flip ? "bg-ink-50" : "bg-white"}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <Reveal className={flip ? "lg:order-2" : ""}>
            {cat.slug === "digital-compliance" ? (
              <DashboardMockup />
            ) : (
              <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl ring-1 ring-ink-900/5">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
              </div>
            )}
          </Reveal>

          {/* Content */}
          <Reveal className={flip ? "lg:order-1" : ""}>
            <div>
              <div className="mb-5 inline-flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <ServiceIcon slug={cat.slug} className="h-6 w-6" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
                  {cat.eyebrow}
                </span>
              </div>
              <h2 className="text-3xl font-bold leading-tight text-ink-950 sm:text-4xl">
                {cat.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-600">
                {cat.short}
              </p>
              <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {cat.items.map((item) => (
                  <li key={item.name} className="flex items-start gap-2.5 text-sm text-ink-800">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{item.name}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/services/${cat.slug}`}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 hover:shadow-ember"
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
