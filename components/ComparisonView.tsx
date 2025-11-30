import React from 'react';
import { GeneratedImage } from '../types';

interface ComparisonViewProps {
  originalUrl: string;
  generatedImage: GeneratedImage | null;
  isLoading: boolean;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ originalUrl, generatedImage, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Original Image */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Original</span>
        </div>
        <div className="relative aspect-[3/4] w-full bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200">
          <img 
            src={originalUrl} 
            alt="Original upload" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Generated Image */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">Gemini Result</span>
            {generatedImage && (
                 <a 
                 href={generatedImage.url} 
                 download="gemini-edit.png"
                 className="text-xs text-indigo-600 hover:text-indigo-800 underline font-medium"
               >
                 Download
               </a>
            )}
        </div>
        <div className="relative aspect-[3/4] w-full bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200 flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 p-6 text-center">
               <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
               <p className="text-slate-600 font-medium animate-pulse">Thinking & Creating...</p>
               <p className="text-xs text-slate-400 max-w-xs">Using gemini-2.5-flash-image to interpret your prompt and edit the pixels.</p>
            </div>
          ) : generatedImage ? (
            <img 
              src={generatedImage.url} 
              alt="Generated result" 
              className="w-full h-full object-contain animate-in fade-in duration-700"
            />
          ) : (
            <div className="text-slate-400 flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
              <span className="text-sm">Result will appear here</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};