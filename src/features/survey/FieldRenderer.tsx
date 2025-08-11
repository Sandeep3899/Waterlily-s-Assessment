import type { QuestionType } from "./types";

export function FieldRenderer({
  id,
  title,
  description,
  qtype,
  required,
  options,
  value,
  onChange,
  error, // NEW: added error prop
}: {
  id: string;
  title: string;
  description?: string | null;
  qtype: QuestionType;
  required: boolean;
  options?: string[] | null;
  value: string;
  onChange: (v: string) => void;
  error?: string | null; // NEW: optional error message for validation
}) {
  // NEW: dynamic base class for error styling
  const base =
    "w-full rounded border p-2 bg-white outline-none " +
    (error
      ? "border-red-500 focus:ring-2 focus:ring-red-300"
      : "border-gray-300 focus:ring-2 focus:ring-indigo-300");

  // NEW: connect error text to input for accessibility
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="mb-5">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {title} {required && <span className="text-red-600">*</span>}
      </label>
      {description && (
        <p className="text-sm text-gray-500 mb-2">{description}</p>
      )}

      {qtype === "text" && (
        <input
          id={id}
          className={base} // UPDATED: use dynamic base
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error} // NEW
          aria-describedby={describedBy} // NEW
          placeholder="Type here" // NEW: example placeholder
        />
      )}

      {qtype === "number" && (
        <input
          id={id}
          type="number"
          className={base}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error} // NEW
          aria-describedby={describedBy} // NEW
          placeholder="0" // NEW
        />
      )}

      {qtype === "select" && (
        <select
          id={id}
          className={base}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error} // NEW
          aria-describedby={describedBy} // NEW
        >
          <option value="">Select…</option>
          {(options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {qtype === "radio" && (
        <div
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={error ? "ring-2 ring-red-300 rounded p-2" : ""}
        >
          {" "}
          {/* NEW */}
          {(options || []).map((opt) => (
            <label key={opt} className="inline-flex items-center gap-2 mr-4">
              <input
                type="radio"
                name={id}
                value={opt}
                checked={value === opt}
                onChange={(e) => onChange(e.target.value)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}

      {error && ( // NEW: error message
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
