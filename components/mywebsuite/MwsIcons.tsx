// Clean, monoline SVG icons (Lucide-style) — created in code, no external assets.
import type { ReactNode } from "react";

type P = { className?: string };
const S = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
);

export const FlameIcon = ({ className }: P) => (
  <S className={className}>
    <path d="M12 3s4 3 4 8a4 4 0 1 1-8 0c0-1.6.8-2.9 1.5-3.8.2 1.5 1.2 2.1 1.7 2.3C10.7 9.7 10.6 7.4 12 3Z" />
  </S>
);

export const ShieldCheckIcon = ({ className }: P) => (
  <S className={className}>
    <path d="M12 3l7 3v5c0 4.6-3.1 7.6-7 9-3.9-1.4-7-4.4-7-9V6l7-3Z" />
    <path d="M9 12l2 2 4-4" />
  </S>
);

export const CapIcon = ({ className }: P) => (
  <S className={className}>
    <path d="M2 9l10-4 10 4-10 4L2 9Z" />
    <path d="M6 11v4c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-4" />
  </S>
);

export const BlocksIcon = ({ className }: P) => (
  <S className={className}>
    <rect x="3" y="3" width="9" height="9" rx="1.5" />
    <rect x="12" y="12" width="9" height="9" rx="1.5" />
    <path d="M12 7.5h3a1.5 1.5 0 0 1 1.5 1.5v3" />
  </S>
);

export const PoundIcon = ({ className }: P) => (
  <S className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 16.5h6M9.5 16.5c1-1 1-2 1-3.5 0-1.2-.3-2.2-.3-3 0-1.4 1-2.3 2.3-2.3 1 0 1.7.5 2 1.2M9 12.5h4" />
  </S>
);

export const GiftIcon = ({ className }: P) => (
  <S className={className}>
    <rect x="3.5" y="9" width="17" height="12" rx="1.5" />
    <path d="M3.5 13.5h17M12 9v12" />
    <path d="M12 9C12 6.5 10 5 8.7 6c-1.3 1 .3 3 3.3 3 3 0 4.6-2 3.3-3-1.3-1-3.3.5-3.3 3Z" />
  </S>
);

export const ClockIcon = ({ className }: P) => (
  <S className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.2 2" />
  </S>
);

export const PinIcon = ({ className }: P) => (
  <S className={className}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </S>
);
