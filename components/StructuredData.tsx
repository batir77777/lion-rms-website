import { ASSESSOR, SITE, COVERAGE_COUNTIES, COMPANY } from "@/lib/site";
import { buildOrganisationSchema } from "@/lib/content-jsonld";

/*
 * The sitewide ProfessionalService node, rendered once in the root layout and
 * therefore emitted on every page.
 *
 * The object itself now comes from lib/content-jsonld.ts (Phase 5A, PR 10),
 * which is where every other piece of structured data on this site is already
 * built. This component's only remaining job is to render it — which is the
 * point: there is now exactly one module to read if you want to know what this
 * site tells search engines.
 *
 * The emitted JSON is unchanged, field for field. tests/jsonld-migration
 * asserts that against a snapshot taken before the move.
 */
export default function StructuredData() {
  const data = buildOrganisationSchema({
    siteName: SITE.name,
    legalName: COMPANY.legalName,
    companyNumber: COMPANY.number,
    /*
     * PAUSED SERVICES — 1 November 2026.
     *
     * "fire door inspections" and "compartmentation assessments" were removed
     * from this description, and "Fire Door Inspection" and "Compartmentation
     * Survey" from serviceType below. Both are currently paused as separately
     * available services, and schema.org serviceType is a statement of what
     * we offer — advertising a service we are not taking on is a claim, not a
     * keyword.
     *
     * Visual observation of fire doors and compartmentation still happens
     * inside a fire risk assessment, and is described in those terms on
     * /services/fire-safety-consultancy. That is not a standalone survey and
     * must not be written as one here.
     *
     * "Compartmentation" stays in knowsAbout: that field is subject-matter
     * knowledge, not an offer, and fire strategy work genuinely involves
     * compartmentation design. "Fire Door Inspection" leaves knowsAbout too,
     * because it names the paused service rather than a field of knowledge.
     */
    description:
      "Health & safety, construction safety and fire safety consultancy serving London, the Home Counties and the wider UK by arrangement. Health & safety consultancy, construction health & safety and CDM advisory support, independent inspections and audits, fire risk assessments, fire strategies, fire engineering, compliance auditing and professional training.",
    telephone: "+447766317818",
    email: SITE.email,
    founder: { name: ASSESSOR.name, role: ASSESSOR.role, bio: ASSESSOR.bio },
    counties: COVERAGE_COUNTIES,
    knowsAbout: [
      "Fire Engineering",
      "Fire Safety Engineering",
      "Building Fire Safety",
      "Passive Fire Protection",
      "Compartmentation",
      "Means of Escape",
      "Fire Strategy",
      "Fire Risk Assessment",
      "Health and Safety",
      "RAMS",
      "Regulatory Reform (Fire Safety) Order 2005",
      "Compliance Management",
    ],
    serviceType: [
      "Fire Engineering",
      "Fire Safety Consultancy",
      "Fire Risk Assessment",
      "Fire Strategy",
      "Health & Safety Consultancy",
      "Compliance Management Support",
    ],
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
