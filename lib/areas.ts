// London boroughs/areas served — powers the local-SEO area pages.
export interface Area {
  slug: string;
  name: string;
  note: string; // brief, broadly-accurate local context
}

export const AREAS: Area[] = [
  { slug: "city-of-london", name: "City of London", note: "a dense mix of commercial offices, historic buildings and a growing residential population" },
  { slug: "westminster", name: "Westminster", note: "high-occupancy commercial, hospitality and high-value residential premises" },
  { slug: "camden", name: "Camden", note: "period conversions, houses in multiple occupation (HMOs) and mixed-use buildings" },
  { slug: "islington", name: "Islington", note: "Victorian terraces, converted flats and town-centre commercial units" },
  { slug: "hackney", name: "Hackney", note: "warehouse conversions and a fast-growing residential and commercial base" },
  { slug: "tower-hamlets", name: "Tower Hamlets", note: "high-rise residential blocks alongside the Canary Wharf commercial estate" },
  { slug: "southwark", name: "Southwark", note: "residential blocks, riverside developments and mixed commercial premises" },
  { slug: "lambeth", name: "Lambeth", note: "residential blocks, HMOs and mixed-use town-centre buildings" },
  { slug: "wandsworth", name: "Wandsworth", note: "riverside residential developments and suburban commercial parades" },
  { slug: "hammersmith-and-fulham", name: "Hammersmith & Fulham", note: "a balanced mix of residential blocks and commercial premises" },
  { slug: "kensington-and-chelsea", name: "Kensington & Chelsea", note: "period mansion blocks and high-value residential buildings" },
  { slug: "croydon", name: "Croydon", note: "town-centre offices and high-rise residential developments" },
  { slug: "ealing", name: "Ealing", note: "suburban residential property and commercial parades" },
  { slug: "brent", name: "Brent", note: "mixed residential stock and the Wembley commercial and event district" },
];

export function getArea(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}
