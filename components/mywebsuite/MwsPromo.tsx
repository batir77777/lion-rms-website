import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function MwsPromo() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl px-7 py-10 sm:px-12 sm:py-12"
            style={{ background: "linear-gradient(135deg,#0c1f3f 0%,#0ea5a0 70%,#10b981 100%)" }}
          >
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="mb-3 inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white">
                  Launch Promotion
                </p>
                <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                  Fire Risk Assessment from <span className="whitespace-nowrap">£250 + VAT</span>
                </h2>
                <p className="mt-2 text-lg font-semibold text-teal-50">
                  Plus 3 months’ free Lion RMS platform access.
                </p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
                  For new clients booking a Fire Risk Assessment, Health &amp; Safety Audit or Fire
                  Strategy. Includes a professional digital report, a prioritised action plan and
                  expert support from experienced fire safety professionals.
                </p>
              </div>
              <div className="lg:text-right">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-navy-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  Book your assessment
                </Link>
                <p className="mt-3 text-xs text-white/70">No commitment · London based, UK-wide</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
