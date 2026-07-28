// Shared factory for the six scenario-specific fixture configs used by
// tests/content-validation.test.mjs. Each scenario config just calls this
// with its own fixture root — kept factored out so the six collection
// definitions aren't repeated six times over.
import path from "node:path";
import { defineConfig, defineCollection } from "velite";
import {
  articleSchema,
  newsArticleSchema,
  standardGuidancePageSchema,
  legislationPageSchema,
  glossaryTermSchema,
  downloadResourceSchema,
} from "../../lib/content-schemas";
import { validateContentCollections, type ContentItemLike } from "../../lib/content-validation";

export function makeFixtureConfig(root: string, outputDirName: string) {
  // Velite resolves a relative `root` against wherever it decides this
  // config file "lives" — which is NOT reliably this file's on-disk
  // directory, because Velite loads/bundles config files (esbuild) before
  // evaluating them, and that bundling step can shift what a relative path
  // (or even import.meta.url) resolves against. Anchoring on
  // process.cwd() instead is reliable here because the test harness
  // (tests/content-validation.test.mjs) always invokes `npx velite build`
  // with cwd explicitly set to the repo root — so a repo-root-relative
  // `root` string ("content/__fixtures__/valid") resolves unambiguously
  // regardless of how Velite itself resolves the config file's location.
  const absoluteRoot = path.resolve(process.cwd(), root);
  const guides = defineCollection({ name: "Guide", pattern: "guides/*.mdx", schema: articleSchema });
  const news = defineCollection({ name: "NewsItem", pattern: "news/*.mdx", schema: newsArticleSchema });
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

  return defineConfig({
    root: absoluteRoot,
    output: {
      data: `.velite-test-output/${outputDirName}`,
      assets: `.velite-test-output/${outputDirName}/static`,
      base: "/static/",
      clean: true,
    },
    collections: { guides, news, standards, legislation, glossaryTerms, downloads },
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
}
