import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ComparisonView } from './components/ComparisonView';
import { AppStatus, ImageState, GeneratedImage } from './types';
import { fileToBase64, editImageWithGemini } from './services/geminiService';

const SUGGESTED_PROMPTS = [
  "Make my photo look formal. Change my wear to corporate suit",
  "Turn this into a pencil sketch",
  "Add a cyberpunk neon background",
  "Make it look like a vintage 1950s photo"
];

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [originalImage, setOriginalImage] = useState<ImageState | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      // Basic validation
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }
      
      // Reset state for new image
      setError(null);
      setGeneratedImage(null);
      setStatus(AppStatus.IDLE);

      const { base64, mimeType } = await fileToBase64(file);
      const previewUrl = URL.createObjectURL(file);

      setOriginalImage({
        file,
        previewUrl,
        base64Data: base64,
        mimeType
      });

    } catch (err) {
      setError("Failed to process image. Please try again.");
      console.error(err);
    }
  }, []);

  const handleReset = useCallback(() => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setStatus(AppStatus.IDLE);
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!originalImage?.base64Data || !prompt.trim()) return;

    setStatus(AppStatus.PROCESSING);
    setError(null);

    try {
      const resultDataUrl = await editImageWithGemini(
        originalImage.base64Data,
        originalImage.mimeType,
        prompt
      );

      setGeneratedImage({
        url: resultDataUrl,
        originalPrompt: prompt
      });
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "An error occurred while generating the image.");
      setStatus(AppStatus.ERROR);
    }
  }, [originalImage, prompt]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Intro / Empty State */}
        {!originalImage && (
          <div className="max-w-2xl mx-auto flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                Transform your photos with <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Gemini Nano Banana</span>
              </h2>
              <p className="text-lg text-slate-600">
                Upload a photo and describe how you want to change it. Change outfits, styles, or backgrounds in seconds.
              </p>
            </div>
            
            <ImageUploader onFileSelect={handleFileSelect} />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 opacity-75">
               <img src="https://picsum.photos/300/400?random=1" className="rounded-lg shadow-sm w-full h-32 object-cover grayscale hover:grayscale-0 transition-all" alt="Demo 1" />
               <img src="https://picsum.photos/300/400?random=2" className="rounded-lg shadow-sm w-full h-32 object-cover grayscale hover:grayscale-0 transition-all" alt="Demo 2" />
               <img src="https://picsum.photos/300/400?random=3" className="rounded-lg shadow-sm w-full h-32 object-cover grayscale hover:grayscale-0 transition-all" alt="Demo 3" />
               <img src="https://picsum.photos/300/400?random=4" className="rounded-lg shadow-sm w-full h-32 object-cover grayscale hover:grayscale-0 transition-all" alt="Demo 4" />
            </div>
          </div>
        )}

        {/* Editor View */}
        {originalImage && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            
            {/* Controls */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24 z-40">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                   <label htmlFor="prompt" className="text-sm font-semibold text-slate-700">
                    How should we change this image?
                   </label>
                   <button onClick={handleReset} className="text-xs text-slate-500 hover:text-red-500 underline">Start Over</button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        id="prompt"
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="E.g. Make my photo look formal. Change my wear to corporate suit"
                        className="flex-grow px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={status === AppStatus.PROCESSING || !prompt.trim()}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 min-w-[140px]"
                    >
                        {status === AppStatus.PROCESSING ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing
                            </>
                        ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                              </svg>
                              Generate
                            </>
                        )}
                    </button>
                </div>
                
                {/* Suggestions */}
                <div className="flex flex-wrap gap-2">
                    {SUGGESTED_PROMPTS.map((suggestion, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setPrompt(suggestion)}
                            className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors border border-slate-200"
                        >
                            {suggestion.length > 50 ? suggestion.substring(0, 50) + '...' : suggestion}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}
              </div>
            </div>

            {/* Display Area */}
            <ComparisonView 
              originalUrl={originalImage.previewUrl!} 
              generatedImage={generatedImage}
              isLoading={status === AppStatus.PROCESSING}
            />
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} NanoStyle Editor. Using Gemini 2.5 Flash Image.</p>
      </footer>
    </div>
  );
};

export default App;