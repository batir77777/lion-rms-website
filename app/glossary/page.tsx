import type { Metadata } from "next";
import PhotoHero from "@/components/PhotoHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import KnowledgeCentreNav from "@/components/KnowledgeCentreNav";
import AlphabetNav from "@/components/AlphabetNav";
import GlossaryEntry from "@/components/GlossaryEntry";
import {
  publishedTerms,
  letterGroups,
  activeLetters,
  displayTerm,
  alternateNames,
  GLOSSARY_PATH,
  GLOSSARY_INDEX_CRUMBS,
} from "@/lib/glossary";
import { buildDefinedTermSetSchema, DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

const TITLE = "Fire safety and health & safety glossary";
const DESCRIPTION =
  "Plain-English definitions of the fire safety and health & safety terms that appear in risk assessments, inspection reports and compliance correspondence.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: GLOSSARY_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: GLOSSARY_PATH,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function GlossaryPage() {
  const terms = publishedTerms();
  const groups = letterGroups().filter((g) => g.terms.length > 0);

  const jsonLd = buildDefinedTermSetSchema({
    name: "Lion RMS fire safety and health & safety glossary",
    description: DESCRIPTION,
    path: GLOSSARY_PATH,
    terms: terms.map((t) => ({
      name: displayTerm(t),
      description: t.shortDefinition,
      path: `${GLOSSARY_PATH}/${t.slug}`,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd items={GLOSSARY_INDEX_CRUMBS} />

      <PhotoHero
        eyebrow="Knowledge Centre"
        title="Glossary"
        body="Plain-English definitions of the fire safety and health &amp; safety terms that turn up in risk assessments, inspection reports and compliance correspondence."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <div className="mb-8">
            <Breadcrumbs items={GLOSSARY_INDEX_CRUMBS} />
          </div>

          <KnowledgeCentreNav current={GLOSSARY_PATH} />

          {terms.length === 0 ? (
            <p className="text-lg text-slate-600">No glossary terms have been published yet.</p>
          ) : (
            <>
              <p className="mb-8 text-base text-slate-600">
                {terms.length} {terms.length === 1 ? "term" : "terms"}, listed A–Z.
              </p>

              <AlphabetNav activeLetters={activeLetters()} />

              <div className="mt-12 space-y-14">
                {groups.map((group) => (
                  <section key={group.letter} aria-labelledby={`letter-${group.letter.toLowerCase()}`}>
                    {/*
                      tabindex={-1} is what makes the A–Z navigation actually
                      work for keyboard and screen-reader users: activating a
                      letter link moves focus into this heading rather than
                      only moving the viewport, so the next Tab continues from
                      where the reader expects. scroll-mt clears the fixed
                      header.
                    */}
                    <h2
                      id={`letter-${group.letter.toLowerCase()}`}
                      tabIndex={-1}
                      className="scroll-mt-28 border-b border-slate-200 pb-3 text-3xl font-extrabold text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
                    >
                      {group.letter}
                    </h2>

                    <dl className="mt-2">
                      {group.terms.map((term) => (
                        <GlossaryEntry
                          key={term.slug}
                          slug={term.slug}
                          term={displayTerm(term)}
                          shortDefinition={term.shortDefinition}
                          alternateNames={alternateNames(term)}
                        />
                      ))}
                    </dl>
                  </section>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
