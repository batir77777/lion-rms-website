import Reveal from "@/components/Reveal";
import { GradientText, PrimaryBtn, GhostBtn } from "./MwsUi";

export default function MwsFinalCta() {
  return (
    <section className="bg-white pb-28 pt-0 sm:pb-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl border px-8 py-20 text-center sm:py-24"
            style={{
              background: "linear-gradient(135deg,#060e1f 0%,#0c1f3f 45%,#0a2a30 72%,#082218 100%)",
              borderColor: "rgba(14,165,160,0.2)",
              boxShadow: "0 0 80px rgba(14,165,160,0.08), 0 32px 80px rgba(6,14,31,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* Glows */}
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(ellipse,rgba(14,165,160,0.16) 0%,transparent 70%)" }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-0 right-0 h-64 w-80 rounded-full"
              style={{ background: "radial-gradient(ellipse,rgba(12,31,63,0.5) 0%,transparent 70%)" }}
              aria-hidden
            />

            {/* Label */}
            <div
              className="relative mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
              style={{ borderColor: "rgba(14,165,160,0.28)", background: "rgba(14,165,160,0.08)" }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400" aria-hidden />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-300">Get Started Today</span>
            </div>

            {/* Headline */}
            <h2 className="relative mb-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Your compliance,<br />
              <GradientText>finally under control.</GradientText>
            </h2>

            <p className="relative mx-auto mb-10 max-w-lg text-lg text-slate-300 leading-relaxed">
              Book a free demo to see how the Lion RMS platform connects your assessments,
              actions, and reporting into one audit-ready compliance system.
            </p>

            <div className="relative flex flex-wrap justify-center gap-4">
              <PrimaryBtn href="/contact" large>Book a Free Demo →</PrimaryBtn>
              <GhostBtn href="/contact" large>Request a Consultation</GhostBtn>
            </div>

            <p className="relative mt-6 text-sm text-slate-500">
              No commitment required &middot; Demo tailored to your portfolio &middot; UK-based support
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
