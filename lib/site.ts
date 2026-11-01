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

/**
 * Lion Digital — a separate sister business (bespoke software / AI
 * automation), not a Lion RMS service. Single source of truth for the URL so
 * the header nav item, the homepage cross-brand card, and the footer link
 * (Footer.tsx) can never drift onto different destinations. Deliberately not
 * added to `NAV`: Lion Digital is cross-linked, not part of Lion RMS's own
 * page structure — see the header and footer for how each surface keeps that
 * distinction visually.
 */
export const LION_DIGITAL_URL = "https://www.liondigital.solutions";

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
  fireSafety: "/img/services/fire-5.jpg",
  fireEngineering: "/img/services/fire-3.jpg",
  fireSafetyConsultancy: "/img/services/fire-1.jpg",
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
// Safety has its own service page as of repositioning PR5, carved out of
// `health-safety`'s former RAMS/Construction Phase Plans and Competent Person
// Support items — see the ServicePointer note on the `health-safety` category
// in SERVICE_CATEGORIES for how the old anchor still resolves. Compliance
// Management is deliberately NOT one of the six homepage propositions: it is
// cross-cutting
// support that underpins both disciplines rather than a headline service in
// its own right, so it is named once here rather than given its own card.
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
 * Repositioning PR1 introduced this for `/services/fire-safety`, which then
 * carried both Fire Risk Assessments and Fire Safety Consultancy — the FRA
 * URL was deliberately not moved (external backlink equity to it was, and
 * remains, unknown), so Fire Safety Consultancy shared the page behind its
 * own anchor until it had a URL of its own.
 *
 * Repositioning PR3 gives Fire Safety Consultancy that URL
 * (`/services/fire-safety-consultancy`), so `fire-safety` now declares only
 * one section. The type stays multi-entry (`ServiceSection[]`) rather than
 * collapsing to a single optional section, because a single-entry array is a
 * smaller, more mechanical diff than changing the shape category-wide, and it
 * keeps the `featured`-wide-card rendering path this section already uses.
 *
 * `featured` renders a section's items as a single wide card rather than the
 * standard two-column grid — the mechanism used to make Fire Risk Assessments
 * visually lead the page, per the "retitle/reposition so FRA clearly lead"
 * instruction from PR1. It still applies now that FRA is the only section.
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

/**
 * A minimal "also available" pointer block — NOT a section. Renders as a
 * single short summary and a link, never as item cards, so it can carry
 * forward an anchor that used to hold a full section without duplicating the
 * content that moved out from under it.
 *
 * Repositioning PR3: `/services/fire-safety-consultancy` is a new, separate
 * page, but `/services/fire-safety#fire-safety-consultancy` was a real,
 * stable, previously-shared anchor — external bookmarks and any inbound links
 * to it deserve to land somewhere relevant, not on a missing element or the
 * top of the page. This is that landing spot: one sentence (reused verbatim
 * from the Fire Safety Consultancy category's own copy, not rewritten) and a
 * link to the page that now carries the full content. Keeping it to one
 * sentence — never the item list that used to live here — is what stops the
 * two pages becoming near-duplicates of each other.
 */
export interface ServicePointer {
  /** Anchor id — must be stable, for the same reason as `ServiceSection.id`. */
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  /** Optional second paragraph, rendered directly below `body`.
   *
   * Added for `construction-health-safety`, which needs to separate the
   * platform's STANDARD functions (first paragraph) from the OPTIONAL
   * AI-assisted summaries (second). That distinction matters commercially:
   * the AI features sit behind a paid plan and a per-organisation toggle that
   * is off by default, so running them into the first paragraph would read as
   * though they ship with every account. Optional, and omitted by every other
   * pointer, so their rendering is byte-identical. */
  bodySecondary?: string;
  /** Optional screenshot, rendered full width beneath the prose.
   *
   * It began as a second column beside the prose, which is the arrangement
   * the layout wanted. Measured at 1440px, that column gave the image 467px
   * — a 3x reduction from the 1388px capture, at which the interface's
   * small-caps labels and the due date on the critical finding stopped being
   * readable. Beneath the prose it gets 974px, a 1.4x reduction, and every
   * label reads. An interface screenshot nobody can read is decoration
   * pretending to be evidence, so the measurement decided the layout rather
   * than the other way round. On a phone it is 293px either way; it stays,
   * because at that size it still shows a working system exists and the
   * caption carries the meaning.
   *
   * Added for `manufacturing-industrial-safety`, where the platform used to
   * be a seventh card in the "what we assess" band. It never belonged there —
   * the other six are premises and hazards we assess, this is how we record
   * what we find — and seven cards in a three-column grid left it stranded
   * alone on the last row. Promoting it here fixes both, and gives a
   * screenshot the width it needs to be legible, which a 371px card never
   * could.
   *
   * ONLY ever a genuine screenshot of our own platform showing demonstration
   * data. Never a mockup, never a composite, never a client's records, names,
   * sites or logos. The same rule as IMAGE-CREDITS.md states, repeated here
   * because this is the one field on the site that invites breaking it.
   *
   * Optional, and omitted by every other pointer, so their rendering is
   * byte-identical — see the spread in app/services/[slug]/page.tsx.
   *
   * Presence of `media` declares the slot; `src` fills it. With the slot
   * declared and no `src`, a plain labelled placeholder renders instead, so
   * the arrangement can be reviewed before the screenshot exists. That is the
   * same bargain RiskCards already strikes, and for the same reason: an
   * invented screenshot of a compliance platform is a fabricated record, and
   * no layout deadline justifies one. */
  media?: {
    /** Path under /public. Omit until the genuine screenshot exists. */
    src?: string;
    /** Always required — the slot is not declared without it. */
    alt: string;
    /** Optional line printed under the image. */
    caption?: string;
    /** Optional second line under the caption, smaller, naming what the
     * image actually is. A screenshot of a working system shows records a
     * reader may take for someone's real ones, so the image says in its own
     * furniture that the data is a demonstration. */
    disclosure?: string;
  };
  href: string;
  linkLabel: string;
}

/**
 * One photograph-led card in the "what we assess" band, above the detail
 * sections. Clicking the card expands a short panel in place and offers a
 * link into the section that covers it.
 *
 * Deliberately NOT a lightbox. A lightbox shows a bigger photograph, which
 * serves decoration; expanding in place shows information, which is what a
 * reader deciding whether to call us actually wants. It also avoids trapping
 * focus on a phone.
 *
 * `image` is a path under /public. It is OPTIONAL on purpose: the card
 * renders a branded placeholder when the file is absent, so the layout can be
 * reviewed and approved before any photograph is licensed, and photographs
 * can be dropped in later without touching this file's shape. Every image
 * that ships must have a row in public/img/IMAGE-CREDITS.md.
 *
 * `alt` describes the photograph for a reader who cannot see it. `caption`
 * describes the HAZARD and what we assess — never a claim that the picture
 * shows our work. See the note on RISK_CARD_COPY_RULES below.
 */
export interface RiskCard {
  id: string;
  title: string;
  /** One line under the title, always visible. The hazard, not a claim. */
  caption: string;
  /** Revealed when the card is expanded: what we actually assess. */
  detail: string;
  image?: string;
  alt?: string;
  /**
   * A key into CARD_ICONS in components/RiskCards.tsx. Set INSTEAD of
   * `image`, for a band where a photograph would misrepresent rather than
   * illustrate — training sessions above all, where any stock photograph of
   * people in a room reads as a course we ran. A card with an icon renders no
   * media band, so eight of them stay compact. See RISK_CARD_COPY_RULES.
   */
  icon?: string;
  /** Where "Read more" goes — an anchor on this page, or another page. */
  href: string;
  linkLabel: string;
}

