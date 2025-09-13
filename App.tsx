import React, { useState, useEffect, useRef } from 'react';
import { EvaluationResult } from './types';
import { evaluateTranscript } from './services/geminiService';
import RecorderControl from './components/RecorderControl';
import EvaluationDisplay from './components/EvaluationDisplay';
import LoaderIcon from './components/icons/LoaderIcon';

enum AppState {
  Idle,
  Recording,
  Loading,
  Result,
  Error,
}

// Check for SpeechRecognition API
// Fix for line 18: Cast window to any to access non-standard properties and rename variable to avoid shadowing the 'SpeechRecognition' type.
const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Idle);
  const [transcript, setTranscript] = useState('');
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fix for line 26: Use of 'SpeechRecognition' as a type is now valid after renaming the constant that was shadowing it.
  const recognition = useRef<SpeechRecognition | null>(null);
  const isSupported = !!SpeechRecognitionAPI;

  useEffect(() => {
    if (!isSupported) {
        setError("Speech recognition is not supported by your browser. Please try Google Chrome or Microsoft Edge.");
        setAppState(AppState.Error);
        return;
    }

    const recogInstance = new SpeechRecognitionAPI();
    recogInstance.continuous = true;
    recogInstance.interimResults = true;
    recogInstance.lang = 'en-US';

    recogInstance.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript + interimTranscript);
    };

    recogInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}. Please check your microphone permissions.`);
        setAppState(AppState.Error);
    };

    recognition.current = recogInstance;
  }, [isSupported]);
  

  const handleStart = () => {
    if (recognition.current) {
      setTranscript('');
      setEvaluationResult(null);
      setError(null);
      recognition.current.start();
      setAppState(AppState.Recording);
    }
  };

  const handleStop = async () => {
    if (recognition.current) {
      recognition.current.stop();
      setAppState(AppState.Loading);
      
      // A short delay to allow final transcript processing
      setTimeout(async () => {
        const finalTranscript = transcript.trim();
        if (finalTranscript) {
          const result = await evaluateTranscript(finalTranscript);
          if (result) {
            setEvaluationResult(result);
            setAppState(AppState.Result);
          } else {
            setError('Failed to get evaluation from AI. Please try again.');
            setAppState(AppState.Error);
          }
        } else {
          setError('No speech was detected. Please try again.');
          setAppState(AppState.Error);
        }
      }, 500);
    }
  };
  
  const handleReset = () => {
      setTranscript('');
      setEvaluationResult(null);
      setError(null);
      setAppState(AppState.Idle);
  }

  const renderContent = () => {
    switch (appState) {
      case AppState.Loading:
        return (
          <div className="flex flex-col items-center justify-center gap-4">
            <LoaderIcon className="w-16 h-16 text-cyan-500" />
            <p className="text-xl text-slate-300">Evaluating your speech...</p>
          </div>
        );
      case AppState.Result:
        return evaluationResult && <EvaluationDisplay result={evaluationResult} onReset={handleReset} />;
      case AppState.Error:
          return (
              <div className="text-center bg-slate-800 p-8 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold text-red-400 mb-4">An Error Occurred</h2>
                  <p className="text-slate-300 mb-6">{error}</p>
                  <button onClick={handleReset} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
                      Try Again
                  </button>
              </div>
          );
      case AppState.Idle:
      case AppState.Recording:
      default:
        return (
          <RecorderControl
            isRecording={appState === AppState.Recording}
            transcript={transcript}
            onStart={handleStart}
            onStop={handleStop}
            isSupported={isSupported}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Spoken English Evaluator
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Your Personal AI Speaking Coach</p>
      </header>
      <main className="w-full flex items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
