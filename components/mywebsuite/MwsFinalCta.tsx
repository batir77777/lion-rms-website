import Reveal from "@/components/Reveal";
import { GradientText, PrimaryBtn, GhostBtn } from "./MwsUi";

export default function MwsFinalCta() {
  return (
    <section className="bg-white pb-24 pt-0">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl border px-8 py-20 text-center"
            style={{
              background: "linear-gradient(135deg,#0f172a 0%,#0a2218 100%)",
              borderColor: "rgba(14,165,160,0.22)",
              boxShadow: "0 0 80px rgba(14,165,160,0.07)",
            }}
          >
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80"
              style={{ background: "radial-gradient(ellipse,rgba(14,165,160,0.14) 0%,transparent 70%)" }}
              aria-hidden
            />
            <p
              className="relative mb-4 inline-block rounded-full border px-4 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-teal-400"
              style={{ borderColor: "rgba(14,165,160,0.3)", background: "rgba(14,165,160,0.08)" }}
            >
              Get Started Today
            </p>
            <h2 className="relative mb-4 text-3xl font-extrabold text-white sm:text-5xl">
              Your business deserves<br />
              <GradientText>better software.</GradientText>
            </h2>
            <p className="relative mx-auto mb-10 max-w-md text-base text-slate-400">
              Join hundreds of UK businesses already running smarter with
              MyWebSuite. Start your free 14-day trial today.
            </p>
            <div className="relative flex flex-wrap justify-center gap-4">
              <PrimaryBtn href="/contact" large>Start free trial &rarr;</PrimaryBtn>
              <GhostBtn href="/contact" large>Book a demo</GhostBtn>
            </div>
            <p className="relative mt-6 text-xs text-slate-600">
              Free for 14 days &middot; No credit card &middot; Cancel anytime &middot; UK support
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
