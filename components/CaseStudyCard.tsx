import Link from "next/link";
import Reveal from "@/components/Reveal";

interface CaseStudyCardProps {
  href?: string; // present only for case studies with a full detail page
  sectorLabel: string;
  title: string;
  body: string;
  tags: string[];
  delay?: number;
}

// Shared card used on /case-studies for both the three detailed case studies
// (which link through to /case-studies/[slug]) and the remaining
// summary-only entries (which don't yet have a detail page).
export default function CaseStudyCard({
  href,
  sectorLabel,
  title,
  body,
  tags,
  delay = 0,
}: CaseStudyCardProps) {
  const content = (
    <>
      <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
        {sectorLabel}
      </p>
      <h2 className="mb-4 text-xl font-bold text-navy-900 leading-snug">{title}</h2>
      <p className="flex-1 text-base leading-relaxed text-slate-500">{body}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700"
          >
            {t}
          </span>
        ))}
      </div>
      {href && (
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
          Read the case study
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </>
  );

  const cardClass =
    "flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl";

  return (
    <Reveal delay={delay}>
      {href ? (
        <Link href={href} className={`group block ${cardClass}`}>
          {content}
        </Link>
      ) : (
        <article className={cardClass}>{content}</article>
      )}
    </Reveal>
  );
}
