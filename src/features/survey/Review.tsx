import type { ResponseDTO } from "./types";

export function Review({ data }: { data: ResponseDTO }) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Your submission</h2>
      <ul className="space-y-3">
        {data.answers.map((a) => (
          <li key={a.question_id} className="border rounded-xl p-3">
            <div className="text-sm text-gray-500">{a.question_title}</div>
            <div className="text-base">
              {a.value || <em className="text-gray-400">(empty)</em>}
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500 mt-4">
        Submitted at: {new Date(data.created_at).toLocaleString()}
      </p>
    </div>
  );
}
