import Reveal from "./Reveal";
import { WHO_WE_HELP } from "@/lib/site";

export default function WhoWeHelp() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-700">
            Who we help
          </p>
          <h2 className="max-w-2xl text-3xl font-bold text-ink-950 sm:text-4xl">
            Tailored support for your sector
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {WHO_WE_HELP.map((a, i) => (
            <Reveal key={a.title} delay={i * 70}>
              <div className="flex h-full gap-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md">
                <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-ink-950">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{a.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
