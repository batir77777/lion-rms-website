"use client";
import Link from "next/link";
import { ReactNode } from "react";

export function GradientText({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        background: "linear-gradient(120deg,#0c1f3f 0%,#0ea5a0 55%,#10b981 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}

export function EyebrowPill({ children, navy }: { children: ReactNode; navy?: boolean }) {
  return navy ? (
    <p className="mb-5 inline-block rounded-full border border-navy-200 bg-navy-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-navy-700">
      {children}
    </p>
  ) : (
    <p className="mb-5 inline-block rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-teal-600">
      {children}
    </p>
  );
}

export function PrimaryBtn({
  href,
  children,
  large,
}: {
  href: string;
  children: ReactNode;
  large?: boolean;
}) {
  const cls = large
    ? "inline-flex items-center rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:opacity-90 hover:-translate-y-0.5"
    : "inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow transition hover:opacity-90";
  return (
    <Link
      href={href}
      className={cls}
      style={{ background: "linear-gradient(135deg,#0c1f3f 0%,#0ea5a0 60%,#10b981 100%)" }}
    >
      {children}
    </Link>
  );
}

export function GhostBtn({
  href,
  children,
  large,
}: {
  href: string;
  children: ReactNode;
  large?: boolean;
}) {
  const cls = large
    ? "inline-flex items-center rounded-full border border-white/25 bg-white/8 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 hover:-translate-y-0.5"
    : "inline-flex items-center rounded-full border border-white/25 bg-white/8 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15";
  return <Link href={href} className={cls}>{children}</Link>;
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`h-full rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children, dark }: { children: ReactNode; dark?: boolean }) {
  if (dark) {
    return (
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/8 px-4 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" aria-hidden />
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-300">{children}</span>
      </div>
    );
  }
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">{children}</span>
    </div>
  );
}
