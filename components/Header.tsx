import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            N
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">NanoStyle <span className="text-indigo-600">Editor</span></h1>
        </div>
        <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Powered by Gemini 2.5 Flash Image
        </div>
      </div>
    </header>
  );
};