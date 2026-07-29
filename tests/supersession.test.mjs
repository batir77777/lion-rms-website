// Supersession resolution (Phase 5A, PR 5).
//
// Pure logic over plain objects — no Velite build, no routes. The cases that
// matter here are the malformed ones: a dangling successor, a self-reference
// and a cycle all have to be survivable, because this code runs during a page
// render where throwing would take the whole build down with a stack trace
// instead of a useful message.

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  successorsOf,
  predecessorsOf,
  currentReplacementsFor,
  hasSupersessionCycle,
} from "../lib/supersession";

const doc = (slug, supersededBy = []) => ({ slug, supersededBy });

describe("Supersession — successors and predecessors", () => {
  test("resolves a declared successor", () => {
    const a = doc("a", ["b"]);
    const b = doc("b");
    assert.deepEqual(successorsOf(a, [a, b]).map((d) => d.slug), ["b"]);
  });

  test("resolves one-to-many supersession", () => {
    // PAS 79:2012 was replaced by TWO documents. This is why supersededBy is
    // an array rather than a string.
    const original = doc("pas-79", ["pas-79-1", "pas-79-2"]);
    const one = doc("pas-79-1");
    const two = doc("pas-79-2");
    assert.deepEqual(
      successorsOf(original, [original, one, two]).map((d) => d.slug),
      ["pas-79-1", "pas-79-2"]
    );
  });

  test("derives the inverse without it ever being authored", () => {
    const a = doc("a", ["b"]);
    const b = doc("b");
    assert.deepEqual(predecessorsOf(b, [a, b]).map((d) => d.slug), ["a"]);
    // And the successor declares nothing itself.
    assert.deepEqual(b.supersededBy, []);
  });

  test("derives multiple predecessors where two documents were merged", () => {
    const a = doc("a", ["c"]);
    const b = doc("b", ["c"]);
    const c = doc("c");
    assert.deepEqual(predecessorsOf(c, [a, b, c]).map((d) => d.slug), ["a", "b"]);
  });

  test("a dangling successor slug degrades to nothing rather than throwing", () => {
    // Rule G2 reports this as a build error, so it cannot reach a render. The
    // accessor still has to survive it: a throw here would be a far worse
    // failure than a missing link.
    const a = doc("a", ["does-not-exist"]);
    assert.deepEqual(successorsOf(a, [a]), []);
  });

  test("a self-reference is dropped rather than returned", () => {
    const a = doc("a", ["a"]);
    assert.deepEqual(successorsOf(a, [a]), []);
  });

  test("predecessors never include the item itself", () => {
    const a = doc("a", ["a"]);
    assert.deepEqual(predecessorsOf(a, [a]), []);
  });
});

describe("Supersession — chain following", () => {
  test("follows a two-hop chain to the document that actually applies now", () => {
    // A reader arriving at a twice-replaced document needs the document that
    // stands today, not the intermediate one that also no longer stands.
    const a = doc("a", ["b"]);
    const b = doc("b", ["c"]);
    const c = doc("c");
    assert.deepEqual(currentReplacementsFor(a, [a, b, c]).map((d) => d.slug), ["c"]);
  });

  test("returns nothing for a document that has not been superseded", () => {
    const a = doc("a");
    assert.deepEqual(currentReplacementsFor(a, [a]), []);
  });

  test("returns every terminal document where a chain branches", () => {
    const a = doc("a", ["b"]);
    const b = doc("b", ["c", "d"]);
    const c = doc("c");
    const d = doc("d");
    const result = currentReplacementsFor(a, [a, b, c, d]).map((x) => x.slug).sort();
    assert.deepEqual(result, ["c", "d"]);
  });

  test("terminates on a cycle instead of looping for ever", () => {
    const a = doc("a", ["b"]);
    const b = doc("b", ["a"]);
    // The assertion that matters is that this returns at all.
    assert.doesNotThrow(() => currentReplacementsFor(a, [a, b]));
  });
});

describe("Supersession — cycle detection", () => {
  test("detects a direct two-document cycle", () => {
    const a = doc("a", ["b"]);
    const b = doc("b", ["a"]);
    assert.equal(hasSupersessionCycle(a, [a, b]), true);
    assert.equal(hasSupersessionCycle(b, [a, b]), true);
  });

  test("detects a longer cycle", () => {
    const a = doc("a", ["b"]);
    const b = doc("b", ["c"]);
    const c = doc("c", ["a"]);
    assert.equal(hasSupersessionCycle(a, [a, b, c]), true);
  });

  test("detects self-supersession", () => {
    const a = doc("a", ["a"]);
    assert.equal(hasSupersessionCycle(a, [a]), true);
  });

  test("a legitimate linear chain is not a cycle", () => {
    const a = doc("a", ["b"]);
    const b = doc("b", ["c"]);
    const c = doc("c");
    assert.equal(hasSupersessionCycle(a, [a, b, c]), false);
  });

  test("a shared successor is not a cycle", () => {
    const a = doc("a", ["c"]);
    const b = doc("b", ["c"]);
    const c = doc("c");
    assert.equal(hasSupersessionCycle(a, [a, b, c]), false);
  });
});
