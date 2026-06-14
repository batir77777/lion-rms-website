import { CREDENTIALS } from "@/lib/site";

function Badge() {
  return (
    <svg className="h-4 w-4 text-teal-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M10 1l2.4 1.7 2.9.1 1 2.8 2 2.1-1 2.8.4 2.9-2.4 1.7-1.2 2.7-2.9-.3L10 19l-2.2-1.7-2.9.3-1.2-2.7-2.4-1.7.4-2.9-1-2.8 2-2.1 1-2.8 2.9-.1L10 1zm-1 11.4l4.3-4.3-1.2-1.2L9 10l-1.6-1.6-1.2 1.2L9 12.4z" clipRule="evenodd" />
    </svg>
  );
}

export default function CredentialsBand() {
  return (
    <section className="border-y border-ink-100 bg-ink-50">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
            Qualified &amp; accredited
          </span>
          {CREDENTIALS.map((c) => (
            <span key={c} className="flex items-center gap-2 text-sm font-semibold text-ink-700">
              <Badge />
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
