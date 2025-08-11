import { supabase } from "../../lib/supabase";
import type { Survey, Question, ResponseDTO } from "./types";

export async function fetchSurvey(): Promise<{
  survey: Survey;
  questions: Question[];
}> {
  const { data: survey, error: sErr } = await supabase
    .from("surveys")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (sErr || !survey) throw sErr || new Error("No survey found");

  const { data: questions, error: qErr } = await supabase
    .from("questions")
    .select("*")
    .eq("survey_id", survey.id)
    .order("order", { ascending: true });
  if (qErr) throw qErr;

  return { survey, questions: questions || [] };
}

export async function createResponse(
  surveyId: string,
  values: Record<string, string>
) {
  const { data: resp, error: rErr } = await supabase
    .from("responses")
    .insert({ survey_id: surveyId })
    .select("*")
    .maybeSingle();
  if (rErr || !resp) throw rErr || new Error("Failed to create response");

  const rows = Object.entries(values).map(([question_id, value]) => ({
    response_id: resp.id,
    question_id,
    value,
  }));
  if (rows.length) {
    const { error: aErr } = await supabase.from("answers").insert(rows);
    if (aErr) throw aErr;
  }
  return { id: resp.id as string };
}

export async function fetchResponse(id: string): Promise<ResponseDTO> {
  const { data: resp, error: rErr } = await supabase
    .from("responses")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (rErr || !resp) throw rErr || new Error("Not found");

  const [{ data: answers }, { data: qs }] = await Promise.all([
    supabase.from("answers").select("*").eq("response_id", id),
    supabase.from("questions").select("*").eq("survey_id", resp.survey_id),
  ]);

  const qMap = new Map((qs || []).map((q) => [q.id, q]));
  return {
    id: resp.id,
    survey_id: resp.survey_id,
    created_at: resp.created_at,
    answers: (answers || []).map((a) => ({
      question_id: a.question_id,
      value: a.value,
      question_title: qMap.get(a.question_id)?.title || "",
    })),
  };
}
