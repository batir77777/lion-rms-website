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

import { defineConfig, defineCollection } from "velite";
import {
  articleSchema,
  newsArticleSchema,
  standardGuidancePageSchema,
  legislationPageSchema,
  glossaryTermSchema,
  downloadResourceSchema,
} from "./lib/content-schemas";
import { validateContentCollections, type ContentItemLike } from "./lib/content-validation";

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

    const result = validateContentCollections(collections);
    if (!result.valid) {
      const message = result.issues.map((issue) => `  - [${issue.collection}] ${issue.message}`).join("\n");
      throw new Error(`Cross-collection content validation failed:\n${message}`);
    }
  },
});
