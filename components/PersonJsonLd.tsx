import { ASSESSOR, MEMBERSHIPS, QUALIFICATIONS, SITE } from "@/lib/site";
import { buildPersonProfileSchema } from "@/lib/content-jsonld";

/*
 * Person JSON-LD for Batir Turakulov, rendered on the About page.
 *
 * Every field is sourced from lib/site.ts — the same data the About page and
 * homepage already display — so the structured data cannot claim a credential
 * the visible page does not show. Object construction moved to
 * lib/content-jsonld.ts in Phase 5A PR 10; the emitted JSON is unchanged.
 */
export default function PersonJsonLd() {
  const data = buildPersonProfileSchema({
    name: ASSESSOR.name,
    role: ASSESSOR.role,
    bio: ASSESSOR.bio,
    photo: ASSESSOR.photo,
    siteName: SITE.name,
    memberships: MEMBERSHIPS,
    qualifications: QUALIFICATIONS,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
