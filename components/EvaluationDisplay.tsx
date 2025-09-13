
import React from 'react';
import { EvaluationResult } from '../types';
import FeedbackCard from './FeedbackCard';

interface EvaluationDisplayProps {
  result: EvaluationResult;
  onReset: () => void;
}

const EvaluationDisplay: React.FC<EvaluationDisplayProps> = ({ result, onReset }) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-cyan-400">Your Evaluation Results</h2>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 text-white">Corrected Transcript</h3>
        <p className="text-slate-300 italic">{result.correctedTranscript}</p>
      </div>
      
      <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 text-white">Overall Feedback</h3>
        <p className="text-slate-300">{result.overallFeedback}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeedbackCard title="Grammar" data={result.grammar} />
        <FeedbackCard title="Lexical Resource" data={result.lexicalResource} />
        <FeedbackCard title="Fluency & Coherence" data={result.fluency} />
        <FeedbackCard title="Pronunciation" data={result.pronunciation} />
      </div>
      
      <div className="text-center mt-8">
        <button
          onClick={onReset}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 text-lg shadow-lg"
        >
          Evaluate Again
        </button>
      </div>
    </div>
  );
};

export default EvaluationDisplay;
