import { getSector } from "@/lib/site";

// Insights / blog posts — demonstrates expertise (E-E-A-T) and adds fresh
// content. Phase 4B PR 2 organises posts into four cornerstone categories so
// the knowledge base scales rather than reading as an undifferentiated list.
export interface InsightCategory {
  slug: string;
  label: string;
}

export const INSIGHT_CATEGORIES: InsightCategory[] = [
  { slug: "fire-risk-assessment", label: "Fire Risk Assessment" },
  { slug: "fire-safety", label: "Fire Safety" },
  { slug: "health-safety", label: "Health & Safety" },
  { slug: "compliance-legislation", label: "Compliance & Legislation" },
];

export function getInsightCategory(slug: string): InsightCategory | undefined {
  return INSIGHT_CATEGORIES.find((c) => c.slug === slug);
}

export interface Post {
  slug: string;
  title: string;
  date: string; // ISO
  dateLabel: string;
  excerpt: string;
  tags: string[];
  category: string; // slug into INSIGHT_CATEGORIES
  body: string; // simple markdown: blank line = paragraph, "## " = heading, **bold**
  relatedService?: string; // slug into SERVICE_CATEGORIES, for internal linking
  relatedCaseStudySlug?: string; // slug into CASE_STUDIES, for internal linking
}

