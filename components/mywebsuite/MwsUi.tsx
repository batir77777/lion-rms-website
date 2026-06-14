"use client";
import Link from "next/link";
import { ReactNode } from "react";

export function GradientText({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        background: "linear-gradient(120deg,#0c1f3f 0%,#0ea5a0 60%,#10b981 100%)",
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
    <p className="mb-4 inline-block rounded-full border border-navy-200 bg-navy-50 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-navy-700">
      {children}
    </p>
  ) : (
    <p className="mb-4 inline-block rounded-full border border-teal-100 bg-teal-50 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-600">
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
    ? "rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
    : "rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90";
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
    ? "rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
    : "rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10";
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
      className={`h-full rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
