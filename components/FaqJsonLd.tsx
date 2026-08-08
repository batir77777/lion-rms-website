import { FAQS } from "@/lib/site";
import { buildFaqPageSchema } from "@/lib/content-jsonld";

/*
 * FAQPage JSON-LD, built from the same FAQS array the page renders, so the
 * structured data and the visible answers cannot diverge. Object construction
 * moved to lib/content-jsonld.ts in Phase 5A PR 10; the emitted JSON is
 * unchanged.
 */
export default function FaqJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqPageSchema(FAQS)) }}
    />
  );
}
