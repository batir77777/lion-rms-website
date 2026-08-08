// The Pagefind load race, and the busy state that used to be silence.
//
// THE DEFECT. Focusing the search field starts the Pagefind index load. The
// old `load()` guarded on React state:
//
//     if (pagefind.current || status === "loading" || ...) return pagefind.current;
//
// which returns NULL while a load is in flight. `run()` then did
// `if (!engine) return;` — abandoning the search with no state change and no
// retry. Anyone who typed a query and submitted it before the index finished
// loading got nothing: no results, no empty state, an empty live region, and
// an address bar that updated anyway because the ?q= effect is independent.
//
// It was reported as "Enter does not work but the Search button does". That
// framing is wrong and the wrong fix follows from it: both controls have
// always shared one `onSubmit` handler. Enter simply arrives during the load
// window; moving a mouse to the button takes long enough that the load has
// usually settled. Reproduced on production before the fix — focus, type,
// Enter in one tick gave 0 results and never recovered; clicking Search
// afterwards gave 31.
//
// These assertions read the component source rather than mounting it. There is
// no DOM test harness in this repo, and the properties that matter here are
// structural: that concurrent callers share one promise, that no caller can
// receive null while a load is in flight, and that both controls submit
// through the same handler. A mounted test would assert the same three things
// more slowly and less directly.

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(repoRoot, "components/SiteSearch.tsx"), "utf8");

/* Comments in this file describe the defect at length; matching against them
   would let a description of the bug satisfy a test for its absence. */
const stripComments = (s) =>
  s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const code = stripComments(source);

const loadFn = () => {
  const start = code.indexOf("const load = useCallback(");
  assert.ok(start > 0, "load() not found");
  const end = code.indexOf("const run = useCallback(", start);
  assert.ok(end > start, "run() not found after load()");
  return code.slice(start, end);
};

describe("Concurrent searches share one in-flight index load", () => {
  test("the in-flight load is held in a ref, not derived from React state", () => {
    // State is asynchronous: two calls in the same tick would both read the
    // stale value, which is exactly how the original guard failed.
    assert.match(
      code,
      /const loading = useRef<Promise<PagefindModule \| null> \| null>\(null\)/,
      "there is no ref holding the in-flight load promise"
    );
  });

  test("a second caller returns the same promise rather than null", () => {
    const fn = loadFn();
    assert.match(fn, /if \(loading\.current\) return loading\.current;/,
      "load() does not return the in-flight promise to a concurrent caller");
  });

  test("load() never returns null merely because a load is in progress", () => {
    // The precise regression. `status === "loading"` must not be a reason to
    // hand back an absent engine.
    const fn = loadFn();
    assert.equal(
      /status === "loading"/.test(fn),
      false,
      'load() still short-circuits on status === "loading" — the original defect'
    );
  });

  test("the only null returns are the genuinely engine-less cases", () => {
    const fn = loadFn();
    // "unavailable" (the index is absent, as in `next dev`) and a failed
    // import are legitimate nulls; a pending load is not.
    assert.match(fn, /if \(status === "unavailable"\) return Promise\.resolve\(null\)/);
    assert.match(fn, /loading\.current = null;/, "a failed load must clear the ref so a retry is possible");
  });

  test("run() awaits the load rather than testing a snapshot of it", () => {
    assert.match(
      code,
      /const engine = pagefind\.current \?\? \(await load\(\)\)/,
      "run() no longer awaits load()"
    );
  });
});

describe("Enter and the Search button are one path", () => {
  test("there is exactly one submit handler and no key handler", () => {
    assert.equal((code.match(/onSubmit=\{/g) ?? []).length, 1, "expected exactly one onSubmit");
    assert.equal(
      /onKeyDown|onKeyUp|onKeyPress|key === "Enter"/.test(code),
      false,
      "a key handler was added — Enter and the button must stay on the same submit path"
    );
  });

  test("the button submits the form rather than carrying its own onClick", () => {
    assert.match(code, /type="submit"/);
    const buttonBlock = code.slice(code.indexOf("<button"), code.indexOf("</button>"));
    assert.equal(/onClick/.test(buttonBlock), false, "the Search button has its own click handler");
  });

  test("the submit handler runs the current query and suppresses navigation", () => {
    const submit = code.slice(code.indexOf("onSubmit={"), code.indexOf("className=\"flex flex-col"));
    assert.match(submit, /e\.preventDefault\(\)/);
    assert.match(submit, /void run\(query\)/);
  });
});

describe("The wait is announced instead of being silence", () => {
  test("a busy state exists and covers both loading and searching", () => {
    assert.match(
      code,
      /const busy =[\s\S]{0,120}status === "loading"[\s\S]{0,40}status === "searching"/,
      "no busy state spanning the load and the search"
    );
  });

  test("busy is false when the field is empty", () => {
    // Otherwise arriving at /knowledge would announce "Searching…" at rest.
    assert.match(code, /const busy = query\.trim\(\) !== ""/);
  });

  test("the polite live region announces the wait, then the count", () => {
    assert.match(code, /const liveMessage = busy \? "Searching…" : countMessage;/);
    assert.match(code, /aria-live="polite"[\s\S]{0,80}\{liveMessage\}/);
  });

  test("the visible indicator is hidden from assistive technology", () => {
    // The live region already announces it; rendering both would say
    // "Searching…" twice.
    assert.match(code, /\{busy && \([\s\S]{0,300}aria-hidden[\s\S]{0,120}Searching…/);
  });

  test("no spinner library or animation dependency was introduced", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const name of Object.keys(deps)) {
      assert.equal(
        /spinner|loader|react-loading|nprogress/i.test(name),
        false,
        `a loading dependency was added: ${name}`
      );
    }
    assert.equal(/animate-spin/.test(code), false, "an animated spinner was added");
  });

  test("the unavailable state keeps its own assertive region", () => {
    // A failure is a different kind of message from a count and must not be
    // swallowed by one arriving in the same tick.
    assert.match(code, /aria-live="assertive"[\s\S]{0,140}Search is unavailable on this page/);
  });
});
