"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
// From lib/knowledge-sections, NOT lib/knowledge: the latter imports every
// content accessor and would ship the whole Velite corpus to the browser.
import { KNOWLEDGE_PATH, SEARCH_PATH, sectionLabelForPath } from "@/lib/knowledge-sections";

/*
 * Knowledge Centre search (Phase 5A, PR 9).
 *
 * Built directly against the Pagefind JavaScript API rather than Pagefind UI.
 * Pagefind UI is 120 KB of JavaScript and 14 KB of CSS that renders a widget
 * we would then have to fight: it ships its own markup, its own focus
 * behaviour and its own styling, none of which match the rest of the site. The
 * API is the same search engine without any of that, and the result markup
 * below is a search form and a list of links — which is what search results
 * are.
 *
 * ---------------------------------------------------------------------------
 * Why there is no ARIA combobox here
 * ---------------------------------------------------------------------------
 * The obvious reading of "search box with results" is role="combobox" with
 * aria-autocomplete and aria-activedescendant. It is the wrong pattern. A
 * combobox is for choosing a VALUE to put in the field; these results are
 * destinations, and choosing one navigates away. Marking them up as options
 * makes a screen reader announce "listbox, 12 options" and offer arrow-key
 * selection that fills the input, which is not what pressing Enter does.
 *
 * So this is a plain search landmark containing a labelled input, and a list
 * of links below it. Everything is in the normal tab order and behaves the way
 * it looks. Two live regions carry what a sighted user gets from watching the
 * page: one announces the result count, the other announces the empty state.
 *
 * ---------------------------------------------------------------------------
 * Loading
 * ---------------------------------------------------------------------------
 * /pagefind/pagefind.js does not exist when Next.js builds — it is generated
 * afterwards, from the very HTML that build produces. The webpackIgnore
 * comment is therefore mandatory, not an optimisation: without it the bundler
 * tries to resolve the path at build time and fails.
 *
 * The import is also deferred until the reader shows intent (focusing or
 * typing in the field), so arriving at /knowledge does not download the search
 * engine, its WebAssembly and its index chunks for a visitor who came to read
 * the guides.
 */

interface PagefindResultData {
  url: string;
  excerpt: string;
  meta?: { title?: string };
}

interface PagefindModule {
  init: () => Promise<void>;
  debouncedSearch: (
    term: string,
    options?: unknown,
    debounceMs?: number
  ) => Promise<{ results: { id: string; data: () => Promise<PagefindResultData> }[] } | null>;
}

interface Result {
  url: string;
  title: string;
  excerpt: string;
  sectionLabel?: string;
}

type Status = "idle" | "loading" | "ready" | "searching" | "unavailable";

/*
 * Pagefind escapes the indexed content and then inserts <mark> around the
 * matched terms. We still strip anything that is not a <mark> before it
 * reaches dangerouslySetInnerHTML: the excerpt is machine-generated from our
 * own pages, so this should never do anything — which is exactly why it is
 * cheap to keep. Escaping the string wholesale instead would double-escape
 * Pagefind's own entities and show "&amp;" to the reader.
 */
const markOnly = (excerpt: string) => excerpt.replace(/<(?!\/?mark\s*\/?>)[^>]*>/gi, "");

/* Pagefind indexes directory URLs ("/guides/foo/"); the site's canonical
   routes have no trailing slash. Normalise once, here. */
