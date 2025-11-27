import React, { useState } from 'react';
import { generateVocabularyList } from '../services/geminiService';
import { VocabWord } from '../types';
import { BookOpen, Search, Volume2, Loader2, Sparkles, Plus } from 'lucide-react';

export const Vocabulary: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [words, setWords] = useState<VocabWord[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    const result = await generateVocabularyList(topic);
    setWords(result);
    setLoading(false);
  };

  const speakWord = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="text-center space-y-4 pt-4">
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
          Vocabulary Expander
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-lg">
          Generate band 8.0+ vocabulary for any IELTS topic instantly.
        </p>
      </div>

      <div className="max-w-xl mx-auto relative group">
        <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative flex bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex-1 flex items-center px-4">
            <Search className="text-slate-400 mr-3" size={20} />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g., Environment, Education, Crime..."
              className="flex-1 py-3 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={18} />}
            Generate
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {words.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group overflow-hidden flex flex-col">
            <div className="p-6 pb-4 flex justify-between items-start bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-blue-700 transition-colors">{item.word}</h3>
                <span className="inline-block mt-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-xs text-slate-400 font-medium">noun/verb</span>
              </div>
              <button 
                onClick={() => speakWord(item.word)}
                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-full transition-all"
              >
                <Volume2 size={20} />
              </button>
            </div>
            
            <div className="p-6 pt-2 space-y-4 flex-grow flex flex-col">
              <div className="flex-grow">
                 <p className="text-slate-600 leading-relaxed text-sm mb-4">{item.definition}</p>
                 <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                   <p className="text-blue-900 italic text-sm font-medium">"{item.example}"</p>
                 </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex flex-wrap gap-2">
                  {item.synonyms.map((syn, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md border border-slate-200">
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!loading && words.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
             <BookOpen size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No words generated yet</h3>
          <p className="text-slate-400">Enter a topic above to build your vocabulary list.</p>
        </div>
      )}
    </div>
  );
};