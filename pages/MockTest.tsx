import React, { useState, useEffect } from 'react';
import { generateQuestion, evaluateSpeaking } from '../services/geminiService';
import { Feedback, SpeakingPart } from '../types';
import { AudioRecorder } from '../components/AudioRecorder';
import { Mic2, Clock, CheckCircle, ChevronRight, BarChart3, AlertCircle, PlayCircle } from 'lucide-react';

export const MockTest: React.FC = () => {
  const [part, setPart] = useState<SpeakingPart>(SpeakingPart.PART_1);
  const [question, setQuestion] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    loadPart(SpeakingPart.PART_1);
  }, []);

  const loadPart = async (newPart: SpeakingPart) => {
    setPart(newPart);
    setLoading(true);
    setFeedback(null);
    setQuestion('');
    const q = await generateQuestion(newPart);
    setQuestion(q);
    setLoading(false);
  };

  const handleAudioComplete = async (base64: string) => {
    setProcessing(true);
    const result = await evaluateSpeaking(base64, question, part);
    setFeedback(result);
    setProcessing(false);

    if (result) {
      localStorage.setItem('ielts_last_performance', JSON.stringify({
        timestamp: Date.now(),
        feedback: result
      }));
    }
  };

  const nextPart = () => {
    if (part === SpeakingPart.PART_1) loadPart(SpeakingPart.PART_2);
    else if (part === SpeakingPart.PART_2) loadPart(SpeakingPart.PART_3);
    else {
      if (confirm("Test complete! Restart?")) {
        loadPart(SpeakingPart.PART_1);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Sidebar */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
               <Mic2 size={20} />
            </div>
            <div>
               <h3 className="font-bold text-slate-800">Mock Exam</h3>
               <p className="text-xs text-slate-500">Speaking Simulation</p>
            </div>
          </div>
          
          <div className="space-y-0 relative">
            {/* Connecting line */}
            <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-slate-100 -z-10"></div>
            
            <Step 
              active={part === SpeakingPart.PART_1} 
              completed={part !== SpeakingPart.PART_1} 
              title="Part 1: Intro" 
              subtitle="Personal Q&A"
            />
            <Step 
              active={part === SpeakingPart.PART_2} 
              completed={part === SpeakingPart.PART_3} 
              title="Part 2: Long Turn" 
              subtitle="2 min speech"
            />
            <Step 
              active={part === SpeakingPart.PART_3} 
              completed={false} 
              title="Part 3: Discussion" 
              subtitle="Abstract ideas"
            />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl">
               <Clock className="text-blue-600 shrink-0 mt-0.5" size={16} />
               <p className="text-xs text-blue-800 leading-relaxed font-medium">
                 {part === SpeakingPart.PART_1 && "Keep answers between 15-20 seconds. Be natural."}
                 {part === SpeakingPart.PART_2 && "You have 1 minute to prepare notes. Use it wisely!"}
                 {part === SpeakingPart.PART_3 && "Explain 'why' and give examples. Expand your answers."}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-9">
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-200 overflow-hidden min-h-[600px] flex flex-col relative">
          
          {/* Header Bar */}
          <div className="bg-slate-50 border-b border-slate-100 px-8 py-5 flex justify-between items-center">
             <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
               <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`}></span>
               {loading ? 'Examiner Preparing...' : 'Examiner Ready'}
             </div>
             <div className="text-slate-400">
               <PlayCircle size={20} />
             </div>
          </div>

          <div className="p-8 flex-1 flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-fade-in">
                 <div className="relative">
                   <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                     <Mic2 size={24} className="text-slate-300" />
                   </div>
                 </div>
                 <p className="text-slate-500 font-medium">Generating a unique question...</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
                <div className="mb-10 text-center space-y-4">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    Current Topic
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif text-slate-800 leading-tight">
                    {question}
                  </h2>
                </div>

                {!feedback ? (
                  <div className="mt-auto flex flex-col items-center justify-center py-12">
                    <AudioRecorder 
                      onRecordingComplete={handleAudioComplete}
                      isProcessing={processing}
                    />
                    <p className="mt-8 text-slate-400 text-sm">
                      {processing ? "Analyzing speech patterns..." : "Tap microphone to begin answering"}
                    </p>
                  </div>
                ) : (
                  <div className="mt-8 space-y-8 animate-fade-in-up">
                    {/* Scorecard */}
                    <div className="bg-slate-900 rounded-2xl p-1 text-white shadow-xl">
                      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                        <div className="flex justify-between items-center mb-6">
                           <div>
                             <h3 className="text-xl font-bold">Performance Report</h3>
                             <p className="text-slate-400 text-sm">AI Assessment</p>
                           </div>
                           <div className="flex flex-col items-end">
                              <span className="text-4xl font-bold text-green-400">{feedback.bandScore}</span>
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Band Score</span>
                           </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                           <ScoreMetric label="Fluency & Coherence" score={feedback.fluency} />
                           <ScoreMetric label="Lexical Resource" score={feedback.lexicalResource} />
                           <ScoreMetric label="Grammatical Range" score={feedback.grammaticalRange} />
                           <ScoreMetric label="Pronunciation" score={feedback.pronunciation} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="bg-green-200 text-green-700 p-1.5 rounded-lg">
                           <CheckCircle size={18} />
                         </div>
                         <h4 className="font-bold text-green-900">Better Way to Say It</h4>
                      </div>
                      <p className="text-green-800 leading-relaxed pl-10 border-l-2 border-green-200 ml-3 italic">
                        "{feedback.improvedVersion}"
                      </p>
                    </div>

                    <button 
                      onClick={nextPart}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {part === SpeakingPart.PART_3 ? "Complete Test" : "Continue to Next Part"} 
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Step = ({ active, completed, title, subtitle }: { active: boolean, completed: boolean, title: string, subtitle: string }) => (
  <div className={`flex items-center gap-4 py-4 relative z-10 ${active ? 'opacity-100 scale-105 origin-left' : 'opacity-60'} transition-all duration-300`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors duration-300 border-2 ${
      completed ? 'bg-green-500 border-green-500 text-white' : active ? 'bg-white border-blue-600 text-blue-600' : 'bg-white border-slate-200 text-slate-300'
    }`}>
      {completed ? <CheckCircle size={20} /> : <span className="font-bold text-sm">{title.split(':')[0].replace('Part ', '')}</span>}
    </div>
    <div>
      <h5 className={`font-bold text-sm ${active ? 'text-slate-900' : 'text-slate-600'}`}>{title}</h5>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  </div>
);

const ScoreMetric = ({ label, score }: { label: string, score: string }) => (
  <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</div>
    <div className="text-sm text-slate-200 leading-snug">{score}</div>
  </div>
);