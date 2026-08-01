// ---------------------------------------------------------------------------
// The Knowledge Centre's shape, with NO content dependency (Phase 5A, PR 9).
//
// This file is split out from lib/knowledge.ts for one measured reason. The
// search component runs in the browser and needs one thing from the registry:
// the label for a URL prefix, so a result can be shown as "Glossary" rather
// than bare. Importing lib/knowledge.ts to get it pulled in the six accessor
// modules, and through them `@/.velite` — the entire generated content
// corpus. Measured on the first build of this PR: /knowledge 246 kB and
// /search 203 kB first-load JS, against a 148-158 kB baseline for every other
// page. Roughly 95 kB of guides, glossary terms, standards, legislation, news
// and downloads was being shipped to the browser so that a result could be
// labelled.
//
// So: everything static about the sections lives here and is safe to import
// from a client component. Anything that needs to COUNT or READ content stays
// in lib/knowledge.ts, which is server-only in practice.
// ---------------------------------------------------------------------------

export const KNOWLEDGE_PATH = "/knowledge";
export const SEARCH_PATH = "/search";

export const GUIDES_PATH = "/guides";
export const GLOSSARY_PATH = "/glossary";
export const STANDARDS_PATH = "/standards";
export const LEGISLATION_PATH = "/legislation";
export const NEWS_PATH = "/news";
export const DOWNLOADS_PATH = "/downloads";

export interface KnowledgeSectionMeta {
  /** URL segment without the leading slash — also the search allow-list key. */
  segment: string;
  path: string;
  /** Short label, used in navigation and as the search result section label. */
  label: string;
  /** One sentence on what the section is for, used on the hub. */
  blurb: string;
  /** Singular and plural nouns, so counts read naturally at any size. */
  noun: readonly [singular: string, plural: string];
}

/*
 * The order is editorial, not alphabetical and not by size. It runs from the
 * most explanatory material to the most procedural: you read a guide to
 * understand something, look a term up in the glossary, consult a standard or
 * an instrument for the detail, check the news for what has changed, and take
 * a download away to use. That is the order a reader moves through, so it is
 * the order the hub presents.
 */
export const KNOWLEDGE_SECTION_META: readonly KnowledgeSectionMeta[] = [
  {
    segment: "guides",
    path: GUIDES_PATH,
    label: "Guides",
    blurb:
      "Longer explanations of how a duty works in practice — what the law asks for, what an assessment looks at, and what usually goes wrong.",
    noun: ["guide", "guides"],
  },
  {
    segment: "glossary",
    path: GLOSSARY_PATH,
    label: "Glossary",
    blurb:
      "Plain-English definitions of the terms that appear in assessments, enforcement notices and contractor reports.",
    noun: ["term", "terms"],
  },
  {
    segment: "standards",
    path: STANDARDS_PATH,
    label: "Standards",
    blurb:
      "What each British Standard, PAS and Approved Document actually covers, whether it is current, and what replaced it if not.",
    noun: ["document", "documents"],
  },
  {
    segment: "legislation",
    path: LEGISLATION_PATH,
    label: "Legislation",
    blurb:
      "The Acts, Orders and Regulations behind the duties — what each one requires, where it applies, and whether it is still in force.",
    noun: ["instrument", "instruments"],
  },
  {
    segment: "news",
    path: NEWS_PATH,
    label: "News",
    blurb:
      "Regulatory changes and commencement dates, written up when they happen and dated so you can tell how current they are.",
    noun: ["item", "items"],
  },
  {
    segment: "downloads",
    path: DOWNLOADS_PATH,
    label: "Downloads",
    blurb:
      "Checklists, record forms and logbook templates to print and use — free, with no sign-up and no email address required.",
    noun: ["resource", "resources"],
  },
] as const;

/** Every Knowledge Centre URL segment, in editorial order. */
export const KNOWLEDGE_SEGMENTS: readonly string[] = KNOWLEDGE_SECTION_META.map((s) => s.segment);

/**
 * The section label for a page path, or undefined for anything outside the
 * Knowledge Centre. Search results use this: a result reads very differently
 * when you can see at a glance that it is a definition rather than a download.
 */
export function sectionLabelForPath(path: string): string | undefined {
  const segment = path.replace(/^\//, "").split("/")[0];
  return KNOWLEDGE_SECTION_META.find((s) => s.segment === segment)?.label;
}
