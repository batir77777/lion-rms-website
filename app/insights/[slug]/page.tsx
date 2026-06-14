import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { POSTS, getPost } from "@/lib/insights";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return { title: "Insights" };
  return { title: p.title, description: p.excerpt };
}

function render(body: string) {
  return body.split("\n\n").map((block, i) => {
    const t = block.trim();
    if (t.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-8 text-xl font-bold text-slate-900">
          {t.slice(3)}
        </h2>
      );
    }
    const parts = t.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
      seg.startsWith("**") && seg.endsWith("**") ? (
        <strong key={j}>{seg.slice(2, -2)}</strong>
      ) : (
        <span key={j}>{seg}</span>
      ),
    );
    return (
      <p key={i} className="mt-4 text-base leading-relaxed text-slate-600">
        {parts}
      </p>
    );
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    datePublished: p.date,
    dateModified: p.date,
    author: { "@type": "Person", name: "Batir Turakulov" },
    publisher: { "@type": "Organization", name: SITE.name },
    description: p.excerpt,
    url: `https://www.lionrms.uk/insights/${p.slug}`,
  };

  return (
    <article className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* White article header */}
      <div className="relative isolate overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30"
            style={{ background: "radial-gradient(ellipse, rgba(14,165,160,0.15) 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-36 sm:px-6 sm:pt-44">
          <Reveal>
            <p className="mb-4 inline-block rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-600">
              {p.dateLabel} · Insights
            </p>
            <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              {p.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-600">
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Reveal>
          <div>{render(p.body)}</div>
        </Reveal>

        <div className="mt-12 rounded-2xl p-8 text-center" style={{ background: "#0f172a" }}>
          <h2 className="text-2xl font-bold text-white">
            Discuss fire safety on your project
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-300">
            Construction-phase fire safety, fire strategies, RAMS and more. Call{" "}
            {SITE.phone} or request a consultation.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #0ea5a0, #10b981)" }}
          >
            Get in touch
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          <Link href="/insights" className="font-semibold text-teal-600 hover:underline">
            ← All insights
          </Link>
        </p>
      </div>
    </article>
  );
}
