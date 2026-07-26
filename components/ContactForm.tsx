"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { SITE } from "@/lib/site";

const SERVICE_LABELS: Record<string, string> = {
  "fire-risk-assessment": "Book a Fire Risk Assessment",
};

type SubmitState = "idle" | "submitting" | "success" | "error";
type FieldName = "name" | "email" | "message";

function validate(form: HTMLFormElement): Partial<Record<FieldName, string>> {
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  const errors: Partial<Record<FieldName, string>> = {};
  if (!name) errors.name = "Please enter your name.";
  if (!email) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Please enter a valid email address.";
  if (!message) errors.message = "Please tell us how we can help.";
  return errors;
}

export default function ContactForm() {
  const params = useSearchParams();
  const preset = params.get("service");
  const [state, setState] = useState<SubmitState>("idle");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const alertRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const configured =
    SITE.formspreeId && SITE.formspreeId !== "YOUR_FORMSPREE_ID";

  function handleFieldBlur(form: HTMLFormElement, field: FieldName) {
    setTouched((t) => ({ ...t, [field]: true }));
    const errors = validate(form);
    setFieldErrors((prev) => ({ ...prev, [field]: errors[field] }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouched({ name: true, email: true, message: true });
      setState("error");
      setFormError("Please correct the highlighted fields below.");
      const firstInvalid: FieldName | undefined = (["name", "email", "message"] as FieldName[]).find(
        (f) => errors[f],
      );
      if (firstInvalid) {
        const el = form.elements.namedItem(firstInvalid) as HTMLElement | null;
        el?.focus();
      }
      return;
    }

    if (!configured) return;

    setState("submitting");
    setFormError("");
    try {
      const res = await fetch(`https://formspree.io/f/${SITE.formspreeId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) {
        setState("success");
        setFieldErrors({});
        setTouched({});
        form.reset();
        requestAnimationFrame(() => successRef.current?.focus());
      } else {
        const data = await res.json().catch(() => null);
        setFormError(
          data?.errors?.[0]?.message || "Something went wrong. Please try again.",
        );
        setState("error");
        requestAnimationFrame(() => alertRef.current?.focus());
      }
    } catch {
      setFormError("Network error. Please try again or call us directly.");
      setState("error");
      requestAnimationFrame(() => alertRef.current?.focus());
    }
  }

  if (state === "success") {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center outline-none"
      >
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
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={state === "submitting"}
      className="space-y-4"
    >
      {!configured && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Form not yet connected. Add your Formspree form ID in{" "}
          <span className="font-mono">lib/site.ts</span> to start receiving
          enquiries by email.
        </p>
      )}

      {state === "error" && formError && (
        <div
          ref={alertRef}
          role="alert"
          tabIndex={-1}
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 outline-none"
        >
          <ErrorIcon />
          <span>{formError}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          required
          error={touched.name ? fieldErrors.name : undefined}
          onFieldBlur={handleFieldBlur}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          error={touched.email ? fieldErrors.email : undefined}
          onFieldBlur={handleFieldBlur}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" name="phone" type="tel" />
        <div>
          <label
            htmlFor="contact-service"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Service of interest
          </label>
          <select
            id="contact-service"
            name="service"
            defaultValue={preset && SERVICE_LABELS[preset] ? preset : ""}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          >
            <option value="">Select…</option>
            <option value="fire-risk-assessment">Fire Risk Assessment</option>
            <option value="fire-strategy">Fire Strategy</option>
            <option value="fire-door-inspection">Fire Door Inspection</option>
            <option value="fire-training">Fire Safety Training</option>
            <option value="health-safety">Health &amp; Safety Support</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          How can we help?
          <span aria-hidden className="text-teal-600"> *</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          aria-required="true"
          placeholder="Tell us about your premises, project, or requirement…"
          aria-invalid={touched.message && Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
          onBlur={(e) => handleFieldBlur(e.currentTarget.form as HTMLFormElement, "message")}
          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
            touched.message && fieldErrors.message
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : "border-slate-200 focus:border-teal-500 focus:ring-teal-100"
          }`}
        />
        {touched.message && fieldErrors.message && (
          <p id="contact-message-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
            <ErrorIcon small />
            {fieldErrors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={state === "submitting" || !configured}
        aria-disabled={state === "submitting" || !configured}
        className="w-full rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 sm:w-auto"
        style={{ background: "linear-gradient(135deg, #0ea5a0, #10b981)" }}
      >
        {state === "submitting" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}

function ErrorIcon({ small = false }: { small?: boolean }) {
  const size = small ? "h-3.5 w-3.5" : "mt-0.5 h-4 w-4 flex-shrink-0";
  return (
    <svg className={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 6v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="13.5" r="1" fill="currentColor" />
    </svg>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  error,
  onFieldBlur,
}: {
  label: string;
  name: FieldName | "phone";
  type?: string;
  required?: boolean;
  error?: string;
  onFieldBlur?: (form: HTMLFormElement, field: FieldName) => void;
}) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const invalid = Boolean(error);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span aria-hidden className="text-teal-600"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        aria-required={required}
        aria-invalid={invalid}
        aria-describedby={invalid ? errorId : undefined}
        onBlur={(e) => {
          if (onFieldBlur) onFieldBlur(e.currentTarget.form as HTMLFormElement, name as FieldName);
        }}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
          invalid
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-slate-200 focus:border-teal-500 focus:ring-teal-100"
        }`}
      />
      {invalid && (
        <p id={errorId} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
          <ErrorIcon small />
          {error}
        </p>
      )}
    </div>
  );
}
