
import React from 'react';
import MicIcon from './icons/MicIcon';
import StopIcon from './icons/StopIcon';

interface RecorderControlProps {
  isRecording: boolean;
  transcript: string;
  onStart: () => void;
  onStop: () => void;
  isSupported: boolean;
}

const RecorderControl: React.FC<RecorderControlProps> = ({
  isRecording,
  transcript,
  onStart,
  onStop,
  isSupported
}) => {
  return (
    <div className="w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6">
      {!isSupported && <p className="text-red-400">Speech recognition is not supported in this browser. Please use Chrome or Edge.</p>}
      <h2 className="text-2xl font-bold text-center text-cyan-400">
        {isRecording ? "Listening..." : "Let's hear your English!"}
      </h2>
      <p className="text-slate-400 text-center">
        Click the button and start speaking. When you're done, click stop to get your evaluation.
      </p>

      <button
        onClick={isRecording ? onStop : onStart}
        disabled={!isSupported}
        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out shadow-lg
        ${isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-cyan-600 hover:bg-cyan-700'}
        disabled:bg-slate-600 disabled:cursor-not-allowed`}
      >
        {isRecording ? <StopIcon className="w-10 h-10 text-white" /> : <MicIcon className="w-10 h-10 text-white" />}
      </button>

      <div className="w-full h-48 bg-slate-900 rounded-lg p-4 overflow-y-auto border border-slate-700">
        <p className="text-slate-300 whitespace-pre-wrap">{transcript || "Your transcript will appear here..."}</p>
      </div>
    </div>
  );
};

export default RecorderControl;
