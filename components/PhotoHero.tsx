import Image from "next/image";
import Reveal from "./Reveal";

export default function PhotoHero({
  image,
  eyebrow,
  title,
  body,
  children,
}: {
  image: string;
  eyebrow: string;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      <div className="absolute inset-0 animate-slow-zoom" aria-hidden>
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 to-ink-950/90" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-36 sm:px-6 sm:pb-28 sm:pt-44">
        <div className="max-w-3xl">
          <Reveal>
            <p className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur">
              {eyebrow}
            </p>
            <h1 className="text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-200">
              {body}
            </p>
            {children && <div className="mt-8">{children}</div>}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
