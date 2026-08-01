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

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
  fireSafety: "/img/services/fire-5.jpg",
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
  { label: "Knowledge Centre", href: "/guides" },
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

// Company positioning — Lion RMS is presented across three co-equal
// disciplines: Fire Engineering, Health & Safety, and Fire Risk Assessment.
// Fire risk assessment is deliberately kept prominent rather than subordinate:
// it is both a core discipline and the highest-intent search term for the
// business. Coverage wording stays "London, the Home Counties, and the wider
// UK by arrangement" — never an unrestricted UK-wide claim (see COVERAGE_FULL).
export const POSITIONING =
  "Lion Risk Management Solutions is a Fire Engineering, Health & Safety and Fire Risk Assessment Consultancy, providing fire engineering consultancy, fire risk assessments, fire safety consultancy, fire strategies, fire door inspections, compartmentation assessments, health & safety consultancy, compliance auditing and professional training across London, the Home Counties, and the wider UK by arrangement.";

export interface ServiceItem {
  name: string;
  desc: string;
}
export interface ServiceCategory {
  slug: string;
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  short: string;
  intro: string;
  items: ServiceItem[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "fire-safety",
    image: IMAGES.fireSafety,
    imageAlt: "Protected escape corridor with fire doors, emergency lighting and illuminated exit signage",
    eyebrow: "Fire Engineering",
    title: "Fire Engineering & Fire Safety Services",
    short: "Fire engineering, fire safety consultancy, fire risk assessments, fire strategies, fire door inspections, compartmentation, and fire safety training.",
    intro: "Fire engineering led, from design-stage advice through to buildings in use. We help duty holders and project teams meet their obligations under the Regulatory Reform (Fire Safety) Order 2005 and the Building Regulations, with clear, prioritised, and proportionate fire safety advice for residential, commercial, and complex premises.",
    // Ordered to the approved service hierarchy: fire engineering first, with
    // fire risk assessment positioned as one service within the broader
    // offering rather than the headline discipline.
    items: [
      { name: "Fire Engineering", desc: "Applied fire engineering across building fire safety — means of escape, passive and active fire protection, compartmentation strategy, and fire safety design review for new build, refurbishment and change-of-use projects." },
      { name: "Fire Safety Consultancy", desc: "Specialist fire safety advice for duty holders, project teams and building owners — from design-stage input and regulatory interpretation through to remedial strategy and ongoing compliance support." },
      { name: "Fire Risk Assessments", desc: "Thorough assessments that identify fire hazards, evaluate risk to occupants, and provide clear, prioritised recommendations informed by relevant recognised guidance, including PAS 79 where appropriate, and the applicable fire safety legislation for the premises and jurisdiction." },
      { name: "Fire Strategies", desc: "Bespoke fire strategies for new developments, change-of-use projects, and complex buildings — supporting planning and Building Regulations compliance." },
      { name: "Fire Door Inspections", desc: "Inspection of fire doors and their hardware against current standards, with a clear schedule of defects and remedial priorities." },
      { name: "Compartmentation", desc: "Survey and review of compartmentation and fire-stopping to identify breaches that could compromise the building's passive fire protection." },
      { name: "Fire Safety Training", desc: "Practical training for staff, managers, and fire marshals covering prevention, evacuation, equipment use, and legal responsibilities — delivered on-site." },
      { name: "Advice for Landlords, Duty Holders & Responsible Persons", desc: "Straightforward guidance on your legal duties so you can make informed, compliant decisions about your premises." },
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
      { name: "RAMS and Construction Phase Plans", desc: "Risk assessments, method statements, and construction phase plans developed alongside your project team." },
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
  { name: "DipFRA Advanced" },
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
  bio: "Batir Turakulov is a Fire Engineer, Member of the Institution of Fire Engineers (MIFireE), and Chartered Health & Safety Professional (CMIOSH), specialising in fire engineering, health & safety, fire risk assessments, fire safety consultancy, building fire safety and regulatory compliance across commercial, residential and complex premises. He holds a Level 5 Diploma in Fire Engineering Design and an Advanced Diploma in Fire Risk Assessment. He provides pragmatic, proportionate consultancy, helping organisations manage risk, achieve compliance and protect people, property and business continuity. Every assessment is personally undertaken by Batir, ensuring clients receive technically robust reports, practical recommendations and clear advice aligned with current UK legislation and recognised industry standards.",
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
  { q: "What is the difference between a Type 1 and Type 4 fire risk assessment?", a: "The types refer to how far the assessment looks into a building. Type 1 is the most common, non-destructive review of common parts. Types 2–4 go progressively further, including destructive inspection and sampling of individual flats, and are used where there is reason to look deeper.", relatedService: "fire-safety" },
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
    body: "A programme of Type 1 and Type 3 assessments across a residential block portfolio, feeding straight into an ongoing, prioritised action schedule.",
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
