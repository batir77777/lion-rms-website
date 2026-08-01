/*
 * Pagefind's runtime bundle is generated after `next build`, from the HTML that
 * build produces, and served from /pagefind/. It therefore does not exist at
 * type-check time and has no package to resolve types from — the import in
 * components/SiteSearch.tsx is a runtime URL, not a module specifier.
 *
 * This declaration exists so TypeScript stops trying to resolve it. It is
 * deliberately `unknown`: the component casts the import to the narrow
 * interface it actually uses, so the shape it relies on is stated where it is
 * used rather than asserted globally against a library we do not control.
 */
declare module "*/pagefind.js" {
  const pagefind: unknown;
  export default pagefind;
}
