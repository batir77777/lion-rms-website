import Reveal from "@/components/Reveal";
import { BlocksIcon, PoundIcon, GiftIcon, ClockIcon, PinIcon } from "./MwsIcons";

const ITEMS = [
  { Icon: BlocksIcon, title: "Consultancy + Software", sub: "Expert advice and a live platform, in one solution" },
  { Icon: PoundIcon, title: "From £250 + VAT", sub: "Fire Risk Assessment with a digital report & action plan" },
  { Icon: GiftIcon, title: "2 Months Free", sub: "Lion RMS platform access for new clients" },
  { Icon: ClockIcon, title: "Fast Turnaround", sub: "Practical, commercial advice — without the wait" },
  { Icon: PinIcon, title: "London · UK-wide", sub: "Based in London, covering clients across the UK" },
];

export default function MwsValueBar() {
  return (
    <section className="bg-white pt-4 pb-2">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ITEMS.map(({ Icon, title, sub }, i) => (
            <Reveal key={title} delay={i * 50}>
              <div className="flex h-full items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-extrabold leading-tight text-navy-900">{title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-slate-500">{sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
