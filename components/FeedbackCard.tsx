
import React from 'react';
import ScoreCircle from './ScoreCircle';
import { EvaluationCriteria } from '../types';

interface FeedbackCardProps {
  title: string;
  data: EvaluationCriteria;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ title, data }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
      <h3 className="text-xl font-semibold text-cyan-400 mb-4">{title}</h3>
      <ScoreCircle score={data.score} />
      <p className="text-slate-300 mt-4 text-left">{data.feedback}</p>
    </div>
  );
};

export default FeedbackCard;
