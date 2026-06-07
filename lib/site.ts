// Central site data — edit here to update content across the whole site.

export const SITE = {
  name: "Lion Risk Management Solutions",
  shortName: "Lion RMS",
  phone: "07766 317818",
  phoneHref: "tel:+447766317818",
  email: "admin@lionrms.uk",
  emailHref: "mailto:admin@lionrms.uk",
  location: "London",
  logo: "/logo.png", // save your logo here: public/logo.png
  // Paste your Formspree form ID here (e.g. "xxxxbcde").
  formspreeId: "meewegnp",
  community: {
    training: "https://ignite-safe-hub.lovable.app/",
    forum: "https://uk-fire-expert.lovable.app/",
  },
};

export const IMAGES = {
  // Verified Unsplash photos (used as background images with dark overlays).
  hero: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
  fireSafety:
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80",
  healthSafety:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
  digital:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
  city:
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2000&q=80",
  office:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80",
};

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

// Joined-up positioning statement — the core differentiator.
export const POSITIONING =
  "From fire risk assessments and fire strategies to health and safety support and bespoke digital compliance systems, Lion Risk Management Solutions provides practical, joined-up consultancy for organisations that need clear, compliant, and efficient solutions.";

export interface ServiceItem {
  name: string;
  desc: string;
}
export interface ServiceCategory {
  slug: string;
  image: string;
  eyebrow: string;
  title: string;
  // Short description shown on the homepage.
  short: string;
  // Longer intro shown on the dedicated service page.
  intro: string;
  items: ServiceItem[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "fire-safety",
    image: IMAGES.fireSafety,
    eyebrow: "Fire Safety",
    title: "Fire Safety Services",
    short:
      "Fire risk assessments, fire strategies, fire door inspections, compartmentation support, and fire safety training.",
    intro:
      "We help duty holders meet their obligations under the Regulatory Reform (Fire Safety) Order 2005, with clear, prioritised, and proportionate fire safety advice for residential, commercial, and construction premises.",
    items: [
      {
        name: "Fire Risk Assessments",
        desc: "Thorough assessments that identify fire hazards, evaluate risk to occupants, and provide clear, prioritised recommendations in line with PAS 79 and the RRO 2005.",
      },
      {
        name: "Fire Strategies",
        desc: "Bespoke fire strategies for new developments, change-of-use projects, and complex buildings — supporting planning and Building Regulations compliance.",
      },
      {
        name: "Fire Door Inspections",
        desc: "Inspection of fire doors and their hardware against current standards, with a clear schedule of defects and remedial priorities.",
      },
      {
        name: "Compartmentation Reviews",
        desc: "Review of compartmentation and fire-stopping to identify breaches that could compromise the building's passive fire protection.",
      },
      {
        name: "Fire Safety Training",
        desc: "Practical training for staff, managers, and fire marshals covering prevention, evacuation, equipment use, and legal responsibilities — delivered on-site.",
      },
      {
        name: "Advice for Landlords, Duty Holders & Responsible Persons",
        desc: "Straightforward guidance on your legal duties so you can make informed, compliant decisions about your premises.",
      },
    ],
  },
  {
    slug: "health-safety",
    image: IMAGES.healthSafety,
    eyebrow: "Health & Safety",
    title: "Health & Safety Services",
    short:
      "Risk assessments, audits, inspections, RAMS, policies, competent person support, and compliance advice.",
    intro:
      "Practical health and safety support that helps businesses, landlords, and contractors meet their obligations under the Health and Safety at Work etc. Act 1974 and associated regulations — without unnecessary complexity.",
    items: [
      {
        name: "Health and Safety Risk Assessments",
        desc: "Clear, suitable and sufficient risk assessments tailored to your activities, premises, and workforce.",
      },
      {
        name: "Workplace Inspections and Audits",
        desc: "Structured inspections and audits that surface real issues and give you a practical action plan.",
      },
      {
        name: "RAMS and Construction Phase Plans",
        desc: "Risk assessments, method statements, and construction phase plans developed alongside your project team.",
      },
      {
        name: "Policies and Procedures",
        desc: "Health and safety policies and documented procedures written in plain English and fit for your organisation.",
      },
      {
        name: "Competent Person Support",
        desc: "Ongoing competent-person support, giving you access to qualified advice whenever you need it.",
      },
      {
        name: "Training and Compliance Advice",
        desc: "Training and day-to-day guidance to keep your team informed and your obligations met.",
      },
    ],
  },
  {
    slug: "digital-compliance",
    image: IMAGES.digital,
    eyebrow: "Digital Compliance",
    title: "Digital Compliance Solutions",
    short:
      "Bespoke digital tools, portals, dashboards, and workflow systems to manage inspections, actions, records, and ongoing compliance.",
    intro:
      "A natural extension of our consultancy — not separate software development. For clients who need structure, we design bespoke digital systems built around how fire and health & safety compliance actually works in your organisation, helping you maintain, record, and manage it more efficiently.",
    items: [
      {
        name: "Bespoke compliance portals",
        desc: "Centralised portals that bring your fire and health & safety compliance into one place.",
      },
      {
        name: "Inspection and action tracking systems",
        desc: "Track inspections and remedial actions from raised to closed, with a full audit trail.",
      },
      {
        name: "Digital dashboards for fire and health & safety management",
        desc: "At-a-glance dashboards showing status, overdue items, and upcoming reviews across your portfolio.",
      },
      {
        name: "Client-specific reporting platforms",
        desc: "Reporting built around your KPIs and the way you actually report to stakeholders.",
      },
      {
        name: "Automated reminders, records, and document control",
        desc: "Automated reminders and version-controlled records so nothing slips and everything is audit-ready.",
      },
      {
        name: "Tailored systems for visibility, accountability, and compliance management",
        desc: "Systems designed around your processes to improve visibility, accountability, and control.",
      },
    ],
  },
];

