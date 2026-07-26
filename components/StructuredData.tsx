import { ASSESSOR, SITE, SITE_URL, COVERAGE_COUNTIES } from "@/lib/site";

// LocalBusiness JSON-LD — helps Google show the business for local searches.
export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    description:
      "Fire safety, health & safety, and compliance management consultancy serving London and the surrounding boroughs. Fire risk assessments, fire strategies, fire door inspections, H&S audits, RAMS, and ongoing compliance support.",
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
      "Fire Risk Assessment",
      "Fire Strategy",
      "Fire Door Inspection",
      "Health and Safety",
      "RAMS",
      "Regulatory Reform (Fire Safety) Order 2005",
      "Compliance Management",
    ],
    serviceType: [
      "Fire Risk Assessment",
      "Fire Safety Consultancy",
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
