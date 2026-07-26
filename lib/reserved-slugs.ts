// Central reserved-route registry (Phase 5A, PR 1 — added at the owner's
// request alongside the approved decision record). No content item in any
// collection may use one of these slugs, preventing future routing
// conflicts with system routes, framework conventions, or verticals this
// plan has already committed to (search, category, rss, etc.).
//
// This is intentionally a flat, hand-maintained list rather than something
// clever/derived — it's cheap to extend and easy to audit, which matters
// more here than DRY-ness.

export const RESERVED_SLUGS: readonly string[] = [
  // Existing top-level routes and the ones this plan's route map commits to
  "knowledge",
  "guides",
  "news",
  "standards",
  "legislation",
  "glossary",
  "downloads",
  "search",
  "faq",
  "case-studies",
  "services",
  "sectors",
  "about",
  "contact",
  "privacy",
  "resources",
  "check",

  // Sub-path words used structurally within a vertical (e.g.
  // /guides/category/[slug]) — reserved everywhere, not just where they're
  // currently used, so a future vertical can't collide with them either.
  "category",
  "categories",
  "tag",
  "tags",
  "rss",
  "feed",
  "feeds",
  "page",
  "pages",
  "index",
  "archive",
  "archives",

  // Common CRUD/system-route words with no current use on this site, but
  // that a future admin/editorial surface would very plausibly want.
  "new",
  "edit",
  "delete",
  "create",
  "update",
  "admin",
  "login",
  "logout",
  "signup",
  "signin",
  "account",
  "settings",
  "preview",
  "draft",
  "drafts",

  // Framework/platform conventions and well-known paths — colliding with
  // any of these would break Next.js itself or a standard web convention,
  // not just this content architecture.
  "api",
  "static",
  "public",
  "assets",
  "images",
  "img",
  "files",
  "sitemap",
  "robots",
  "favicon",
  "manifest",
  "_next",
  "well-known",
  "404",
  "500",
  "error",
  "not-found",
] as const;

const RESERVED_SLUG_SET = new Set(RESERVED_SLUGS.map((s) => s.toLowerCase()));

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUG_SET.has(slug.toLowerCase());
}
