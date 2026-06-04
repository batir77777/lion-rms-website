"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { SITE } from "@/lib/site";

const SERVICE_LABELS: Record<string, string> = {
  "fire-risk-assessment": "Book a Fire Risk Assessment",
  "digital-compliance": "Digital Compliance Solution",
};

type State = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const params = useSearchParams();
  const preset = params.get("service");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const configured =
    SITE.formspreeId && SITE.formspreeId !== "YOUR_FORMSPREE_ID";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configured) return;
    const form = e.currentTarget;
    setState("submitting");
    setErrorMsg("");
    try {
      const res = await fetch(`https://formspree.io/f/${SITE.formspreeId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) {
        setState("success");
        form.reset();
      } else {
        const data = await res.json().catch(() => null);
        setErrorMsg(
          data?.errors?.[0]?.message || "Something went wrong. Please try again.",
        );
        setState("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again or call us directly.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-green-900">Thank you</h3>
        <p className="mt-2 text-sm text-green-800">
          Your enquiry has been sent. We&apos;ll get back to you shortly. For
          anything urgent, call{" "}
          <a href={SITE.phoneHref} className="font-semibold underline">
            {SITE.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!configured && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Form not yet connected. Add your Formspree form ID in{" "}
          <span className="font-mono">lib/site.ts</span> to start receiving
          enquiries by email.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" name="phone" type="tel" />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-800">
            Service of interest
          </label>
          <select
            name="service"
            defaultValue={preset && SERVICE_LABELS[preset] ? preset : ""}
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Select…</option>
            <option value="fire-risk-assessment">Fire Risk Assessment</option>
            <option value="fire-strategy">Fire Strategy</option>
            <option value="fire-door-inspection">Fire Door Inspection</option>
            <option value="fire-training">Fire Safety Training</option>
            <option value="health-safety">Health &amp; Safety Support</option>
            <option value="digital-compliance">Digital Compliance Solution</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-800">
          How can we help?
        </label>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Tell us about your premises, project, or requirement…"
          className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {state === "error" && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === "submitting" || !configured}
        className="w-full rounded-lg bg-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800 disabled:opacity-50 sm:w-auto"
      >
        {state === "submitting" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-800">
        {label}
        {required && <span className="text-brand-600"> *</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
}
