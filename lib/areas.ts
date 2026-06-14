// London areas served — powers the local-SEO area pages.
export interface Area {
  slug: string;
  name: string;
  note: string; // brief, broadly-accurate local context
}

export const AREAS: Area[] = [
  { slug: "tower-hamlets", name: "Tower Hamlets", note: "high-rise residential blocks alongside the Canary Wharf commercial estate" },
  { slug: "hackney", name: "Hackney", note: "warehouse conversions and a fast-growing residential and commercial base" },
  { slug: "newham", name: "Newham", note: "regeneration developments around Stratford and high-density residential blocks" },
  { slug: "waltham-forest", name: "Waltham Forest", note: "Victorian terraces, converted flats and Walthamstow's busy town centre" },
  { slug: "redbridge", name: "Redbridge", note: "suburban residential property and Ilford's commercial centre" },
  { slug: "barking-and-dagenham", name: "Barking & Dagenham", note: "large residential estates and riverside regeneration sites" },
  { slug: "havering", name: "Havering", note: "suburban housing and Romford's town-centre commercial premises" },
  { slug: "stratford", name: "Stratford", note: "high-rise residential and mixed-use developments around the Olympic Park" },
  { slug: "canary-wharf", name: "Canary Wharf", note: "high-rise commercial towers and modern residential developments" },
  { slug: "shoreditch", name: "Shoreditch", note: "warehouse conversions, creative offices and mixed-use premises" },
  { slug: "bethnal-green", name: "Bethnal Green", note: "period conversions, estates and mixed residential and commercial units" },
  { slug: "bow", name: "Bow", note: "residential estates and converted industrial buildings" },
  { slug: "whitechapel", name: "Whitechapel", note: "dense mixed-use residential and commercial premises" },
  { slug: "walthamstow", name: "Walthamstow", note: "Victorian terraces, HMOs and a busy town centre" },
];

export function getArea(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}
