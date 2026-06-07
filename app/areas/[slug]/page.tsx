import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import CtaButtons from "@/components/CtaButtons";
import { AREAS, getArea } from "@/lib/areas";
import { IMAGES, SERVICE_CATEGORIES, SITE } from "@/lib/site";

export function generateStaticParams() {
  return AREAS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArea(slug);
  if (!a) return { title: "Area" };
  return {
    title: `Fire Risk Assessment in ${a.name}, London`,
    description: `Professional fire risk assessments, fire strategies, fire door inspections and health & safety consultancy in ${a.name}, London. Chartered, qualified and insured. Call ${SITE.phone}.`,
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArea(slug);
  if (!a) notFound();

  const fire =
    SERVICE_CATEGORIES.find((c) => c.slug === "fire-safety")?.items.map((i) => i.name) ?? [];
  const hs =
    SERVICE_CATEGORIES.find((c) => c.slug === "health-safety")?.items.map((i) => i.name) ?? [];
  const services = [...fire, ...hs.slice(0, 3)];

  return (
    <>
      <PhotoHero
        image={IMAGES.city}
        eyebrow={`${a.name} · London`}
        title={`Fire Risk Assessment in ${a.name}`}
        body={`Fire risk assessments and fire & health & safety consultancy for ${a.name} — ${a.note}.`}
      >
        <CtaButtons />
      </PhotoHero>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <Reveal>
            <div className="space-y-4 text-base leading-relaxed text-ink-700">
              <p>
                Lion Risk Management Solutions provides fire risk assessments,
                fire strategies, fire door inspections and health &amp; safety
                support to landlords, managing agents, businesses and developers
                in {a.name}. The area is characterised by {a.note}, and every
                assessment is tailored to the specific premises.
              </p>
              <p>
                Your assessment is carried out personally by a Chartered
                consultant (CMIOSH, AIFireE, MIFSM) — not a call centre — and is
                grounded in the Regulatory Reform (Fire Safety) Order 2005, with
                clear, prioritised, plain-English recommendations.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <h2 className="mt-10 text-xl font-bold text-ink-950">
              Services in {a.name}
            </h2>
            <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {services.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-ink-800">
                  <span className="mt-0.5 text-brand-600">✓</span>
                  <span className="font-medium">{s}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-12 rounded-2xl bg-brand-800 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">
              Book a fire risk assessment in {a.name}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-brand-100">
              Tell us about your premises and we&apos;ll arrange a compliant
              assessment. Call {SITE.phone} or request one online.
            </p>
            <div className="mt-6 flex justify-center">
              <CtaButtons variant="final" />
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-ink-500">
            <Link href="/areas" className="font-semibold text-brand-700 hover:underline">
              ← All London areas we cover
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
