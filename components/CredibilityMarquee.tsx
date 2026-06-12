import { MEMBERSHIPS, STANDARDS_ROW } from "@/lib/site";

// Credibility strip: professional memberships shown statically, the standards
// we work to as a slow marquee. Duplicate run is aria-hidden; the marquee
// animation is disabled entirely under prefers-reduced-motion (globals.css).

function BadgeIcon() {
  return (
    <svg className="h-4 w-4 text-brand-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M10 1l2.4 1.7 2.9.1 1 2.8 2 2.1-1 2.8.4 2.9-2.4 1.7-1.2 2.7-2.9-.3L10 19l-2.2-1.7-2.9.3-1.2-2.7-2.4-1.7.4-2.9-1-2.8 2-2.1 1-2.8 2.9-.1L10 1zm-1 11.4l4.3-4.3-1.2-1.2L9 10l-1.6-1.6-1.2 1.2L9 12.4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StandardsRun({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-12 pr-12"
      aria-hidden={hidden || undefined}
    >
      {STANDARDS_ROW.map((s) => (
        <span
          key={s}
          className="whitespace-nowrap font-display text-sm font-semibold tracking-tight text-ink-400"
        >
          {s}
        </span>
      ))}
    </div>
  );
}

export default function CredibilityMarquee() {
  return (
    <section className="border-b border-white/5 bg-ink-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Memberships — static, named, precise. */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-500">
            Professional memberships
          </span>
          {MEMBERSHIPS.map((m) => (
            <span key={m} className="flex items-center gap-2 text-sm font-semibold text-ink-200">
              <BadgeIcon />
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Standards — slow marquee with edge fades. */}
      <div className="relative overflow-hidden border-t border-white/5 py-5">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent"
          aria-hidden
        />
        <div className="flex w-max animate-marquee">
          <StandardsRun />
          <StandardsRun hidden />
        </div>
      </div>
    </section>
  );
}