const canonicalPath = (url: string) => {
  const path = url.split(/[?#]/)[0].replace(/\/$/, "");
  return path === "" ? "/" : path;
};

export default function SiteSearch({
  variant = "full",
  compactLimit = 5,
}: {
  variant?: "full" | "compact";
  compactLimit?: number;
}) {
  const isCompact = variant === "compact";
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [searched, setSearched] = useState(false);
  const pagefind = useRef<PagefindModule | null>(null);
  const requestId = useRef(0);
  const initialised = useRef(false);
  /* The single in-flight load. See the note in `load` below. */
  const loading = useRef<Promise<PagefindModule | null> | null>(null);

  /*
   * THE DEFECT THIS SHAPE EXISTS TO PREVENT.
   *
   * This used to guard on `status`:
   *
   *     if (pagefind.current || status === "loading" || ...) return pagefind.current;
   *
   * which returns NULL while a load is in flight — and `run` below then did
   * `if (!engine) return;`, abandoning the search without setting any state
   * and without scheduling a retry.
   *
   * Focusing the field starts the load. So anyone who typed a query and
   * submitted it before the engine had finished loading got nothing at all:
   * no results, no empty state, and an empty live region, while the separate
   * ?q= effect updated the address bar regardless. That is why it looked like
   * "Enter does not work but the button does" — Enter arrives during the load
   * window, whereas moving the mouse to the button takes long enough that the
   * load has usually settled. Both controls always shared one submit handler;
   * the key was never the variable.
   *
   * Now every caller awaits the SAME promise, so a search issued mid-load
   * resolves against the engine the moment it is ready. The promise is held in
   * a ref rather than derived from `status`, because state is asynchronous and
   * two calls in one tick would both read the stale value.
   */
  const load = useCallback((): Promise<PagefindModule | null> => {
    if (pagefind.current) return Promise.resolve(pagefind.current);
    if (status === "unavailable") return Promise.resolve(null);
    if (loading.current) return loading.current;

    setStatus("loading");
    loading.current = (async () => {
      try {
        const engine = (await import(
          /* webpackIgnore: true */ "/pagefind/pagefind.js"
        )) as unknown as PagefindModule;
        await engine.init();
        pagefind.current = engine;
        setStatus("ready");
        return engine;
      } catch {
        /* The index is absent in `next dev`, where nothing has run the build
           step. Say so plainly rather than leaving a field that silently does
           nothing. */
        setStatus("unavailable");
        /* Cleared so a later attempt can retry rather than being permanently
           bound to a rejected load. */
        loading.current = null;
        return null;
      }
    })();
    return loading.current;
  }, [status]);

  const run = useCallback(
    async (term: string) => {
      const id = ++requestId.current;
      if (!term.trim()) {
        setResults([]);
        setTotal(0);
        setSearched(false);
        return;
      }
      const engine = pagefind.current ?? (await load());
      if (!engine) return;

      setStatus("searching");
      const search = await engine.debouncedSearch(term, undefined, 200);
      /* debouncedSearch resolves null when a later keystroke has superseded
         this one. The id check covers the same race across an awaited load. */
      if (search === null || id !== requestId.current) return;

      const limit = isCompact ? compactLimit : 40;
      const data = await Promise.all(search.results.slice(0, limit).map((r) => r.data()));
      if (id !== requestId.current) return;

      setResults(
        data.map((d) => {
          const path = canonicalPath(d.url);
          return {
            url: path,
            title: d.meta?.title ?? path,
            excerpt: markOnly(d.excerpt),
            sectionLabel: sectionLabelForPath(path),
          };
        })
      );
      setTotal(search.results.length);
      setSearched(true);
      setStatus("ready");
    },
    [compactLimit, isCompact, load]
  );

  /*
   * ?q= is read on the client, not from the server's searchParams.
   *
   * Reading searchParams in the page component would opt /search into dynamic
   * rendering: it would stop being prerendered, would not appear in
   * .next/server/app, and would be served from a function on every request for
   * a page whose entire job is done in the browser. Reading it here keeps the
   * route fully static and still lets a result set be linked to.
   */
  useEffect(() => {
    if (isCompact || typeof window === "undefined") {
      initialised.current = true;
      return;
    }
    const seed = new URLSearchParams(window.location.search).get("q") ?? "";
    if (seed.trim()) {
      setQuery(seed);
      void run(seed);
    }
    initialised.current = true;
    // Runs once, to seed the field from the address bar on first paint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Keep ?q= in step with the field, so a result set can be linked to or
     reloaded. replaceState rather than a router push: this is not a
     navigation, and one history entry per keystroke would break the back
     button. Gated on `initialised` so the first paint cannot strip the very
     parameter the effect above is about to read. */
  useEffect(() => {
    if (isCompact || typeof window === "undefined" || !initialised.current) return;
    const url = new URL(window.location.href);
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }, [query, isCompact]);

  const onChange = (value: string) => {
    setQuery(value);
    void run(value);
  };

  const showing = results.length;
  const hasMore = total > showing;

  /*
   * Busy means: the reader has asked for something and we are either still
   * fetching the index or still searching it. Before the load race was fixed
   * this window produced silence — no results, no empty state and an empty
   * live region — so a screen-reader user had no way to tell a slow search
   * from a broken one. It is announced, and it clears the moment results or
   * the empty state are ready, because `status` leaves these two values then.
   */
  const busy = query.trim() !== "" && (status === "loading" || status === "searching");

  const countMessage = !searched
    ? ""
    : total === 0
      ? `No results for ${query.trim()}.`
      : `${total} ${total === 1 ? "result" : "results"} for ${query.trim()}${
          hasMore ? `, showing the first ${showing}` : ""
        }.`;

  /* One region, one message at a time. Announcing a stale count underneath a
     "Searching…" would be worse than saying nothing. */
  const liveMessage = busy ? "Searching…" : countMessage;

  return (
    <div className={isCompact ? "" : "mt-2"}>
      {/*
        role="search" on the form rather than a wrapping <section>: it is the
        form that is the search landmark. Labelled, because /search and
        /knowledge both contain more than one landmark.
      */}
      <form
        role="search"
        aria-label="Search the Knowledge Centre"
        onSubmit={(e) => {
          e.preventDefault();
          void run(query);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <div className="flex-1">
          <label htmlFor={inputId} className={isCompact ? "sr-only" : "block text-sm font-semibold text-navy-900"}>
            Search guides, glossary, standards, legislation, news and downloads
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => void load()}
            autoComplete="off"
            spellCheck={false}
            placeholder="e.g. flat entrance doors"
            className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-navy-900 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
              isCompact ? "" : "mt-2"
            }`}
          />
        </div>
        {/*
          A submit button for a field that already searches as you type looks
          redundant, but it is not: it is the only affordance for anyone whose
          input method does not fire per-keystroke events, and pressing Enter
          in a form with no submit control is inconsistent across browsers.
        */}
        <button
          type="submit"
          className={`rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
            isCompact ? "" : "mt-2 sm:mt-[2.1rem]"
          }`}
        >
          Search
        </button>
      </form>

      {/*
        Two live regions, not one. The count is polite — it updates on every
        keystroke and must not interrupt. The unavailable state is a different
        kind of message: it is a failure, it happens once, and it is announced
        through its own region so it cannot be swallowed by a count update
        arriving in the same tick.
      */}
      <p aria-live="polite" className="sr-only">
        {liveMessage}
      </p>
      <p aria-live="assertive" className="sr-only">
        {status === "unavailable" ? "Search is unavailable on this page." : ""}
      </p>

      {/*
        The visible counterpart, aria-hidden because the region above already
        announces it — rendering both to assistive technology would say
        "Searching…" twice. Plain text rather than a spinner: it needs no
        dependency, no animation, and it survives reduced-motion settings.
      */}
      {busy && (
        <p className="mt-6 text-sm font-semibold text-slate-500" aria-hidden>
          Searching…
        </p>
      )}

      {status === "unavailable" && (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Search is not available at the moment. You can still browse every section from{" "}
          <Link href={KNOWLEDGE_PATH} className="font-semibold underline">
            the Knowledge Centre
          </Link>
          .
        </p>
      )}

      {searched && total === 0 && status !== "unavailable" && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-base font-semibold text-navy-900">
            No results for &ldquo;{query.trim()}&rdquo;
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Search covers the full text of every guide, glossary term, standard, instrument, news
            item and download. Try a shorter phrase, or a term as it would appear in a report —
            &ldquo;compartmentation&rdquo; rather than &ldquo;fire spread between flats&rdquo;.
          </p>
        </div>
      )}

      {searched && total > 0 && (
        <div className="mt-8">
          <p className="text-sm font-semibold text-slate-500" aria-hidden>
            {total} {total === 1 ? "result" : "results"}
            {hasMore ? ` — showing the first ${showing}` : ""}
          </p>

          <ul className="mt-4 divide-y divide-slate-100">
            {results.map((result) => (
              <li key={result.url} className="py-5">
                <Link
                  href={result.url}
                  className="group block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  {result.sectionLabel && (
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
                      {result.sectionLabel}
                    </span>
                  )}
                  <span className="mt-1 block text-lg font-bold text-navy-900 group-hover:text-teal-700">
                    {result.title}
                  </span>
                  {/*
                    The excerpt carries Pagefind's <mark> around matched terms.
                    Emphasis is not the only signal — the term is also in the
                    reader's own query — so a highlight that does not render
                    loses nothing.
                  */}
                  <span
                    className="mt-1.5 block text-sm leading-relaxed text-slate-600 [&_mark]:bg-teal-50 [&_mark]:font-semibold [&_mark]:text-navy-900"
                    dangerouslySetInnerHTML={{ __html: result.excerpt }}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {isCompact && hasMore && (
            <p className="mt-4 text-sm">
              <Link
                href={`${SEARCH_PATH}?q=${encodeURIComponent(query.trim())}`}
                className="font-semibold text-teal-700 hover:underline"
              >
                See all {total} results
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
