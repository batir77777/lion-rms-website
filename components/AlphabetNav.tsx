import Link from "next/link";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// A–Z jump navigation for the Glossary index (Phase 5A, PR 4).
//
// Three decisions here are what separate a usable A–Z from a decorative one.
//
// 1. Letters with no terms render as PLAIN TEXT, not disabled links. A link
//    that scrolls nowhere is worse than no link, and `aria-disabled` on an
//    anchor is widely mishandled by assistive technology. With twelve terms,
//    seventeen of twenty-six letters are inactive, so this is the majority
//    case rather than an edge case.
//
// 2. Each active letter has a real accessible name — "Jump to terms beginning
//    with C" — because a link list announced as "A B C D" carries no
//    information at all.
//
// 3. Focus, not just scroll. The target heading carries tabindex={-1} and is
//    focused on activation (see the index page), so a keyboard or screen-reader
//    user lands inside the section rather than having the viewport move
//    underneath an unchanged focus point. That is the single most common
//    failure in this pattern and it is invisible to a sighted mouse user.
//
// Deliberately plain anchors with native keyboard behaviour — no roving
// tabindex, no arrow-key interception, no custom widget semantics. None of it
// is warranted for a list of links and each would be a new failure mode.
export default function AlphabetNav({ activeLetters }: { activeLetters: string[] }) {
  const active = new Set(activeLetters);

  return (
    <nav aria-label="Jump to letter" className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
      <ol className="flex flex-wrap justify-center gap-1">
        {ALPHABET.map((letter) => {
          const isActive = active.has(letter);
          return (
            <li key={letter} aria-hidden={isActive ? undefined : true}>
              {isActive ? (
                <Link
                  href={`#letter-${letter.toLowerCase()}`}
                  aria-label={`Jump to terms beginning with ${letter}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-teal-700 transition hover:bg-teal-50 hover:text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  {letter}
                </Link>
              ) : (
                // slate-500, not slate-400: this sits on slate-50 and the
                // lighter token measures 2.45:1 there. Inactive letters are
                // still visible text and still have to meet AA.
                <span className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium text-slate-500">
                  {letter}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