export const POSTS: Post[] = [
  {
    slug: "fire-risk-assessments-explained",
    title: "Fire risk assessments explained: what they are and what to expect",
    date: "2026-07-06",
    dateLabel: "July 2026",
    excerpt:
      "What a fire risk assessment actually covers, who is legally required to have one, and what a competent assessment should deliver beyond a list of findings.",
    tags: ["Fire Risk Assessment", "RRO 2005", "PAS 79"],
    category: "fire-risk-assessment",
    relatedService: "fire-safety",
    relatedCaseStudySlug: "residential-portfolio-fire-risk-assessment",
    body: `A fire risk assessment is a systematic look at a building to identify fire hazards, evaluate the risk to the people who use it, and set out what needs to change to reduce that risk to an acceptable level. It is not a tick-box inspection and it is not optional for most non-domestic premises and the common parts of residential blocks — it is a legal requirement under the **Regulatory Reform (Fire Safety) Order 2005** (the RRO), and it has to be kept under review.

## Who needs one

If you are the **Responsible Person** for a workplace, or the person in control of the common parts of a residential building containing multiple dwellings, the RRO applies to you. In practice that covers office buildings, shops, warehouses, purpose-built blocks of flats, HMOs, schools, and mixed-use developments — effectively anywhere other than a single private dwelling. Landlords, managing agents, employers and building owners can all be the Responsible Person, depending on who has control of the premises.

## What a proper assessment covers

A competent fire risk assessment works through the same core areas regardless of the building type: how a fire could start and what could fuel it, how it could spread, who is at risk and how vulnerable they might be, the adequacy of means of escape and how quickly people can get out, fire detection and warning arrangements, fire-fighting provisions, and the management arrangements that keep all of the above working day to day — training, maintenance, and record-keeping. **PAS 79**, the British Standards Institution's published guidance, sets out the recognised methodology for carrying this out consistently (we cover this in more detail in a separate article on PAS 79 methodology).

## Type 1 versus Type 3 assessments

For residential blocks, assessments are commonly described as **Type 1** (non-intrusive — a visual inspection of the common parts and shared areas, not the individual flats) or **Type 3** (intrusive — involving inspection of a sample of flat entrance doors and, where necessary, opening up construction to check compartmentation). Which is appropriate depends on the building's construction, height, and any specific concerns already identified — it is not a one-size-fits-all decision, and a competent assessor should be able to explain why a particular type is being recommended for your building.

## What good practice looks like after the assessment

The assessment itself is only the start. A report that simply lists findings and is then filed away doesn't reduce risk — what matters is what happens next: a clear, prioritised action plan, realistic timescales for addressing each finding, a review date so the assessment doesn't quietly go out of date, and documentation that would stand up to scrutiny if a resident, insurer, or enforcing authority asked to see it. This is why we treat every assessment as the start of an ongoing compliance record rather than a one-off deliverable.

## Getting started

If you're not sure whether your premises need an assessment, whether an existing assessment is still current, or what type of assessment is appropriate for your building, get in touch and we can talk through it — there's no obligation, and it's often a five-minute conversation to establish where you stand.`,
  },
  {
    slug: "pas-79-methodology-explained",
    title: "PAS 79 methodology: how a structured fire risk assessment is carried out",
    date: "2026-07-09",
    dateLabel: "July 2026",
    excerpt:
      "PAS 79 is the published methodology behind a properly structured fire risk assessment. Here's what it actually sets out, and why following it matters.",
    tags: ["PAS 79", "Fire Risk Assessment", "Methodology"],
    category: "fire-risk-assessment",
    relatedService: "fire-safety",
    relatedCaseStudySlug: "residential-portfolio-fire-risk-assessment",
    body: `**PAS 79** ("Publicly Available Specification 79: Fire risk assessment — Guidance and a recommended methodology") is the British Standards Institution's guidance document setting out how a fire risk assessment should be structured and carried out. It isn't itself a legal requirement, but it is the recognised, industry-standard methodology that a competent assessment is expected to follow — and it gives clients a way of judging whether an assessment they've received is actually fit for purpose.

## Why a standard methodology matters

Fire risk assessment is a judgement-based exercise — two competent assessors looking at the same building should reach broadly the same conclusions, but only if they're working to a consistent framework. Without one, the quality and thoroughness of an assessment depends entirely on the individual assessor's own habits, which makes it very difficult for a duty holder to know whether they're getting a genuinely thorough assessment or a superficial one. PAS 79 exists to close that gap.

## The core structure

PAS 79 sets out a systematic sequence: identifying fire hazards (sources of ignition, fuel, and oxygen), identifying the people at risk and how vulnerable they are, evaluating the risk arising from those hazards, and considering the adequacy of existing fire precautions — means of escape, fire detection and warning, fire-fighting equipment, and the management of fire safety over time. The output is a structured record of significant findings, not a free-form narrative, which is what makes assessments carried out to PAS 79 comparable and auditable.

## Risk rating, not just risk identification

One of the more important aspects of PAS 79 is that it doesn't stop at listing hazards — it provides a framework for rating the overall level of fire risk in a building (commonly expressed in bands such as trivial, tolerable, moderate, substantial, or intolerable), and for rating individual findings by priority. This is what allows an action plan to be genuinely prioritised, rather than presenting every finding as equally urgent.

## What this means for you as a client

When you commission a fire risk assessment, asking whether it's carried out in line with PAS 79 is a reasonable and useful question — it tells you the assessor is following a recognised, structured methodology rather than an informal walk-round. It also means the resulting report should give you a clear risk rating for the building as a whole, not just a list of individual issues, and a genuinely prioritised set of actions rather than an undifferentiated checklist.

## In practice

Every fire risk assessment we carry out follows the PAS 79 methodology, from initial hazard identification through to a risk-rated, prioritised action plan — because a structured approach is what turns an assessment into something you can actually act on, rather than a document that sits on a shelf.`,
  },
  {
    slug: "fire-door-inspections-explained",
    title: "Fire door inspections: what's checked and why it matters",
    date: "2026-07-13",
    dateLabel: "July 2026",
    excerpt:
      "Fire doors only work if every component is correct and properly maintained. Here's what a fire door inspection actually looks at, and why it's more than checking the door closes.",
    tags: ["Fire Doors", "Inspections", "Compartmentation"],
    category: "fire-safety",
    relatedService: "fire-safety",
    body: `A fire door is a system, not a single object — the leaf, frame, hinges, seals, glazing, door closer and ironmongery all have to work together and be correctly specified for the door to perform as intended. A fire door inspection checks that system as a whole, because a door that looks fine but has the wrong seals, an incompatible lock, or has been undercut for a carpet no longer provides the protection it was designed for.

## Why fire doors matter

Fire doors are a core part of a building's **passive fire protection** — the compartmentation that's designed to hold a fire back for a defined period, protecting escape routes and giving occupants time to get out safely. A fire door isn't there to stop a fire indefinitely; it's rated to resist fire for a specific period (commonly FD30 or FD60, denoting 30 or 60 minutes), and that rating only holds if every part of the door assembly is intact and correctly maintained.

## What an inspection actually checks

A proper fire door inspection looks at the leaf for damage, delamination or unauthorised alterations; the gaps around the door, which need to fall within a specific tolerance — too wide and smoke and flame can pass through, too tight and the door may bind; intumescent and smoke seals, checking they're present, continuous, and undamaged; hinges, checking there are enough of them, correctly fitted, and fire-rated; the door closer, checking the door closes fully from any open position without being forced; and any glazing or vision panels, checking the glass and its beading are the correct fire-rated specification. Signage — "Fire Door Keep Shut" or "Fire Door Keep Locked" as appropriate — is also checked, since it's part of how the door is meant to be managed day to day.

## Common findings

In practice, the same handful of issues come up repeatedly: doors wedged open in breach of their "keep shut" designation, damaged or missing intumescent seals, gaps that have widened as a building settles or as doors are repeatedly used, self-closers that have been disconnected or adjusted so the door no longer closes fully, and doors that have had non-fire-rated hardware fitted at some point without anyone checking the fire rating was preserved. None of these are necessarily obvious to someone walking past — which is exactly why a structured inspection, rather than a casual glance, is needed.

## Who needs fire door inspections and how often

Fire door inspection sits within your wider duties under the RRO 2005, and for higher-risk residential buildings there are now more specific expectations around inspection frequency for doors in the common parts. The right frequency for your building depends on its use, occupancy and risk profile — something we'd cover as part of a fire risk assessment or a dedicated fire door inspection.

## Getting your fire doors checked properly

A fire door inspection should leave you with a clear, prioritised schedule of defects — not just a pass/fail — so remedial work can be planned sensibly rather than reactively. If it's been a while since your fire doors were properly inspected, or you're not sure what condition they're in, that's a straightforward thing for us to help with.`,
  },
  {
    slug: "fire-safety-responsibilities-responsible-person",
    title: "Fire safety responsibilities: understanding the Responsible Person duty",
    date: "2026-07-17",
    dateLabel: "July 2026",
    excerpt:
      "The Regulatory Reform (Fire Safety) Order 2005 places specific legal duties on a 'Responsible Person'. Here's what that role actually means in practice.",
    tags: ["RRO 2005", "Responsible Person", "Legal Duties"],
    category: "compliance-legislation",
    relatedService: "fire-safety",
    relatedCaseStudySlug: "residential-portfolio-fire-risk-assessment",
    body: `The **Regulatory Reform (Fire Safety) Order 2005** is the primary piece of fire safety legislation for non-domestic premises and the common parts of residential buildings in England and Wales. At the centre of it is a single defined role — the **Responsible Person** — who carries specific legal duties. Understanding whether you are the Responsible Person for a given building, and what that actually requires of you, is the starting point for fire safety compliance.

## Who is the Responsible Person

The RRO defines the Responsible Person as the employer, if the workplace is to any extent under their control, or otherwise the person who has control of the premises in connection with their trade, business or other undertaking — for example an owner or a managing agent. For the common parts of a residential building containing two or more sets of domestic premises, the Responsible Person is typically the landlord, freeholder, or managing agent responsible for those shared areas. There can be more than one Responsible Person for the same premises where responsibilities are shared, and each has to cooperate with the others.

## The core duties

The Responsible Person's duties include carrying out a suitable and sufficient fire risk assessment and keeping it under review; putting in place and maintaining appropriate fire precautions, based on the findings of that assessment; providing and maintaining fire-fighting equipment, fire detection and warning systems as appropriate to the risk; ensuring routes to emergency exits and the exits themselves are kept clear and available for use at all times; providing staff (or, in residential settings, relevant persons) with clear information, and where appropriate training, on the fire precautions in place; and keeping records of the assessment and the actions taken, in a form that's proportionate to the size and complexity of the premises.

## What "suitable and sufficient" actually means

The RRO doesn't specify a rigid checklist — it requires the fire risk assessment to be **suitable and sufficient** for the specific premises, which is a proportionate rather than one-size-fits-all standard. A small single-occupancy office and a large residential block with vulnerable occupants will reasonably require different depths of assessment. This is precisely why PAS 79's structured methodology exists — it gives assessors a consistent framework for judging what "suitable and sufficient" looks like for a given building, rather than leaving it to guesswork.

## Enforcement and consequences

Fire and rescue authorities enforce the RRO, and have powers ranging from an informal notice through to enforcement notices, prohibition notices restricting or preventing use of a premises, and prosecution for serious or persistent non-compliance. Beyond the legal exposure, an out-of-date or absent fire risk assessment is also a significant practical risk if a fire does occur — both to the people in the building and to whoever held the Responsible Person duty.

## Making the duty manageable

For many Responsible Persons, particularly managing agents overseeing a portfolio of buildings, the practical challenge isn't understanding the duty in principle — it's keeping every building's assessment current, every action tracked, and every review date met, all at once. That's the gap that ongoing compliance management is designed to close, turning a legal duty into a manageable, auditable process rather than something that has to be reconstructed from scratch each time it's queried.`,
  },
  {
    slug: "commercial-fire-safety-compliance",
    title: "Commercial fire safety compliance: a practical overview for business owners",
    date: "2026-07-21",
    dateLabel: "July 2026",
    excerpt:
      "What fire safety compliance actually involves for a commercial premises — from the initial assessment through to keeping day-to-day precautions in good order.",
    tags: ["Commercial Premises", "Compliance", "Fire Safety"],
    category: "compliance-legislation",
    relatedService: "fire-safety",
    relatedCaseStudySlug: "multi-site-commercial-compliance-management",
    body: `Running a compliant commercial premises means more than having a fire risk assessment on file — it means the precautions identified in that assessment are actually in place, working, and maintained day to day. For business owners without a dedicated facilities or compliance function, it can be difficult to know where the legal minimum sits, and where it's worth going further for genuine risk reduction rather than just paperwork.

## The starting point: a current fire risk assessment

Every commercial premises needs a fire risk assessment under the RRO 2005, carried out by someone competent to do so, and kept under review — not treated as a one-off exercise at lease signing. If your premises has changed in any material way since the last assessment (a layout change, a change of use, new storage arrangements, increased occupancy) the assessment needs revisiting, not just filed as still current.

## The precautions that actually get checked in practice

Beyond the assessment itself, day-to-day commercial fire safety compliance typically comes down to a consistent set of things: means of escape being kept clear at all times, not obstructed by stock, furniture, or deliveries; fire doors closing properly and not wedged open; fire detection and alarm systems tested and maintained on a proper schedule; fire extinguishers in date, correctly located, and of the right type for the risk; emergency lighting tested and functioning; and staff aware of what to do in an emergency, which for most premises means a documented evacuation procedure and, where appropriate, some practical training.

## Multi-tenant and multi-site complications

Where a commercial premises is shared between multiple tenants, or a business operates across several sites, compliance gets meaningfully more complicated. Responsibility for shared areas needs to be clearly established and not simply assumed, and a business with several locations needs a way of knowing, at a glance, which sites are up to date and which aren't — rather than discovering a lapsed assessment only when something goes wrong or an inspection is imminent.

## Where compliance work usually breaks down

In our experience, non-compliance is rarely a case of a business deliberately ignoring its obligations — it's far more often that assessments and actions exist somewhere, but nobody has a clear, current view of the overall picture: which sites have outstanding actions, which reviews are overdue, and which documentation would actually be ready to produce if asked. That's a process problem as much as a fire safety one, and it's usually what ongoing compliance management is built to solve.

## Keeping on top of it

If you run a commercial premises — whether a single site or several — and you're not entirely confident your fire safety compliance would hold up to scrutiny today, that's worth addressing directly rather than leaving as an open question. A proportionate review of where you currently stand is usually the quickest way to find out.`,
  },
  {
    slug: "block-management-fire-safety-guidance",
    title: "Fire safety guidance for block management: what managing agents need to know",
    date: "2026-07-24",
    dateLabel: "July 2026",
    excerpt:
      "Fire safety in residential blocks sits at the intersection of the RRO 2005 and, for higher-risk buildings, the Building Safety Act 2022. Here's what that means for managing agents in practice.",
    tags: ["Block Management", "Managing Agents", "Building Safety Act"],
    category: "compliance-legislation",
    relatedService: "compliance-support",
    body: `Managing agents responsible for residential blocks sit at the centre of fire safety compliance for those buildings — coordinating access for inspections, commissioning fire risk assessments, and, in practice, being the point of contact when leaseholders or residents have concerns. Getting this right across a portfolio of buildings, each with its own age, construction and risk profile, is one of the more demanding parts of the role.

## The legal framework

The **Regulatory Reform (Fire Safety) Order 2005** applies to the common parts of any residential building containing more than one set of domestic premises — the Responsible Person for those common parts (typically the freeholder or managing agent) has the core duties of assessing and managing fire risk. For higher-risk buildings — broadly, those at least 18 metres or 7 storeys with two or more residential units — the **Building Safety Act 2022** adds a further layer, introducing the role of the **Accountable Person** and additional duties around building safety cases, mandatory occupation information, and resident engagement. Managing agents need to be clear about which regime applies to each building in their portfolio, since the two frameworks operate alongside each other rather than one replacing the other.

## What good fire safety management looks like across a portfolio

For a managing agent overseeing multiple blocks, the practical challenge isn't usually understanding any single building's requirements — it's maintaining a consistent, current picture across every building at once: which blocks have a current fire risk assessment, which have outstanding actions and how urgent they are, which fire doors are due for inspection, and which review dates are approaching. Without a structured system, this information tends to live in separate reports and email threads per building, which makes it very difficult to answer a simple question like "are we compliant right now?" with confidence.

## Communicating with leaseholders and residents

Fire safety in residential blocks isn't purely a technical or legal matter — leaseholders and residents reasonably want to understand what's being done and why, particularly following the significant increase in scrutiny of building and fire safety across the sector in recent years. Being able to show a clear, structured compliance record — what's been assessed, what's been actioned, and what's scheduled — is as much a trust and communication tool as it is a legal safeguard.

## Common pressure points

The recurring issues we see in block management fire safety tend to be the same across different portfolios: fire risk assessments that technically exist but are out of date and haven't been reviewed against current guidance; fire door inspection findings that were identified but never tracked through to completion; and a lack of any single, portfolio-wide view that would let a managing agent answer a compliance question quickly and confidently, rather than having to dig through individual building files.

## How we support managing agents

We work with managing agents to bring fire risk assessments, fire door inspections and the resulting actions into a single, ongoing compliance record across a portfolio — so compliance status is something you can state with confidence at any point, not something that has to be reconstructed when it's asked for. If that's a gap in how your portfolio currently operates, it's worth a conversation.`,
  },
  {
    slug: "pas-9970-bsi-consultation-fire-safety-construction",
    title:
      "Fire safety during construction: contributing to the BSI PAS 9970 consultation",
    date: "2026-06-07",
    dateLabel: "June 2026",
    excerpt:
      "Construction sites are among the hardest environments in which to manage fire risk. We shared practical, site-based feedback on two new BSI standards — PAS 9970-1 and PAS 9970-2 — shaping how fire safety is managed during the construction phase.",
    tags: ["Construction fire safety", "PAS 9970", "Standards", "Fire strategy"],
    category: "fire-safety",
    relatedService: "fire-safety",
    relatedCaseStudySlug: "mixed-use-fire-strategy-change-of-use",
    body: `Construction sites are among the most challenging environments in which to manage fire risk — so the new **PAS 9970** standards are a welcome step towards managing it more consistently. I was pleased to contribute comments to the BSI public consultation on **PAS 9970-1** and **PAS 9970-2**, drawing directly on what I see on live projects.

## What PAS 9970 sets out to do

The two parts tackle two sides of the same problem. One addresses how fire safety is **organised and managed across the site as a whole** — the coordination, responsibilities and arrangements that hold everything together. The other sets clearer expectations for the **temporary fire detection and alarm systems** relied upon during the construction phase, before the permanent systems are in place.

## Why construction-phase fire safety is uniquely difficult

On a live site, almost nothing stays still. The layout changes week to week, the number of people on site rises and falls, and the materials being stored and worked with shift constantly. A fire safety plan written once at the start and filed away simply cannot keep up. Construction fire safety has to be **living and coordinated** — reviewed and adjusted as the project moves through its phases, so the controls always match the actual conditions on the ground.

## Why standards like this matter

Clearer, shared standards raise the floor for the whole industry. Instead of every project improvising its own approach, teams can work to a consistent, recognised benchmark — which makes fire safety easier to plan, easier to audit, and ultimately more effective. Reviewing the drafts and feeding back from real-world experience is a small way to help get them right.

I will be following the consultation closely, and look forward to seeing how the final versions develop.

## How we support construction projects

At Lion Risk Management Solutions we help developers, principal contractors and project teams manage fire safety through the construction phase — from **fire strategies** and **RAMS and construction phase plans** to practical, on-site fire safety arrangements that keep pace with the work. If you are planning or running a project in London and want fire safety handled properly from the outset, please get in touch.`,
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return POSTS.filter((p) => p.category === categorySlug);
}

// Internal-linking helpers (Phase 4B PR 2).
export function getPostsForService(serviceSlug: string): Post[] {
  return POSTS.filter((p) => p.relatedService === serviceSlug);
}

export function getPostsForSector(sectorSlug: string): Post[] {
  const sector = getSector(sectorSlug);
  const services = sector?.relatedServices ?? [];
  return POSTS.filter((p) => p.relatedService && services.includes(p.relatedService));
}
