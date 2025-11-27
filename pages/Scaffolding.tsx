import React, { useState } from 'react';
import { generateQuestion, generateScaffolding, evaluateSpeaking } from '../services/geminiService';
import { ScaffoldingTip, Feedback, SpeakingPart } from '../types';
import { AudioRecorder } from '../components/AudioRecorder';
import { Lightbulb, MessageCircle, ChevronRight, CheckCircle2 } from 'lucide-react';

export const Scaffolding: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [tip, setTip] = useState<ScaffoldingTip | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingTip, setLoadingTip] = useState(false);
  const [processingAudio, setProcessingAudio] = useState(false);

  const getNewQuestion = async () => {
    setLoadingQuestion(true);
    setTip(null);
    setFeedback(null);
    setQuestion('');
    const q = await generateQuestion(SpeakingPart.PART_2, "travel or daily life");
    setQuestion(q);
    setLoadingQuestion(false);
  };

  const getHints = async () => {
    if (!question) return;
    setLoadingTip(true);
    const hints = await generateScaffolding(question);
    setTip(hints);
    setLoadingTip(false);
  };

  const handleAudioComplete = async (base64: string) => {
    setProcessingAudio(true);
    const result = await evaluateSpeaking(base64, question, SpeakingPart.PART_2);
    setFeedback(result);
    setProcessingAudio(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <Lightbulb className="text-yellow-500" size={32} />
          Guided Practice
        </h2>
        <p className="text-slate-600">
          Get a question, unlock structure hints, and practice with AI feedback.
        </p>
      </div>

      {/* Step 1: Question */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-6">
        {!question ? (
          <button 
            onClick={getNewQuestion}
            disabled={loadingQuestion}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            {loadingQuestion ? "Generating..." : "Start Practice Session"}
          </button>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-sm font-semibold tracking-widest text-slate-400 uppercase">Question</span>
              <h3 className="text-2xl font-serif font-medium text-slate-900 leading-relaxed">
                "{question}"
              </h3>
            </div>
            
            {!tip && (
              <button 
                onClick={getHints}
                disabled={loadingTip}
                className="flex items-center gap-2 mx-auto px-6 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full font-medium transition-colors"
              >
                <Lightbulb size={18} />
                {loadingTip ? "Analyzing..." : "Show Hints & Structure"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Step 2: Scaffolding Hints */}
      {tip && (
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm animate-fade-in">
          <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <MessageCircle size={20} /> Suggested Strategy
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-indigo-400 uppercase">Structure</span>
              <ul className="space-y-2">
                {tip.structure.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-white p-2 rounded border border-indigo-50">
                    <span className="bg-indigo-100 text-indigo-700 w-5 h-5 flex items-center justify-center rounded-full text-xs shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <span className="text-xs font-bold text-indigo-400 uppercase">Key Phrases</span>
              <div className="flex flex-wrap gap-2">
                {tip.keyPhrases.map((phrase, i) => (
                  <span key={i} className="px-3 py-1 bg-white text-indigo-800 text-sm border border-indigo-100 rounded-full shadow-sm">
                    {phrase}
                  </span>
                ))}
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-100">
                <span className="text-xs font-bold text-indigo-400 uppercase block mb-1">Opener</span>
                <p className="italic text-slate-600 text-sm">"{tip.sampleOpener}..."</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Recording */}
      {question && (
        <div className="space-y-4">
           <h4 className="text-center font-semibold text-slate-500 uppercase tracking-wider text-sm">Your Turn</h4>
           <AudioRecorder 
             onRecordingComplete={handleAudioComplete} 
             isProcessing={processingAudio}
           />
        </div>
      )}

      {/* Step 4: Feedback */}
      {feedback && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-green-500/20 space-y-6 scroll-mt-20">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" />
              AI Feedback
            </h3>
            <div className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold">
              Band {feedback.bandScore}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FeedbackItem label="Fluency & Coherence" content={feedback.fluency} />
              <FeedbackItem label="Lexical Resource" content={feedback.lexicalResource} />
            </div>
            <div className="space-y-4">
              <FeedbackItem label="Grammatical Range" content={feedback.grammaticalRange} />
              <FeedbackItem label="Pronunciation" content={feedback.pronunciation} />
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <span className="text-sm font-bold text-green-700 uppercase tracking-wider block mb-2">Improved Version</span>
            <p className="text-slate-800 leading-relaxed">
              {feedback.improvedVersion}
            </p>
          </div>
          
          <button 
            onClick={getNewQuestion}
            className="w-full py-3 mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Next Question <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

const FeedbackItem = ({ label, content }: { label: string, content: string }) => (
  <div>
    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
    <p className="text-sm text-slate-700 mt-1">{content}</p>
  </div>
);
