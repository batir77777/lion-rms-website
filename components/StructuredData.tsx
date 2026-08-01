import { ASSESSOR, SITE, SITE_URL, COVERAGE_COUNTIES, COMPANY } from "@/lib/site";

// LocalBusiness JSON-LD — helps Google show the business for local searches.
export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    /*
     * `name` stays the trading name — it is what the public reads. `legalName`
     * identifies the registered entity, and `identifier` carries the company
     * number using schema.org's existing PropertyValue pattern rather than a
     * bespoke identity model.
     *
     * The registered office is deliberately absent from `address` below. This
     * node renders on EVERY page, so putting a residential address here would
     * republish it sitewide — the exact thing /company-information exists to
     * avoid. `address` stays the service locality.
     */
    legalName: COMPANY.legalName,
    identifier: {
      "@type": "PropertyValue",
      name: "UK company number",
      value: COMPANY.number,
    },
    description:
      "Fire engineering, health & safety and fire risk assessment consultancy serving London, the Home Counties and the wider UK by arrangement. Fire engineering consultancy, fire risk assessments, fire safety consultancy, fire strategies, fire door inspections, compartmentation assessments, health & safety consultancy, compliance auditing and professional training.",
    url: SITE_URL,
    telephone: "+447766317818",
    email: SITE.email,
    founder: {
      "@type": "Person",
      name: ASSESSOR.name,
      jobTitle: ASSESSOR.role,
      description: ASSESSOR.bio,
      url: `${SITE_URL}/about`,
    },
    areaServed: [
      { "@type": "City", name: "London", "@id": "https://www.wikidata.org/wiki/Q84" },
      ...COVERAGE_COUNTIES.map((c) => ({ "@type": "AdministrativeArea", name: c })),
    ],
    address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
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
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
