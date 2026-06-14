"use client";

// The animated "report → living dashboard" product demo, extracted so it can
// run compact in the hero (autoplay on load, navigational deep-links) and
// anywhere else. One act-state machine drives every Framer Motion variant:
//
//   report (3s) → transfer (2s) → live (7s) → hold (1s) → loop
//
// - autoStart: play immediately on mount (hero, above the fold); timers still
//   pause whenever the stage scrolls out of view.
// - navigational: report card / action rows / dashboard gauge become links to
//   the matching service pages with pointer cursor + subtle hover ring.
// - prefers-reduced-motion renders the static final state (no timers).
// - GPU transforms/opacity only; fixed height (no layout shift).
// - Everything inside [data-anim-demo] is excluded from the reveal checker.
//
// Illustrative product visual — not live client data.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Phase = "report" | "transfer" | "live" | "hold";

const PHASE_MS: Record<Phase, number> = {
  report: 3000,
  transfer: 2000,
  live: 7000,
  hold: 1000,
};
const NEXT: Record<Phase, Phase> = {
  report: "transfer",
  transfer: "live",
  live: "hold",
  hold: "report",
};

const EASE = [0.22, 1, 0.36, 1] as const;

export const DEMO_FINDINGS = [
  { text: "Fire door self-closer defective — Level 2", chip: "Substantial", tone: "bg-red-500/15 text-red-400 ring-red-500/30", due: "Due 14 days" },
  { text: "Emergency lighting monthly test overdue", chip: "Moderate", tone: "bg-amber-500/15 text-amber-400 ring-amber-500/30", due: "Due 1 month" },
  { text: "Combustible storage in riser cupboard", chip: "Moderate", tone: "bg-amber-500/15 text-amber-400 ring-amber-500/30", due: "Due 1 month" },
  { text: "Fire action notice missing — plant room", chip: "Tolerable", tone: "bg-sky-500/15 text-sky-400 ring-sky-500/30", due: "Due 3 months" },
];

const CAPTIONS: Record<Phase, string> = {
  report: "Every assessment starts on site.",
  transfer: "Findings become live actions — automatically.",
  live: "Compliance that stays current — reports, actions, reminders, records.",
  hold: "Compliance that stays current — reports, actions, reminders, records.",
};

const ROW_DONE_DELAY = [0.6, 1.8, 3.0, 4.2];

// Subtle affordance for navigational zones.
const NAV_ZONE =
  "block cursor-pointer rounded-2xl ring-teal-500/0 transition duration-200 hover:ring-2 hover:ring-teal-500/40";

function useTimeline(inView: boolean, reduced: boolean) {
  const [phase, setPhase] = useState<Phase>("report");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduced || !inView) return;
    const t = setTimeout(() => {
      setPhase((p) => {
        if (p === "hold") setCycle((c) => c + 1);
        return NEXT[p];
      });
    }, PHASE_MS[phase]);
    return () => clearTimeout(t);
  }, [phase, inView, reduced]);

  return reduced ? { phase: "hold" as Phase, cycle: 0 } : { phase, cycle };
}

