import { useEffect, useState } from "react";
import { fetchSurvey, fetchResponse } from "./api";
import { SurveyForm } from "./SurveyForm";
import { Review } from "./Review";
import type { Question, ResponseDTO } from "./types";

export default function SurveyPage() {
  const [loading, setLoading] = useState(true);
  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState<string | undefined>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responseId, setResponseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<ResponseDTO | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { survey, questions } = await fetchSurvey();
        setSurveyId(survey.id);
        setTitle(survey.title);
        setDesc(survey.description ?? undefined);
        setQuestions(questions);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Failed to load");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!responseId) return;
    (async () => {
      const r = await fetchResponse(responseId);
      setReviewData(r);
    })();
  }, [responseId]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!surveyId) return <div className="p-6">No survey available</div>;

  return (
    <div className="p-6">
      {!reviewData ? (
        <SurveyForm
          surveyId={surveyId}
          title={title}
          description={desc}
          questions={questions}
          onSubmitted={setResponseId}
        />
      ) : (
        <Review data={reviewData} />
      )}
    </div>
  );
}
