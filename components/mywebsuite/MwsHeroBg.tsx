"use client";

// Animated gradient backdrop for the MyWebSuite hero.
// Pure CSS animations — no Three.js dependency.

export default function MwsHeroBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Central teal radial glow */}
      <div
        className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 animate-pulse rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(ellipse, rgba(14,165,160,0.18) 0%, transparent 70%)",
        }}
      />
      {/* Right-side green accent glow */}
      <div
        className="absolute -bottom-40 -right-40 h-[500px] w-[500px] animate-pulse rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(ellipse, rgba(16,185,129,0.12) 0%, transparent 70%)",
          animationDelay: "1.5s",
        }}
      />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
