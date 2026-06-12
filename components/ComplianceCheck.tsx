"use client";

// Compliance self-check: 10 yes/no questions across fire and H&S duties.
// Red/amber/green score with a plain-English, FACTUAL explanation of exposure
// — the legal consequences stated are real features of the RRO 2005 and HSWA
// 1974 (s.33/s.37), not scaremongering. Email capture is optional and never
// required to see the score.

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/lib/site";

const QUESTIONS = [
  {
    q: "Do you have a current fire risk assessment, reviewed within the last 12 months?",
    why: "The Fire Safety Order requires a suitable and sufficient FRA, kept up to date.",
  },
  {
    q: "Have the significant findings from your last FRA been actioned?",
    why: "An unactioned FRA is one of the most common grounds for enforcement.",
  },
  {
    q: "Are your fire doors inspected on a regular schedule?",
    why: "Fire doors are a legal focus area — flat entrance doors and common-part doors in residential blocks have explicit checking duties.",
  },
  {
    q: "Is your fire alarm tested weekly, with the result recorded (BS 5839-1)?",
    why: "BS 5839-1 recommends a weekly user test from a different call point in rotation.",
  },
  {
    q: "Is your emergency lighting tested on schedule (BS 5266-1)?",
    why: "BS 5266-1 sets out monthly function tests and annual full-duration tests.",
  },
  {
    q: "Do you have a written health & safety risk assessment in place?",
    why: "Required for employers with 5+ employees; expected practice for any duty holder.",
  },
  {
    q: "Do contractors working on your premises provide RAMS you actually review?",
    why: "Duty holders must coordinate with contractors — unmanaged contractor work is a common cause of incidents and liability.",
  },
  {
    q: "Do you keep an accident book and know your RIDDOR reporting duties?",
    why: "Certain injuries, diseases and dangerous occurrences are legally reportable.",
  },
  {
    q: "Are fire and H&S training records kept for your staff?",
    why: "Training is a legal requirement — and the record is your evidence it happened.",
  },
  {
    q: "Could you retrieve all your compliance records from one place within an hour?",
    why: "When an inspector or insurer asks, scattered records read as unmanaged risk.",
  },
];

type Answer = boolean | null;

function scoreBand(yesCount: number): {
  band: "green" | "amber" | "red";
  title: string;
  body: string;
} {
  if (yesCount >= 9)
    return {
      band: "green",
      title: "Green — well managed",
      body:
        "On your answers, your fire and H&S duties look well managed. Keep your review dates in the diary, and consider whether one synced system for records would save you time at audit or renewal.",
    };
  if (yesCount >= 6)
    return {
      band: "amber",
      title: "Amber — gaps to close",
      body:
        "You have a base in place but real gaps. Each 'no' above is an area where a duty under the Fire Safety Order 2005 or the Health and Safety at Work Act 1974 may not currently be met. Enforcing authorities can issue improvement or enforcement notices, and offences under both regimes can carry unlimited fines. The fix is usually straightforward once the gaps are identified properly.",
    };
  return {
    band: "red",
    title: "Red — significant exposure",
    body:
      "On your answers, several core duties are not currently evidenced. Be aware of the factual position: fire safety offences carry unlimited fines, enforcement and prohibition notices can restrict use of the premises, and under section 37 of the Health and Safety at Work Act, directors and managers can be personally liable where offences are committed with their consent, connivance or neglect. None of this is inevitable — these duties are entirely manageable with a clear, prioritised plan.",
  };
}

const BAND_STYLES = {
  green: {
    ring: "border-emerald-500/50",
    bg: "bg-emerald-950/30",
    text: "text-emerald-300",
    dot: "#34d399",
  },
  amber: {
    ring: "border-amber-500/50",
    bg: "bg-amber-950/30",
    text: "text-amber-300",
    dot: "#fbbf24",
  },
  red: {
    ring: "border-red-500/60",
    bg: "bg-red-950/30",
    text: "text-red-300",
    dot: "#f87171",
  },
} as const;

