import path from "path";

// ---------------------------------------------------------------------------
// Velite content-collection generation (Phase 5A, PR 3).
//
// Production builds run Velite via the `build` npm script
// (`velite build --strict --clean && next build`), which is deterministic:
// Next.js cannot start compiling until Velite has exited zero. That ordering
// matters because routes import the generated `@/.velite` output, which is
// gitignored and therefore absent from a clean checkout.
//
// `next dev` has no such step, so the watcher below is the development-only
// counterpart. Two deliberate departures from the snippet in Velite's own
// documentation:
//
//   1. Guarded on NODE_ENV rather than `process.argv.indexOf('dev')`. Next.js
//      16 no longer places "dev" in process.argv when loading this config, so
//      the documented guard silently stops firing on upgrade — and the symptom
//      ("my content edits do nothing") comes with no error to explain it.
//   2. `clean: false` in dev, so restarting the dev server doesn't wipe and
//      regenerate the whole output directory every time.
//
// The VELITE_STARTED guard is required because Next.js loads this config more
// than once; without it, two watchers write to the same output directory.
//
// The Velite webpack plugin is deliberately NOT used: Velite documents that it
// does not work correctly under Turbopack, which becomes the default bundler in
// Next.js 16, and a project carrying custom webpack config fails `next build`
// there unless it opts out. Keeping generation out of the bundler entirely
// keeps that upgrade path clear.
if (process.env.NODE_ENV === "development" && !process.env.VELITE_STARTED) {
  process.env.VELITE_STARTED = "1";
  const { build } = await import("velite");
  await build({ watch: true, clean: false });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.squarespace-cdn.com" },
    ],
    qualities: [75, 85],
  },
  async redirects() {
    return [
      {
        source: "/ai-automation",
        destination: "https://www.liondigital.org",
        permanent: true,
      },
      {
        source: "/areas",
        destination: "/sectors",
        permanent: true,
      },

      // ---------------------------------------------------------------------
      // Insights → Guides (Phase 5A, PR 3).
      //
      // PERMANENT. These rules stay in this file indefinitely, even if other
      // parts of PR 3 are later changed. `permanent: true` emits a 308, which
      // Google treats as equivalent to a 301 for signal consolidation — and
      // which browsers cache indefinitely, so removing a rule does not undo it
      // for anyone who has already followed it. The URL migration is
      // fix-forward only after merge.
      //
      // Enumerated per slug rather than expressed as `/insights/:slug*`. A
      // wildcard would permanently redirect every path under /insights,
      // including ones that should legitimately 404, and cannot be tested
      // exhaustively. Eight explicit rules are eight testable assertions.
      //
      // Declared here rather than in vercel.json so they are active in local
      // development and therefore verifiable before deploy, and so the map
      // grows where PR 10's redirect consolidation is heading.
      //
      // Note: /resources/fire-safety-checklist → /downloads/... is deliberately
      // NOT here. The Downloads vertical does not exist yet, and that rule
      // would permanently redirect a working page to a 404. It ships with
      // Downloads.
      // ---------------------------------------------------------------------
      { source: "/insights", destination: "/guides", permanent: true },
      {
        source: "/insights/fire-risk-assessments-explained",
        destination: "/guides/fire-risk-assessments-explained",
        permanent: true,
      },
      {
        source: "/insights/pas-79-methodology-explained",
        destination: "/guides/pas-79-methodology-explained",
        permanent: true,
      },
      {
        source: "/insights/fire-door-inspections-explained",
        destination: "/guides/fire-door-inspections-explained",
        permanent: true,
      },
      {
        source: "/insights/fire-safety-responsibilities-responsible-person",
        destination: "/guides/fire-safety-responsibilities-responsible-person",
        permanent: true,
      },
      {
        source: "/insights/commercial-fire-safety-compliance",
        destination: "/guides/commercial-fire-safety-compliance",
        permanent: true,
      },
      {
        source: "/insights/block-management-fire-safety-guidance",
        destination: "/guides/block-management-fire-safety-guidance",
        permanent: true,
      },
      {
        source: "/insights/pas-9970-bsi-consultation-fire-safety-construction",
        destination: "/guides/pas-9970-bsi-consultation-fire-safety-construction",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