export function getCategory(slug: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find((c) => c.slug === slug);
}


// Confirmed credentials — EDIT or remove any that aren't 100% accurate.
export const CREDENTIALS = [
  "BAFE SP205",
  "CMIOSH \u2014 Chartered",
  "AIFireE (IFE)",
  "MIFSM",
  "DipFRA Advanced",
  "ISO 45001",
  "PI Insured",
];

// About-your-assessor — REPLACE the placeholder name/bio with your real details.
export const ASSESSOR = {
  name: "Batir Turakulov",
  role: "Fire, Health & Safety, Water & Environmental Consultant",
  // Save a professional headshot to public/assessor.jpg to replace the initials.
  photo: "/assessor.jpg",
  bio:
    "A BAFE SP205 registered fire risk assessor and validator and Chartered safety practitioner (CMIOSH), I deliver expert risk assessments, compliance strategies, and safety solutions across fire safety, health & safety, water management (Legionella), and environmental protection. I carry out every assessment personally — identifying and mitigating hazards, ensuring regulatory compliance, and supporting sustainable practice — with clear, proportionate recommendations grounded in current UK legislation.",
  credentials: ["BAFE SP205", "CMIOSH", "MIIRSM", "MIFSM", "AIFireE", "AIEMA", "DipNCRQ", "DipFRA Advanced (NAFRAR)"],
};

export const WHO_WE_HELP = [
  {
    title: "Landlords & Responsible Persons",
    body: "Meet your duties under the Fire Safety Order with clear, prioritised assessments and straightforward guidance — so you stay compliant and protect your residents.",
  },
  {
    title: "Managing Agents",
    body: "Portfolio-wide fire risk assessments, action tracking, and a single point of contact across all your blocks — with audit-ready records whenever you need them.",
  },
  {
    title: "Construction & Developers",
    body: "Fire strategies, RAMS, and construction phase plans that support planning and Building Regulations, delivered alongside your project team.",
  },
  {
    title: "Businesses & Employers",
    body: "Health & safety risk assessments, audits, and policies that keep your people safe and your business compliant under the Health and Safety at Work Act.",
  },
];

