
import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER, description: "Score from 1 to 10." },
    feedback: { type: Type.STRING, description: "Detailed feedback." },
  },
  required: ["score", "feedback"],
};

export async function evaluateTranscript(transcript: string): Promise<EvaluationResult | null> {
  if (!transcript) return null;

  const prompt = `
    You are an expert IELTS examiner evaluating a user's spoken English based on a provided transcript. Analyze the transcript for the following criteria: Grammar, Lexical Resource, Pronunciation, and Fluency.

    Transcript:
    "${transcript}"

    Based on this text, please provide the following:
    1.  **Grammar**: Assess the range and accuracy of grammatical structures.
    2.  **Lexical Resource**: Evaluate the range of vocabulary, its accuracy, and appropriateness.
    3.  **Fluency and Coherence**: Judge the flow and coherence from the text. Note limitations as you cannot assess spoken pauses, but infer from structure.
    4.  **Pronunciation**: Since you don't have the audio, identify words/phrases in the transcript that are commonly mispronounced. Provide phonetic guidance or common pitfalls.
    5.  **Overall Feedback**: A summary of the user's performance and suggestions for improvement.
    6.  **Corrected Transcript**: A corrected version of the transcript, fixing any errors.

    Return your evaluation as a JSON object. For each of the four main criteria, provide a score from 1 to 10.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grammar: evaluationSchema,
            lexicalResource: evaluationSchema,
            pronunciation: evaluationSchema,
            fluency: evaluationSchema,
            overallFeedback: { type: Type.STRING },
            correctedTranscript: { type: Type.STRING },
          },
          required: [
            "grammar",
            "lexicalResource",
            "pronunciation",
            "fluency",
            "overallFeedback",
            "correctedTranscript"
          ],
        },
      },
    });

    const jsonText = response.text.trim();
    const result: EvaluationResult = JSON.parse(jsonText);
    return result;
  } catch (error) {
    console.error("Error evaluating transcript:", error);
    return null;
  }
}
