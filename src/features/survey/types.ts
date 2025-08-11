export type QuestionType = "text" | "number" | "select" | "radio";

export interface Survey {
  id: string;
  title: string;
  description?: string | null;
}
export interface Question {
  id: string;
  survey_id: string;
  order: number;
  title: string;
  description?: string | null;
  qtype: QuestionType;
  required: boolean;
  options?: string[] | null;
}
export interface ResponseDTO {
  id: string;
  survey_id: string;
  created_at: string;
  answers: { question_id: string; value: string; question_title: string }[];
}