/*
 * RISK_CARD_COPY_RULES — read before editing any card copy.
 *
 * 1. A stock photograph of a factory implies nothing untrue. A CAPTION that
 *    says or suggests we worked there does. Captions describe the hazard and
 *    the assessment, never a project, client or outcome.
 * 2. No photograph on this site may be presented as a Lion RMS project
 *    unless the client has given written permission and the caption says so.
 * 3. Keep the scope boundary of the parent page: we review arrangements and
 *    controls; we do not certify, approve or carry out statutory thorough
 *    examinations.
 * 4. On the training page, a card describes what a session covers. It never
 *    states a duration, a price, a certificate, an accreditation or an
 *    awarding body, because none of those are settled — and an icon card
 *    carries no photograph precisely so it cannot imply a session we ran.
 */

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
  /**
   * See `ServicePointer`. A list, not a single pointer: a category can be the
   * origin of more than one carve-out, and can also carry a non-carve-out
   * pointer such as the digital-platform block. `health-safety` holds two
   * after the Independent Inspections & Audits split — one for the content
   * that moved out, one for the platform — and `construction-health-safety`
   * holds three, having since given its training section away as well.
   * Rendered in array order, after all sections.
   */
  pointers?: ServicePointer[];
  /**
   * Opt-in photograph for the page hero. Omitted by every other category, so
   * their heroes render exactly as before — PhotoHero only shows an image
   * when it is given one. See components/PhotoHero.tsx.
   */
  heroImage?: string;
  heroImageAlt?: string;
  /** Opt-in. See RiskCard. Absent elsewhere, so no other page changes. */
  riskCards?: RiskCard[];
  /**
   * Heading and standfirst for the `riskCards` band. Explicit per category,
   * because the band means different things on different pages — hazards we
   * assess on an industrial site, sessions we deliver on a training page —
   * and a ternary on the category title in the route file does not scale past
   * two.
   */
  cardsHeading?: string;
  cardsIntro?: string;
  /**
   * Where the page's closing CTA goes. Defaults to "/contact" — which is what
   * every category used when this was hard-coded in the route file — so only
   * a category that sets it renders anything different. `health-safety-training`
   * sets it so the enquiry arrives with the training service already chosen;
   * the value after `?service=` must exist BOTH as a key in SERVICE_LABELS
   * and as an <option> in components/ContactForm.tsx, or the form silently
   * falls back to "Select…".
   */
  ctaHref?: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "fire-safety",
    image: IMAGES.fireSafety,
    imageAlt: "Protected escape corridor with fire doors, emergency lighting and illuminated exit signage",
    eyebrow: "Fire Safety",
    // Repositioning PR3 (August 2026): title, short and intro rewritten to
    // lead with Fire Risk Assessments alone, now that Fire Safety Consultancy
    // has moved to its own page — this page no longer covers it in full, so
    // it should not still claim to in its own metadata and heading copy.
    title: "Fire Risk Assessments",
    short: "Fire risk assessments informed by recognised guidance, including PAS 79 where appropriate, for residential, commercial and complex premises.",
    // First two sentences carried over unchanged from the About page wording
    // (see the PR1 note this replaces). The third sentence, which used to
    // describe Fire Safety Consultancy in full here, is gone — that content
    // now lives at its own URL; see `pointer` below for how this page still
    // points to it.
    intro: "Fire risk assessment is a core discipline of the consultancy and represents a substantial part of its work. Assessments are undertaken with reference to relevant recognised guidance, including PAS 79 where appropriate, and the applicable fire safety legislation for the premises and jurisdiction.",
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
    ],
    // Repositioning PR3: the anchor Fire Safety Consultancy used to occupy
    // when it shared this page. Body text is reused verbatim from the new
    // fire-safety-consultancy category's own `short` below — not retyped —
    // so the two pages cannot silently drift apart on what this sentence
    // claims.
    pointers: [
      {
        id: "fire-safety-consultancy",
        eyebrow: "Also Available",
        title: "Fire Safety Consultancy",
        body: "Fire safety advice and support for buildings already in use — fire risk assessments, training, and day-to-day guidance for landlords, duty holders and Responsible Persons.",
        href: "/services/fire-safety-consultancy",
        linkLabel: "View Fire Safety Consultancy",
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
    // Repositioning PR3 (August 2026) — new page, carved out of `fire-safety`'s
    // former "Fire Safety Consultancy" section (see the ServiceSection and
    // ServicePointer notes above). Every item below is moved, not rewritten —
    // same names, same descriptions, same order — so nothing that already
    // ranked or was bookmarked on the old anchor changes shape on arrival at
    // its new URL. `/services/fire-safety` keeps a one-sentence pointer at the
    // anchor this used to occupy; see `pointer` on that category.
    //
    // Positioned in this array between Fire Engineering and Health & Safety,
    // matching the reading order already established by FOOTER_SERVICE_LINKS
    // (Fire Risk Assessments, Fire Engineering, Fire Safety Consultancy,
    // Health & Safety, Compliance Management) — so the /services index grid
    // and the "Also available" cross-links on every other service page read
    // in that same order without extra hand-ordering logic.
    slug: "fire-safety-consultancy",
    image: IMAGES.fireSafetyConsultancy,
    imageAlt: "Consultant inspecting a fire door closer in a commercial corridor, holding a tablet",
    eyebrow: "Fire Safety",
    title: "Fire Safety Consultancy",
    // PAUSED SERVICES — 1 November 2026. This sentence named "door
    // inspections" and "compartmentation" as separately available services.
    // Both are paused. What remains true is that a fire risk assessment
    // includes visual observation of fire doors and compartmentation, which
    // is how the page now describes it. Do not reinstate either as a
    // standalone offer without Batir saying so.
    short: "Fire safety advice and support for buildings already in use — fire risk assessments, training, and day-to-day guidance for landlords, duty holders and Responsible Persons.",
    // Reused verbatim from the sentence that used to introduce this content on
    // /services/fire-safety (repositioning PR1), minus its leading "Alongside
    // assessment, we provide" clause — that clause described this content's
    // relationship to Fire Risk Assessments from the FRA page's point of view,
    // which no longer applies now this is its own page.
    intro: "Ongoing fire safety consultancy for buildings already in use — fire risk assessments, practical training, and clear advice for landlords, duty holders and Responsible Persons on what the law asks of them and what to do about it.",
    items: [
      { name: "Fire Safety Consultancy", desc: "Specialist fire safety advice for duty holders, building owners and managing agents — fire safety management arrangements, regulatory interpretation, remedial strategy and ongoing compliance support." },
      // Replaced the "Fire Door Inspections" and "Compartmentation" items on
      // 1 November 2026. Both described a standalone survey — a dedicated
      // inspection "against current standards", and a "survey and review ...
      // to identify breaches". Those services are paused.
      //
      // What is left is what a non-intrusive fire risk assessment actually
      // involves, written so it cannot be read as more than it is: we look,
      // from what is accessible, and we report what we saw. No specialist
      // verification, no certification, no opening up, no standalone survey.
      // Keep "observation" and "report what we see" as the operative words;
      // never "inspect against", "verify", "certify", "survey" or "confirm
      // compliance".
      { name: "Fire Doors and Compartmentation Within an Assessment", desc: "A fire risk assessment includes visual observation of fire doors and the compartmentation we can see — doors, their condition and obvious defects, and visible breaches in walls and ceilings where they are accessible. We report what we observe and say where a specialist inspection or intrusive investigation is needed. We do not currently offer dedicated fire door or compartmentation surveys, and we do not verify or certify either." },
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
    // Repositioning PR5: "RAMS" dropped from this summary sentence now that
    // RAMS and Construction Phase Plans has its own page — see `pointer`
    // below. The rest of this sentence is unchanged.
    short: "Risk assessments, audits, inspections, policies, competent person support, and compliance advice.",
    intro: "Practical health and safety support that helps businesses, landlords, and contractors meet their obligations under the Health and Safety at Work etc. Act 1974 and associated regulations — without unnecessary complexity.",
    items: [
      { name: "Health and Safety Risk Assessments", desc: "Clear, suitable and sufficient risk assessments tailored to your activities, premises, and workforce." },
      { name: "Policies and Procedures", desc: "Health and safety policies and documented procedures written in plain English and fit for your organisation." },
      { name: "Training and Compliance Services", desc: "Training and day-to-day guidance to keep your team informed and your obligations met." },
    ],
    // Repositioning PR5: RAMS and Construction Phase Plans, AND Competent
    // Person Support, both moved to their own page — carved out of this
    // category exactly as Fire Safety Consultancy was carved out of
    // `fire-safety` in PR3 (see the ServicePointer note on that category,
    // above). `id` is kept identical to the anchor this
    // content used to occupy — "rams-construction-phase-plans" — so the
    // existing bookmarked/inbound URL
    // `/services/health-safety#rams-construction-phase-plans` still resolves
    // to a real, visible element rather than becoming a dead fragment. Body
    // text is reused verbatim from the new construction-health-safety
    // category's own `short` below — not retyped.
    pointers: [
      // "Workplace Inspections and Audits" moved to
      // /services/independent-health-safety-audits, where workplace and
      // construction inspections are covered together rather than split
      // across two pages. The item had no anchor id of its own, so this
      // pointer introduces one rather than preserving one. The id avoids the
      // substring "workplace-inspections", which is a reserved taxonomy tag
      // slug that tests/taxonomy-health-safety.test.mjs forbids anywhere in
      // built HTML.
      {
        id: "workplace-audits",
        eyebrow: "Also Available",
        title: "Workplace Inspections and Audits",
        body: "Workplace and commercial premises audits, risk assessment reviews and safety management reviews are covered in full on our Independent Inspections & Audits page.",
        href: "/services/independent-health-safety-audits",
        linkLabel: "View Independent Inspections & Audits",
      },
      {
        id: "rams-construction-phase-plans",
        eyebrow: "Also Available",
        title: "Construction Health & Safety",
        body: "Risk assessments, method statements and construction phase plans developed alongside your project team, with ongoing competent-person support for construction clients.",
        href: "/services/construction-health-safety",
        linkLabel: "View Construction Health & Safety",
      },
    ],
  },
  {
    // Repositioning PR5 (August 2026) — new page, carved out of
    // `health-safety`'s former "RAMS and Construction Phase Plans" and
    // "Competent Person Support" items (see the ServicePointer note on
    // `health-safety`, above). Both items are moved, not rewritten — same
    // names, same descriptions — matching the "moved, not rewritten"
    // discipline used for the Fire Safety Consultancy split in PR3. Those two
    // item NAMES are pinned verbatim by tests/service-architecture.test.mjs,
    // which also asserts neither appears on /services/health-safety.
    //
    // DUTY-HOLDER BOUNDARY — the hard rule on this page.
    // tests/dutyholder-boundary.test.mjs bans the SINGULAR "Principal
    // Designer" and "Principal Contractor" from every built page, with no
    // exemption for a disclaimer: "we do not act as Principal Designer" would
    // fail the suite. The plural passes, describing third parties. So this
    // page says "appointed duty holders" throughout and never names either
    // role in the singular. That is a deliberate choice of vocabulary, not an
    // oversight, and the guard must not be weakened to get around it.
    //
    // MARKET FOCUS (November 2026). This is a UK page. UK construction
    // clients, developers, contractors and refurbishment projects are the
    // subject of roughly everything here; `major-international-projects` is
    // one short section at the end and stays that way. Its wording claims
    // CAPABILITY, never track record — "we can consider", never "we have
    // delivered" — matching the rule written for the audits page (see the
    // comment on `independent-health-safety-audits` below). No named project,
    // no client, no airport, no country, no funder, and no claim of
    // established overseas teams or partnerships.
    //
    // SCOPE SPLIT. The card band names the services a construction client
    // buys, but the DETAIL for inspection programmes, client-side assurance
    // and contractor monitoring lives on
    // /services/independent-health-safety-audits, and inductions and toolbox
    // talks on /services/health-safety-training. Those cards link out rather
    // than restating what those pages own; the two "Also Available" pointers
    // below stay one sentence each. That is what stops three pages competing
    // for the same terms.
    //
    // Positioned in this array immediately after Health & Safety, matching
    // the reading order established by FOOTER_SERVICE_LINKS and
    // HOMEPAGE_SERVICE_CLUSTERS below.
    slug: "construction-health-safety",
    image: IMAGES.healthSafety,
    imageAlt: "Organised modern office workstation representing workplace compliance and risk assessment",
    eyebrow: "Construction Safety",
    // Retitled November 2026. `title` is also the <title>, the OpenGraph and
    // Twitter copy, the Service JSON-LD name, the breadcrumb leaf, the footer
    // label on every page and the homepage card heading — so this one string
    // moves all twenty-four content hashes. The slug and canonical URL are
    // deliberately unchanged.
    title: "Construction Health & Safety and Project Assurance",
    short: "Site inspections, CDM 2015 advisory support, RAMS and construction phase plans, incident investigation and independent project assurance for construction clients, developers and contractors.",
    intro: "Independent construction health and safety consultancy for UK clients, developers, contractors and project teams — from pre-construction planning and CDM 2015 advisory support through to site delivery and handover. We inspect, advise, investigate and report: you get prioritised findings backed by photographic evidence, recommended actions with owners and dates, and a record of what was raised and what was closed that holds for the life of the project.",
    // Icon cards, as on the Manufacturing and Training pages. No photographs:
    // public/img/IMAGE-CREDITS.md already records a rejected construction
    // candidate showing a worker in flip-flops on rubble and others with no
    // head protection, which is representative of the stock available, and a
    // photograph of a site reads as a site we worked on.
    //
    // Each card names a service a construction client buys and says what they
    // receive. Four link OUT, to the page that owns the detail — see the
    // scope-split note above. Captions describe the work, never a project.
    cardsHeading: "What we do on your project",
    cardsIntro: "Select any service to see what it covers and where it is delivered.",
    riskCards: [
      {
        id: "card-site-inspections",
        title: "Construction site safety inspections",
        caption: "Site conditions, welfare, access and egress, inspected against the plan you are working to.",
        detail: "One-off or recurring inspections against the construction phase plan and the agreed method statements. You receive prioritised findings with photographic evidence, recommended actions with owners and target dates, and a dated record of what was closed.",
        icon: "checklist",
        href: "#site-safety",
        linkLabel: "Site inspections and competent-person support",
      },
      {
        id: "card-inspection-programmes",
        title: "Regular inspection programmes",
        caption: "Weekly, fortnightly, monthly or quarterly visits in one consistent format.",
        detail: "A standing programme across the construction phase, reported the same way each time so trends and repeat issues become visible rather than being re-discovered. Programme frequencies and formats are set out in full on our Independent Inspections & Audits page.",
        icon: "calendar",
        href: "/services/independent-health-safety-audits",
        linkLabel: "Inspection programmes",
      },
      {
        id: "card-client-assurance",
        title: "Client-side project assurance",
        caption: "Independent evidence for the client, the project board or the funder, not the delivery team.",
        detail: "Assurance inspections and reporting carried out independently of the parties delivering the work, written for people who have to make decisions about a project rather than run it. Covered in full on our Independent Inspections & Audits page.",
        icon: "shield",
        href: "/services/independent-health-safety-audits",
        linkLabel: "Client-side assurance",
      },
      {
        id: "card-contractor-monitoring",
        title: "Contractor and subcontractor monitoring",
        caption: "Work carried out by others, checked against the requirements set for the project.",
        detail: "Compliance audits of contractors and subcontractors, with competence, insurance and documentation reviewed at selection and during the works, and results held in a contractor register so the picture is cumulative. Covered in full on our Independent Inspections & Audits page.",
        icon: "contractors",
        href: "/services/independent-health-safety-audits",
        linkLabel: "Contractor compliance",
      },
      {
        id: "card-cdm",
        title: "CDM 2015 advisory support",
        caption: "Advice for clients and appointed duty holders on what the Regulations ask of them.",
        detail: "Practical advisory support on duties under the Construction (Design and Management) Regulations 2015 — what the client has to do, what has to be in place before work starts, and whether the arrangements made are adequate in practice. We advise and monitor; the statutory duties stay with the appointed duty holders.",
        icon: "cdm",
        href: "#how-we-work",
        linkLabel: "How we work with duty holders",
      },
      {
        id: "card-rams",
        title: "RAMS and construction phase plans",
        caption: "Written for the work as it will actually be carried out, not lifted from a template.",
        detail: "Task-specific risk assessments, method statements and construction phase plans prepared alongside your project team, or reviewed and commented on where your contractor has authored them. We always make clear which of the two applies, because responsibility for a document stays with its author.",
        icon: "clipboard",
        href: "#rams-planning",
        linkLabel: "Planning and documentation",
      },
      {
        id: "card-pre-start",
        title: "Pre-start and mobilisation reviews",
        caption: "Checking the arrangements are real before anyone starts work, not after.",
        detail: "A review of the health and safety arrangements, documentation and site set-up ahead of mobilisation, so gaps are found while they are still cheap to fix. You receive a written list of what is missing and what to do about it, in priority order.",
        icon: "flag",
        href: "#site-safety",
        linkLabel: "Pre-start advice",
      },
      {
        id: "card-investigations",
        title: "Incident and near-miss investigations",
        caption: "What happened, why it happened, and what stops it happening again.",
        detail: "Independent investigation of construction incidents, near misses and dangerous occurrences, with a factual report, root-cause analysis and corrective actions assigned to owners and tracked to closure.",
        icon: "magnifier",
        href: "#investigations",
        linkLabel: "Investigations",
      },
      {
        id: "card-construction-fire",
        title: "Construction fire safety and emergency arrangements",
        caption: "Fire precautions that keep pace with a building that changes every week.",
        detail: "Fire and emergency arrangements for the construction phase: precautions and escape routes appropriate to each stage, hot-work and ignition-source control, site fire safety inspections, and arrangements where part of a building stays occupied while works continue.",
        icon: "flame",
        href: "#construction-fire-safety",
        linkLabel: "Construction fire safety",
      },
    ],
    sections: [
      {
        id: "site-safety",
        eyebrow: "Site delivery",
        title: "Construction H&S Consultancy and Site Inspections",
        intro: "Site safety inspections against the construction phase plan and agreed method statements, with findings prioritised and tracked to closure. Competent-person support gives your project team qualified advice as conditions change on site.",
        featured: true,
        items: [
          { name: "Site safety inspections", desc: "Scheduled or ad-hoc inspections covering site conditions, welfare, access and egress, with prioritised findings and photographic evidence." },
          { name: "Competent Person Support", desc: "Ongoing access to qualified health and safety advice for your project team throughout the works." },
          { name: "Documentation review", desc: "Review of contractor documentation before works begin and as the programme changes." },
          { name: "Pre-start and mobilisation advice", desc: "Practical help getting health and safety arrangements in place before work starts on site." },
        ],
      },
      {
        id: "how-we-work",
        eyebrow: "CDM 2015",
        title: "CDM 2015 Advisory Support and Working with Your Duty Holders",
        // The scope sentence this page turns on. It is stated positively —
        // what we do — then bounded, rather than led by a disclaimer. The
        // roles are never named in the singular; see the duty-holder note at
        // the top of this category.
        intro: "We provide advisory support on duties under the Construction (Design and Management) Regulations 2015, and we support appointed duty holders rather than replacing them. Lion RMS does not automatically assume a statutory duty-holder appointment: those duties, and the decisions that go with them, stay with the people appointed to hold them, and our role is to advise, inspect, monitor and report so that they can discharge them with evidence. Depending on the appointment, our involvement in documentation takes one of three forms, and we always make clear which applies.",
        items: [
          { name: "Client duties under CDM 2015", desc: "What the Regulations ask of a construction client — making suitable arrangements, allowing adequate time and resources, and satisfying yourself that those arrangements are working — explained against your actual project rather than in the abstract." },
          { name: "Reviewing the arrangements made", desc: "An independent view of whether the pre-construction information, the construction phase plan and the appointments made are adequate in practice, and what to do where they are not." },
          { name: "Prepare", desc: "We author the document, with your input, and it is issued in our name." },
          { name: "Review", desc: "Your contractor authors it; we examine it against the works and the applicable requirements and report what should change. Responsibility for the document stays with its author." },
          { name: "Advise", desc: "We give guidance on arrangements, controls or competence, without authoring or approving a specific document." },
        ],
      },
      {
        id: "rams-planning",
        eyebrow: "Planning",
        title: "Risk Assessments, RAMS and Construction Safety Management",
        intro: "Risk assessments and method statements prepared with your team, or reviewed where your contractor has authored them \u2014 written for the work as it will actually be carried out, not generic templates.",
        items: [
          { name: "RAMS and Construction Phase Plans", desc: "Task-specific risk assessments, method statements and construction phase plans prepared alongside your project team, or reviewed and commented on where prepared by others." },
          { name: "Activity-specific assessments", desc: "Work at height, manual handling, hazardous substances and other higher-risk construction activities." },
          { name: "Management arrangements", desc: "Practical arrangements covering responsibilities, supervision, monitoring and review." },
        ],
      },
      {
        id: "investigations",
        eyebrow: "Response",
        title: "Incident and Near-Miss Investigations",
        intro: "Independent investigation of construction incidents and near misses, establishing what happened and why, and identifying the corrective actions that prevent recurrence.",
        items: [
          { name: "Incident and accident investigation", desc: "Structured, independent investigation with a factual report and root-cause analysis." },
          { name: "Near-miss and dangerous occurrence review", desc: "Investigation of events that caused no injury but revealed a real risk." },
          { name: "Corrective action planning", desc: "Assigned actions with owners and target dates, tracked through to closure." },
          { name: "Trend and lessons-learned reporting", desc: "Analysis across incidents to identify recurring causes and strengthen controls." },
        ],
      },
      {
        id: "construction-fire-safety",
        eyebrow: "Fire safety on site",
        title: "Construction Fire Safety and Emergency Planning",
        intro: "Fire safety management during construction is a site management discipline, distinct from fire engineering design. We help put workable fire and emergency arrangements in place while works are under way and while buildings are partially occupied.",
        items: [
          { name: "Construction phase fire safety arrangements", desc: "Fire precautions, means of escape and fire-fighting equipment appropriate to each phase of the works." },
          { name: "Hot works and ignition source control", desc: "Practical controls and procedures for hot works and other ignition sources." },
          { name: "Site fire safety inspections", desc: "Inspection of fire precautions, escape routes and equipment as the site changes." },
          { name: "Emergency and evacuation planning", desc: "Emergency procedures, alarm arrangements, assembly points and drills for the construction phase." },
          { name: "Phased occupation arrangements", desc: "Fire safety where parts of a building remain occupied or are handed over while works continue." },
        ],
      },
      {
        id: "major-international-projects",
        eyebrow: "Projects",
        title: "Larger Projects, and Work Outside the UK",
        // CAPABILITY, NEVER TRACK RECORD. "We can consider", never "we have
        // delivered". The previous wording said "We support client
        // organisations... on larger projects" in the present tense with no
        // hedge \u2014 the only place on the site that asserted major-project work
        // as current activity, written before the rule on the audits page
        // existed. Corrected November 2026. No named project, client,
        // country, airport or funder, and no claim of standing overseas
        // teams or partnerships. Keep this section SHORT: this is a UK page.
        intro: "Most of our construction work is in the UK. We can also consider larger projects and assignments outside the UK where the scope suits a specialist advisory practice of our size, subject to resourcing, local requirements and a scope agreed in writing before anything is committed.",
        items: [
          { name: "UK projects", desc: "Delivered against UK legislation, including the Construction (Design and Management) Regulations 2015 and the Health and Safety at Work etc. Act 1974." },
          { name: "Projects outside the UK", desc: "CDM 2015 is UK legislation and applies only to projects in the UK. For work elsewhere we can advise against the applicable local legal framework, the project's own agreed requirements, and recognised international standards and good practice \u2014 working with suitably qualified local specialists where local law, permitting or specialist design input requires it." },
        ],
      },
    ],
    pointers: [
      // The audits/contractor-monitoring content that used to sit here as a
      // full section moved to /services/independent-health-safety-audits,
      // which covers construction sites and workplaces together. The anchor
      // id is kept identical to the section it replaces, so
      // `#audits-monitoring` still resolves to a real element rather than
      // becoming a dead fragment. Same discipline as the PR3 and PR5 splits.
      {
        id: "audits-monitoring",
        eyebrow: "Also Available",
        title: "Independent H&S Audits and Contractor Compliance Monitoring",
        body: "Independent audits, contractor and subcontractor compliance monitoring and client-side assurance reporting are covered in full on our dedicated page, for construction sites and workplaces alike.",
        href: "/services/independent-health-safety-audits",
        linkLabel: "View Independent Inspections & Audits",
      },
      // The "Workforce Safety Training and Site Inductions" section moved to
      // /services/health-safety-training, where the fire, workplace and site
      // sessions are covered together instead of only in a construction
      // context. The anchor id is kept identical to the section it replaces —
      // `training-inductions` — so
      // `/services/construction-health-safety#training-inductions` still
      // resolves to a real, visible element. Fourth carve-out in this
      // pattern, after PR3, PR5 and the audits split above.
      {
        id: "training-inductions",
        eyebrow: "Also Available",
        title: "Workforce Safety Training and Site Inductions",
        body: "Site and contractor inductions, toolbox talks, fire safety, manual handling and working at height training are covered in full on our dedicated training page, for construction projects and workplaces alike.",
        href: "/services/health-safety-training",
        linkLabel: "View Health & Safety Training",
      },
      {
        id: "digital-records",
        eyebrow: "Digital and AI",
        title: "Digital Compliance Records and AI-Assisted Summaries",
        body: "Every inspection, audit and investigation we carry out is recorded in our own digital compliance platform. Photographic evidence attaches to individual findings, corrective actions carry an owner and are tracked to closure with a dated history, and reports are issued as PDFs. Contractor and workforce registers hold competence and training records alongside the inspection history, and client organisations get their own login to see the records for their sites.",
        // Deliberately narrow. The platform's AI is ONE reachable capability
        // (AI-assisted compliance summaries), behind a paid plan and a
        // per-organisation toggle that ships disabled. Claims this copy does
        // NOT make, because the platform does not support them: predictive
        // risk, trend analysis, automated report drafting, or any reading of
        // uploaded documents. Keep it that way.
        bodySecondary:
          "AI-assisted compliance summaries are available as an option alongside these standard functions. The figures are calculated directly from your own records \u2014 the AI writes only the interpretation that accompanies them, and anything it cannot verify against your data is withheld rather than shown. It is built to support professional judgement, not to replace it: assessments, findings and recommendations remain the work of our consultants.",
        href: "/contact",
        linkLabel: "Enquire about our digital platform",
      },
    ],
  },
  {
    // Independent Inspections & Audits (October 2026) — new page, carved out
    // of TWO existing categories at once: `construction-health-safety`'s
    // "audits-monitoring" section and `health-safety`'s "Workplace
    // Inspections and Audits" item. Both origins keep a ServicePointer at a
    // live anchor, the same discipline used for the PR3 and PR5 splits.
    //
    // Scope boundary, stated twice on purpose (section intro and the
    // high-risk item): we inspect the safety ARRANGEMENTS AND CONTROLS in
    // place. We do not provide specialist engineering design, design
    // approval, certification or sign-off. Do not let "approval",
    // "certification" or "sign-off" drift into this copy.
    //
    // International wording claims capability, never track record: "We can
    // support", never "we have delivered". No named project, no airport, and
    // no claim of established overseas partnerships — local specialists are
    // engaged "where required", not pre-existing partners.
    slug: "independent-health-safety-audits",
    image: IMAGES.healthSafety,
    imageAlt: "Health and safety inspection of a construction site",
    eyebrow: "Independent Assurance",
    title: "Independent Health & Safety Inspections and Audits",
    short: "Independent health and safety inspections and audits for construction sites, workplaces and commercial premises — delivered as one-off assignments or regular inspection programmes.",
    intro: "Independent inspections and audits for developers, contractors, project managers and commercial clients. We assess what is actually happening on site and in the workplace, report prioritised findings supported by photographic evidence, and track corrective actions through to closure. We offer both one-off inspections and regular inspection programmes, and every inspection, finding and action is held in our own digital compliance platform.",
    sections: [
      {
        id: "site-inspections",
        eyebrow: "Construction",
        title: "Independent Construction Site Inspections",
        intro: "Site inspections carried out independently of the parties delivering the work, against the construction phase plan, agreed method statements and the applicable legal framework. We inspect the safety arrangements and controls in place on site. We do not provide specialist engineering design, design approval, certification or sign-off.",
        featured: true,
        items: [
          { name: "Site conditions, welfare and access", desc: "Access and egress, welfare provision, housekeeping, segregation and site security." },
          { name: "High-risk activity inspections", desc: "Inspection of the arrangements and controls in place for work at height, lifting operations, excavations and hot works — whether the controls described are actually being applied, not whether a design is adequate." },
          { name: "On-site documentation checks", desc: "Whether the method statements and permits in use reflect the work being carried out." },
          { name: "Prioritised findings with photographic evidence", desc: "Every finding carries a risk priority and supporting photographs, so nothing is disputed later." },
        ],
      },
      {
        id: "inspection-programmes",
        eyebrow: "Ongoing support",
        title: "Regular Inspection Programmes",
        intro: "Assurance works best on a rhythm. We agree an inspection programme matched to the risk and pace of the work — commonly weekly or fortnightly on active construction sites, monthly or quarterly for workplaces and portfolios — so performance can be compared visit to visit rather than judged from a single snapshot.",
        items: [
          { name: "Weekly or fortnightly site inspections", desc: "A consistent format across the construction programme, so trends and repeat issues are visible." },
          { name: "Monthly or quarterly workplace inspections", desc: "Scheduled inspections across a premises or portfolio, reported in a comparable form each time." },
          { name: "Project-specific programmes", desc: "A schedule built around the phases and milestones of a particular project." },
          { name: "Competent person support between visits", desc: "Qualified health and safety advice as conditions change, not only on inspection days." },
        ],
      },
      {
        id: "contractor-compliance",
        eyebrow: "Contractors",
        title: "Contractor and Subcontractor Compliance Audits",
        intro: "Where work is carried out by others, responsibility for it does not pass with it. We audit contractor and subcontractor performance against the requirements set for the project, and hold results in a contractor register so the picture is cumulative.",
        items: [
          { name: "Contractor compliance audits", desc: "Structured audits of a contractor's arrangements, documentation and site practice against agreed requirements." },
          { name: "Subcontractor monitoring", desc: "Monitoring of subcontractors, reported to whoever holds the contract." },
          { name: "Competence and documentation review", desc: "Competence evidence, insurances, training records and method statements, at selection and during the works." },
          { name: "Contractor register and audit history", desc: "Results held against each contractor, so repeat issues and improvement are both visible." },
        ],
      },
      {
        id: "workplace-audits",
        eyebrow: "Workplaces",
        title: "Workplace and Commercial Premises Audits",
        intro: "Health and safety audits for offices, retail, industrial and multi-occupancy commercial premises. We audit arrangements as they operate day to day, not as the paperwork describes them.",
        items: [
          { name: "Workplace health and safety audits", desc: "Full audits of arrangements, documentation and practice across a site or premises." },
          { name: "Multi-site and portfolio audits", desc: "One consistent format applied across a portfolio, with results comparable site by site." },
          { name: "Statutory compliance review", desc: "A review of your health and safety arrangements against the duties that apply to your organisation, with gaps identified and prioritised." },
          { name: "Practical action plans", desc: "Findings expressed as actions with owners and priorities, not an undifferentiated list of observations." },
        ],
      },
      {
        id: "assurance-reviews",
        eyebrow: "Client-side",
        title: "Client-Side Assurance, Risk and Management Reviews",
        intro: "Where work is delivered by others, clients often want their own view of how it is being managed. Independent assurance gives you an evidenced picture of whether what was specified is actually being delivered, separate from the parties delivering it.",
        items: [
          { name: "Client-side assurance inspections", desc: "Commissioned by the client organisation rather than the contractor, and reported directly to you." },
          { name: "Project board and procurement reporting", desc: "Written for decision-makers, with a clear position on where things stand." },
          { name: "Risk assessment review", desc: "Independent review of existing risk assessments against the work as actually carried out, with comments and recommendations." },
          { name: "Safety management system review", desc: "How responsibilities, supervision, monitoring and review operate in practice." },
        ],
      },
      {
        id: "investigations-actions",
        eyebrow: "Response",
        title: "Incident Investigations and Corrective-Action Monitoring",
        intro: "Independent investigation of incidents and near misses, establishing what happened and why — then monitoring the corrective actions rather than leaving them in a report.",
        items: [
          { name: "Incident and accident investigation", desc: "Structured independent investigation with a factual report and root-cause analysis." },
          { name: "Near-miss and dangerous occurrence review", desc: "Events that caused no injury but revealed a real risk." },
          { name: "Corrective-action monitoring", desc: "Actions tracked to closure with owners, target dates and a dated history of what was done." },
        ],
      },
      {
        id: "major-projects",
        eyebrow: "Projects",
        title: "Major Construction and Infrastructure Projects",
        intro: "We can support major construction and infrastructure projects where health and safety assurance has to be demonstrable rather than assumed — structured inspection and audit regimes, clear reporting lines and auditable digital records.",
        items: [
          { name: "UK projects", desc: "Delivered against UK legislation, including the Construction (Design and Management) Regulations 2015 and the Health and Safety at Work etc. Act 1974." },
          { name: "International projects", desc: "We can support international construction and infrastructure projects, working to the applicable local legislation, the project's own agreed requirements, and recognised international standards and good practice. UK legislation applies only where the project is in the UK, and we can work with suitably qualified local specialists where required." },
          { name: "Multi-contractor assurance regimes", desc: "Inspection and audit programmes designed for projects with several contractors and formal reporting obligations." },
        ],
      },
    ],
    pointers: [
      {
        id: "digital-records",
        eyebrow: "Digital and AI",
        title: "Digital Inspection and Audit Records",
        body: "Every inspection, audit and investigation is recorded in our own digital compliance platform. Photographic evidence attaches to individual findings, corrective actions carry an owner and are tracked to closure with a dated history, and reports are issued as PDFs. Contractor and workforce registers hold competence and training records alongside the inspection history, and client organisations get their own login to see the records for their sites.",
        // Same narrow AI claim as the construction page. One reachable
        // capability, behind a paid plan and a per-organisation toggle that
        // ships disabled. No predictive risk, no trend analysis, no automated
        // report drafting, no reading of uploaded documents.
        bodySecondary:
          "AI-assisted compliance summaries are available as an option alongside these standard functions. The figures are calculated directly from your own records — the AI writes only the interpretation that accompanies them, and anything it cannot verify against your data is withheld rather than shown. It is built to support professional judgement, not to replace it: assessments, findings and recommendations remain the work of our consultants.",
        href: "/contact",
        linkLabel: "Enquire about our digital platform",
      },
    ],
  },
  {
    // Manufacturing & Industrial Safety (October 2026) — new page, not a
    // carve-out: nothing on the site covered manufacturing, production or
    // industrial premises before this. PUWER, LOLER, DSEAR and "fabrication"
    // had zero occurrences anywhere in the repo.
    //
    // SCOPE BOUNDARY — the reason this page exists in this shape. We sell
    // independent H&S consultancy: audits, inspections, reviews of
    // arrangements and controls. We do NOT sell statutory thorough
    // examinations (LOLER/PUWER/PSSR), LEV examinations, machinery
    // certification, CE/UKCA conformity assessment, engineering design
    // approval, DSEAR hazardous-area classification or zoning, process
    // safety engineering, specialist occupational-hygiene measurement, or
    // intrusive fire investigation. The boundary is stated ONCE in the intro
    // and then only where a reader would otherwise assume otherwise — it is
    // not repeated per item, which would read as defensive.
    //
    // Keep "review", "observations", "arrangements" and "identify where a
    // specialist is required" as the operative verbs. Never "certify",
    // "approve", "examine" (in the statutory sense), "classify" or "sign off".
    slug: "manufacturing-industrial-safety",
    // Opt-in hero photograph and risk cards (visual pilot, October 2026).
    // Paths point at files that must be licensed and recorded in
    // public/img/IMAGE-CREDITS.md before they ship. Until a file exists the
    // hero renders as it always did and each card shows a branded
    // placeholder, so nothing breaks and no unlicensed image can leak out.
    heroImage: "/img/industrial/hero-production-floor.jpg",
    heroImageAlt: "Industrial robots working within a manufacturing production line",
    // Stated explicitly rather than derived from the category title in the
    // route file, which is where it lived when this was the only card band.
    // The strings are the ones that shipped, so the built HTML is unchanged.
    cardsHeading: "What we assess on an industrial site",
    cardsIntro: "Select any card to see what we look at and which service covers it.",
    riskCards: [
      {
        id: "card-production",
        title: "Manufacturing and production facilities",
        caption: "Machinery, materials handling and maintenance running in one space, often across shifts.",
        detail: "We audit how health and safety is actually organised on a production site — responsibilities, supervision, monitoring and records — and report prioritised findings with photographic evidence.",
        image: "/img/industrial/production-facility.jpg",
        alt: "Manufacturing floor with production machinery and marked pedestrian walkways",
        href: "#industrial-audits",
        linkLabel: "Facility audits",
      },
      {
        id: "card-machinery",
        title: "Machinery guarding and work equipment",
        caption: "Guarding, interlocks, isolation and maintenance regimes around moving machinery.",
        detail: "We review your arrangements under PUWER — guarding, controls, isolation, maintenance and inspection records — and report what we observe in use. Statutory thorough examination and machinery certification are carried out by others.",
        image: "/img/industrial/machinery-guarding.jpg",
        alt: "Guard rails and perimeter fencing around automated production machinery",
        href: "#machinery-equipment",
        linkLabel: "Machinery reviews",
      },
      {
        id: "card-warehouse",
        title: "Warehousing, forklifts and segregation",
        caption: "Vehicle routes, loading areas, racking and the pedestrians moving between them.",
        detail: "We assess workplace transport arrangements, pedestrian segregation, racking condition and damage reporting, and access to height — identifying where specialist racking inspection is needed.",
        // AI-generated illustration, 1 November 2026, replacing the branded
        // stock candidate rejected in October ("NISSAN FORKLIFT" and
        // "UNICARRIERS" were legible and effectively the subject). The
        // lettering on this forklift is generator glyphs, not a real mark,
        // and is illegible at card size. See public/img/IMAGE-CREDITS.md.
        image: "/img/industrial/warehouse-segregation.jpg",
        alt: "Forklift operating in a warehouse aisle beside a marked green pedestrian walkway",
        href: "#height-lifting-transport",
        linkLabel: "Transport and height",
      },
      {
        id: "card-hotworks",
        title: "Welding, fabrication and hot works",
        caption: "Fume, sparks and ignition sources in close company with stored materials.",
        detail: "We review fume control and ventilation, hot-work permits, screening and the fire precautions around welding, cutting and fabrication, including whether LEV is maintained and examined.",
        image: "/img/industrial/welding-fabrication.jpg",
        alt: "A welder in a protective helmet and gloves working at a fabrication bench",
        href: "#hazardous-substances",
        linkLabel: "Hot works and COSHH",
      },
      {
        id: "card-construction",
        title: "Construction and site inspections",
        caption: "Plant installations, shutdowns and building work alongside live production.",
        detail: "Independent site inspections against the construction phase plan and agreed method statements, with prioritised findings tracked to closure — covered in full on our Construction Health & Safety page.",
        // AI-generated illustration, 1 November 2026, replacing the stock
        // candidate rejected in October for visible unsafe practice (a worker
        // in flip-flops on rubble, others without head protection). Everyone
        // shown here is in a hard hat and hi-vis, and the open floors have
        // edge protection. See public/img/IMAGE-CREDITS.md.
        image: "/img/industrial/construction-site-inspection.jpg",
        alt: "Two people in hard hats and hi-vis reviewing a steel-frame building under construction, holding tablets",
        href: "/services/construction-health-safety",
        linkLabel: "Construction H&S",
      },
      {
        id: "card-fire-substances",
        title: "Industrial fire and hazardous substances",
        caption: "Flammable storage, dust, ignition sources and the escape routes through it all.",
        detail: "Fire risk assessments for production and storage premises, informed by recognised guidance including PAS 79 where appropriate, alongside COSHH assessment of the substances in use.",
        image: "/img/industrial/fire-hazardous-substances.jpg",
        alt: "Red fire protection pipework beneath the roof of an industrial warehouse",
        href: "#industrial-fire",
        linkLabel: "Fire and substances",
      },
      // The platform was a seventh card here until 1 November 2026. Two
      // things were wrong with that. It was the only card in the band that
      // is not a premises or a hazard we assess \u2014 it is how we record what
      // we find \u2014 and seven cards in a three-column grid left it stranded
      // alone on the last row at every desktop width. Its content now opens
      // the `digital-records` pointer below, where the screenshot has the
      // width to be legible. Nothing was lost: the card's `detail` was a
      // condensed version of that pointer's first paragraph, and its caption
      // survives as the screenshot's caption.
    ],
    image: IMAGES.healthSafety,
    imageAlt: "Health and safety assessment in an industrial workplace",
    eyebrow: "Industrial Safety",
    title: "Manufacturing & Industrial Safety",
    short: "Health and safety consultancy for manufacturing, production and industrial premises — audits, inspections, machinery and process safety reviews, hazardous substances, and safe systems of work.",
    intro: "Health and safety consultancy for factories, production facilities, workshops and warehousing. We audit and inspect industrial premises as they actually operate, review the arrangements and controls in place around machinery, processes, substances and contractors, and report prioritised findings with photographic evidence and corrective actions tracked to closure. Statutory thorough examinations, machinery certification and engineering design approval are specialist functions carried out by others; where your site needs one, we identify the gap and tell you what kind of specialist to appoint.",
    sections: [
      {
        id: "industrial-audits",
        eyebrow: "Audits",
        title: "Manufacturing and Production Facility H&S Audits",
        intro: "Full audits of health and safety arrangements across a manufacturing or production site — how work is organised, supervised, monitored and recorded, judged against what is actually happening on the floor.",
        featured: true,
        items: [
          { name: "Production facility health and safety audits", desc: "Arrangements, documentation and practice across the site, reported with prioritised findings and recommended actions." },
          { name: "Factory and workshop inspections", desc: "Scheduled or unannounced inspections covering the production environment, traffic routes, welfare and housekeeping." },
          { name: "Multi-site and group audits", desc: "One consistent audit format applied across several premises, so results are comparable site by site." },
          { name: "Management arrangements review", desc: "How responsibilities, supervision, monitoring and review operate in practice, rather than as the paperwork describes them." },
        ],
      },
      {
        id: "machinery-equipment",
        eyebrow: "Machinery",
        title: "Machinery and Work Equipment Safety Reviews",
        intro: "A review of your arrangements for work equipment under the Provision and Use of Work Equipment Regulations 1998 — guarding, isolation, maintenance regimes and inspection records, and the safe systems around them. This is an advisory review of arrangements and controls, not a statutory thorough examination or any form of machinery certification.",
        items: [
          { name: "PUWER arrangements review", desc: "Whether suitable equipment, guarding, controls, isolation and maintenance arrangements are in place and being followed in practice." },
          { name: "Guarding and access observations", desc: "Practical observations on guarding, interlocking and access as found in use, reported for your engineers or equipment supplier to act on." },
          { name: "Isolation and maintenance procedures", desc: "Permit-to-work, lock-off and safe isolation arrangements around maintenance, cleaning and breakdown work." },
          { name: "Inspection and examination records", desc: "Whether required inspections and examinations are being obtained, recorded and acted on. Where one is overdue we identify it; the examination itself is carried out by a competent person appointed for that purpose." },
        ],
      },
      {
        id: "height-lifting-transport",
        eyebrow: "High-risk activities",
        title: "Work at Height, Lifting Operations and Workplace Transport",
        intro: "Three of the highest-consequence activity groups in an industrial premises, reviewed as arrangements and controls. Thorough examination of lifting equipment under LOLER is carried out by a competent examiner; we review whether examinations are current and whether their findings have been acted on.",
        items: [
          { name: "Work at height arrangements", desc: "Access to plant, mezzanines, roofs and racking, and the equipment, controls and rescue arrangements in use." },
          { name: "Lifting operations", desc: "Planning, supervision and safe systems of work around lifting activities, including the use of cranes, hoists and lifting accessories." },
          { name: "Workplace transport and segregation", desc: "Vehicle routes, fork-lift operations, loading and unloading areas, and pedestrian segregation." },
          { name: "Racking and storage observations", desc: "Condition, loading and damage-reporting arrangements, with specialist racking inspection identified where it is required." },
        ],
      },
      {
        id: "hazardous-substances",
        eyebrow: "Substances",
        title: "COSHH, Hazardous Substances and Hot Works",
        intro: "Assessment and review of exposure to hazardous substances, and of the arrangements where flammable atmospheres, fume or dust are present.",
        items: [
          { name: "COSHH assessments and reviews", desc: "The substances in use, who is exposed and how, and whether the controls in place are suitable and being maintained." },
          { name: "Welding, hot works and fabrication", desc: "Fume control, hot-work permits, screening, ventilation and fire precautions around welding, cutting and fabrication." },
          { name: "Local exhaust ventilation arrangements", desc: "Whether LEV is in place, maintained and subject to the required examination. The statutory LEV thorough examination itself is a specialist function." },
          { name: "DSEAR arrangements review", desc: "Whether DSEAR assessments exist, are current and are reflected in day-to-day controls. We review the arrangements and identify apparent gaps, and recommend a specialist DSEAR assessment where one is needed. Hazardous-area classification and zoning are specialist work we do not undertake." },
        ],
      },
      {
        id: "safe-systems",
        eyebrow: "Planning",
        title: "Risk Assessments and Safe Systems of Work",
        intro: "Risk assessments written for the work as it is actually carried out, with the people who do it, and the procedures that go with them.",
        items: [
          { name: "Task and activity risk assessments", desc: "Assessments for specific production tasks, machinery operations and higher-risk activities." },
          { name: "Safe systems of work and permits", desc: "Practical procedures for higher-risk tasks, including permit-to-work arrangements where they are needed." },
          { name: "Manual handling and ergonomics", desc: "Handling, repetitive tasks and workstation arrangements in a production setting." },
          { name: "Noise and vibration arrangements", desc: "A review of how noise and vibration are being managed — whether assessments exist, controls are applied and health surveillance is in place — identifying where a competent occupational hygiene assessment or measurement survey is needed." },
        ],
      },
      {
        id: "contractors-maintenance",
        eyebrow: "Contractors",
        title: "Contractor Safety and Maintenance Activities",
        intro: "Shutdowns, installations and maintenance bring contractors into a live production environment, and are usually the highest-risk periods an industrial site has.",
        items: [
          { name: "Contractor control arrangements", desc: "Selection, induction, supervision and monitoring of contractors working on your site." },
          { name: "Maintenance and shutdown safety", desc: "Arrangements around planned maintenance, breakdown work and shutdown periods." },
          { name: "Permit-to-work systems", desc: "Whether permits are suitable for the work, understood by those using them, and actually being used." },
          { name: "Contractor register and competence records", desc: "Competence evidence and audit history held against each contractor, so the picture is cumulative." },
        ],
      },
      {
        id: "monitoring-investigations",
        eyebrow: "Ongoing support",
        title: "Regular Inspections, Investigations and Compliance Monitoring",
        intro: "We offer both one-off assignments and regular inspection programmes — commonly monthly or quarterly for industrial premises, matched to the risk and pace of operations.",
        items: [
          { name: "Regular inspection programmes", desc: "A schedule of inspections in a consistent format, so trends and repeat issues are visible rather than judged from a single visit." },
          { name: "Incident and near-miss investigation", desc: "Independent investigation with a factual report and root-cause analysis." },
          { name: "Corrective-action monitoring", desc: "Actions tracked to closure with owners, target dates and a dated history of what was done." },
          { name: "Compliance reporting", desc: "Periodic reporting on position, progress and outstanding actions, written for the people who have to act on it." },
        ],
      },
      {
        id: "industrial-fire",
        eyebrow: "Fire safety",
        title: "Fire Risk Assessments for Industrial Premises",
        intro: "Fire risk assessments for factories, workshops and warehouses, where process risk, storage arrangements and travel distances all bear on the outcome. These are fire risk assessments of the premises as found; they are not process fire engineering and do not involve intrusive investigation.",
        items: [
          { name: "Industrial fire risk assessments", desc: "Assessments informed by recognised guidance, including PAS 79 where appropriate, for production and storage premises." },
          { name: "Storage and ignition risk", desc: "Flammable storage, racking arrangements, dust accumulation and ignition sources, considered as part of the assessment." },
          { name: "Means of escape in production environments", desc: "Travel distances, routes through production areas, and final exits where plant and storage affect them." },
        ],
      },
    ],
    pointers: [
      {
        id: "related-audits",
        eyebrow: "Also Available",
        title: "Independent H&S Inspections and Audits",
        body: "Independent inspections and audits across construction sites, workplaces and industrial premises, including contractor compliance monitoring and client-side assurance.",
        href: "/services/independent-health-safety-audits",
        linkLabel: "View Independent Inspections & Audits",
      },
      {
        id: "digital-records",
        eyebrow: "Digital and AI",
        title: "Digital Inspection and Audit Records",
        body: "Every inspection, audit and investigation is recorded in our own digital compliance platform. Photographic evidence attaches to individual findings, corrective actions carry an owner and are tracked to closure with a dated history, and reports are issued as PDFs. Contractor and workforce registers hold competence and training records alongside the inspection history, and client organisations get their own login to see the records for their sites.",
        bodySecondary:
          "AI-assisted compliance summaries are available as an option alongside these standard functions. The figures are calculated directly from your own records — the AI writes only the interpretation that accompanies them, and anything it cannot verify against your data is withheld rather than shown. It is built to support professional judgement, not to replace it: assessments, findings and recommendations remain the work of our consultants.",
        // The only pointer on the site carrying a screenshot, because this is
        // the only page where the platform lost its card in the band above.
        // `src` is deliberately absent until a genuine capture exists; the
        // slot renders a labelled placeholder meanwhile. Whatever fills it
        // must show demonstration data only, and must not show a panel the
        // copy above refuses to claim \u2014 no predictive risk, no trend
        // analysis, no automated report drafting, no reading of uploaded
        // documents. An image makes a claim as surely as a sentence does.
        media: {
          src: "/img/platform/compliance-overview.png",
          alt: "The Lion RMS platform's compliance overview: a compliance score, counts of open, overdue and high-priority actions, and the next critical deadline with its site, priority and due date",
          caption: "Monitor inspection findings, overdue actions and compliance performance across multiple sites.",
          disclosure: "Lion RMS demonstration environment \u2014 illustrative data only.",
        },
        href: "/contact",
        linkLabel: "Enquire about our digital platform",
      },
    ],
  },
  {
    // SCOPE BOUNDARY — read before editing any copy on this category.
    //
    // Lion RMS is NOT an approved or accredited training provider. It holds no
    // IOSH, NEBOSH, CITB or other awarding-body approval. Nothing here may
    // claim, imply or hint at one, and no course may be named after an
    // awarding body's product. The IOSH Training Provider and NEBOSH Learning
    // Partner applications are unresolved; until one is granted in writing,
    // neither exists as far as this website is concerned.
    //
    // Equally out of bounds, because none of it is settled: session durations,
    // prices, certificate or attendance-certificate arrangements, course
    // approval numbers, and any training venue other than the client's own
    // premises. "Agreed with you before booking" is the device that keeps the
    // page useful without inventing any of it — do not replace it with a
    // number.
    //
    // Keep "awareness", "practical", "briefing", "covers" and "explains" as
    // the operative verbs. Never "certified", "accredited", "approved",
    // "qualifies" or "licensed".
    //
    // The eight sessions here are the ones approved on 1 November 2026. Six of
    // them restate competence the site already advertised (fire awareness,
    // fire marshal, manual handling, working at height, inductions, toolbox
    // talks); General Workplace H&S Awareness and COSHH Awareness were added
    // then. COSHH is held at AWARENESS level deliberately and is subject to a
    // final competence and delivery confirmation before publication.
    slug: "health-safety-training",
    image: IMAGES.healthSafety,
    imageAlt: "Site team receiving a safety briefing before starting work",
    eyebrow: "Training",
    title: "Health & Safety and Fire Safety Training",
    short:
      "Practical fire safety and health & safety training delivered at your premises — fire marshal, manual handling, working at height, COSHH awareness, site inductions and toolbox talks.",
    intro:
      "Practical safety training delivered at your own premises and built around the hazards your people actually face. Sessions are awareness and duty-focused: they explain the risk, the controls in place and who is responsible for what, in the language of the job rather than of a syllabus. Content, audience and format are agreed with you before anything is booked.",
    // Icon cards, not photographs. A stock photograph of people in a training
    // room would read as a session we ran, which is exactly the claim this
    // page must not make. See the `icon` field on RiskCard.
    cardsHeading: "Training sessions we deliver",
    cardsIntro: "Select any session to see what it covers and where it fits.",
    ctaHref: "/contact?service=training",
    riskCards: [
      {
        id: "card-fire-awareness",
        title: "Fire Safety Awareness",
        caption: "What can start a fire in your building, and what everyone does when the alarm sounds.",
        detail:
          "Covers the fire risks present in your own premises, how fire and smoke spread, the alarm and detection arrangements in place, escape routes and final exits, and what staff are expected to do on discovering a fire or hearing the alarm. Pitched at all staff, whatever their role.",
        icon: "flame",
        href: "/services/fire-safety-consultancy",
        linkLabel: "Fire safety consultancy",
      },
      {
        id: "card-fire-marshal",
        title: "Fire Marshal and Fire Warden Training",
        caption: "For the people who sweep the floor, run the roll call and meet the fire service.",
        detail:
          "Covers the fire warden's role before, during and after an evacuation: routine checks, raising the alarm, sweeping an area, assisting people who need help to escape, assembly point procedure and roll call, and handing over to the fire and rescue service. Extinguisher familiarisation is included where your own fire strategy expects staff to use them.",
        icon: "warden",
        href: "/services/fire-safety",
        linkLabel: "Fire safety in occupied buildings",
      },
      {
        id: "card-manual-handling",
        title: "Manual Handling",
        caption: "Lifting, carrying, pushing and pulling the loads your people actually handle.",
        detail:
          "Covers how handling injuries happen, how the body is loaded, assessing a task by looking at the task, the individual, the load and the environment, and practical technique. It also covers the point at which a task should be redesigned or mechanised rather than trained around. Built from the real tasks and loads on your site.",
        icon: "lifting",
        href: "/services/health-safety",
        linkLabel: "Health & safety support",
      },
      {
        id: "card-working-at-height",
        title: "Working at Height Awareness",
        caption: "Steps, ladders, towers and edges — and the decisions taken before anyone goes up.",
        detail:
          "Awareness-level training covering the hierarchy of control in the Work at Height Regulations 2005, choosing the right access equipment for the task, pre-use checks, fragile surfaces, falling objects and exclusion zones. It is awareness training, not operator or rescue training: it does not qualify anyone to erect scaffolding, operate a MEWP or carry out a rescue from height.",
        icon: "height",
        href: "/services/construction-health-safety",
        linkLabel: "Construction health & safety",
      },
      {
        id: "card-workplace-awareness",
        title: "General Workplace Health & Safety Awareness",
        caption: "The duties, hazards and reporting routes everyone at work is expected to know.",
        detail:
          "Covers employer and employee duties under the Health and Safety at Work etc. Act 1974, how risk assessment works and where to find your own, the hazards common to your type of workplace, accident and near-miss reporting, and who to raise a concern with. Works as a general induction-level session or as a refresher.",
        icon: "clipboard",
        href: "/guides/health-and-safety-risk-assessment-explained",
        linkLabel: "Risk assessment explained",
      },
      {
        id: "card-coshh",
        title: "COSHH Awareness",
        caption: "The substances in use on your site, the harm they can do and the controls that hold them.",
        detail:
          "Awareness-level training on hazardous substances: reading labels and safety data sheets, how exposure happens, the controls in place on your own site, local exhaust ventilation and PPE, and what to do about a spill or a suspected exposure. Based on the substances actually in use rather than a generic slide deck.",
        icon: "hazard",
        href: "/guides/coshh-assessment-explained",
        linkLabel: "COSHH assessment explained",
      },
      {
        id: "card-inductions",
        title: "Site and Contractor Safety Inductions",
        caption: "What anyone arriving on site needs to know before they start — staff and contractors alike.",
        detail:
          "Project-specific inductions covering site rules, the hazards present, permit arrangements, welfare and emergency procedures, PPE requirements and who holds which responsibility. Delivered for your own workforce and for visiting contractors, with attendance recorded.",
        icon: "induction",
        href: "/services/construction-health-safety",
        linkLabel: "Construction health & safety",
      },
      {
        id: "card-toolbox-talks",
        title: "Toolbox Talks",
        caption: "Short, focused briefings delivered where the work is happening.",
        detail:
          "Brief practical sessions on a single topic — a hazard that has just appeared on site, a change in method, or a near miss worth learning from — delivered at the workface and recorded. Topics are chosen with you, and can follow directly from the findings of an inspection or audit.",
        icon: "talk",
        href: "/services/independent-health-safety-audits",
        linkLabel: "Inspections and audits",
      },
    ],
    sections: [
      {
        id: "how-training-works",
        eyebrow: "Delivery",
        title: "How Training Is Delivered",
        intro:
          "Training is delivered by our own competent consultant, with suitably qualified associates brought in only where that is specifically arranged with you.",
        items: [
          {
            name: "Delivered at your premises",
            desc: "Sessions run at your own site, office or project, around the hazards, equipment and working practices your people actually encounter — not a generic course delivered off site.",
          },
          {
            name: "Delivered by a chartered practitioner",
            desc: "Sessions are delivered personally by a chartered safety practitioner (CMIOSH) who also works as a fire engineer (MIFireE), so the training reflects current assessment practice rather than a fixed slide pack.",
          },
          {
            name: "Scoped with you before booking",
            desc: "Content, audience, group size and session format are agreed with you in advance and confirmed in writing, so you know what will be covered and who it is pitched at before anything is arranged.",
          },
          {
            name: "Recorded for your compliance file",
            desc: "Attendance is recorded and the session content documented, so the training can be evidenced to a client, an insurer or an enforcing authority after the event.",
          },
        ],
      },
      {
        id: "training-scope",
        eyebrow: "Scope",
        title: "What These Sessions Are",
        intro:
          "Being straightforward about what we deliver is quicker than letting you find out later, so the scope is set out here rather than in the small print.",
        items: [
          {
            name: "Practical, non-accredited workplace training",
            desc: "These are practical in-house awareness and safety sessions. They explain the risks, the controls and the responsibilities that apply in your workplace. They are not regulated qualifications and they are not awarding-body certificated courses.",
          },
          {
            name: "Where a formal qualification is needed",
            desc: "Some roles call for a regulated qualification or an accredited certificate — operator tickets for plant and access equipment, for instance, or management-level safety qualifications. Where that applies to your people, we will tell you plainly and point you to a provider holding the relevant approval.",
          },
        ],
      },
    ],
    pointers: [
      {
        id: "training-records",
        eyebrow: "Digital and AI",
        title: "Training and Competence Records",
        // "auditor" is forbidden in built HTML by
        // tests/qualifications-credibility.test.mjs — calling anyone an
        // auditor edges towards certification-body auditor status, which is
        // not something this practice holds. Say who is actually asking.
        body: "Attendance and session records are held in our own digital compliance platform alongside your risk assessments, inspections and corrective actions. When a client, an insurer or an enforcing authority asks who was trained and when, the record is already there rather than in somebody's inbox. Client organisations get their own login to see the records for their sites.",
        href: "/contact",
        linkLabel: "Enquire about our digital platform",
      },
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

/*
 * ONE ORDERING, USED EVERYWHERE THE SERVICES ARE LISTED.
 *
 * SERVICE_CATEGORIES keeps its historical array order: several comments in
 * it describe a category's position relative to its neighbours, and the
 * carve-out notes rely on that reading order. Reordering the array itself
 * would invalidate those and move a thousand lines for a presentational
 * change.
 *
 * So presentation order lives here instead, as slugs. Health & safety and
 * construction lead, fire safety follows as the specialism, compliance
 * management closes. /services renders in this order and so does the
 * "Also available:" strip on each service page, which is what stops the two
 * disagreeing.
 */
const SERVICE_DISPLAY_ORDER = [
  "health-safety",
  "construction-health-safety",
  "independent-health-safety-audits",
  "manufacturing-industrial-safety",
  "health-safety-training",
  "fire-safety",
  "fire-safety-consultancy",
  "fire-engineering",
  "compliance-support",
] as const;

/**
 * SERVICE_CATEGORIES in presentation order.
 *
 * Throws rather than falling back if the two lists disagree. A tenth service
 * added to SERVICE_CATEGORIES and not listed above would otherwise vanish
 * from /services silently, which is exactly the kind of omission that left
 * Independent Audits and Manufacturing out of the footer for weeks.
 */
export const SERVICES_IN_DISPLAY_ORDER: ServiceCategory[] = (() => {
  const bySlug = new Map(SERVICE_CATEGORIES.map((c) => [c.slug, c]));
  const ordered = SERVICE_DISPLAY_ORDER.map((slug) => {
    const cat = bySlug.get(slug);
    if (!cat) throw new Error(`SERVICE_DISPLAY_ORDER lists "${slug}", which is not a SERVICE_CATEGORIES slug.`);
    return cat;
  });
  if (ordered.length !== SERVICE_CATEGORIES.length) {
    const missing = SERVICE_CATEGORIES.filter((c) => !SERVICE_DISPLAY_ORDER.includes(c.slug as (typeof SERVICE_DISPLAY_ORDER)[number]));
    throw new Error(`SERVICE_DISPLAY_ORDER is missing: ${missing.map((c) => c.slug).join(", ")}`);
  }
  return ordered;
})();

export interface ServiceMenuGroup {
  label: string;
  items: { label: string; href: string }[];
}

/**
 * The grouped Services menu, for the header dropdown and its mobile
 * equivalent. Labels are read from the categories rather than retyped, so a
 * renamed page renames its menu entry too.
 *
 * Fire Risk Assessments is listed as its own entry pointing at the section
 * anchor, not folded into Fire Safety Consultancy: it is the strongest
 * commercial term on the site and a visitor looking for it should not have
 * to guess which page it lives on. Same treatment it already gets in the
 * footer and the homepage cards.
 */
export const SERVICE_MENU: ServiceMenuGroup[] = (() => {
  const get = (slug: string) => SERVICE_CATEGORIES.find((c) => c.slug === slug);
  const fireSafety = get("fire-safety");
  const fra = fireSafety?.sections?.find((sec) => sec.id === "fire-risk-assessments");
  const entry = (slug: string) => {
    const cat = get(slug);
    return cat ? { label: cat.title, href: `/services/${cat.slug}` } : null;
  };
  const keep = (x: { label: string; href: string } | null): x is { label: string; href: string } => Boolean(x);

  return [
    {
      label: "Health & Safety",
      items: [
        entry("health-safety"),
        entry("construction-health-safety"),
        entry("independent-health-safety-audits"),
        entry("manufacturing-industrial-safety"),
        entry("health-safety-training"),
        entry("compliance-support"),
      ].filter(keep),
    },
    {
      label: "Fire Safety",
      items: [
        fra ? { label: fra.title, href: `/services/fire-safety#${fra.id}` } : null,
        entry("fire-safety-consultancy"),
        entry("fire-engineering"),
      ].filter(keep),
    },
  ];
})();

/**
 * The footer's Services column (repositioning PR1). Hand-ordered rather than
 * derived by flatMap over `SERVICE_CATEGORIES`, because a category's
 * `sections` are declared together but need to interleave with sibling
 * categories in the list a reader actually wants: Fire Risk Assessments,
 * Fire Engineering, Fire Safety Consultancy, then Health & Safety, then
 * Compliance Management. Labels are read from the data so the footer cannot
 * drift from the pages it links to; only the ORDER is hand-set here.
 *
 * Repositioning PR3: Fire Safety Consultancy is now looked up as its own
 * category (it has its own page) rather than as a section of `fire-safety`,
 * and its link is a real route rather than an anchor. Fire Risk Assessments
 * stays an anchor lookup — `fire-safety` still uses `sections` for its one
 * remaining section.
 *
 * Repositioning PR5: Construction Health & Safety is added the same way Fire
 * Safety Consultancy was in PR3 — looked up as its own category, linked as a
 * real route, positioned immediately after Health & Safety to match the
 * reading order used on the homepage clusters below.
 */
export const FOOTER_SERVICE_LINKS: { label: string; href: string }[] = (() => {
  const fireSafety = SERVICE_CATEGORIES.find((c) => c.slug === "fire-safety");
  const fra = fireSafety?.sections?.find((s) => s.id === "fire-risk-assessments");
  const fireEngineering = SERVICE_CATEGORIES.find((c) => c.slug === "fire-engineering");
  const fsc = SERVICE_CATEGORIES.find((c) => c.slug === "fire-safety-consultancy");
  const healthSafety = SERVICE_CATEGORIES.find((c) => c.slug === "health-safety");
  const constructionHealthSafety = SERVICE_CATEGORIES.find((c) => c.slug === "construction-health-safety");
  const audits = SERVICE_CATEGORIES.find((c) => c.slug === "independent-health-safety-audits");
  const manufacturing = SERVICE_CATEGORIES.find((c) => c.slug === "manufacturing-industrial-safety");
  const training = SERVICE_CATEGORIES.find((c) => c.slug === "health-safety-training");
  const complianceSupport = SERVICE_CATEGORIES.find((c) => c.slug === "compliance-support");

  /*
   * Reordered November 2026 to put health & safety first, matching the
   * homepage, the Services index and the header menu — the footer was the
   * last place still leading with fire. Independent Audits and Manufacturing
   * & Industrial Safety join it: both have had published pages for weeks and
   * neither was reachable from the footer, which is the one navigation
   * element present on every page.
   *
   * Fire Risk Assessments stays an explicit entry, not folded into a Fire
   * Safety link, because it is the strongest commercial term on the site and
   * the anchor it points at is the page's lead section.
   */
  const links = [
    healthSafety && { label: healthSafety.title, href: `/services/${healthSafety.slug}` },
    constructionHealthSafety && { label: constructionHealthSafety.title, href: `/services/${constructionHealthSafety.slug}` },
    audits && { label: audits.title, href: `/services/${audits.slug}` },
    manufacturing && { label: manufacturing.title, href: `/services/${manufacturing.slug}` },
    training && { label: training.title, href: `/services/${training.slug}` },
    fra && { label: fra.title, href: `/services/fire-safety#${fra.id}` },
    fsc && { label: fsc.title, href: `/services/${fsc.slug}` },
    fireEngineering && { label: fireEngineering.title, href: `/services/${fireEngineering.slug}` },
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
 * Six cards in two clusters, matching the approved architecture (five before
 * repositioning PR5 gave Construction Health & Safety its own page and card):
 *   Fire Safety & Fire Engineering — Fire Risk Assessments, Fire Engineering,
 *   Fire Safety Consultancy (three propositions, equal billing since PR1).
 *   Health & Safety & Construction Safety — Health & Safety Consultancy,
 *   Construction Health & Safety (two propositions, equal billing since PR5).
 *
 * Compliance Management is NOT a sixth card here — see the note on
 * `POSITIONING` above for why. It keeps its own page and its own footer link;
 * it is just not promoted to homepage-headline status.
 *
 * Repositioning PR5: Construction Health & Safety now has its own dedicated
 * page, and this card reads its title, description and link from that
 * category — the same treatment PR3 gave the Fire Safety Consultancy card
 * below. The card's visible text is UNCHANGED: `construction.short` is set to
 * the exact sentence this card always showed (assembled, before PR5, from the
 * health-safety category's "RAMS and Construction Phase Plans" and
 * "Competent Person Support" items — see that category's former item text).
 * Only the destination moves, from the `#rams-construction-phase-plans`
 * anchor on `/services/health-safety` to the new page's own URL — the same
 * "wording unchanged, destination moves" pattern PR3 used. Wording stays
 * advisory (assessments, plans, support "alongside" the project team) — it
 * does not say or imply that Lion RMS acts as Principal Designer or Principal
 * Contractor.
 *
 * Repositioning PR3: the Fire Safety Consultancy card now reads its title and
 * description from its own category (it has its own page) rather than from a
 * section of `fire-safety`, and links straight to that page rather than to an
 * anchor. The card's visible text is unchanged — `short` carries the same
 * sentence the old section's `intro` did — only the destination moves.
 */
export const HOMEPAGE_SERVICE_CLUSTERS: HomepageServiceCluster[] = (() => {
  const fireSafety = SERVICE_CATEGORIES.find((c) => c.slug === "fire-safety");
  const fra = fireSafety?.sections?.find((s) => s.id === "fire-risk-assessments");
  const fireEngineering = SERVICE_CATEGORIES.find((c) => c.slug === "fire-engineering");
  const fsc = SERVICE_CATEGORIES.find((c) => c.slug === "fire-safety-consultancy");
  const healthSafety = SERVICE_CATEGORIES.find((c) => c.slug === "health-safety");
  const constructionHealthSafety = SERVICE_CATEGORIES.find((c) => c.slug === "construction-health-safety");
  const audits = SERVICE_CATEGORIES.find((c) => c.slug === "independent-health-safety-audits");
  const manufacturing = SERVICE_CATEGORIES.find((c) => c.slug === "manufacturing-industrial-safety");
  const training = SERVICE_CATEGORIES.find((c) => c.slug === "health-safety-training");
  const complianceSupport = SERVICE_CATEGORIES.find((c) => c.slug === "compliance-support");

  /*
   * Homepage repositioning, 1 November 2026 — three tiers, nine cards.
   *
   * The old shape was two clusters and five cards, and it had fallen behind
   * reality: Independent Audits, Manufacturing & Industrial Safety and
   * Training all had published pages that the homepage never mentioned,
   * while the heading above still read "Two Disciplines, Five Services".
   *
   * Health & Safety leads, because that is what the practice is being
   * positioned on. Fire Safety keeps a full tier of its own rather than
   * being folded in as a footnote: Fire Risk Assessments is still the
   * strongest commercial term on the site and must stay a headline card.
   * Training and Compliance Management sit in a third, quieter tier —
   * visible without competing.
   *
   * Compliance Management becomes a card here for the first time. The old
   * comment explained its absence by saying it was named in the
   * introductory statement instead; with nine published service pages that
   * reasoning no longer holds, and leaving it out was how the previous
   * hand-typed array went stale in the first place.
   *
   * Every card still reads its title and description from SERVICE_CATEGORIES
   * rather than retyping them, so the homepage cannot drift from the pages
   * it links to.
   */
  const healthSafetyCards: (HomepageServiceCard | false | undefined)[] = [
    healthSafety && { icon: "🏗️", title: healthSafety.title, desc: healthSafety.short, href: `/services/${healthSafety.slug}` },
    constructionHealthSafety && {
      icon: "🦺",
      title: constructionHealthSafety.title,
      desc: constructionHealthSafety.short,
      href: `/services/${constructionHealthSafety.slug}`,
    },
    audits && { icon: "🔍", title: audits.title, desc: audits.short, href: `/services/${audits.slug}` },
    manufacturing && { icon: "🏭", title: manufacturing.title, desc: manufacturing.short, href: `/services/${manufacturing.slug}` },
  ];

  const fireCards: (HomepageServiceCard | false | undefined)[] = [
    fra && { icon: "📄", title: fra.title, desc: fra.intro, href: `/services/fire-safety#${fra.id}` },
    fsc && { icon: "🔥", title: fsc.title, desc: fsc.short, href: `/services/${fsc.slug}` },
    fireEngineering && { icon: "📐", title: fireEngineering.title, desc: fireEngineering.short, href: `/services/${fireEngineering.slug}` },
  ];

  const supportingCards: (HomepageServiceCard | false | undefined)[] = [
    training && { icon: "🎓", title: training.title, desc: training.short, href: `/services/${training.slug}` },
    complianceSupport && { icon: "📋", title: complianceSupport.title, desc: complianceSupport.short, href: `/services/${complianceSupport.slug}` },
  ];

  const isCard = (c: HomepageServiceCard | false | undefined): c is HomepageServiceCard => Boolean(c);

  return [
    { label: "Health & Safety and Construction", cards: healthSafetyCards.filter(isCard) },
    { label: "Fire Safety", cards: fireCards.filter(isCard) },
    { label: "Training and Ongoing Compliance", cards: supportingCards.filter(isCard) },
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
    // Given a page in the Manufacturing & Industrial stage (October 2026).
    // The slug is deliberately unchanged — "industrial-warehousing" is the
    // existing, linkable URL — while the title and summary are rewritten to
    // lead with manufacturing and with health & safety rather than fire.
    //
    // This page describes the ENVIRONMENTS and CLIENTS we support. What we
    // actually deliver lives at /services/manufacturing-industrial-safety.
    // Keep that split: a sector page that starts listing services duplicates
    // the service page and the two drift apart.
    slug: "industrial-warehousing",
    title: "Manufacturing, Industrial & Warehousing",
    summary: "Health and safety support for manufacturing plants, production facilities, workshops, warehouses and logistics sites.",
    body: "Manufacturing and industrial premises carry a different risk profile from an office or a retail unit: moving machinery, hot works, hazardous substances, vehicle movements and maintenance activity all running in the same space, often across shifts. We support manufacturers, production facilities, engineering workshops, fabrication shops, warehousing and logistics operators, and the landlords and managing agents responsible for industrial estates.",
    considerations: [
      "Moving machinery, guarding and safe isolation during maintenance",
      "Hot works, welding fume and hazardous or flammable substances",
      "Workplace transport, fork-lift operations and pedestrian segregation",
      "Racking, storage arrangements and work at height",
      "Contractors working in a live production environment",
      "Shift patterns, lone working and out-of-hours cover",
    ],
    relatedServices: [
      "manufacturing-industrial-safety",
      "independent-health-safety-audits",
      "health-safety",
      "fire-safety",
    ],
    hasPage: true,
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
// Level 6 Diploma in Applied Health and Safety (repositioning PR4) — public
// data model deliberately holds only the qualification title. No award date
// and no grade are stored here, in a comment, or anywhere else in the
// codebase (owner instruction) — the title alone is the verified, publishable
// fact.
export const QUALIFICATIONS: Qualification[] = [
  { name: "Level 4 Diploma in Fire Risk Assessment" },
  { name: "Level 5 Diploma in Fire Engineering Design" },
  { name: "Level 6 Diploma in Applied Health and Safety" },
];

// A professional card/status — distinct from a Membership (a body you belong
// to) and a Qualification (a diploma you were awarded). `abbr` + `status`
// combine to form the exact public wording; `fullName` is the longer form
// used in structured data only (repositioning PR4).
export interface ProfessionalCard {
  abbr: string;
  status: string;
  fullName: string;
}
// Construction Skills Certification Scheme (CSCS) card. No expiry date, card
// number or registration/candidate number is stored here or anywhere else in
// the codebase — none of that is ever rendered publicly or in structured
// data.
/*
 * EMPTIED 1 November 2026, temporarily, on the owner's instruction.
 *
 * This held the CSCS Professionally Qualified Person card. The card's
 * CURRENT VALIDITY has not been confirmed, and a professional card is a
 * statement about today, not about the past — so it comes off the homepage,
 * the About page and the Person JSON-LD until it is checked.
 *
 * This is a pause, not a deletion: the wording above is the owner's own
 * specified form and is kept here so reinstating it is a one-line change
 * once the card is confirmed in date. Nothing else about the credential —
 * expiry, card number, registration or candidate number — is stored here or
 * anywhere else, and that does not change on reinstatement.
 *
 * The memberships and diplomas are untouched. CMIOSH and MIFireE in
 * particular are verified and stay exactly as they are.
 */
export const PROFESSIONAL_CARDS: ProfessionalCard[] = [];

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
  ...PROFESSIONAL_CARDS.map((c) => `${c.abbr} ${c.status}`),
  ...ASSURANCES.map((a) => a.name),
];

export const ASSESSOR = {
  name: "Batir Turakulov",
  // Reordered 1 November 2026 to lead with health & safety, matching the
  // repositioning. Both credentials are unchanged and both still appear —
  // only the order moves. This string renders as a visible line on /about,
  // the homepage and all 54 Knowledge Centre pages (via lib/people.ts), and
  // as jobTitle in both the Person and Organisation JSON-LD.
  role: "Chartered Health & Safety Professional (CMIOSH) and Fire Engineer (MIFireE)",
  /**
   * Compact form of `role`, for places where the full form would be unwieldy —
   * currently the two portrait alt texts. `role` grew past 120 characters when
   * MIFireE was spelled out in full, which would have pushed those alt strings
   * to 172 characters; screen-reader guidance puts the practical ceiling around
   * 125. Same credentials, same order, fewer words. Not a second source of
   * truth: nothing here is a claim that `role` does not already make.
   */
  shortRole: "Chartered Health & Safety Professional (CMIOSH) & Fire Engineer (MIFireE)",
  photo: "/batir-turakulov.jpg",
  /*
   * THE MOST-RENDERED SENTENCE ON THE SITE. Read before editing.
   *
   * This string appears in three places: the credential card on /about, the
   * founder description in the sitewide Organisation JSON-LD (every page),
   * and the author and reviewer blocks on all 54 Knowledge Centre pages via
   * lib/people.ts. Changing it moves every authored route's content hash and
   * rewrites a visible paragraph on roughly seventy-eight built pages. That
   * is why the Level 6 Diploma was previously kept out of it.
   *
   * Rewritten 1 November 2026, with that cost accepted deliberately. It now
   * leads on chartered health & safety competence and names the Level 6
   * Diploma, because leaving the most-rendered description of the practice
   * fire-led would have undercut the repositioning everywhere except the
   * homepage.
   *
   * Kept short on purpose. MIFSM, MIIRSM and AIEMA are real and stay in the
   * credentials strip, which is where a reader looks for the full list — a
   * biography that recites nine credentials reads as insecurity, not
   * authority.
   *
   * THE DELIVERY SENTENCE. It used to read "Every assessment is personally
   * undertaken by Batir". That is an absolute, and it contradicted copy
   * published the same week on the training and construction pages, which
   * say associates may be engaged where specifically arranged. It would also
   * have become false on seventy-eight pages at once the first time an
   * associate did any of the work. The replacement keeps the real promise —
   * Batir does the work — without the absolute, and must not drift back.
   * It does NOT say associates are employed or in regular use, because they
   * are not.
   */
  bio: "Batir Turakulov is a Chartered Health & Safety Professional (CMIOSH) and Fire Engineer (MIFireE), holding a Level 6 Diploma in Applied Health and Safety alongside Level 5 and Level 4 Diplomas in Fire Engineering Design and Fire Risk Assessment. He advises on workplace and construction health & safety, independent inspections and audits, CDM 2015 duties, manufacturing and industrial safety, and health & safety training, alongside fire risk assessments and fire strategies for commercial, residential and complex premises. Batir personally undertakes consultancy assignments, with suitably qualified associates engaged only where specifically agreed with the client in advance, so clients receive technically robust reports, practical recommendations and clear advice aligned with current UK legislation and recognised industry standards.",
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

/*
 * EMPTY BY DECISION (1 November 2026), not by oversight.
 *
 * This array held four figures. Three had no basis anywhere in the repo or
 * in the business: "10+ years' experience", "500+ assessments & inspections
 * completed", and "16 London areas covered" — the last of which was also
 * contradicted by the only coverage data we have (six Home Counties, plus
 * London; there is no sixteen-area concept). components/StatsBand.tsx had
 * already carried a standing note that these were pulled "pending real
 * figures", but the homepage rendered the array directly and bypassed that.
 *
 * The fourth, "9 sectors served", counted SECTORS correctly — but a count of
 * the taxonomy is not evidence of projects delivered in all nine. The
 * homepage now presents that as "Sectors We Support" with a link, which is
 * true, instead of as a performance statistic.
 *
 * Do not repopulate this with estimates. A figure goes here only when there
 * is a record behind it that would survive a client asking to see it.
 */
export const STATS: { value: number; suffix: string; label: string }[] = [];

export const PROCESS_STEPS = [
  // "usually the same day" removed 1 November 2026, with the matching
  // promise in the homepage's closing CTA. The FAQ deliberately commits to
  // agreeing a timescale rather than to a turnaround, and nothing on the
  // site should promise more than the FAQ does.
  { n: "01", title: "Enquiry", body: "Tell us about your premises, portfolio, or project. We confirm scope, timescales, and a clear fixed fee before any work begins." },
  { n: "02", title: "Site visit", body: "Your assessor visits in person, walking the building and gathering the evidence a suitable and sufficient assessment depends on." },
  { n: "03", title: "Report", body: "You receive a clear, prioritised report in plain English — what matters, why, and in what order to act." },
  { n: "04", title: "Ongoing support", body: "Action tracking, reviews, reminders, and compliance records that keep your compliance current — not a report left in a drawer." },
];

// "What Clients Receive" section (Phase 4B PR 1) — tangible deliverables,
// distinct from PROCESS_STEPS above (which describes the steps, not the outputs).
/*
 * What a client actually ends up holding. Rewritten 1 November 2026 to lead
 * on consultancy deliverables — inspections, findings, evidence, priorities,
 * monitoring — rather than on commercial terms. Every line describes
 * something we hand over or do, so none of it is a claim about outcomes.
 */
export const WHAT_CLIENTS_RECEIVE = [
  { title: "Independent inspections and audits", body: "Carried out by us rather than by the people delivering the work, against the standards that actually apply to your premises or project." },
  { title: "Clear findings, with photographic evidence", body: "What we saw and where, recorded at the time, so a finding can be understood without having been there." },
  { title: "Prioritised recommendations", body: "Ranked by risk and written in plain English — what matters, why, and in what order to deal with it." },
  { title: "Corrective actions tracked to closure", body: "Each action carries an owner and a target date, with a dated history of what was closed and when." },
  { title: "Incident and near-miss investigation", body: "Structured, independent investigation when something goes wrong, with root causes identified rather than assumed." },
  { title: "Reporting and ongoing support", body: "Reports issued as PDFs, review dates scheduled, and the same consultant available between visits as things change." },
];

export const STANDARDS_ROW = [
  "PAS 79", "BS 9999", "Approved Document B", "RRO (Fire Safety) Order 2005",
  "BS 9991", "Health & Safety at Work Act 1974", "CDM 2015",
];

/*
 * Anonymised recent-work highlights for the homepage "Recent Projects"
 * section. Every entry here must have a full case study behind it at
 * /case-studies/<slug>, so a reader who wants the detail can get it.
 *
 * Reduced from three to two on 1 November 2026. The removed entry, "RAMS &
 * construction phase plans", had no case study behind it at all: its twin
 * lives in OTHER_CASES (lib/case-studies.ts), which is deliberately never
 * rendered and has no detail page. The old comment here claimed all three
 * were "shown in full on /case-studies", which was true of two of them.
 *
 * The outcome claim on the fire strategy entry is also softened. It
 * previously said the strategy was "unlocking planning approval without
 * further queries" — an asserted causal result, stated three times on one
 * page (here, in the case study, and again as a client testimonial). What we
 * can stand behind is the work done and that the application was approved,
 * not that our document is what caused it. The case study at
 * lib/case-studies.ts:124 still carries the stronger wording and is flagged
 * for Batir to confirm or soften.
 */
export const RECENT_PROJECTS = [
  {
    sector: "Residential · Managing Agent",
    title: "Portfolio fire risk assessments, London-wide",
    body: "A programme of Type 1 and Type 4 assessments across a residential block portfolio, feeding straight into an ongoing, prioritised action schedule.",
  },
  {
    sector: "Mixed-use · Developer",
    title: "Fire strategy for a change-of-use scheme",
    body: "A bespoke fire strategy setting out evacuation principles and construction details, prepared in support of a change-of-use planning application.",
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
