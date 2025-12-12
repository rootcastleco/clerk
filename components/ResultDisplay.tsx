/**
 * Clerk
 * Developed by Batuhan Ayrıbaş in the Rootcastle ecosystem.
 */

import React, { useState } from 'react';
import { ClerkResponse, MessageVariant } from '../types';
import { Copy, Check, AlertTriangle, Shield, MessageCircle, AlertCircle } from 'lucide-react';

interface ResultDisplayProps {
  data: ClerkResponse;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, onReset }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const variants = data.message_variants;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Quality & Safety Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl border ${data.quality_checks.intent_preserved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
           <div className="flex items-start gap-3">
             <Shield className={`w-5 h-5 ${data.quality_checks.intent_preserved ? 'text-green-600' : 'text-red-600'} mt-0.5`} />
             <div>
               <h3 className="font-semibold text-slate-800">Quality Check</h3>
               <p className="text-sm text-slate-600 mt-1">
                 Intent Preserved: {data.quality_checks.intent_preserved ? 'Yes' : 'No'} • 
                 Safe: {data.quality_checks.no_private_data_leak ? 'Yes' : 'Warning'}
               </p>
             </div>
           </div>
        </div>

        {data.clarifying_questions && data.clarifying_questions.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
             <div className="flex items-start gap-3">
               <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
               <div>
                 <h3 className="font-semibold text-slate-800">Clarifying Questions</h3>
                 <ul className="list-disc list-inside text-sm text-slate-600 mt-1">
                   {data.clarifying_questions.map((q, i) => <li key={i}>{q}</li>)}
                 </ul>
               </div>
             </div>
          </div>
        )}
      </div>

      {data.assumptions && data.assumptions.length > 0 && (
         <div className="text-xs text-slate-500 px-1">
           <span className="font-semibold">Assumptions made:</span> {data.assumptions.join(' • ')}
         </div>
      )}

      {/* 2. Message Variants Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50">
          {variants.map((variant, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 
                ${activeTab === idx 
                  ? 'border-indigo-600 text-indigo-700 bg-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
            >
              {variant.platform.toUpperCase()} 
              <span className="ml-2 text-xs opacity-70">to {variant.recipient.name}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {variants.map((variant, idx) => (
             <div key={idx} className={activeTab === idx ? 'block' : 'hidden'}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                       {variant.subject ? variant.subject : 'No Subject'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      To: {variant.recipient.name} ({variant.recipient.handle_or_address})
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
                       {variant.char_count} chars
                     </span>
                     <button
                        onClick={() => handleCopy(variant.body, `body-${idx}`)}
                        className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
                      >
                        {copied === `body-${idx}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied === `body-${idx}` ? 'Copied' : 'Copy'}
                      </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {variant.body}
                </div>

                {/* Payload View (Simulated technical view) */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <details className="group">
                    <summary className="cursor-pointer text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 hover:text-indigo-600 transition">
                      View JSON Payload
                    </summary>
                    <pre className="mt-4 bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                      {JSON.stringify(variant.send_payload, null, 2)}
                    </pre>
                  </details>
                </div>
             </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center pt-6">
        <button onClick={onReset} className="text-slate-500 hover:text-slate-800 font-medium transition">
          Start Over
        </button>
      </div>

    </div>
  );
};

export default ResultDisplay;