function PriorityChip({ label, tone }: { label: string; tone: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ring-1 ${tone}`}>
      {label}
    </span>
  );
}

function ReportCard({
  phase,
  rowRefs,
  navigational,
}: {
  phase: Phase;
  rowRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  navigational: boolean;
}) {
  const dimmed = phase === "live" || phase === "hold";
  const card = (
    <motion.div
      animate={{ opacity: dimmed ? 0.45 : 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="h-full rounded-2xl border border-white/10 bg-ink-900/80 p-3.5 backdrop-blur sm:p-4"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-teal-400">
            Report
          </p>
          <h4 className="mt-0.5 font-display text-[13px] font-semibold text-white">
            Fire Risk Assessment — Block A
          </h4>
        </div>
        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[9px] font-semibold text-ink-300">
          PAS 79
        </span>
      </div>
      <div className="mt-2.5 space-y-1.5">
        {DEMO_FINDINGS.map((f, i) => (
          <motion.div
            key={f.text}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            animate={
              phase === "report"
                ? { opacity: 1, x: 0 }
                : phase === "transfer"
                  ? { opacity: 0.25, x: 18 }
                  : { opacity: 0.5, x: 0 }
            }
            initial={{ opacity: 0, x: -14 }}
            transition={{
              duration: 0.5,
              ease: EASE,
              delay: phase === "report" ? 0.4 + i * 0.5 : i * 0.08,
            }}
            className="rounded-lg border border-white/5 bg-white/[0.04] px-2.5 py-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-[10px] text-ink-200">{f.text}</p>
              <PriorityChip label={f.chip} tone={f.tone} />
            </div>
            <p className="mt-0.5 text-[9px] text-ink-500">{f.due}</p>
          </motion.div>
        ))}
      </div>
      <p className="mt-2.5 text-[9px] italic text-ink-500">
        Carried out on site · prioritised to PAS 79
      </p>
    </motion.div>
  );

  if (!navigational) return card;
  return (
    <Link
      href="/services/fire-safety"
      aria-label="Fire Risk Assessments — explore fire safety services"
      className={`${NAV_ZONE} h-full`}
    >
      {card}
    </Link>
  );
}

function Gauge({ phase, cycle }: { phase: Phase; cycle: number }) {
  const [value, setValue] = useState(phase === "hold" ? 94 : 61);
  const R = 26;
  const C = 2 * Math.PI * R;

  useEffect(() => {
    if (phase === "hold") {
      setValue(94);
      return;
    }
    if (phase !== "live") {
      setValue(61);
      return;
    }
    let raf = 0;
    const t0 = performance.now() + 500;
    const DUR = 5000;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0) / DUR));
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(61 + eased * (94 - 61)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, cycle]);

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-14 w-14">
        <svg viewBox="0 0 64 64" className="h-14 w-14 -rotate-90">
          <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <motion.circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={C}
            animate={{
              strokeDashoffset:
                phase === "live" || phase === "hold" ? C * (1 - 0.94) : C * (1 - 0.61),
            }}
            transition={
              phase === "live"
                ? { duration: 5, delay: 0.5, ease: "easeOut" }
                : { duration: 0.4 }
            }
          />
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0ea5a0" />
              <stop offset="100%" stopColor="#ff9d36" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-xs font-bold text-white tabular-nums">
            {value}%
          </span>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-ink-200">Compliance</p>
        <p className="text-[9px] text-ink-500">across portfolio</p>
      </div>
    </div>
  );
}

function LineChart({ phase }: { phase: Phase }) {
  const drawn = phase === "live" || phase === "hold";
  const d = "M4 44 L26 38 L48 40 L70 28 L92 22 L114 10";
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.04] p-2.5">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[9px] font-semibold text-ink-300">
          Actions closed · 6 months
        </span>
        <motion.span
          animate={{ opacity: drawn ? 1 : 0 }}
          transition={{ delay: phase === "live" ? 3 : 0, duration: 0.4 }}
          className="text-[9px] font-semibold text-emerald-400"
        >
          ▲ on track
        </motion.span>
      </div>
      <svg viewBox="0 0 118 48" className="h-10 w-full">
        {[44, 32, 20, 8].map((y) => (
          <line key={y} x1="0" x2="118" y1={y} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}
        <motion.path
          d={d}
          fill="none"
          stroke="#ff9d36"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={
            phase === "live"
              ? { duration: 2.4, delay: 0.8, ease: "easeInOut" }
              : { duration: 0.3 }
          }
          style={{ pathLength: 0 }}
        />
        <motion.circle
          cx="114"
          cy="10"
          r="2.5"
          fill="#ff9d36"
          animate={{ opacity: drawn ? 1 : 0, scale: drawn ? 1 : 0 }}
          transition={{ delay: phase === "live" ? 3 : 0, duration: 0.3 }}
        />
      </svg>
    </div>
  );
}

function Tick() {
  return (
    <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M4 10.5l4 4 8-8.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardFrame({
  phase,
  cycle,
  targetRefs,
  navigational,
}: {
  phase: Phase;
  cycle: number;
  targetRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  navigational: boolean;
}) {
  const visible = phase !== "report";
  const live = phase === "live";
  const settled = phase === "hold";

  const topZone = (
    <div className="grid grid-cols-2 items-center gap-2.5 rounded-xl p-1">
      <Gauge phase={phase} cycle={cycle} />
      <LineChart phase={phase} />
    </div>
  );

  const rowsZone = (
    <div className="space-y-1.5 rounded-xl p-1">
      {DEMO_FINDINGS.map((f, i) => {
        const done = live || settled;
        const delay = live ? ROW_DONE_DELAY[i] : 0;
        return (
          <div
            key={f.text}
            ref={(el) => {
              targetRefs.current[i] = el;
            }}
          >
            <motion.div
              animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
              transition={{
                duration: 0.4,
                ease: EASE,
                delay: phase === "transfer" ? 0.9 + i * 0.16 : 0,
              }}
              className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.04] px-2.5 py-1.5"
            >
              <div className="flex min-w-0 items-center gap-2">
                <motion.span
                  animate={{
                    backgroundColor: done
                      ? "rgba(16, 185, 129, 0.9)"
                      : "rgba(255, 255, 255, 0.12)",
                    scale: done ? [1, 1.35, 1] : 1,
                  }}
                  transition={{ duration: 0.45, delay, ease: EASE }}
                  className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-white"
                >
                  <motion.span
                    animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.4 }}
                    transition={{ duration: 0.3, delay: delay + 0.1 }}
                    className="flex"
                  >
                    <Tick />
                  </motion.span>
                </motion.span>
                <p className="min-w-0 truncate text-[10px] text-ink-200">{f.text}</p>
              </div>
              <span className="relative flex-shrink-0 text-[9px] font-semibold">
                <motion.span
                  animate={{ opacity: done ? 0 : 1 }}
                  transition={{ duration: 0.25, delay }}
                  className="text-amber-400"
                >
                  Open
                </motion.span>
                <motion.span
                  animate={{ opacity: done ? 1 : 0 }}
                  transition={{ duration: 0.25, delay: delay + 0.1 }}
                  className="absolute right-0 top-0 text-emerald-400"
                >
                  Complete
                </motion.span>
              </span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );

  return (
    // x stays within the canvas padding in the hidden state so the frame's
    // geometry never extends past the stage edge (the overflow guard asserts
    // this at every act). `relative` anchors the toast inside the frame.
    <motion.div
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 12 }}
      initial={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.65, ease: EASE }}
      className="relative flex h-full overflow-hidden rounded-2xl border border-white/10 bg-ink-900/90 shadow-2xl backdrop-blur"
    >
      {/* Sidebar */}
      <div className="hidden w-9 flex-col items-center gap-2.5 border-r border-white/5 bg-ink-950/60 py-3 sm:flex">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-600 text-[8px] font-bold text-white">
          LR
        </span>
        {["▦", "✓", "⚠", "🗎", "⚙"].map((icon, i) => (
          <span
            key={i}
            className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] ${
              i === 1 ? "bg-white/10 text-teal-400" : "text-ink-500"
            }`}
            aria-hidden
          >
            {icon}
          </span>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-ink-500">
              Lion RMS · Live
            </p>
            <h4 className="font-display text-[11px] font-semibold text-white">
              Compliance Dashboard
            </h4>
          </div>
          <div className="flex items-center gap-1.5">
            {(["red", "amber", "green"] as const).map((c) => {
              const activeWhen =
                c === "red" ? !live && !settled : c === "amber" ? live : settled;
              const colour =
                c === "red" ? "#f87171" : c === "amber" ? "#fbbf24" : "#34d399";
              return (
                <motion.span
                  key={c}
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: colour }}
                  animate={{ opacity: activeWhen ? 1 : 0.2, scale: activeWhen ? 1.15 : 1 }}
                  transition={{ duration: 0.4, delay: live && c === "amber" ? 0.5 : 0 }}
                />
              );
            })}
            <span className="ml-1 h-5 w-5 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-center text-[8px] font-bold leading-5 text-white">
              B
            </span>
          </div>
        </div>

        <div className="space-y-2 p-2.5">
          {navigational ? (
            <>
              <Link
                href="/services/digital-compliance"
                aria-label="Digital Compliance — explore live dashboard solutions"
                className={NAV_ZONE}
              >
                {topZone}
              </Link>
              <Link
                href="/services/health-safety"
                aria-label="Health & Safety — explore action-tracking and assessments"
                className={NAV_ZONE}
              >
                {rowsZone}
              </Link>
            </>
          ) : (
            <>
              {topZone}
              {rowsZone}
            </>
          )}
        </div>
      </div>

      {/* Notification toast — pops up in place (y/scale) rather than sliding
          in from beyond the frame, so its geometry never exceeds the stage. */}
      <motion.div
        key={`toast-${cycle}`}
        className="absolute bottom-2.5 right-2.5 flex items-center gap-2 rounded-xl border border-white/10 bg-ink-950/95 px-3 py-2 shadow-2xl"
        initial={{ opacity: 0, y: 8, scale: 0.94 }}
        animate={
          live
            ? {
                opacity: [0, 0, 1, 1, 0],
                y: [8, 8, 0, 0, 8],
                scale: [0.94, 0.94, 1, 1, 0.94],
              }
            : { opacity: 0, y: 8, scale: 0.94 }
        }
        transition={
          live
            ? { duration: 7, times: [0, 0.5, 0.56, 0.86, 0.93], ease: "easeOut" }
            : { duration: 0.2 }
        }
      >
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-600/20 text-[10px]" aria-hidden>
          🔔
        </span>
        <div>
          <p className="text-[9px] font-semibold text-white">Reminder</p>
          <p className="text-[9px] text-ink-400">Fire door inspection due — Block C</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Stage
