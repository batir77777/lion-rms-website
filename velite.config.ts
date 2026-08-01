// Production content-collection configuration for the Knowledge Centre
// platform (Phase 5A, PR 1).
//
// Per the approved PR 1 scope, every collection below is real
// infrastructure but points at a currently-EMPTY content directory — no
// content migration happens in this PR. Later, separately-approved PRs
// (Insights → Guides migration, Standards/Legislation/Glossary/News/
// Downloads libraries) populate these directories; this file does not
// change shape when they do, only the content underneath it grows.
//
// Chosen over the gray-matter + Zod + MDX-compiler fallback after a
// compatibility spike against this project's actual Next.js 15.5.19 /
// React 19.0.3 / Node 22 stack — see the PR description for the full
// comparison and rationale. No content-collection abstraction beyond what
// Velite itself provides has been added on top of it.

import { statSync } from "node:fs";
import path from "node:path";

import { defineConfig, defineCollection } from "velite";
import {
  articleSchema,
  newsArticleSchema,
  standardGuidancePageSchema,
  legislationPageSchema,
  glossaryTermSchema,
  downloadResourceSchema,
} from "./lib/content-schemas";
import {
  validateContentCollections,
  formatIssues,
  type ContentItemLike,
} from "./lib/content-validation";

const guides = defineCollection({
  name: "Guide",
  pattern: "guides/*.mdx",
  schema: articleSchema,
});

const news = defineCollection({
  name: "NewsItem",
  pattern: "news/*.mdx",
  schema: newsArticleSchema,
});

const standards = defineCollection({
  name: "StandardGuidancePage",
  pattern: "standards/*.mdx",
  schema: standardGuidancePageSchema,
});

const legislation = defineCollection({
  name: "LegislationPage",
  pattern: "legislation/*.mdx",
  schema: legislationPageSchema,
});

const glossaryTerms = defineCollection({
  name: "GlossaryTerm",
  pattern: "glossary/*.mdx",
  schema: glossaryTermSchema,
});

const downloads = defineCollection({
  name: "DownloadResource",
  pattern: "downloads/*.mdx",
  schema: downloadResourceSchema,
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    // GENERATED DIRECTORY — `clean: true` below empties public/static on every
    // build. Never place a hand-managed asset here; it would be deleted by the
    // next build with no warning. Hand-managed images live in public/images.
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { guides, news, standards, legislation, glossaryTerms, downloads },

  // Cross-collection validation (Section 5.5 of the architecture plan):
  // reserved-slug collisions, duplicate ids within a collection, and
  // relation fields pointing at slugs that don't exist in their target
  // collection. Velite's own per-item schema (above) already handles
  // frontmatter shape, unknown-category rejection, and duplicate *slugs*
  // within a single collection — this hook is deliberately only the
  // cross-cutting layer on top of that, not a re-implementation of it.
  complete: async (data) => {
    const collections: Record<string, ContentItemLike[]> = {
      guides: data.guides as unknown as ContentItemLike[],
      news: data.news as unknown as ContentItemLike[],
      standards: data.standards as unknown as ContentItemLike[],
      legislation: data.legislation as unknown as ContentItemLike[],
      glossaryTerms: data.glossaryTerms as unknown as ContentItemLike[],
      downloads: data.downloads as unknown as ContentItemLike[],
    };

    // Resolves an emitted asset URL (e.g. "/static/checklist-a1b2c3.pdf") to
    // its real size on disk, for rule R5.
    //
    // Safe to do here precisely because `complete` runs AFTER Velite has
    // written its output: the copied asset already exists. That same ordering
    // is why the size cannot be DERIVED here — this hook returns void and
    // cannot inject a value into the emitted JSON — so the number is authored
    // in frontmatter and verified against reality instead.
    const sizeOf = (url: string): number | undefined => {
      if (!url.startsWith("/static/")) return undefined;
      try {
        return statSync(path.join(process.cwd(), "public", url.slice(1))).size;
      } catch {
        return undefined;
      }
    };

    const result = validateContentCollections(collections, { sizeOf });

    // Warnings are reported, never fatal. This is deliberate: editorial
    // observations — an overdue review date, a short meta description — must
    // never break a production deployment, or content simply ageing could
    // block an unrelated urgent fix months later.
    if (result.warnings.length > 0) {
      console.warn(
        `\n[content] ${result.warnings.length} editorial warning${result.warnings.length === 1 ? "" : "s"}:\n${formatIssues(result.warnings)}\n` +
          `[content] Warnings do not fail the build. Run \`npm run content:audit\` to treat them as failures.\n`
      );
    }

    // CONTENT_AUDIT escalates warnings to failures. Set by
    // scripts/content-audit.mjs; never set during a normal build.
    const auditMode = process.env.CONTENT_AUDIT === "1";
    const fatal = auditMode ? result.issues : result.errors;

    if (fatal.length > 0) {
      const heading = auditMode
        ? `Content audit failed: ${result.errors.length} error(s), ${result.warnings.length} warning(s)`
        : `Content validation failed: ${result.errors.length} error(s)`;
      throw new Error(`${heading}\n${formatIssues(fatal)}`);
    }
  },
});
