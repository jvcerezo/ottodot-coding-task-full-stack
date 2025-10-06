// Database types
export type MathProblemSession = {
  id: string;
  created_at: string;
  problem_text: string;
  correct_answer: number;
};

export type MathProblemSubmission = {
  id: string;
  session_id: string;
  user_answer: number;
  is_correct: boolean;
  feedback_text: string;
  created_at: string;
};

// API types
export type GeneratedProblem = {
  problem_text: string;
  final_answer: number;
  hint?: string;
  solution_steps?: string[];
};

export type SubmissionResponse = {
  is_correct: boolean;
  feedback_text: string;
  submission_id: string;
};
