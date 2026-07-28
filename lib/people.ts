// Author/Reviewer registry for the Knowledge Centre content platform
// (Phase 5A). This is the fix for a real gap identified in the Phase 5A
// architecture audit: the existing Article JSON-LD in app/insights/[slug]
// hardcodes the author as the literal string "Batir Turakulov" instead of
// sourcing the site's own ASSESSOR data in lib/site.ts. Every content
// item's `author`/`reviewer` field should reference this registry by `id`,
// never a free-text name — this also future-proofs for a second reviewer
// without any restructuring if/when the practice grows.
//
// Seeded from the real, existing ASSESSOR/MEMBERSHIPS/QUALIFICATIONS data in
// lib/site.ts rather than invented — this is registry data, not "content"
// in the article-drafting sense, so reusing the real profile here is
// appropriate even though PR 1 otherwise ships fixture-only content.

import { z } from "zod";
import { ASSESSOR, CREDENTIALS } from "./site";

export interface Person {
  id: string;
  name: string;
  jobTitle: string;
  credentials: string[];
  bio: string;
  photo: { src: string; alt: string };
  sameAs?: string[];
}

export interface Reviewer extends Person {
  reviewScope: ("technical" | "compliance" | "editorial")[];
}

export const AUTHORS: Person[] = [
  {
    id: "batir-turakulov",
    name: ASSESSOR.name,
    jobTitle: ASSESSOR.role,
    credentials: CREDENTIALS,
    bio: ASSESSOR.bio,
    photo: { src: ASSESSOR.photo, alt: `Portrait of ${ASSESSOR.name}` },
  },
];

// Batir currently also acts as sole technical reviewer for his own content
// (a real, stated limitation — see the Phase 5A risk register). Modelled as
// its own registry entry, distinct from the Author entry, so a second
// reviewer can be added later without touching the Author registry or any
// content item that references this id.
export const REVIEWERS: Reviewer[] = [
  {
    id: "batir-turakulov",
    name: ASSESSOR.name,
    jobTitle: ASSESSOR.role,
    credentials: CREDENTIALS,
    bio: ASSESSOR.bio,
    photo: { src: ASSESSOR.photo, alt: `Portrait of ${ASSESSOR.name}` },
    reviewScope: ["technical", "compliance", "editorial"],
  },
];

export function getAuthor(id: string): Person | undefined {
  return AUTHORS.find((a) => a.id === id);
}

export function getReviewer(id: string): Reviewer | undefined {
  return REVIEWERS.find((r) => r.id === id);
}

export const AUTHOR_IDS = AUTHORS.map((a) => a.id) as [string, ...string[]];
export const REVIEWER_IDS = REVIEWERS.map((r) => r.id) as [string, ...string[]];

// ---------------------------------------------------------------------------
// Lightweight runtime validation, mirroring lib/taxonomy.ts's approach —
// these are plain TS registries, validated with the standalone Zod install
// (not Velite's `s` builder, which is reserved for the MDX collections
// themselves; see the PR description for why the two are kept separate).
// ---------------------------------------------------------------------------

const personSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  jobTitle: z.string().min(1),
  credentials: z.array(z.string()),
  bio: z.string().min(1),
  photo: z.object({ src: z.string().min(1), alt: z.string().min(1) }),
  sameAs: z.array(z.string()).optional(),
});

const reviewerSchema = personSchema.extend({
  reviewScope: z.array(z.enum(["technical", "compliance", "editorial"])).min(1),
});

export interface PeopleValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePeopleRegistry(): PeopleValidationResult {
  const errors: string[] = [];

  const authorIds = new Set<string>();
  for (const author of AUTHORS) {
    const result = personSchema.safeParse(author);
    if (!result.success) errors.push(`Invalid author "${author.id}": ${result.error.message}`);
    if (authorIds.has(author.id)) errors.push(`Duplicate author id: "${author.id}"`);
    authorIds.add(author.id);
  }

  const reviewerIds = new Set<string>();
  for (const reviewer of REVIEWERS) {
    const result = reviewerSchema.safeParse(reviewer);
    if (!result.success) errors.push(`Invalid reviewer "${reviewer.id}": ${result.error.message}`);
    if (reviewerIds.has(reviewer.id)) errors.push(`Duplicate reviewer id: "${reviewer.id}"`);
    reviewerIds.add(reviewer.id);
  }

  return { valid: errors.length === 0, errors };
}
