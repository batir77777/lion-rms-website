import { SITE, SITE_URL } from "@/lib/site";
import { getAuthor } from "@/lib/people";

// ---------------------------------------------------------------------------
// Structured-data builders for Knowledge Centre content pages
// (Phase 5A, PR 3).
//
// Scope note: this module is used ONLY by the new /guides routes. The five
// existing scattered JSON-LD components (StructuredData, PersonJsonLd,
// BreadcrumbJsonLd, FaqJsonLd, plus inline per-page objects) are deliberately
// NOT migrated here — that refactor touches structured data across the whole
// existing site and belongs to the separately-scoped PR 10. These builders are
// written in a shape PR 10 can adopt wholesale rather than replace.
//
// The correction worth calling out: the previous Article JSON-LD hardcoded the
// author as the literal string "Batir Turakulov". Every content item carries a
// validated `authorId`, and lib/people.ts holds a proper Person registry, so
// `author` is now a real Person object with a job title and a URL — which is
// what carries author authority on exactly the pages that need it most.
// ---------------------------------------------------------------------------

/**
 * Site-level fallback social image, matching the default already set in
 * app/layout.tsx. Content items may set `featuredImageSrc`; where they don't,
 * og:image still resolves to something, because a shared link with no image is
 * materially less likely to be clicked and the absence is invisible during
 * normal browsing.
 */
export const DEFAULT_OG_IMAGE = "/images/hero-banner.jpg";

const publisher = {
  "@type": "Organization",
  name: SITE.name,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}${SITE.logo}` },
};

export function buildPersonRef(authorId: string) {
  const person = getAuthor(authorId);
  if (!person) {
    // Unreachable in practice — authorId is enum-validated against the
    // registry at content-build time — but returning undefined rather than a
    // half-built node keeps a bad id out of the emitted schema.
    return undefined;
  }
  return {
    "@type": "Person",
    name: person.name,
    jobTitle: person.jobTitle,
    url: `${SITE_URL}/about`,
  };
}

export interface ArticleSchemaInput {
  schemaType: "Article" | "TechArticle";
  headline: string;
  description: string;
  path: string;
  authorId: string;
  datePublished?: string;
  dateModified?: string;
  articleSection?: string;
  image?: string;
}

export function buildArticleSchema(input: ArticleSchemaInput) {
  const url = `${SITE_URL}${input.path}`;
  return {
    "@context": "https://schema.org",
    "@type": input.schemaType,
    headline: input.headline,
    description: input.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.articleSection ? { articleSection: input.articleSection } : {}),
    ...(input.image ? { image: `${SITE_URL}${input.image}` } : {}),
    author: buildPersonRef(input.authorId),
    publisher,
  };
}

export interface CollectionPageInput {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}

export function buildCollectionPageSchema(input: CollectionPageInput) {
  const url = `${SITE_URL}${input.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: input.items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: `${SITE_URL}${item.path}`,
      })),
    },
    publisher,
  };
}
