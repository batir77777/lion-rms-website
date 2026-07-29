import Image from "next/image";
import Link from "next/link";
import GlossaryLink from "@/components/GlossaryLink";
import StandardLink from "@/components/StandardLink";
import * as jsxRuntime from "react/jsx-runtime";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

// ---------------------------------------------------------------------------
// Shared renderer for Velite-compiled MDX bodies (Phase 5A, PR 3).
//
// Velite's `s.mdx()` does not emit HTML or a React element — it emits a
// JavaScript function-body string that destructures a JSX runtime from its
// first argument and returns `{ default: Component }`. Rendering therefore
// means evaluating that string.
//
// SECURITY BOUNDARY — read before changing this file.
// This component is a React Server Component (no "use client"), and every page
// that uses it is statically generated. The evaluation below therefore happens
// at BUILD TIME, in Node, against MDX that reached the repository through a
// reviewed pull request. Nothing is evaluated in a reader's browser, no
// `unsafe-eval` Content Security Policy allowance is required, and the input is
// never user-supplied. Moving this evaluation to the client — for example by
// adding "use client" here — would break all three of those properties.
//
// The component map below is the single enforcement point for the content
// conventions the Knowledge Centre depends on: heading styles that keep the
// document outline intact, semantic tables with scoped headers, images that
// must carry alt text, and links that mark external destinations. Enforcing
// them structurally here means every guide gets them, rather than each author
// remembering. It also exposes GlossaryLink for explicit, author-triggered
// glossary links; automatic first-mention linking was deliberately NOT built —
// see components/GlossaryLink.tsx for why.
//
// Reused unchanged by News, Standards, Legislation, Glossary and Downloads.
// ---------------------------------------------------------------------------

type MDXComponent = (props: { components?: Record<string, unknown> }) => ReactNode;

// Compiling the same body twice is pure waste during a static build, and the
// code string is a perfectly good cache key.
const compiled = new Map<string, MDXComponent>();

function compile(code: string): MDXComponent {
  const cached = compiled.get(code);
  if (cached) return cached;

  // The runtime is passed explicitly rather than being resolved by the
  // compiled output itself. Velite compiles with `development: false`, so the
  // body expects the production runtime (`jsx`/`jsxs`/`Fragment`); pinning it
  // here stops dev and production diverging on an ambient NODE_ENV read.
  const factory = new Function(code) as (
    runtime: typeof jsxRuntime
  ) => { default: MDXComponent };

  const Component = factory(jsxRuntime).default;
  compiled.set(code, Component);
  return Component;
}

function isExternal(href: string | undefined): boolean {
  if (!href) return false;
  return /^https?:\/\//i.test(href);
}

const components: Record<string, unknown> = {
  // Available to every MDX body. Explicit, author-triggered linking to the
  // Glossary and the Standards library — deliberately not automatic
  // first-mention replacement, for the reasons in components/GlossaryLink.tsx
  // and components/StandardLink.tsx.
  GlossaryLink,
  StandardLink,

  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 {...props} className="mt-10 scroll-mt-28 text-2xl font-bold text-navy-900" />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 {...props} className="mt-8 scroll-mt-28 text-xl font-bold text-navy-900" />
  ),
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <h4 {...props} className="mt-6 scroll-mt-28 text-lg font-semibold text-navy-900" />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p {...props} className="mt-5 text-lg leading-relaxed text-slate-600" />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul {...props} className="mt-5 list-disc space-y-2 pl-6 text-lg leading-relaxed text-slate-600" />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol {...props} className="mt-5 list-decimal space-y-2 pl-6 text-lg leading-relaxed text-slate-600" />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => <li {...props} className="pl-1" />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong {...props} className="font-semibold text-navy-900" />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      {...props}
      className="mt-6 border-l-4 border-teal-200 bg-teal-50/40 py-3 pl-5 text-lg italic leading-relaxed text-slate-700"
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr {...props} className="mt-10 border-slate-200" />
  ),

  // Real semantic table markup. MDX emits <th> without a scope attribute; a
  // header cell without one is ambiguous to assistive technology, so it is
  // added here rather than left to the author.
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="mt-6 overflow-x-auto">
      <table {...props} className="w-full border-collapse text-left text-base text-slate-600" />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      scope="col"
      {...props}
      className="border-b border-slate-200 px-3 py-2 font-semibold text-navy-900"
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td {...props} className="border-b border-slate-100 px-3 py-2 align-top" />
  ),

  a: ({ href, children, ...rest }: ComponentPropsWithoutRef<"a">) => {
    const className = "font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800";
    if (isExternal(href)) {
      return (
        <a
          href={href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {children}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    }
    return (
      <Link href={href ?? "#"} className={className} {...rest}>
        {children}
      </Link>
    );
  },

  // `alt` is a mandatory schema field for featured images and a mandatory MDX
  // authoring convention for inline ones; rendering through next/image keeps
  // sizing and format handling consistent with the rest of the site.
  img: ({ src, alt, ...rest }: ComponentPropsWithoutRef<"img">) => (
    <Image
      src={typeof src === "string" ? src : ""}
      alt={alt ?? ""}
      width={1200}
      height={675}
      className="mt-6 h-auto w-full rounded-xl"
      {...(rest as Record<string, unknown>)}
    />
  ),
};

export default function MDXContent({ code }: { code: string }) {
  const Component = compile(code);
  return <Component components={components} />;
}