// ---------------------------------------------------------------------------

interface Flyer {
  x0: number;
  y0: number;
  dx: number;
  dy: number;
  chip: string;
  tone: string;
}

// The demo is laid out on a FIXED internal design canvas and scaled to fit
// the container exactly (transform scale, origin top-left), so the content
// can never exceed the stage width at any hero column size. The outer stage
// keeps the same aspect ratio via CSS, so its height is correct from SSR
// onwards with zero layout shift.
const DESIGN_W = 640;
const DESIGN_H = 440;

export default function DemoStage({
  autoStart = false,
  navigational = false,
  className = "",
}: {
  /** Play immediately on mount (above-the-fold hero); still pauses off-view. */
  autoStart?: boolean;
  /** Demo zones deep-link to the matching service pages. */
  navigational?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const targetRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [inView, setInView] = useState(autoStart);
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [scale, setScale] = useState(1);

  // Scale the design canvas to the measured stage width (ResizeObserver).
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / DESIGN_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pause whenever the stage leaves the viewport (autoStart only sets the
  // initial state — the observer takes over from first callback).
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.2,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { phase, cycle } = useTimeline(inView, reduced);

  // Measure flyer paths after the dashboard slides in. Rects are measured in
  // SCREEN space (post-transform), so divide by the canvas scale to convert
  // into design-canvas coordinates — the flyers live inside the scaled canvas.
  useEffect(() => {
    if (phase !== "transfer" || reduced) {
      setFlyers([]);
      return;
    }
    const t = setTimeout(() => {
      const canvas = canvasRef.current?.getBoundingClientRect();
      const s = scale || 1;
      if (!canvas) return;
      const out: Flyer[] = [];
      DEMO_FINDINGS.forEach((f, i) => {
        const from = rowRefs.current[i]?.getBoundingClientRect();
        const to = targetRefs.current[i]?.getBoundingClientRect();
        if (!from || !to) return;
        out.push({
          x0: (from.right - canvas.left) / s - 70,
          y0: (from.top - canvas.top + from.height / 2) / s - 9,
          dx: (to.left - from.right) / s + 90,
          dy: (to.top - from.top + to.height / 2 - from.height / 2) / s,
          chip: f.chip,
          tone: f.tone,
        });
      });
      setFlyers(out);
    }, 700);
    return () => clearTimeout(t);
  }, [phase, reduced, scale]);

  return (
    <div data-anim-demo className={className}>
      {/* Stage: aspect-ratio reserves the exact scaled height from SSR (no
          layout shift); overflow-hidden is a backstop — the scaled canvas
          fits the width exactly by construction. */}
      <div
        ref={stageRef}
        className="relative w-full overflow-hidden rounded-3xl bg-ink-950/80 ring-1 ring-white/10 backdrop-blur"
        style={{
          aspectRatio: `${DESIGN_W} / ${DESIGN_H}`,
          backgroundImage:
            "radial-gradient(60% 50% at 85% 10%, rgba(194, 75, 8, 0.12) 0%, transparent 60%)," +
            "radial-gradient(40% 40% at 10% 95%, rgba(249, 127, 17, 0.08) 0%, transparent 65%)",
        }}
      >
        {/* Fixed design canvas, scaled to the container. */}
        <div
          ref={canvasRef}
          className="absolute left-0 top-0 p-4"
          style={{
            width: DESIGN_W,
            height: DESIGN_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* Window chrome */}
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-3 truncate text-[10px] font-medium text-ink-400">
              Lion RMS · from assessment to live compliance
            </span>
          </div>

          {/* Split stage: report left, dashboard right. */}
          <div className="grid h-[calc(100%-4.25rem)] grid-cols-[42%_1fr] gap-3">
            <ReportCard phase={phase} rowRefs={rowRefs} navigational={navigational} />
            <div className="relative">
              <DashboardFrame
                phase={phase}
                cycle={cycle}
                targetRefs={targetRefs}
                navigational={navigational}
              />
            </div>
          </div>

          {/* Transfer flyers — design-canvas coordinates (scaled with it). */}
          {flyers.map((f, i) => (
            <motion.span
              key={`${cycle}-${i}`}
              className={`pointer-events-none absolute z-10 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ring-1 ${f.tone} bg-ink-950`}
              style={{ left: f.x0, top: f.y0 }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.9 }}
              animate={{
                x: [0, f.dx * 0.55, f.dx],
                y: [0, f.dy * 0.4 - 28, f.dy],
                opacity: [0, 1, 0],
                scale: [0.9, 1, 0.85],
              }}
              transition={{ duration: 1.0, delay: i * 0.12, ease: "easeInOut" }}
            >
              {f.chip}
            </motion.span>
          ))}

          {/* Caption */}
          <div className="absolute inset-x-0 bottom-3 px-6 text-center">
            <motion.p
              key={CAPTIONS[phase]}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="text-[11px] font-medium text-ink-300"
            >
              {CAPTIONS[phase]}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Discoverable nav row + disclaimer */}
      {navigational && (
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-2 text-[11px] font-medium">
          <Link href="/services/fire-safety" className="text-ink-300 transition hover:text-teal-400">
            Fire Risk Assessments
          </Link>
          <span className="text-ink-600" aria-hidden>·</span>
          <Link href="/services/health-safety" className="text-ink-300 transition hover:text-teal-400">
            Health &amp; Safety
          </Link>
          <span className="text-ink-600" aria-hidden>·</span>
          <Link href="/services/digital-compliance" className="text-ink-300 transition hover:text-teal-400">
            Digital Compliance
          </Link>
        </div>
      )}
      <p className="mt-1.5 text-center text-[10px] text-ink-500">
        Illustrative product demo — not live client data.
      </p>
    </div>
  );
}
