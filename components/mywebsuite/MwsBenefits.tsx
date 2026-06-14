import Reveal from "@/components/Reveal";
import { Card, EyebrowPill, GradientText } from "./MwsUi";

const BENEFITS = [
  { icon: "⚡", stat: "10×", title: "Faster client onboarding", body: "From first enquiry to active client in minutes, not days." },
  { icon: "🎯", stat: "100%", title: "Visibility across every job", body: "Know the status of every client, project and task in one view." },
  { icon: "📂", stat: "Zero", title: "Paperwork left unsent", body: "Generate, store and deliver documents without leaving the platform." },
  { icon: "🔄", stat: "–60%", title: "Admin time per client", body: "Workflows, reminders and templates handle the repetitive work for you." },
  { icon: "🔒", stat: "UK", title: "Hosted & GDPR-compliant", body: "Every byte of your data hosted in the UK. Full compliance out of the box." },
  { icon: "🚀", stat: "4 hr", title: "Average time to go live", body: "Onboarding wizard gets your site, services and workflows running fast." },
];

export default function MwsBenefits() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <EyebrowPill>Platform Benefits</EyebrowPill>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Built to make your business <GradientText>move faster.</GradientText>
            </h2>
            <p className="mb-14 text-base text-slate-500">
              MyWebSuite eliminates the tools, friction and admin that slow
              professional service businesses down.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 55}>
              <Card className="group p-8">
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                  style={{
                    background: "linear-gradient(135deg,rgba(14,165,160,0.1),rgba(16,185,129,0.1))",
                    border: "1px solid rgba(14,165,160,0.15)",
                  }}
                >
                  {b.icon}
                </div>
                <p
                  className="mb-1 text-2xl font-extrabold"
                  style={{
                    background: "linear-gradient(135deg,#0ea5a0,#10b981)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {b.stat}
                </p>
                <h3 className="mb-2 text-sm font-bold text-slate-900">{b.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{b.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
