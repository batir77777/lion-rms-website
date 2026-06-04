import Reveal from "./Reveal";

export default function PageHero({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <section className="bg-ink-950">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-300">
            {eyebrow}
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-200">
            {body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
