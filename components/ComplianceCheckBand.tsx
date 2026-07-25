import Link from "next/link";
import Reveal from "@/components/Reveal";

// Homepage promo band for the free Compliance Self-Check tool (/check).
// Sits directly under the hero — the tool previously had no internal links
// anywhere on the site, despite being a strong, ready-built lead magnet.
export default function ComplianceCheckBand() {
  return (
    <section className="border-b border-slate-100 bg-white py-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal>
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-teal-100 bg-teal-50/60 p-7 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm" aria-hidden>
                🧭
              </span>
              <div>
                <p className="text-base font-bold text-navy-900">
                  Not sure if you&apos;re compliant?
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Complete our free 2-minute Fire Safety Compliance Check — instant red / amber / green score, no sign-up needed.
                </p>
              </div>
            </div>
            <Link
              href="/check"
              className="inline-flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #0c1f3f, #0ea5a0)" }}
            >
              Start the Check &rarr;
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
