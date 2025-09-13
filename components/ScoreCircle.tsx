
import React from 'react';

interface ScoreCircleProps {
  score: number;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score }) => {
  const getColor = () => {
    if (score >= 8) return 'border-green-400 text-green-300';
    if (score >= 5) return 'border-yellow-400 text-yellow-300';
    return 'border-red-400 text-red-300';
  };

  return (
    <div
      className={`w-20 h-20 rounded-full border-4 flex items-center justify-center bg-slate-700/50 ${getColor()}`}
    >
      <span className="text-3xl font-bold">{score}</span>
      <span className="text-sm self-end mb-3">/10</span>
    </div>
  );
};

export default ScoreCircle;
