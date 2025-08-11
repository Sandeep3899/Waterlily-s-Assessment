import { useMemo, useState } from "react";
import { FieldRenderer } from "./FieldRenderer";
import { createResponse } from "./api";
import type { Question } from "./types";

export function SurveyForm({
  surveyId,
  title,
  description,
  questions,
  onSubmitted,
}: {
  surveyId: string;
  title: string;
  description?: string | null;
  questions: Question[];
  onSubmitted: (responseId: string) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({}); // NEW: store validation errors
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NEW: function to validate a single field
  function validateOne(q: Question, raw: string): string | null {
    const value = (raw ?? "").trim();

    if (q.required && !value) return "This field is required."; // NEW: required check

    switch (q.qtype) {
      case "text":
        if (!value && !q.required) return null;
        if (value.length > 200) return "Please keep under 200 characters.";
        return null;
      case "number": {
        if (!value) return q.required ? "This field is required." : null;
        const n = Number(value);
        if (!Number.isFinite(n)) return "Enter a valid number.";
        if (n < 0 || n > 150) return "Enter a value between 0 and 150.";
        return null;
      }
      case "select":
        if (!value) return q.required ? "Please select an option." : null;
        if (q.options && !q.options.includes(value))
          return "Choose one of the provided options.";
        return null;
      case "radio":
        if (!value) return q.required ? "Please choose an option." : null;
        if (q.options && !q.options.includes(value))
          return "Choose one of the provided options.";
        return null;
      default:
        return null;
    }
  }

  // NEW: validate all fields at once
  function validateAll(vs: Record<string, string>) {
    const next: Record<string, string | null> = {};
    for (const q of questions) {
      next[q.id] = validateOne(q, vs[q.id] ?? "");
    }
    setErrors(next);
    return next;
  }

  const requiredMissing = useMemo(
    () => questions.filter((q) => q.required && !values[q.id]),
    [questions, values]
  );

  const hasErrors = useMemo(
    () => Object.values(errors).some(Boolean), // NEW: any non-null error
    [errors]
  );

  const formInvalid = requiredMissing.length > 0 || hasErrors; // NEW

  // NEW: live validation on change
  function handleChange(q: Question, v: string) {
    setValues((prev) => {
      const next = { ...prev, [q.id]: v };
      setErrors((e) => ({ ...e, [q.id]: validateOne(q, v) }));
      return next;
    });
  }

  async function submit() {
    try {
      setBusy(true);
      setError(null);

      const final = validateAll(values); // NEW: final validation
      const anyErr = Object.values(final).some(Boolean);
      if (anyErr) return; // NEW: block submit if errors

      const { id } = await createResponse(surveyId, values);
      onSubmitted(id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to submit");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-1">{title}</h1>
      {description && <p className="text-gray-600 mb-6">{description}</p>}

      {questions.map((q) => (
        <FieldRenderer
          key={q.id}
          id={q.id}
          title={q.title}
          description={q.description}
          qtype={q.qtype}
          required={q.required}
          options={q.options}
          value={values[q.id] || ""}
          onChange={(v) => handleChange(q, v)} // UPDATED: now uses handleChange
          error={errors[q.id] || null} // NEW: pass error down
        />
      ))}

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <button
        className="inline-flex items-center justify-center rounded px-4 py-2 font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        disabled={busy || formInvalid} // UPDATED: disable when invalid
        onClick={submit}
      >
        {busy ? "Submitting…" : "Submit survey"}
      </button>

      {formInvalid && (
        <p className="text-sm text-gray-500 mt-2">
          Please fix the highlighted fields.
        </p>
      )}
    </div>
  );
}
