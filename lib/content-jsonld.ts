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

export interface DefinedTermInput {
  name: string;
  description: string;
  path: string;
  /** Synonyms plus, for an abbreviation, the full form it stands for. */
  alternateNames?: string[];
  /** The abbreviation itself, e.g. "AFD" — omitted where the term is not one. */
  termCode?: string;
  /** Absolute URL of the DefinedTermSet this term belongs to. */
  inDefinedTermSet: string;
}

/**
 * A single Glossary term (Phase 5A, PR 4).
 *
 * `inDefinedTermSet` is what ties every term back to one sitewide set rather
 * than leaving twelve unrelated DefinedTerm nodes scattered across the site.
 * The set itself lives on /glossary — see buildDefinedTermSetSchema — because
 * repeating the full set on every term page would be noise.
 */
export function buildDefinedTermSchema(input: DefinedTermInput) {
  const url = `${SITE_URL}${input.path}`;
  const alternates = (input.alternateNames ?? []).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: input.name,
    description: input.description,
    url,
    "@id": url,
    ...(alternates.length > 0
      ? { alternateName: alternates.length === 1 ? alternates[0] : alternates }
      : {}),
    ...(input.termCode ? { termCode: input.termCode } : {}),
    inDefinedTermSet: input.inDefinedTermSet,
  };
}

export interface StandardSchemaInput {
  /** Our headline for the page — not the document's own title. */
  headline: string;
  description: string;
  path: string;
  authorId: string;
  datePublished?: string;
  dateModified?: string;
  articleSection?: string;
  /** The external document this page is about. */
  document: {
    /** The document's own title, as its publisher writes it. */
    name: string;
    /** The designation, e.g. "PAS 79-1:2020". */
    identifier: string;
    /** Edition, where the document has one. */
    version?: string;
    /** The publishing body — BSI, HM Government, HSE. NOT this site. */
    publisher: string;
    /** The publisher's own page for the document. */
    url: string;
  };
}

/**
 * A Standards library page (Phase 5A, PR 5).
 *
 * There is no schema.org type for a standard, and the gap has to be handled
 * honestly rather than approximately.
 *
 * This page is Lion RMS's COMMENTARY ON a document. It is not the document.
 * Marking it up as though it were would claim BSI's — or the Crown's —
 * intellectual property as this site's content in structured data, which is
 * wrong on the facts and, for the commercially licensed material, unwise.
 *
 * So the outer node is a TechArticle whose `author` and `publisher` are ours,
 * and the document appears as a nested CreativeWork under `about` with its own
 * publisher and identifier. The two publisher fields carrying different values
 * is the entire point of the shape, not an oversight.
 *
 * `about` is deliberately unchanged by a document's status. A withdrawn
 * standard is still the same work; supersession is expressed in the visible
 * banner and the internal link graph, rather than forced into a schema.org
 * property that does not carry that meaning cleanly.
 */
export function buildStandardSchema(input: StandardSchemaInput) {
  const url = `${SITE_URL}${input.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: input.headline,
    description: input.description,
    url,
    "@id": url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.articleSection ? { articleSection: input.articleSection } : {}),
    author: buildPersonRef(input.authorId),
    publisher,
    about: {
      "@type": "CreativeWork",
      name: input.document.name,
      identifier: input.document.identifier,
      ...(input.document.version ? { version: input.document.version } : {}),
      publisher: { "@type": "Organization", name: input.document.publisher },
      url: input.document.url,
    },
  };
}

export interface LegislationSchemaInput {
  headline: string;
  description: string;
  path: string;
  authorId: string;
  datePublished?: string;
  dateModified?: string;
  articleSection?: string;
  instrument: {
    /** Short title, e.g. "Fire Safety Act 2021". */
    name: string;
    /** Citation, e.g. "2021 c. 24". */
    identifier: string;
    /** schema.org LegislationType, e.g. "Act" or "StatutoryInstrument". */
    legislationType?: string;
    /** Year, as a date string where known. */
    legislationDate?: string;
    /** Where it APPLIES — the operative statement, not extent. */
    jurisdiction: string;
    /** InForce | PartiallyInForce | NotInForce, or omitted where neither fits. */
    legalForce?: string;
    /** The publishing body. NOT this site. */
    publisher: string;
    url: string;
  };
}

/**
 * A Legislation library page (Phase 5A, PR 6).
 *
 * Unlike Standards, schema.org has a real type here — `Legislation`, from the
 * ELI vocabulary — so the `about` node can be precise rather than a generic
 * CreativeWork.
 *
 * The principle is unchanged: this page is Lion RMS's COMMENTARY ON an
 * instrument, not the instrument. `author` and `publisher` on the outer node
 * are ours; `publisher` on the inner node is The National Archives. The two
 * carrying different values is the point of the shape.
 *
 * `legislationJurisdiction` uses APPLICATION rather than extent, because
 * application is the operative statement — where the instrument actually
 * imposes duties. Saying an instrument's jurisdiction is England and Wales
 * when it applies only in England would mislead exactly the reader the
 * distinction exists to protect.
 *
 * `legislationLegalForce` is omitted rather than guessed where no schema.org
 * value fits — "partially repealed" and "spent" have no counterpart, and
 * mapping them to NotInForce would state something untrue.
 */
export function buildLegislationSchema(input: LegislationSchemaInput) {
  const url = `${SITE_URL}${input.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: input.headline,
    description: input.description,
    url,
    "@id": url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.articleSection ? { articleSection: input.articleSection } : {}),
    author: buildPersonRef(input.authorId),
    publisher,
    about: {
      "@type": "Legislation",
      name: input.instrument.name,
      legislationIdentifier: input.instrument.identifier,
      ...(input.instrument.legislationType
        ? { legislationType: input.instrument.legislationType }
        : {}),
      ...(input.instrument.legislationDate
        ? { legislationDate: input.instrument.legislationDate }
        : {}),
      legislationJurisdiction: input.instrument.jurisdiction,
      ...(input.instrument.legalForce
        ? { legislationLegalForce: input.instrument.legalForce }
        : {}),
      publisher: { "@type": "Organization", name: input.instrument.publisher },
      url: input.instrument.url,
    },
  };
}

export interface DefinedTermSetInput {
  name: string;
  description: string;
  path: string;
  terms: { name: string; description: string; path: string }[];
}

/** The Glossary index's DefinedTermSet, listing every published term. */
export function buildDefinedTermSetSchema(input: DefinedTermSetInput) {
  const url = `${SITE_URL}${input.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: input.name,
    description: input.description,
    url,
    "@id": url,
    hasDefinedTerm: input.terms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.name,
      description: t.description,
      url: `${SITE_URL}${t.path}`,
      inDefinedTermSet: url,
    })),
    publisher,
  };
}
