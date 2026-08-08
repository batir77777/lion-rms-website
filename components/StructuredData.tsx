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
    description:
      "Fire engineering, health & safety and fire risk assessment consultancy serving London, the Home Counties and the wider UK by arrangement. Fire engineering consultancy, fire risk assessments, fire safety consultancy, fire strategies, fire door inspections, compartmentation assessments, health & safety consultancy, compliance auditing and professional training.",
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
      "Fire Door Inspection",
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
      "Fire Door Inspection",
      "Compartmentation Survey",
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
