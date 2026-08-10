// Central site data — edit here to update content across the whole site.

export const SITE_URL = "https://www.lionrms.uk";

export const SITE = {
  name: "Lion Risk Management Solutions",
  shortName: "Lion RMS",
  phone: "07766 317818",
  phoneHref: "tel:+447766317818",
  email: "admin@lionrms.uk",
  emailHref: "mailto:admin@lionrms.uk",
  location: "London",
  logo: "/logo.png",
  formspreeId: "meewegnp",
};

/**
 * Statutory identity of the legal entity, verified against the Companies House
 * register (company 13739074) rather than transcribed from memory.
 *
 * Two rules govern how this is used, and both are enforced by
 * tests/site-quality.test.mjs rather than left to discipline:
 *
 * 1. `registeredOffice` renders on `/company-information` and NOWHERE else. It
 *    is a residential address, and the footer, the privacy page and the
 *    sitewide JSON-LD would each republish it on every page of the site. The
 *    footer links to the page instead.
 * 2. `legalName` appears only where the legal entity is being identified — the
 *    company information page, the privacy policy's legal-identity block, and
 *    `legalName` in the Organisation structured data. Everything the public
 *    reads uses `SITE.name`, the trading name, unchanged.
 *
 * If the registered office is changed at Companies House, update it here
 * promptly so the site matches the public register — and only here.
 */
export const COMPANY = {
  legalName: "LION RISK MANAGEMENT SOLUTIONS LTD",
  tradingName: "Lion Risk Management Solutions",
  number: "13739074",
  jurisdiction: "England and Wales",
  registeredOffice: "Flat 18 Gloster Ridley Court, 12 St. Annes Row, London E14 7GE",
} as const;