export default function ComplianceCheck() {
  const reduced = useReducedMotion();
  const [answers, setAnswers] = useState<Answer[]>(Array(QUESTIONS.length).fill(null));
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const answered = answers.filter((a) => a !== null).length;
  const yesCount = answers.filter((a) => a === true).length;
  const done = answered === QUESTIONS.length;
  const result = useMemo(() => scoreBand(yesCount), [yesCount]);

  function setAnswer(i: number, v: boolean) {
    setAnswers((prev) => prev.map((a, j) => (j === i ? v : a)));
  }

  async function sendResult(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setEmailError(null);
    const data = new FormData(e.currentTarget);
    data.append("_subject", "Compliance self-check result — lionrms.uk");
    data.append("score", `${yesCount}/10 — ${result.title}`);
    data.append(
      "gaps",
      QUESTIONS.filter((_, i) => answers[i] === false)
        .map((q) => q.q)
        .join(" | ") || "none",
    );
    try {
      const res = await fetch(`https://formspree.io/f/${SITE.formspreeId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error("send failed");
      setEmailSent(true);
    } catch {
      setEmailError(`Could not send — you can call us on ${SITE.phone} instead.`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-ink-400">
          <span>
            {answered} of {QUESTIONS.length} answered
          </span>
          <span>Takes about a minute</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-400"
            animate={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Questions */}
      <ol className="space-y-4">
        {QUESTIONS.map((item, i) => (
          <li
            key={item.q}
            className="rounded-2xl border border-white/10 bg-ink-900/60 p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink-100">
                  <span className="mr-2 font-display font-semibold text-brand-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.q}
                </p>
                <p className="mt-1.5 pl-7 text-xs leading-relaxed text-ink-400">
                  {item.why}
                </p>
              </div>
              <div className="flex shrink-0 gap-2 pl-7 sm:pl-0">
                {([true, false] as const).map((v) => (
                  <button
                    key={String(v)}
                    onClick={() => setAnswer(i, v)}
                    aria-pressed={answers[i] === v}
                    className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                      answers[i] === v
                        ? v
                          ? "border-emerald-500/60 bg-emerald-950/40 text-emerald-300"
                          : "border-red-500/60 bg-red-950/40 text-red-300"
                        : "border-white/15 bg-white/[0.04] text-ink-300 hover:border-white/30"
                    }`}
                  >
                    {v ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* Result */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`mt-10 rounded-2xl border p-7 ${BAND_STYLES[result.band].ring} ${BAND_STYLES[result.band].bg}`}
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: BAND_STYLES[result.band].dot }}
                aria-hidden
              />
              <h2 className={`font-display text-xl font-semibold sm:text-2xl ${BAND_STYLES[result.band].text}`}>
                {result.title} · {yesCount}/10
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-200">{result.body}</p>

            {result.band !== "green" && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="flex-1 rounded-full bg-brand-600 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-brand-950/40 transition hover:bg-brand-500"
                >
                  Book a call
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 rounded-full border border-white/20 bg-white/[0.06] px-6 py-3.5 text-center text-sm font-semibold text-white backdrop-blur transition hover:bg-white/[0.12]"
                >
                  Request a consultation →
                </Link>
              </div>
            )}

            {/* Optional email capture — never required to see the score. */}
            <div className="mt-7 border-t border-white/10 pt-6">
              {emailSent ? (
                <p className="text-sm text-ink-300">
                  Sent — check your inbox. Anything urgent:{" "}
                  <a href={SITE.phoneHref} className="font-semibold text-white underline">
                    {SITE.phone}
                  </a>
                </p>
              ) : (
                <form onSubmit={sendResult} className="flex flex-col gap-3 sm:flex-row">
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email me this result (optional)"
                    className="flex-1 rounded-full border border-white/15 bg-ink-950/60 px-5 py-3 text-sm text-white placeholder:text-ink-500 focus:border-brand-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="rounded-full border border-white/20 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.12] disabled:opacity-50"
                  >
                    {sending ? "Sending…" : "Send"}
                  </button>
                </form>
              )}
              {emailError && <p className="mt-2 text-sm text-brand-300">{emailError}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
