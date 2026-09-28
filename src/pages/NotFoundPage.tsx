import React from 'react';
import type { NavSectionId } from '../types';
import { ShieldAlert, Home } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate?: (section: NavSectionId) => void;
  onNavigateHome?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate, onNavigateHome }) => {
  const handleHomeClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else if (onNavigate) {
      onNavigate('home');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[#F5F7FA] border border-slate-300 rounded-3xl p-8 space-y-5 shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-[#003366] text-[#F2B705] flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-[#003366] uppercase tracking-wider">ERROR 404 • PAGE NOT FOUND</span>
          <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Requested Academic Route Does Not Exist</h1>
          <p className="text-xs text-[#555555] leading-relaxed">
            The URL path or hash route you navigated to could not be located in the UPSA IT Studies directory.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={handleHomeClick}
            className="px-5 py-2.5 rounded-lg bg-[#003366] text-white hover:bg-blue-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4 text-[#F2B705]" />
            <span>Return to Home</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate('academics/programmes')}
            className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-200 text-xs font-bold uppercase tracking-wider"
          >
            Browse Programmes
          </button>
        </div>
      </div>
    </div>
  );
};
