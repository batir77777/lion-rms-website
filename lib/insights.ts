// Insights / blog posts — demonstrates expertise (E-E-A-T) and adds fresh content.
export interface Post {
  slug: string;
  title: string;
  date: string; // ISO
  dateLabel: string;
  excerpt: string;
  tags: string[];
  body: string; // simple markdown: blank line = paragraph, "## " = heading
}

export const POSTS: Post[] = [
  {
    slug: "pas-9970-bsi-consultation-fire-safety-construction",
    title:
      "Contributing to the BSI consultation on PAS 9970: fire safety during construction",
    date: "2026-06-07",
    dateLabel: "June 2026",
    excerpt:
      "We were pleased to contribute practical, site-based feedback to the BSI public consultation on PAS 9970-1 and PAS 9970-2 — two new standards addressing fire safety during the construction phase.",
    tags: ["Fire safety", "Construction", "Standards", "PAS 9970"],
    body: `I recently contributed comments to the BSI public consultation on **PAS 9970-1** and **PAS 9970-2** — two new standards focused on fire safety during construction.

## What the standards cover

Between them, the two parts address two sides of the same challenge. One part looks at how fire safety is organised and managed on site overall; the other sets out clearer expectations for the temporary fire detection and alarm systems used during the construction phase.

## Why construction-phase fire safety is different

Construction sites are genuinely difficult when it comes to fire risk. Everything keeps changing — the layout, the number of people on site, and the materials being stored and used. That means fire safety cannot be a one-off plan written at the start and then filed away. It has to stay flexible and be properly coordinated as the project moves forward, with arrangements that keep pace with the work.

## Sharing practical, on-site feedback

It was genuinely useful to review the drafts and share feedback grounded in what actually works — and what does not — on live projects. Standards like these help the whole industry manage these risks in a more consistent, joined-up way, rather than every project reinventing its own approach. I am looking forward to seeing how the final versions develop following the consultation.

## How we help on construction projects

At Lion Risk Management Solutions we support developers, principal contractors and project teams with construction-phase fire safety — including fire strategies, RAMS and construction phase plans, and practical site fire safety arrangements. If you would like to discuss fire safety on a current or upcoming project, get in touch.`,
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
