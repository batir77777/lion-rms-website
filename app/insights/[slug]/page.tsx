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

// Minimal markdown: "## " headings, **bold**, blank-line paragraphs.
function render(body: string) {
  return body.split("\n\n").map((block, i) => {
    const t = block.trim();
    if (t.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-8 text-xl font-bold text-ink-950">
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
      <p key={i} className="mt-4 text-base leading-relaxed text-ink-700">
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
      {/* Dark article header — consistent with the fixed transparent header. */}
      <div className="bg-ink-950">
        <div className="mx-auto max-w-3xl px-4 pb-14 pt-36 sm:px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">
              {p.dateLabel} · Insights
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
              {p.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-medium text-ink-200">
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

        <div className="mt-12 rounded-2xl bg-brand-800 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">
            Discuss fire safety on your project
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-brand-100">
            Construction-phase fire safety, fire strategies, RAMS and more. Call{" "}
            {SITE.phone} or request a consultation.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition hover:bg-ink-100"
          >
            Get in touch
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-ink-500">
          <Link href="/insights" className="font-semibold text-brand-700 hover:underline">
            ← All insights
          </Link>
        </p>
      </div>
    </article>
  );
}
