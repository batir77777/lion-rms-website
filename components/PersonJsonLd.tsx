import { ASSESSOR, CREDENTIALS, SITE, SITE_URL } from "@/lib/site";

// Person JSON-LD for Batir Turakulov — every field below is sourced directly
// from lib/site.ts (the same data already rendered on the homepage and About
// page), so nothing here can drift out of sync with what visitors actually see.
// No `sameAs` (no verified social/professional profile links exist in the
// codebase) and no awards/registrations beyond the credentials already shown.
export default function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: ASSESSOR.name,
    jobTitle: ASSESSOR.role,
    description: ASSESSOR.bio,
    image: `${SITE_URL}${ASSESSOR.photo}`,
    url: `${SITE_URL}/about`,
    worksFor: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE_URL,
    },
    hasCredential: CREDENTIALS.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
