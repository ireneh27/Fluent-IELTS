import React, { useState, useEffect } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { StudyPlan as IStudyPlan, Feedback } from '../types';
import { Calendar, Target, ListChecks, Sparkles, AlertCircle, Clock, BookOpen, Mic } from 'lucide-react';

export const StudyPlan: React.FC = () => {
  const [plan, setPlan] = useState<IStudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentBand, setCurrentBand] = useState<number>(6.0);
  const [targetBand, setTargetBand] = useState<number>(7.0);
  const [recentFeedback, setRecentFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ielts_last_performance');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.feedback) {
        setRecentFeedback(parsed.feedback);
        if (parsed.feedback.bandScore) {
            setCurrentBand(parsed.feedback.bandScore);
            setTargetBand(Math.min(9, parsed.feedback.bandScore + 1));
        }
      }
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateStudyPlan(currentBand, targetBand, recentFeedback);
    setPlan(result);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Calendar className="text-indigo-600" size={32} />
          Adaptive Study Plan
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          AI analyzes your mock test performance to create a high-impact, 3-day schedule tailored to your weak points.
        </p>
      </div>

      {!plan && (
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 max-w-2xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Current Band</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0" max="9" step="0.5"
                    value={currentBand}
                    onChange={(e) => setCurrentBand(parseFloat(e.target.value))}
                    className="w-full pl-4 pr-4 py-4 rounded-xl border border-slate-300 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-xl font-semibold text-slate-800 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">IELTS</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Target Band</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0" max="9" step="0.5"
                    value={targetBand}
                    onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                    className="w-full pl-4 pr-4 py-4 rounded-xl border border-slate-300 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-xl font-semibold text-indigo-600 transition-all"
                  />
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">Goal</div>
                </div>
              </div>
            </div>

            {recentFeedback && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-start animate-fade-in">
                <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-amber-800 leading-relaxed">
                  <span className="font-bold block mb-1">Performance Data Found</span>
                  Integrating your recent <strong>Band {recentFeedback.bandScore}</strong> mock test results. The plan will specifically target your <em>{recentFeedback.fluency.toLowerCase().includes('hesitation') ? 'fluency' : 'grammar'}</em>.
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>Generating Roadmap... <Sparkles className="animate-spin" /></>
              ) : (
                <>Generate Optimized Plan <Sparkles /></>
              )}
            </button>
          </div>
        </div>
      )}

      {plan && (
        <div className="grid lg:grid-cols-3 gap-8 animate-fade-in-up">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-2">Assessment</h3>
                 <p className="text-lg font-light leading-relaxed italic">"{plan.currentLevelAssessment}"</p>
                 
                 <div className="mt-8 pt-8 border-t border-white/10">
                    <h4 className="flex items-center gap-2 font-bold mb-4 text-white">
                       <Target className="text-red-400" size={20} /> Priorities
                    </h4>
                    <ul className="space-y-3">
                      {plan.focusAreas.map((area, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-indigo-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div>
                          {area}
                        </li>
                      ))}
                    </ul>
                 </div>
               </div>
               {/* Decor */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
            </div>

            <button 
              onClick={() => setPlan(null)}
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-600 font-semibold rounded-xl border border-slate-200 transition-colors"
            >
              Adjust Parameters
            </button>
          </div>

          {/* Timeline Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h4 className="font-bold text-2xl text-slate-900 mb-8 flex items-center gap-2">
                <ListChecks className="text-indigo-600" /> Action Roadmap
              </h4>
              
              <div className="space-y-0 relative">
                 {/* Timeline Line */}
                 <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-100"></div>

                 {plan.schedule.map((day, idx) => (
                   <div key={day.day} className="relative pl-20 pb-12 last:pb-0 group">
                      {/* Date Bubble */}
                      <div className="absolute left-0 top-0 w-16 h-16 bg-white border-2 border-indigo-100 rounded-2xl flex flex-col items-center justify-center z-10 shadow-sm group-hover:border-indigo-500 transition-colors">
                        <span className="text-xs text-slate-400 font-bold uppercase">Day</span>
                        <span className="text-2xl font-bold text-indigo-600">{day.day}</span>
                      </div>
                      
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-colors">
                        <h5 className="font-bold text-slate-900 text-lg mb-1">{day.focus}</h5>
                        <div className="flex flex-col gap-3 mt-4">
                          {day.activities.map((act, i) => (
                            <div key={i} className="flex items-start gap-3 text-slate-700 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                               <div className="mt-0.5 text-indigo-500">
                                  {act.toLowerCase().includes('speak') || act.toLowerCase().includes('practice') ? <Mic size={16} /> : <BookOpen size={16} />}
                               </div>
                               <span className="text-sm">{act}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};