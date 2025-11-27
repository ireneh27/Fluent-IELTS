import React from 'react';
import { AppView } from '../types';
import { BookOpen, Lightbulb, Mic2, ArrowRight, Calendar, TrendingUp } from 'lucide-react';

interface HomeProps {
  onChangeView: (view: AppView) => void;
}

export const Home: React.FC<HomeProps> = ({ onChangeView }) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <div className="relative text-center space-y-8 max-w-4xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-4 animate-fade-in">
          <TrendingUp size={16} />
          <span>New: AI Study Plans Available</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Your Personal <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">IELTS Examiner</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-light">
          Master vocabulary, perfect your pronunciation, and get instant band score predictions with advanced AI.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => onChangeView(AppView.MOCK_TEST)}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            Start Free Mock Test <ArrowRight size={20} />
          </button>
          <button 
             onClick={() => onChangeView(AppView.STUDY_PLAN)}
             className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-bold text-lg transition-all hover:shadow-lg flex items-center justify-center gap-2"
          >
            Create Study Plan
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        <FeatureCard 
          icon={<BookOpen className="text-blue-600" size={28} />}
          title="Smart Vocabulary"
          desc="Context-aware word lists tailored to IELTS topics."
          onClick={() => onChangeView(AppView.VOCABULARY)}
          delay={0}
        />
        <FeatureCard 
          icon={<Lightbulb className="text-amber-500" size={28} />}
          title="Answer Scaffolding"
          desc="Learn structures to extend your answers logically."
          onClick={() => onChangeView(AppView.SCAFFOLDING)}
          delay={100}
        />
        <FeatureCard 
          icon={<Mic2 className="text-rose-500" size={28} />}
          title="Realistic Mock Tests"
          desc="Simulate the full 3-part exam with strict timing."
          onClick={() => onChangeView(AppView.MOCK_TEST)}
          delay={200}
        />
        <FeatureCard 
          icon={<Calendar className="text-indigo-500" size={28} />}
          title="Adaptive Plans"
          desc="Daily schedules based on your performance data."
          onClick={() => onChangeView(AppView.STUDY_PLAN)}
          delay={300}
        />
      </div>

      {/* Stats / Trust Section */}
      <div className="border-t border-slate-200 pt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
          <StatItem label="Active Learners" value="10k+" />
          <StatItem label="Words Learned" value="500k+" />
          <StatItem label="Mock Tests Taken" value="25k+" />
          <StatItem label="Avg Band Increase" value="1.5" />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, onClick, delay }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void, delay: number }) => (
  <button 
    onClick={onClick}
    style={{ animationDelay: `${delay}ms` }}
    className="group relative p-8 bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-100 transition-all duration-300 text-left h-full flex flex-col items-start animate-fade-in-up"
  >
    <div className="mb-6 p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
    <p className="text-slate-500 leading-relaxed">
      {desc}
    </p>
    <div className="mt-auto pt-6 flex items-center text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
      Try Now <ArrowRight size={16} className="ml-1" />
    </div>
  </button>
);

const StatItem = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-1">
    <div className="text-3xl md:text-4xl font-extrabold text-slate-900">{value}</div>
    <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</div>
  </div>
);