import Reveal from "@/components/Reveal";
import { EyebrowPill, GradientText } from "./MwsUi";

const STEPS = [
  {
    n: "1",
    icon: "🏗️",
    title: "Create your workspace",
    body: "Sign up, add your business details and branding. Guided wizard gets you started in under 10 minutes.",
  },
  {
    n: "2",
    icon: "⚙️",
    title: "Manage your operations",
    body: "Add services, connect your team, set up workflows. Your website goes live automatically.",
  },
  {
    n: "3",
    icon: "📈",
    title: "Track your results",
    body: "Watch enquiries, projects, compliance and revenue flow into your dashboard in real time.",
  },
];

export default function MwsHowItWorks() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <EyebrowPill>How It Works</EyebrowPill>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Live in hours, <GradientText>not weeks.</GradientText>
            </h2>
            <p className="mb-14 text-base text-slate-500">
              Three steps from signup to a fully running business platform.
            </p>
          </div>
        </Reveal>
        <div className="relative grid gap-8 sm:grid-cols-3">
          <div
            className="absolute left-[16.7%] right-[16.7%] top-10 hidden h-px sm:block"
            style={{ background: "linear-gradient(90deg,transparent,rgba(14,165,160,0.3),transparent)" }}
            aria-hidden
          />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="flex flex-col items-center text-center">
                <div
                  className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-extrabold"
                  style={{
                    background: "white",
                    border: "2px solid #0ea5a0",
                    color: "#0ea5a0",
                    boxShadow: "0 0 0 6px rgba(14,165,160,0.08)",
                  }}
                >
                  {s.n}
                </div>
                <div className="mb-2 text-2xl">{s.icon}</div>
                <h3 className="mb-2 text-base font-bold text-slate-900">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
