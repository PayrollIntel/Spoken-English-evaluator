
export interface EvaluationCriteria {
  score: number; // Score out of 10
  feedback: string;
}

export interface EvaluationResult {
  grammar: EvaluationCriteria;
  lexicalResource: EvaluationCriteria;
  pronunciation: EvaluationCriteria;
  fluency: EvaluationCriteria;
  overallFeedback: string;
  correctedTranscript: string;
}
