import Link from "next/link";
import Reveal from "@/components/Reveal";

// Compliance-check promo card used on the services listing page and each
// individual service detail page (Phase 4A — feature the tool on every
// service page, not just link to it in passing).
export default function ServiceCheckCTA() {
  return (
    <Reveal>
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-teal-200 bg-white p-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
            Free tool
          </p>
          <h3 className="mt-2 text-lg font-bold text-navy-900">
            Want to know where you stand right now?
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
            Take the free 2-minute Compliance Check for an instant read on your
            fire and health &amp; safety exposure before you book an assessment.
          </p>
        </div>
        <Link
          href="/check"
          className="inline-flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-teal-200 bg-teal-50 px-6 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-100"
        >
          Take the Check &rarr;
        </Link>
      </div>
    </Reveal>
  );
}
