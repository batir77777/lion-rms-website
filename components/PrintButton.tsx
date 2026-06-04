"use client";

export default function PrintButton({ label = "Print or save as PDF" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="mt-6 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500 print:hidden"
    >
      {label}
    </button>
  );
}
