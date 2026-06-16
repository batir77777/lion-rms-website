// A branded vector illustration (created in code) — the "report → live
// compliance" story: a building protected by a fire-safety shield, with a live
// dashboard. Scalable and sharp on any screen.
export default function ComplianceArt({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fire safety compliance illustration">
      <defs>
        <linearGradient id="lr-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0c1f3f" />
          <stop offset="0.55" stopColor="#0ea5a0" />
          <stop offset="1" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="lr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0fdfa" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      {/* Soft background */}
      <circle cx="240" cy="200" r="190" fill="url(#lr-sky)" />
      <circle cx="240" cy="200" r="190" fill="#0ea5a0" opacity="0.05" />

      {/* Building */}
      <rect x="150" y="120" width="120" height="210" rx="8" fill="#0c1f3f" />
      <rect x="150" y="120" width="120" height="210" rx="8" fill="url(#lr-grad)" opacity="0.12" />
      {[0, 1, 2, 3, 4].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}-${c}`} x={166 + c * 32} y={140 + r * 36} width="20" height="22" rx="3" fill="#10b981" opacity={(r + c) % 2 ? 0.35 : 0.6} />
        )),
      )}
      <rect x="196" y="300" width="28" height="30" rx="2" fill="#0ea5a0" opacity="0.5" />

      {/* Shield with check */}
      <g transform="translate(252 60)">
        <path d="M44 6l40 16v26c0 26-18 43-40 51C22 91 4 74 4 48V22L44 6Z" fill="url(#lr-grad)" />
        <path d="M44 6l40 16v26c0 26-18 43-40 51C22 91 4 74 4 48V22L44 6Z" fill="#ffffff" opacity="0.06" />
        <path d="M30 49l10 10 20-22" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* Live dashboard card */}
      <g transform="translate(286 196)">
        <rect x="0" y="0" width="150" height="118" rx="12" fill="#ffffff" stroke="#e2e8f0" />
        <rect x="0" y="0" width="150" height="30" rx="12" fill="#0c1f3f" />
        <circle cx="16" cy="15" r="4" fill="#10b981" />
        <rect x="28" y="11" width="70" height="8" rx="4" fill="#ffffff" opacity="0.6" />
        {/* bars */}
        <rect x="18" y="92" width="16" height="14" rx="3" fill="#0ea5a0" opacity="0.5" />
        <rect x="42" y="78" width="16" height="28" rx="3" fill="#0ea5a0" opacity="0.65" />
        <rect x="66" y="62" width="16" height="44" rx="3" fill="#10b981" />
        <rect x="90" y="84" width="16" height="22" rx="3" fill="#0ea5a0" opacity="0.55" />
        <rect x="114" y="70" width="16" height="36" rx="3" fill="#10b981" opacity="0.8" />
        {/* trend line */}
        <path d="M18 56 L52 48 L86 38 L120 30" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="18" y="40" width="48" height="6" rx="3" fill="#e2e8f0" />
      </g>

      {/* Flame accent */}
      <g transform="translate(110 250)">
        <circle cx="20" cy="20" r="26" fill="#10b981" opacity="0.1" />
        <path d="M20 4s9 6 9 17a9 9 0 1 1-18 0c0-3.4 1.7-6.2 3.2-8.1.4 3.2 2.6 4.5 3.6 4.9C18 16.6 17.8 12.2 20 4Z" fill="url(#lr-grad)" />
      </g>

      {/* Floating check tags */}
      <g transform="translate(70 130)">
        <rect x="0" y="0" width="92" height="26" rx="13" fill="#ffffff" stroke="#cdeee9" />
        <circle cx="14" cy="13" r="6" fill="#10b981" />
        <path d="M11 13l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="26" y="9" width="54" height="8" rx="4" fill="#e2e8f0" />
      </g>
    </svg>
  );
}
