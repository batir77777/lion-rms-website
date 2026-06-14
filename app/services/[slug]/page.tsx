import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import CtaButtons from "@/components/CtaButtons";
import { SERVICE_CATEGORIES, getCategory } from "@/lib/site";

export function generateStaticParams() {
  return SERVICE_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return { title: "Service" };
  return { title: cat.title, description: cat.intro };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  return (
    <>
      <PhotoHero image={cat.image} eyebrow={cat.eyebrow} title={cat.title} body={cat.intro} />
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {cat.items.map((item, i) => (
              <Reveal key={item.name} delay={i * 50}>
                <div className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h2 className="text-base font-semibold text-slate-900">
                    {item.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-8">
            <div className="flex gap-4 text-sm">
              {SERVICE_CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => (
                <Link
                  key={c.slug}
                  href={`/services/${c.slug}`}
                  className="font-medium text-teal-600 hover:underline"
                >
                  {c.title} →
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-2xl p-8 text-center" style={{ background: "#0f172a" }}>
            <h2 className="text-2xl font-bold text-white">
              Discuss your {cat.eyebrow.toLowerCase()} requirements
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
              Tell us about your premises or project and we&apos;ll recommend a
              proportionate, compliant way forward.
            </p>
            <div className="mt-6 flex justify-center">
              <CtaButtons variant="final" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
