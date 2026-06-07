import { SITE } from "@/lib/site";

// LocalBusiness JSON-LD — helps Google show the business for local searches.
export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    description:
      "Fire safety, health & safety, and digital compliance consultancy serving London and every London borough. Fire risk assessments, fire strategies, fire door inspections, H&S audits, RAMS, and bespoke compliance systems.",
    url: "https://www.lionrms.uk",
    telephone: "+447766317818",
    email: SITE.email,
    areaServed: { "@type": "City", name: "London", "@id": "https://www.wikidata.org/wiki/Q84" },
    address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
    knowsAbout: [
      "Fire Risk Assessment",
      "Fire Strategy",
      "Fire Door Inspection",
      "Health and Safety",
      "RAMS",
      "Regulatory Reform (Fire Safety) Order 2005",
      "Compliance Management Software",
    ],
    serviceType: [
      "Fire Risk Assessment",
      "Fire Safety Consultancy",
      "Health & Safety Consultancy",
      "Digital Compliance Solutions",
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
