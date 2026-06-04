const PATHS: Record<string, React.ReactNode> = {
  "fire-safety": (
    <path d="M12 2.5c1.2 3 3.4 4.2 3.4 7.1 0 1-.4 1.9-1 2.6.7.3 2.1 1.4 2.1 3.6A4.5 4.5 0 0 1 12 20a4.5 4.5 0 0 1-4.5-4.2c0-3.4 2.6-4.3 2.6-7.2 0 1.3.7 2 1.5 2.4-.2-2.6 0-4.7.9-6.5Z" />
  ),
  "health-safety": (
    <>
      <path d="M12 3l7 3v5c0 4.4-3 8-7 9-4-1-7-4.6-7-9V6l7-3Z" />
      <path d="M12 8.5v5M9.5 11h5" />
    </>
  ),
  "digital-compliance": (
    <>
      <rect x="3" y="4.5" width="18" height="12" rx="1.5" />
      <path d="M3 9h18M8 20h8M12 16.5V20" />
    </>
  ),
};

export default function ServiceIcon({
  slug,
  className = "h-6 w-6",
}: {
  slug: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[slug] ?? null}
    </svg>
  );
}
