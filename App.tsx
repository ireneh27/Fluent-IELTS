import React, { useState } from 'react';
import { AppView } from './types';
import { Home } from './pages/Home';
import { Vocabulary } from './pages/Vocabulary';
import { Scaffolding } from './pages/Scaffolding';
import { MockTest } from './pages/MockTest';
import { StudyPlan } from './pages/StudyPlan';
import { Layers, Github } from 'lucide-react';

interface NavItemProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ children, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    {children}
  </button>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.VOCABULARY:
        return <Vocabulary />;
      case AppView.SCAFFOLDING:
        return <Scaffolding />;
      case AppView.MOCK_TEST:
        return <MockTest />;
      case AppView.STUDY_PLAN:
        return <StudyPlan />;
      case AppView.DASHBOARD:
      default:
        return <Home onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setCurrentView(AppView.DASHBOARD)}
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Layers size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">FluentIELTS<span className="text-blue-600">.ai</span></h1>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Speaking Coach</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50">
            <NavItem active={currentView === AppView.DASHBOARD} onClick={() => setCurrentView(AppView.DASHBOARD)}>Dashboard</NavItem>
            <NavItem active={currentView === AppView.VOCABULARY} onClick={() => setCurrentView(AppView.VOCABULARY)}>Vocabulary</NavItem>
            <NavItem active={currentView === AppView.SCAFFOLDING} onClick={() => setCurrentView(AppView.SCAFFOLDING)}>Practice</NavItem>
            <NavItem active={currentView === AppView.MOCK_TEST} onClick={() => setCurrentView(AppView.MOCK_TEST)}>Mock Test</NavItem>
            <NavItem active={currentView === AppView.STUDY_PLAN} onClick={() => setCurrentView(AppView.STUDY_PLAN)}>Plan</NavItem>
          </nav>

          <div className="md:hidden">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">MENU</span>
          </div>
        </div>
      </header>

      {/* Main Content Spacer for fixed header */}
      <div className="h-24"></div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-semibold text-slate-900">FluentIELTS AI</p>
            <p className="text-slate-500 text-sm mt-1">AI-powered preparation for IELTS Speaking.</p>
          </div>
          <div className="flex gap-6 text-sm text-slate-500 font-medium">
             <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;