/**
 * Clerk
 * Developed by Batuhan Ayrıbaş in the Rootcastle ecosystem.
 */

import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { ClerkInput, ClerkResponse } from './types';
import { generateMessages } from './services/geminiService';
import { Bot, Sparkles, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<ClerkResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ClerkInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateMessages(data);
      setResult(response);
    } catch (err) {
      setError("Something went wrong with the AI service. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Bot className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Clerk
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
              AI Assistant
            </span>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-xs text-slate-500 font-medium">
               Clerk
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {!result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                One message. <span className="text-indigo-600">Every platform.</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Draft your intent once. Clerk instantly adapts tone, length, and format for Email, Slack, WhatsApp, and more.
              </p>
              <div className="mt-4 text-xs text-slate-400">
                Developed by Batuhan Ayrıbaş in the Rootcastle ecosystem.
              </div>
            </div>
            
            <InputForm onSubmit={handleSubmit} isGenerating={loading} />
            
            {loading && (
              <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <h3 className="text-xl font-semibold text-slate-800">Drafting your messages...</h3>
                <p className="text-slate-500 mt-2">Analyzing tone, constraints, and platform rules.</p>
              </div>
            )}
            
            {error && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
                {error}
              </div>
            )}
          </div>
        ) : (
          <ResultDisplay data={result} onReset={handleReset} />
        )}
        
      </main>
    </div>
  );
};

export default App;