export const FAQS = [
  {
    q: "How often do I need a fire risk assessment?",
    a: "There is no fixed legal interval, but the Fire Safety Order requires your assessment to be kept up to date. As a rule of thumb, review it annually and carry out a fresh assessment every 1–2 years, or sooner after significant changes to the building, its use, or its occupants.",
  },
  {
    q: "Is a fire risk assessment a legal requirement?",
    a: "Yes. Under the Regulatory Reform (Fire Safety) Order 2005, the Responsible Person for almost any non-domestic premises — and the common parts of residential blocks — must carry out and maintain a suitable and sufficient fire risk assessment.",
  },
  {
    q: "What is the difference between a Type 1 and Type 4 fire risk assessment?",
    a: "The types refer to how far the assessment looks into a building. Type 1 is the most common, non-destructive review of common parts. Types 2–4 go progressively further, including destructive inspection and sampling of individual flats, and are used where there is reason to look deeper.",
  },
  {
    q: "Do I need a fire strategy as well as a fire risk assessment?",
    a: "Not always. A fire risk assessment evaluates an existing building in use. A fire strategy is a design document for new builds, change-of-use, or complex buildings, setting out the fire safety principles to support planning and Building Regulations. We can advise which you need.",
  },
  {
    q: "Who is the 'Responsible Person'?",
    a: "It is whoever has control of the premises — typically the employer, building owner, landlord, or managing agent. The Responsible Person carries the legal duty to manage fire safety and act on the assessment's findings.",
  },
  {
    q: "How quickly can you carry out an assessment?",
    a: "We aim to be responsive and will agree a timescale with you up front, prioritising urgent or enforcement-driven work. Get in touch with your requirements and we'll confirm availability.",
  },
  {
    q: "Do you cover health & safety as well as fire?",
    a: "Yes. Alongside fire safety we provide general health & safety risk assessments, audits, RAMS, policies, and competent person support — so you can manage both through one consultancy.",
  },
  {
    q: "What areas do you cover?",
    a: "We are based in East London and work across every East London borough for residential, commercial, and construction clients.",
  },
];

export const RESOURCES = [
  {
    title: "Free Fire & Health Safety Training",
    body: "Access our free training hub for practical fire and health & safety learning.",
    href: "https://ignite-safe-hub.lovable.app/",
    external: true,
  },
  {
    title: "UK Fire & Safety Community",
    body: "Join our community to ask questions and stay up to date with UK fire safety.",
    href: "https://uk-fire-expert.lovable.app/",
    external: true,
  },
  {
    title: "Fire Safety Checklist",
    body: "A quick self-check for landlords and Responsible Persons before your assessment.",
    href: "/resources/fire-safety-checklist",
    external: false,
  },
];

export const WHY_US = [
  {
    title: "Practical, proportionate advice",
    body: "We focus on what genuinely reduces risk and supports compliance, without over-complicating the process or inflating costs.",
  },
  {
    title: "UK compliance expertise",
    body: "Every recommendation is grounded in current UK fire safety legislation and health & safety law, tailored to your premises.",
  },
  {
    title: "Broad sector experience",
    body: "We work across residential, commercial, and construction environments, giving us the depth to understand your context.",
  },
  {
    title: "Tailored, client-focused support",
    body: "We communicate clearly, meet deadlines, and provide straightforward guidance so you can make informed decisions.",
  },
  {
    title: "Joined-up consultancy",
    body: "Fire, health & safety, and digital compliance through one consultancy — a consistent, professional approach throughout.",
  },
  {
    title: "Responsive and reliable",
    body: "A direct line to an experienced assessor who responds quickly and sees your work through to completion.",
  },
];
