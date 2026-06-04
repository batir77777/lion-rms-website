import Link from "next/link";

type Variant = "hero" | "final";

export default function CtaButtons({ variant = "hero" }: { variant?: Variant }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Link
        href="/contact"
        className="rounded-full bg-brand-600 px-7 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-500"
      >
        Request a Consultation
      </Link>
      <Link
        href="/contact?service=fire-risk-assessment"
        className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-center text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
      >
        Book a Fire Risk Assessment
      </Link>
      {variant === "final" && (
        <Link
          href="/contact?service=digital-compliance"
          className="rounded-full border border-white/30 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Discuss a Digital Compliance Solution
        </Link>
      )}
    </div>
  );
}