export const COMPANY_INFO_PATH = "/company-information";

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
  fireSafety: "/img/services/fire-5.jpg",
  fireEngineering: "/img/services/fire-3.jpg",
  healthSafety: "/img/services/hs-5.jpg",
  digital: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
  city: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2000&q=80",
  office: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80",
};

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Sectors", href: "/sectors" },
  { label: "Free Check", href: "/check" },
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
  // Points at the /knowledge hub from PR 9. It pointed at /guides from PR 3
  // only because there was nowhere else for it to go: the label promised a
  // Knowledge Centre and delivered one of its six sections, so the Glossary,
  // Standards, Legislation, News and Downloads were reachable only by noticing
  // the secondary navigation once you had already landed on Guides. /guides is
  // unchanged and un-redirected — this is a destination change, not a move.
  { label: "Knowledge Centre", href: "/knowledge" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

// Geographic coverage — accurate, non-overclaiming wording (Phase 4B PR 1).
// Use COVERAGE_FULL where there's room for a full sentence, COVERAGE_SHORT in
// compact badges/strips. Wider UK coverage is by arrangement, not unrestricted.
export const COVERAGE_FULL =
  "London and the Home Counties, with wider UK coverage available by arrangement.";
export const COVERAGE_SHORT = "London & Home Counties";
export const COVERAGE_COUNTIES = [
  "Hertfordshire",
  "Essex",
  "Kent",
  "Surrey",
  "Buckinghamshire",
  "Berkshire",
];

// Standardised CTA wording (Phase 4A) — primary drives enquiries, secondary
// promotes the free compliance self-check tool as a lower-commitment step.
export const CTA_PRIMARY_LABEL = "Request a Quote";
export const CTA_SECONDARY_LABEL = "Free Compliance Check";
export const CTA_SECONDARY_HREF = "/check";

// Company positioning (repositioning PR1, August 2026; brought onto the
// homepage in PR2) — Lion RMS is presented as TWO co-equal disciplines rather
// than a fire practice that also offers health & safety: Fire Safety & Fire
// Engineering, and Health & Safety & Construction Safety. Within Fire, three
// propositions stand at equal billing (Fire Risk Assessments, Fire
// Engineering, Fire Safety Consultancy); within Health & Safety, two (Health
// & Safety Consultancy, Construction Health & Safety). Construction Health &
// Safety does not have its own service page yet (that is PR5's job) — PR2
// represents it on the homepage using content that already exists elsewhere
// on the site (RAMS and Construction Phase Plans, competent-person support),
// deep-linked into `/services/health-safety`. Compliance Management is
// deliberately NOT one of the five homepage propositions: it is cross-cutting
// support that underpins both disciplines rather than a headline service in
// its own right, so it is named once here rather than given a sixth card.
// Parity is at the discipline level, not forced page-for-page: fire genuinely
// has three distinct propositions and H&S genuinely has two, and neither side
// is padded to match the other's count. Fire risk assessment is named first
// among the fire services deliberately — it is the highest-intent search term
// for the business and PR1 keeps it at `/services/fire-safety`, unmoved (see
// the note on `sections` below). Coverage wording stays "London, the Home
// Counties, and the wider UK by arrangement" — never an unrestricted UK-wide
// claim (see COVERAGE_FULL).
//
// PR2 renders this sentence directly on the homepage (the introductory /
// independent-adviser statement, replacing the old one-line trust strip) —
// it is no longer documentation-only. "Independent adviser" is a plain
// positioning word, not a claim tied to any specific accreditation or
// membership body; nothing else in this sentence asserts a qualification,
// certification or scope of work beyond what the rest of the site already
// states.
export const POSITIONING =
  "Lion Risk Management Solutions is an independent adviser supporting residential, commercial and construction clients across fire safety, fire engineering, health & safety and compliance — one consultancy, two disciplines, working across London, the Home Counties, and the wider UK by arrangement.";

export interface ServiceItem {
  name: string;
  desc: string;
  /**
   * Optional stable anchor id for an item inside a flat (non-`sections`)
   * category's item grid — added for `health-safety`'s "RAMS and Construction
   * Phase Plans" item in repositioning PR2, so the homepage's Construction
   * Health & Safety card can deep-link to it without a dedicated page. Only
   * set where something outside the page links to this specific item; most
   * items have none. Referenced from the homepage — changing it breaks that
   * link on the next deploy.
   */
  id?: string;
}

/**
 * A grouped, anchor-linkable subsection within one service page — used only
 * where two or more genuinely distinct propositions share a single URL.
 *
 * `/services/fire-safety` is the first and, for now, only case: Fire Risk
 * Assessments and Fire Safety Consultancy are two of the five services in the
 * approved architecture, but the FRA URL is deliberately NOT being moved (see
 * the SEO migration note — external backlink equity to `/services/fire-safety`
 * is still unknown, and moving the URL is off the table until it is). Fire
 * Safety Consultancy gets its own URL in PR3; until then both sections live
 * here, each independently linkable via `id`.
 *
 * `featured` renders a section's items as a single wide card rather than the
 * standard two-column grid — the mechanism used to make Fire Risk Assessments
 * visually lead the page, per the "retitle/reposition so FRA clearly lead"
 * instruction, without shortening or diminishing the Fire Safety Consultancy
 * content that still shares the page.
 */
export interface ServiceSection {
  /** Anchor id — must be stable. Referenced from the homepage, the footer,
   * and any external link, so changing it breaks those on the next deploy. */
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  items: ServiceItem[];
  featured?: boolean;
}

export interface ServiceCategory {
  slug: string;
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  short: string;
  intro: string;
  /**
   * A flat list of services rendered as a single grid. Mutually exclusive
   * with `sections` below — a category has one or the other. Omitted (rather
   * than left as `[]`) for a category that uses `sections`, so a future
   * reader importing `.items` directly gets `undefined` and a type error
   * rather than a silently empty page.
   */
  items?: ServiceItem[];
  /** See `ServiceSection`. Present only on `fire-safety` for now. */
  sections?: ServiceSection[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "fire-safety",
    image: IMAGES.fireSafety,
    imageAlt: "Protected escape corridor with fire doors, emergency lighting and illuminated exit signage",
    eyebrow: "Fire Safety",
    title: "Fire Risk Assessments & Fire Safety Consultancy",
    short: "Fire risk assessments informed by recognised guidance, including PAS 79 where appropriate — plus fire safety consultancy: fire door inspections, compartmentation, training and duty-holder advice.",
    // Fire risk assessment is a core discipline of the consultancy and
    // represents a substantial part of its work — wording carried over from
    // the About page rather than newly written, so the page's framing of FRA
    // matches what the site already says about it elsewhere.
    intro: "Fire risk assessment is a core discipline of the consultancy and represents a substantial part of its work. Assessments are undertaken with reference to relevant recognised guidance, including PAS 79 where appropriate, and the applicable fire safety legislation for the premises and jurisdiction. Alongside assessment, we provide ongoing fire safety consultancy for buildings already in use — fire door inspections, compartmentation surveys, training, and clear advice for landlords, duty holders and Responsible Persons.",
    // Repositioning PR1 (August 2026). Restructured from a single flat list
    // into two anchor-linkable sections so Fire Risk Assessments and Fire
    // Safety Consultancy — two of the five services in the approved
    // architecture — can each be linked to directly while they still share
    // this URL. See ServiceSection above for why the URL is not yet split.
    //
    // Two items moved OUT of this page to the new /services/fire-engineering
    // page: "Fire Engineering" and "Fire Strategies". The remaining items are
    // unchanged from before this PR, redistributed rather than rewritten,
    // with one exception: the "Fire Safety Consultancy" item's description
    // no longer says "design-stage input", which is now Fire Engineering's
    // territory and would otherwise be claimed on two live pages at once.
    sections: [
      {
        id: "fire-risk-assessments",
        eyebrow: "Primary service — buildings in use",
        title: "Fire Risk Assessments",
        intro: "Thorough, prioritised fire risk assessments for residential, commercial and complex premises.",
        featured: true,
        items: [
          { name: "Fire Risk Assessments", desc: "Thorough assessments that identify fire hazards, evaluate risk to occupants, and provide clear, prioritised recommendations informed by relevant recognised guidance, including PAS 79 where appropriate, and the applicable fire safety legislation for the premises and jurisdiction." },
        ],
      },
      {
        id: "fire-safety-consultancy",
        eyebrow: "Ongoing management & operational support",
        title: "Fire Safety Consultancy",
        intro: "Fire safety advice and support for buildings already in use — door inspections, compartmentation, training and day-to-day duty-holder guidance.",
        items: [
          { name: "Fire Safety Consultancy", desc: "Specialist fire safety advice for duty holders, building owners and managing agents — fire safety management arrangements, regulatory interpretation, remedial strategy and ongoing compliance support." },
          { name: "Fire Door Inspections", desc: "Inspection of fire doors and their hardware against current standards, with a clear schedule of defects and remedial priorities." },
          { name: "Compartmentation", desc: "Survey and review of compartmentation and fire-stopping to identify breaches that could compromise the building's passive fire protection." },
          { name: "Fire Safety Training", desc: "Practical training for staff, managers, and fire marshals covering prevention, evacuation, equipment use, and legal responsibilities — delivered on-site." },
          { name: "Advice for Landlords, Duty Holders & Responsible Persons", desc: "Straightforward guidance on your legal duties so you can make informed, compliant decisions about your premises." },
        ],
      },
    ],
  },
  {
    // Repositioning PR1 (August 2026) — new page. Carved out of what was
    // `fire-safety`'s original intro and its "Fire Engineering" and "Fire
    // Strategies" items, which is why the wording below is close to what
    // fire-safety used to say: this page is where that copy actually
    // belonged all along. PR3 gives this page its full approved depth (means
    // of escape, Building Regulations advice, design review and change-of-use
    // support as standalone items); PR1 moves only what already existed.
    slug: "fire-engineering",
    image: IMAGES.fireEngineering,
    imageAlt: "Fire engineer in a hard hat reviewing plans on a tablet in a protected stairwell with illuminated exit signage",
    eyebrow: "Fire Engineering",
    title: "Fire Engineering",
    short: "Applied fire engineering — means of escape, passive and active fire protection, compartmentation strategy, fire safety design review and fire strategies for new build, refurbishment and change-of-use projects.",
    intro: "Fire engineering led, from design-stage advice through to buildings in use. We help project teams and duty holders meet their obligations under the Building Regulations and the Regulatory Reform (Fire Safety) Order 2005, with clear, proportionate fire engineering advice for new build, refurbishment, and change-of-use projects.",
    items: [
      { name: "Fire Engineering Consultancy", desc: "Applied fire engineering across building fire safety — means of escape, passive and active fire protection, compartmentation strategy, and fire safety design review for new build, refurbishment and change-of-use projects." },
      { name: "Fire Strategies", desc: "Bespoke fire strategies for new developments, change-of-use projects, and complex buildings — supporting planning and Building Regulations compliance." },
    ],
  },
  {
    slug: "health-safety",
    image: IMAGES.healthSafety,
    imageAlt: "Organised modern office workstation representing workplace compliance and risk assessment",
    eyebrow: "Health & Safety",
    title: "Health & Safety Consultancy",
    short: "Risk assessments, audits, inspections, RAMS, policies, competent person support, and compliance advice.",
    intro: "Practical health and safety support that helps businesses, landlords, and contractors meet their obligations under the Health and Safety at Work etc. Act 1974 and associated regulations — without unnecessary complexity.",
    items: [
      { name: "Health and Safety Risk Assessments", desc: "Clear, suitable and sufficient risk assessments tailored to your activities, premises, and workforce." },
      { name: "Workplace Inspections and Audits", desc: "Structured inspections and audits that surface real issues and give you a practical action plan." },
      { name: "RAMS and Construction Phase Plans", id: "rams-construction-phase-plans", desc: "Risk assessments, method statements, and construction phase plans developed alongside your project team." },
      { name: "Policies and Procedures", desc: "Health and safety policies and documented procedures written in plain English and fit for your organisation." },
      { name: "Competent Person Support", desc: "Ongoing competent-person support, giving you access to qualified advice whenever you need it." },
      { name: "Training and Compliance Services", desc: "Training and day-to-day guidance to keep your team informed and your obligations met." },
    ],
  },
  {
    slug: "compliance-support",
    image: IMAGES.digital,
    imageAlt: "Compliance records and documentation management",
    eyebrow: "Compliance Support",
    title: "Compliance Management",
    short: "Every assessment we deliver feeds a live compliance record — actions tracked, reviews scheduled, and documentation audit-ready. Ongoing support to keep your compliance current.",
    intro: "The assessment is the start, not the end. Every assessment feeds into ongoing compliance management: actions tracked to completion, review dates scheduled, and your documentation kept audit-ready. One consultancy supporting your compliance from assessment through to ongoing management.",
    items: [
      { name: "Action tracking and remedial management", desc: "Track remedial actions from raised to closed, with a clear audit trail and priority ranking." },
      { name: "Review scheduling and reminders", desc: "Automatic scheduling of review dates so assessments stay current and nothing slips." },
      { name: "Audit-ready documentation", desc: "All reports, certificates, and records stored and accessible for inspection or enforcement at any time." },
      { name: "Portfolio compliance oversight", desc: "At-a-glance status across multiple sites — overdue items, upcoming reviews, and outstanding actions." },
      { name: "Compliance reporting", desc: "Clear reporting on compliance status for landlords, managing agents, and responsible persons." },
      { name: "Ongoing competent person support", desc: "Day-to-day advice and support to keep your organisation compliant as circumstances change." },
    ],
  },
];

export function getCategory(slug: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find((c) => c.slug === slug);
}

/**
 * The footer's Services column (repositioning PR1). Hand-ordered rather than
 * derived by flatMap over `SERVICE_CATEGORIES`, because a category's
 * `sections` are declared together but need to interleave with sibling
 * categories in the list a reader actually wants: Fire Risk Assessments,
 * Fire Engineering, Fire Safety Consultancy, then Health & Safety, then
 * Compliance Management. Labels are read from the data so the footer cannot
 * drift from the pages it links to; only the ORDER is hand-set here.
 *
 * Construction Health & Safety is deliberately absent until PR5 creates its
 * page — a footer link with no destination is worse than no link.
 */
export const FOOTER_SERVICE_LINKS: { label: string; href: string }[] = (() => {
  const fireSafety = SERVICE_CATEGORIES.find((c) => c.slug === "fire-safety");
  const fra = fireSafety?.sections?.find((s) => s.id === "fire-risk-assessments");
  const fsc = fireSafety?.sections?.find((s) => s.id === "fire-safety-consultancy");
  const fireEngineering = SERVICE_CATEGORIES.find((c) => c.slug === "fire-engineering");
  const healthSafety = SERVICE_CATEGORIES.find((c) => c.slug === "health-safety");
  const complianceSupport = SERVICE_CATEGORIES.find((c) => c.slug === "compliance-support");

  const links = [
    fra && { label: fra.title, href: `/services/fire-safety#${fra.id}` },
    fireEngineering && { label: fireEngineering.title, href: `/services/${fireEngineering.slug}` },
    fsc && { label: fsc.title, href: `/services/fire-safety#${fsc.id}` },
    healthSafety && { label: healthSafety.title, href: `/services/${healthSafety.slug}` },
    complianceSupport && { label: complianceSupport.title, href: `/services/${complianceSupport.slug}` },
  ].filter((l): l is { label: string; href: string } => Boolean(l));

  return links;
})();

export interface HomepageServiceCard {
  icon: string;
  title: string;
  desc: string;
  href: string;
}

export interface HomepageServiceCluster {
  /** Cluster label, rendered above its cards — the two co-equal disciplines. */
  label: string;
  cards: HomepageServiceCard[];
}

/**
 * Homepage service-card data (repositioning PR2, August 2026) — replaces a
 * hand-typed, independently-drifting array that used to live in `app/page.tsx`
 * (it had already gone stale: it was missing Compliance Management entirely).
 * Every card's title and description is read from `SERVICE_CATEGORIES` /
 * `ServiceSection`, not retyped, so the homepage cannot silently diverge from
 * the pages it links to — the same discipline PR1 applied to
 * `FOOTER_SERVICE_LINKS` above.
 *
 * Five cards in two clusters, matching the approved architecture:
 *   Fire Safety & Fire Engineering — Fire Risk Assessments, Fire Engineering,
 *   Fire Safety Consultancy (three propositions, equal billing since PR1).
 *   Health & Safety & Construction Safety — Health & Safety Consultancy,
 *   Construction Health & Safety.
 *
 * Compliance Management is NOT a sixth card here — see the note on
 * `POSITIONING` above for why. It keeps its own page and its own footer link;
 * it is just not promoted to homepage-headline status.
 *
 * Construction Health & Safety has no dedicated page yet (PR5). Its card
 * description below is assembled from two sentences that already exist
 * verbatim elsewhere in this file — the health-safety category's "RAMS and
 * Construction Phase Plans" and "Competent Person Support" items — recombined,
 * not newly claimed. Its link deep-links to the stable `id` added to the RAMS
 * item above, so the destination is real rather than a page that doesn't
 * exist. Wording is kept to advisory language (assessments, plans, support
 * "alongside" the project team) — it does not say or imply that Lion RMS acts
 * as Principal Designer or Principal Contractor.
 */
export const HOMEPAGE_SERVICE_CLUSTERS: HomepageServiceCluster[] = (() => {
  const fireSafety = SERVICE_CATEGORIES.find((c) => c.slug === "fire-safety");
  const fra = fireSafety?.sections?.find((s) => s.id === "fire-risk-assessments");
  const fsc = fireSafety?.sections?.find((s) => s.id === "fire-safety-consultancy");
  const fireEngineering = SERVICE_CATEGORIES.find((c) => c.slug === "fire-engineering");
  const healthSafety = SERVICE_CATEGORIES.find((c) => c.slug === "health-safety");

  const fireCards: (HomepageServiceCard | false | undefined)[] = [
    fra && { icon: "📄", title: fra.title, desc: fra.intro, href: `/services/fire-safety#${fra.id}` },
    fireEngineering && { icon: "📐", title: fireEngineering.title, desc: fireEngineering.short, href: `/services/${fireEngineering.slug}` },
    fsc && { icon: "🔥", title: fsc.title, desc: fsc.intro, href: `/services/fire-safety#${fsc.id}` },
  ];

  const healthSafetyCards: (HomepageServiceCard | false | undefined)[] = [
    healthSafety && { icon: "🏗️", title: healthSafety.title, desc: healthSafety.short, href: `/services/${healthSafety.slug}` },
    {
      icon: "🦺",
      title: "Construction Health & Safety",
      desc: "Risk assessments, method statements and construction phase plans developed alongside your project team, with ongoing competent-person support for construction clients.",
      href: "/services/health-safety#rams-construction-phase-plans",
    },
  ];

  const isCard = (c: HomepageServiceCard | false | undefined): c is HomepageServiceCard => Boolean(c);

  return [
    { label: "Fire Safety & Fire Engineering", cards: fireCards.filter(isCard) },
    { label: "Health & Safety & Construction Safety", cards: healthSafetyCards.filter(isCard) },
  ];
})();

// The nine approved sectors (Phase 4B PR 1). Three have dedicated pages
// (`hasPage: true`); the remaining six are represented on the homepage and
// the /sectors index without a dedicated page yet — deferred to a later PR.
export interface Sector {
  slug: string;
  title: string;
  summary: string;
  body?: string;
  considerations?: string[];
  relatedServices?: string[]; // slugs into SERVICE_CATEGORIES
  hasPage: boolean;
}

export const SECTORS: Sector[] = [
  {
    slug: "residential-blocks-hmos",
    title: "Residential Blocks & HMOs",
    summary: "Fire risk assessments and ongoing compliance support for residential blocks, purpose-built flats, and HMOs.",
    body: "Fire risk assessments and ongoing compliance support for residential blocks, purpose-built flats, and HMOs — meeting your duties under the Fire Safety Order for the common parts, with clear, prioritised action plans landlords and managing agents can work through.",
    considerations: [
      "Common-parts duties under the Regulatory Reform (Fire Safety) Order 2005",
      "Coordination with managing agents across a portfolio",
      "HMO licensing overlap",
      "External wall and compartmentation considerations where relevant",
    ],
    relatedServices: ["fire-safety"],
    hasPage: true,
  },
  {
    slug: "offices-commercial-workplaces",
    title: "Offices & Commercial Workplaces",
    summary: "Practical fire safety and health & safety support for offices and commercial workplaces.",
    body: "Practical fire safety and health & safety support for offices and commercial workplaces — general fire precautions, evacuation planning, and day-to-day health & safety risk assessment, delivered with minimal disruption to your business.",
    considerations: [
      "General fire precautions and evacuation planning",
      "Multi-tenant building coordination",
      "Workplace health & safety risk assessment alongside fire",
      "Scheduling around business hours, with minimal disruption",
    ],
    relatedServices: ["fire-safety", "health-safety"],
    hasPage: true,
  },
  {
    slug: "education",
    title: "Education",
    summary: "Fire risk assessments and health & safety support for schools, colleges, and other education settings.",
    body: "Fire risk assessments and health & safety support for education settings, carried out with the scheduling and site awareness that schools and colleges need — clear, prioritised recommendations that account for higher-occupancy, vulnerable-occupant environments.",
    considerations: [
      "Higher-occupancy and vulnerable-occupant risk profile",
      "Phased and assisted evacuation planning",
      "Scheduling around term time",
    ],
    relatedServices: ["fire-safety", "health-safety"],
    hasPage: true,
  },
  {
    slug: "property-management",
    title: "Property Management",
    summary: "Portfolio-wide fire risk assessments and compliance management for managing agents.",
    hasPage: false,
  },
  {
    slug: "construction-developers",
    title: "Construction & Developers",
    summary: "Fire strategies, RAMS, and construction phase plans for new developments and change-of-use projects.",
    hasPage: false,
  },
  {
    slug: "retail-hospitality",
    title: "Retail & Hospitality",
    summary: "Fire safety and health & safety support for retail units, restaurants, and hospitality venues.",
    hasPage: false,
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    summary: "Fire risk assessment and health & safety support for healthcare and care settings.",
    hasPage: false,
  },
  {
    slug: "industrial-warehousing",
    title: "Industrial & Warehousing",
    summary: "Fire safety and health & safety support for industrial units, warehouses, and logistics sites.",
    hasPage: false,
  },
  {
    slug: "mixed-use-developments",
    title: "Mixed-Use & Change of Use Developments",
    summary: "Fire strategies and compliance support for mixed-use schemes and change-of-use developments.",
    hasPage: false,
  },
];

export function getSector(slug: string): Sector | undefined {
  return SECTORS.find((s) => s.slug === slug);
}

// Professional memberships, qualifications and assurance items — single
// source of truth (Phase 4B PR 1). Previously split across two inconsistent
// lists (`CREDENTIALS`, `MEMBERSHIPS`); reconciled here with every membership
// grade stated explicitly so badges can never misrepresent chartership status.
export interface Membership {
  abbr: string;
  /** Short grade word used in compact badges — always shown, never omitted. */
  grade: string;
  /** Full, formal name — used in structured data and any full-text listing. */
  fullName: string;
}
// Order here is the order post-nominals are displayed everywhere they appear —
// the badge strips on the homepage, About and Contact, the footer's first four,
// and `hasCredential` in the Person JSON-LD all read from this array in
// sequence. Set to the owner's stated preferred order.
export const MEMBERSHIPS: Membership[] = [
  { abbr: "MIFireE", grade: "Member", fullName: "Member of the Institution of Fire Engineers (IFE)" },
  { abbr: "CMIOSH", grade: "Chartered", fullName: "Chartered Member of the Institution of Occupational Safety and Health (IOSH)" },
  { abbr: "MIFSM", grade: "Member", fullName: "Member of the Institute of Fire Safety Managers (IFSM)" },
  { abbr: "MIIRSM", grade: "Member", fullName: "Member of the International Institute of Risk and Safety Management (IIRSM)" },
  { abbr: "AIEMA", grade: "Associate", fullName: "Associate Member of the Institute of Environmental Management and Assessment (IEMA)" },
];

export interface Qualification {
  name: string;
}
export const QUALIFICATIONS: Qualification[] = [
  { name: "Level 4 Diploma in Fire Risk Assessment" },
  { name: "Level 5 Diploma in Fire Engineering Design" },
];

export interface Assurance {
  name: string;
}
// ISO 45001 intentionally omitted — basis/evidence not yet confirmed (Phase 4B PR 1).
export const ASSURANCES: Assurance[] = [
  { name: "PI Insured" },
];

// Derived, not hand-maintained — feeds the existing badge strips (About,
// Contact, homepage, Footer) and PersonJsonLd without changing their shape.
export const CREDENTIALS: string[] = [
  ...MEMBERSHIPS.map((m) => `${m.abbr} — ${m.grade}`),
  ...QUALIFICATIONS.map((q) => q.name),
  ...ASSURANCES.map((a) => a.name),
];

export const ASSESSOR = {
  name: "Batir Turakulov",
  role: "Fire Engineer, Member of the Institution of Fire Engineers (MIFireE), and Chartered Health & Safety Professional (CMIOSH)",
  /**
   * Compact form of `role`, for places where the full form would be unwieldy —
   * currently the two portrait alt texts. `role` grew past 120 characters when
   * MIFireE was spelled out in full, which would have pushed those alt strings
   * to 172 characters; screen-reader guidance puts the practical ceiling around
   * 125. Same credentials, same order, fewer words. Not a second source of
   * truth: nothing here is a claim that `role` does not already make.
   */
  shortRole: "Fire Engineer (MIFireE) & Chartered Health & Safety Professional (CMIOSH)",
  photo: "/batir-turakulov.jpg",
  bio: "Batir Turakulov is a Fire Engineer, Member of the Institution of Fire Engineers (MIFireE), and Chartered Health & Safety Professional (CMIOSH), specialising in fire engineering, health & safety, fire risk assessments, fire safety consultancy, building fire safety and regulatory compliance across commercial, residential and complex premises. He holds a Level 5 Diploma in Fire Engineering Design and a Level 4 Diploma in Fire Risk Assessment. He provides pragmatic, proportionate consultancy, helping organisations manage risk, achieve compliance and protect people, property and business continuity. Every assessment is personally undertaken by Batir, ensuring clients receive technically robust reports, practical recommendations and clear advice aligned with current UK legislation and recognised industry standards.",
  credentials: CREDENTIALS,
};

export const WHO_WE_HELP = [
  { title: "Landlords & Responsible Persons", body: "Meet your duties under the Fire Safety Order with clear, prioritised assessments and straightforward guidance — so you stay compliant and protect your residents." },
  { title: "Managing Agents", body: "Portfolio-wide fire risk assessments, action tracking, and a single point of contact across all your blocks — with audit-ready records whenever you need them." },
  { title: "Construction & Developers", body: "Fire strategies, RAMS, and construction phase plans that support planning and Building Regulations, delivered alongside your project team." },
  { title: "Businesses & Employers", body: "Health & safety risk assessments, audits, and policies that keep your people safe and your business compliant under the Health and Safety at Work Act." },
];

export const FAQS = [
  { q: "How often do I need a fire risk assessment?", a: "There is no fixed legal interval, but the Fire Safety Order requires your assessment to be kept up to date. As a rule of thumb, review it annually and carry out a fresh assessment every 1–2 years, or sooner after significant changes to the building, its use, or its occupants.", relatedService: "fire-safety" },
  { q: "Is a fire risk assessment a legal requirement?", a: "Yes. Under the Regulatory Reform (Fire Safety) Order 2005, the Responsible Person for almost any non-domestic premises — and the common parts of residential blocks — must carry out and maintain a suitable and sufficient fire risk assessment.", relatedService: "fire-safety" },
  { q: "What is the difference between a Type 1 and Type 4 fire risk assessment?", a: "Two things set the type: how far into the building the assessment reaches, and whether construction is opened up. Type 1 covers the common parts without destructive inspection and is much the most common. Type 2 covers the common parts with destructive inspection. Type 3 covers the common parts and a sample of flats without destructive inspection. Type 4 covers both, with destructive inspection. Higher types are not simply more thorough — they answer different questions.", relatedService: "fire-safety" },
  { q: "Do I need a fire strategy as well as a fire risk assessment?", a: "Not always. A fire risk assessment evaluates an existing building in use. A fire strategy is a design document for new builds, change-of-use, or complex buildings, setting out the fire safety principles to support planning and Building Regulations. We can advise which you need.", relatedService: "fire-safety" },
  { q: "Who is the 'Responsible Person'?", a: "It is whoever has control of the premises — typically the employer, building owner, landlord, or managing agent. The Responsible Person carries the legal duty to manage fire safety and act on the assessment's findings." },
  { q: "How quickly can you carry out an assessment?", a: "We aim to be responsive and will agree a timescale with you up front, prioritising urgent or enforcement-driven work. Get in touch with your requirements and we'll confirm availability." },
  { q: "Do you cover health & safety as well as fire?", a: "Yes. Alongside fire safety we provide general health & safety risk assessments, audits, RAMS, policies, and competent person support — so you can manage both through one consultancy.", relatedService: "health-safety" },
  { q: "What areas do you cover?", a: "We are based in London and cover London and the Home Counties (Hertfordshire, Essex, Kent, Surrey, Buckinghamshire and Berkshire) as standard, with wider UK coverage available by arrangement for larger projects and portfolios." },
];

export const RESOURCES = [
  { title: "Compliance Self-Check", body: "Ten yes/no questions across your fire and H&S duties — instant red/amber/green score, no sign-up needed.", href: "/check", external: false },
  { title: "Fire Safety Checklist", body: "A quick self-check for landlords and Responsible Persons before your assessment.", href: "/downloads/fire-safety-checklist", external: false },
];

export const STATS = [
  { value: 10, suffix: "+", label: "Years' experience across fire & safety" },
  { value: 500, suffix: "+", label: "Assessments & inspections completed" },
  { value: 9, suffix: "", label: "Sectors served — see our sector experience" },
  { value: 16, suffix: "", label: "London areas covered" },
];

export const PROCESS_STEPS = [
  { n: "01", title: "Enquiry", body: "Tell us about your premises, portfolio, or project. We confirm scope, timescales, and a clear fixed fee — usually the same day." },
  { n: "02", title: "Site visit", body: "Your assessor visits in person, walking the building and gathering the evidence a suitable and sufficient assessment depends on." },
  { n: "03", title: "Report", body: "You receive a clear, prioritised report in plain English — what matters, why, and in what order to act." },
  { n: "04", title: "Ongoing support", body: "Action tracking, reviews, reminders, and compliance records that keep your compliance current — not a report left in a drawer." },
];

// "What Clients Receive" section (Phase 4B PR 1) — tangible deliverables,
// distinct from PROCESS_STEPS above (which describes the steps, not the outputs).
export const WHAT_CLIENTS_RECEIVE = [
  { title: "A clear, prioritised report", body: "Written in plain English — what matters, why, and in what order to act." },
  { title: "A fixed fee, agreed up front", body: "Confirmed before any work begins, so there are no surprises." },
  { title: "A named point of contact", body: "The same assessor throughout, not a call centre." },
  { title: "Actions tracked to completion", body: "A live record, not a report left in a drawer." },
  { title: "Review dates scheduled automatically", body: "So nothing lapses without your knowledge." },
  { title: "Audit-ready documentation", body: "Stored and accessible whenever you need it, for inspection or enforcement." },
];

export const STANDARDS_ROW = [
  "PAS 79", "BS 9999", "Approved Document B", "RRO (Fire Safety) Order 2005",
  "BS 9991", "Health & Safety at Work Act 1974", "CDM 2015",
];

// Anonymised recent-work highlights for the homepage "Recent Projects"
// section — condensed versions of entries also shown in full on /case-studies.
export const RECENT_PROJECTS = [
  {
    sector: "Residential · Managing Agent",
    title: "Portfolio fire risk assessments, London-wide",
    body: "A programme of Type 1 and Type 4 assessments across a residential block portfolio, feeding straight into an ongoing, prioritised action schedule.",
  },
  {
    sector: "Construction · Principal Contractor",
    title: "RAMS & construction phase plans",
    body: "Risk assessments and construction phase plans developed alongside the project team to support a compliant, well-documented site setup.",
  },
  {
    sector: "Mixed-use · Developer",
    title: "Fire strategy for a change-of-use scheme",
    body: "A bespoke fire strategy setting out evacuation principles and construction details, unlocking planning approval without further queries.",
  },
];

export const TESTIMONIALS = [
  { quote: "The assessment was thorough without being alarmist — every action came prioritised, costed in effort, and explained in plain English. Exactly what a Responsible Person needs.", name: "Portfolio Manager", role: "Managing agent, London" },
  { quote: "One consultant who actually understands both fire and health & safety — and provided clear compliance records so nothing slips. It has changed how we run compliance.", name: "Operations Director", role: "Multi-site commercial business" },
  { quote: "Responsive, precise, and pragmatic on site. The fire strategy unlocked our change-of-use application without a single round of planning queries.", name: "Project Lead", role: "Developer, mixed-use scheme" },
];

export const WHY_US = [
  { title: "Practical, proportionate advice", body: "We focus on what genuinely reduces risk and supports compliance, without over-complicating the process or inflating costs." },
  { title: "UK compliance expertise", body: "Every recommendation is grounded in current UK fire safety legislation and health & safety law, tailored to your premises." },
  { title: "Broad sector experience", body: "We work across residential, commercial, and construction environments, giving us the depth to understand your context." },
  { title: "Tailored, client-focused support", body: "We communicate clearly, meet deadlines, and provide straightforward guidance so you can make informed decisions." },
  { title: "Joined-up consultancy", body: "Fire and health & safety through one consultancy — a consistent, professional approach throughout." },
  { title: "Responsive and reliable", body: "A direct line to an experienced assessor who responds quickly and sees your work through to completion." },
];
