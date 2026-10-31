import Image from "next/image";
import Reveal from "./Reveal";

/*
 * `image` was accepted and deliberately ignored for a long time, so every
 * "PhotoHero" was in fact a text hero. It now renders when supplied, and
 * ONLY when supplied: a page that passes no image produces exactly the markup
 * it did before, so adding this changed no existing page.
 *
 * The hero image is the LCP element on any page that has one, hence
 * `priority` and an explicit `sizes`. It sits beside the text on large
 * screens and below it on small ones, so the heading is never pushed under
 * the fold on a phone.
 */
export default function PhotoHero({
  eyebrow,
  title,
  body,
  children,
  image,
  imageAlt,
}: {
  image?: string;
  imageAlt?: string;
  eyebrow: string;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(14,165,160,0.09) 0%, transparent 65%)" }}
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-40 sm:px-6 sm:pb-24">
        <div className={image ? "grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]" : "max-w-3xl"}>
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
              {eyebrow}
            </p>
            <h1 className="text-[clamp(2.5rem,5.5vw,4rem)] font-extrabold leading-[1.05] tracking-tight text-navy-900">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-500">
              {body}
            </p>
            {children && <div className="mt-8">{children}</div>}
          </Reveal>

          {image && (
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm lg:aspect-[5/4]">
                <Image
                  src={image}
                  alt={imageAlt ?? ""}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
