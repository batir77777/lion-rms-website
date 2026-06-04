import Reveal from "./Reveal";

function Check() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function ServiceGrid({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {items.map((item, i) => (
        <Reveal key={item} delay={i * 50}>
          <li className="flex items-start gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-sm transition hover:border-brand-200 hover:shadow-md">
            <Check />
            <span className="text-sm font-medium text-ink-800">{item}</span>
          </li>
        </Reveal>
      ))}
    </ul>
  );
}
