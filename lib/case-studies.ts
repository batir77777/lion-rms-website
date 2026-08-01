// Case studies — reusable content model (Phase 4B PR 2).
//
// These three case studies expand existing, already-published anonymised
// project summaries (previously only short cards on /case-studies) into full
// detail pages. No new projects are introduced — every fact below traces
// back to copy already live on the site before this PR. Fields that aren't
// evidenced anywhere in the existing copy (exact dates, named buildings,
// specific risk gradings) are deliberately left as honest, qualitative
// descriptions rather than invented specifics — flagged in the PR
// description for Batir to tighten up with real detail if he wants to.

export interface KeyFacts {
  sector: string;
  buildingType: string;
  /** General location only — never a specific site/address. */
  location: string;
  serviceProvided: string;
  projectType: string;
  riskLevel: string;
  yearCompleted: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  /** Short display label used on cards, e.g. "Residential · Managing Agent". */
  sectorLabel: string;
  sectorSlug?: string; // slug into SECTORS, for the badge + related content
  excerpt: string; // used on the index card
  tags: string[];
  keyFacts: KeyFacts;
  overview: string;
  scopeOfWork: string[];
  challenges: string[];
  recommendations: string[];
  outcome: string;
  servicesProvided: string[]; // slugs into SERVICE_CATEGORIES — structured data + internal linking
  relatedSectors: string[]; // slugs into SECTORS
  relatedServices: string[]; // slugs into SERVICE_CATEGORIES
  relatedInsightSlugs?: string[]; // slugs into POSTS
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "residential-portfolio-fire-risk-assessment",
    title: "Portfolio fire risk assessments with ongoing action tracking",
    sectorLabel: "Residential · Managing Agent",
    sectorSlug: "residential-blocks-hmos",
    excerpt:
      "Programme of Type 1 and Type 4 fire risk assessments across a residential block portfolio — findings fed directly into an ongoing compliance record, giving the client a prioritised action schedule and audit-ready documentation.",
    tags: ["Fire Risk Assessment", "RRO 2005", "Action Tracking", "Audit-Ready Records"],
    keyFacts: {
      sector: "Residential blocks & HMOs",
      buildingType: "Purpose-built residential blocks (portfolio)",
      location: "London",
      serviceProvided: "Fire Risk Assessment",
      projectType: "Portfolio programme",
      riskLevel: "Type 1 & Type 4 assessments — findings prioritised by severity",
      yearCompleted: "Ongoing",
    },
    overview:
      "A managing agent responsible for a portfolio of residential blocks needed fire risk assessments carried out consistently across every building, with a way of tracking the resulting actions that didn't rely on filing individual reports away and hoping nothing slipped. We put in place a rolling programme of fire risk assessments across the portfolio — Type 1 across the common parts, and Type 4 where the building warranted looking inside a sample of flats and opening up construction — with every finding feeding directly into an ongoing compliance record.",
    scopeOfWork: [
      "Type 1 fire risk assessments — common parts, non-destructive — across the portfolio",
      "Type 4 assessments — common parts and a sample of flats, with destructive inspection — where construction had to be opened up to verify compartmentation",
      "Findings recorded directly into an ongoing compliance record for the client, rather than delivered as standalone reports",
    ],
    challenges: [
      "Coordinating access and scheduling across a multi-building portfolio without disrupting residents",
      "Maintaining a consistent standard of assessment across blocks of varying age and construction",
      "Turning raised findings into action the managing agent could actually track and close out, not just a static report on file",
    ],
    recommendations: [
      "A prioritised, risk-ranked action schedule for each block, rather than an undifferentiated list of findings",
      "Clear review dates set for every assessment so nothing falls out of date unnoticed",
      "Documentation structured to be audit-ready if requested by residents, insurers or enforcing authorities",
    ],
    outcome:
      "The findings fed directly into an ongoing compliance record, giving the managing agent a single, prioritised action schedule across the portfolio and audit-ready documentation for every block — with review dates scheduled so the programme keeps pace with the portfolio rather than needing to be restarted from scratch each cycle.",
    servicesProvided: ["fire-safety", "compliance-support"],
    relatedSectors: ["residential-blocks-hmos", "property-management"],
    relatedServices: ["fire-safety", "compliance-support"],
    relatedInsightSlugs: [
      "fire-risk-assessments-explained",
      "fire-safety-responsibilities-responsible-person",
    ],
  },
  {
    slug: "mixed-use-fire-strategy-change-of-use",
    title: "Fire strategy for a change-of-use scheme",
    sectorLabel: "Mixed-use · Developer",
    sectorSlug: "mixed-use-developments",
    excerpt:
      "A bespoke fire strategy supporting a change-of-use planning application, setting out evacuation principles and construction details for Building Regulations compliance — unlocking planning approval without further queries.",
    tags: ["Fire Strategy", "Building Regs", "Planning"],
    keyFacts: {
      sector: "Mixed-use & change of use developments",
      buildingType: "Mixed-use scheme (change of use)",
      location: "London",
      serviceProvided: "Fire Strategy",
      projectType: "Change-of-use planning support",
      riskLevel: "Design-stage — evacuation & construction principles set at strategy stage",
      yearCompleted: "Recent",
    },
    overview:
      "A developer needed a fire strategy to support a change-of-use planning application on a mixed-use scheme — the existing building's construction meant the strategy had to work with what was already there, not a blank sheet of paper, while still giving the planning authority everything it needed to approve the application first time.",
    scopeOfWork: [
      "Review of the proposed change-of-use scheme against current Building Regulations guidance",
      "Development of a bespoke fire strategy covering means of escape and evacuation principles",
      "Construction detail recommendations to support Building Regulations compliance",
      "Strategy prepared to a standard suitable for submission alongside the planning application",
    ],
    challenges: [
      "Aligning a fire strategy with a change of use rather than a new-build, where existing construction constrained the available options",
      "Producing a strategy robust enough to satisfy the planning authority without triggering a further round of queries",
      "Balancing evacuation principles against the practical realities of the existing building fabric",
    ],
    recommendations: [
      "Evacuation strategy and travel distances set out clearly enough to be assessed directly by the planning authority",
      "Construction detail requirements identified early, before they became a design or cost problem later in the project",
      "A strategy document structured so it could be referenced directly in the Building Regulations submission",
    ],
    outcome:
      "The fire strategy unlocked the change-of-use planning application, with the evacuation principles and construction details accepted without a further round of planning queries.",
    servicesProvided: ["fire-safety"],
    relatedSectors: ["mixed-use-developments", "construction-developers"],
    relatedServices: ["fire-safety"],
    relatedInsightSlugs: ["pas-9970-bsi-consultation-fire-safety-construction"],
  },
  {
    slug: "multi-site-commercial-compliance-management",
    title: "Bespoke compliance management for a multi-site commercial portfolio",
    sectorLabel: "Commercial · Multi-site Business",
    sectorSlug: "offices-commercial-workplaces",
    excerpt:
      "A tailored compliance management service centralising inspections, actions, and records across all sites — giving the client clear visibility of fire and health & safety compliance, with scheduled review reminders.",
    tags: ["Compliance Management", "Multi-site Portfolio", "Review Scheduling"],
    keyFacts: {
      sector: "Commercial — multi-site business",
      buildingType: "Multiple commercial sites (portfolio)",
      location: "London & the Home Counties",
      serviceProvided: "Compliance Management",
      projectType: "Ongoing compliance management",
      riskLevel: "Ongoing — inspections, actions and reviews managed on a rolling basis",
      yearCompleted: "Ongoing",
    },
    overview:
      "A commercial business operating across multiple sites had fire and health & safety compliance information split across each location, with no single view of what was outstanding, overdue, or coming up for review. We built a bespoke compliance management service that centralises inspections, actions and records across every site into one auditable system.",
    scopeOfWork: [
      "Centralising fire and health & safety inspection records across all sites into a single system",
      "Tracking remedial actions from each site through to closure",
      "Scheduling review reminders so no site's compliance record falls out of date",
      "Giving the client portfolio-wide visibility rather than a site-by-site view",
    ],
    challenges: [
      "Bringing separate, inconsistent site-level records into one coherent portfolio view",
      "Keeping review dates and remedial actions on track across multiple sites without a dedicated in-house compliance function",
      "Making compliance status visible to the client at a glance, rather than buried in individual site reports",
    ],
    recommendations: [
      "A single compliance record covering every site, with status visible at a glance",
      "Remedial actions tracked to closure with a clear audit trail",
      "Review dates scheduled automatically so compliance stays current without the client having to chase it",
    ],
    outcome:
      "The client gained clear, portfolio-wide visibility of fire and health & safety compliance across every site, with actions tracked to completion and reviews scheduled automatically — replacing a fragmented, site-by-site approach with one auditable record.",
    servicesProvided: ["compliance-support"],
    relatedSectors: ["offices-commercial-workplaces", "retail-hospitality"],
    relatedServices: ["compliance-support", "health-safety"],
    relatedInsightSlugs: ["commercial-fire-safety-compliance"],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

// Internal-linking helpers (Phase 4B PR 2) — used to auto-populate
// "Related case studies" on service and sector pages.
export function getCaseStudiesForService(serviceSlug: string): CaseStudy[] {
  return CASE_STUDIES.filter(
    (c) => c.relatedServices.includes(serviceSlug) || c.servicesProvided.includes(serviceSlug),
  );
}

export function getCaseStudiesForSector(sectorSlug: string): CaseStudy[] {
  return CASE_STUDIES.filter(
    (c) => c.relatedSectors.includes(sectorSlug) || c.sectorSlug === sectorSlug,
  );
}

// Additional case-study summaries that remain index-only (no detail page yet)
// — unchanged from the original /case-studies content, just moved here
// alongside the detailed ones so the index page has one source of truth.
export interface CaseSummary {
  sector: string;
  title: string;
  body: string;
  tags: string[];
}

export const OTHER_CASES: CaseSummary[] = [
  {
    sector: "Construction · Principal Contractor",
    title: "RAMS & construction phase plans",
    body: "Risk assessments, method statements, and construction phase plans developed alongside the project team to support a compliant, well-documented site setup — all properly recorded and version-controlled.",
    tags: ["RAMS", "CDM", "H&S", "Document Control"],
  },
  {
    sector: "Property Management · Managing Agent",
    title: "Ongoing compliance management for a property management company",
    body: "A bespoke compliance management service for a property management company, centralising fire and health & safety inspections, certificates, and remedial actions into a single, auditable record across their managed portfolio.",
    tags: ["Compliance Management", "Property Management", "Portfolio Oversight"],
  },
  {
    sector: "Professional Services · Consultancy",
    title: "Compliance management support for a consultancy firm",
    body: "A tailored compliance management service streamlining how assessments, records, and client deliverables are produced, tracked, and stored — reducing admin time and improving audit readiness.",
    tags: ["Compliance Management", "Consultancy", "Process Improvement"],
  },
];
