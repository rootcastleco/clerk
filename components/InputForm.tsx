/**
 * Clerk
 * Developed by Batuhan Ayrıbaş in the Rootcastle ecosystem.
 */

import React, { useState } from 'react';
import { ClerkInput, Target, Relationship, Tone, Platform, Recipient, TargetConstraint } from '../types';
import { Plus, Trash2, Settings, User, MessageSquare, Send, Check } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: ClerkInput) => void;
  isGenerating: boolean;
}

const DEFAULT_TARGET: Target = {
  id: '1',
  platform: 'email',
  recipient: { name: '', handle_or_address: '' },
  constraints: { max_chars: 5000, allow_emojis: false, allow_markdown: false, allow_links: true }
};

const PLATFORM_DEFAULTS: Record<Platform, TargetConstraint> = {
  email: { max_chars: 10000, allow_emojis: true, allow_markdown: false, allow_links: true },
  sms: { max_chars: 160, allow_emojis: false, allow_markdown: false, allow_links: true },
  whatsapp: { max_chars: 1000, allow_emojis: true, allow_markdown: true, allow_links: true },
  telegram: { max_chars: 4096, allow_emojis: true, allow_markdown: true, allow_links: true },
  slack: { max_chars: 4000, allow_emojis: true, allow_markdown: true, allow_links: true },
  discord: { max_chars: 2000, allow_emojis: true, allow_markdown: true, allow_links: true },
  linkedin_dm: { max_chars: 2000, allow_emojis: true, allow_markdown: false, allow_links: true },
  x_dm: { max_chars: 1000, allow_emojis: true, allow_markdown: false, allow_links: true },
};

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isGenerating }) => {
  const [goal, setGoal] = useState("Tell my client we need to move tomorrow’s meeting by 30 minutes.");
  const [relationship, setRelationship] = useState<Relationship>('customer');
  const [tone, setTone] = useState<Tone>('formal');
  const [language, setLanguage] = useState('en');
  
  const [topic, setTopic] = useState("Meeting reschedule");
  const [keyPoints, setKeyPoints] = useState<string>("Move meeting 30 mins later\nApologize briefly\nConfirm new time");
  const [mustInclude, setMustInclude] = useState<string>("New time: 10:30 AM");
  const [mustAvoid, setMustAvoid] = useState<string>("Blaming anyone");
  const [datesTimes, setDatesTimes] = useState<string>("Tomorrow 10:30 AM");
  
  const [draft, setDraft] = useState("");
  const [signOff, setSignOff] = useState("Best, Clerk");
  const [brandVoice, setBrandVoice] = useState("Professional, helpful, concise");

  const [targets, setTargets] = useState<Target[]>([{ ...DEFAULT_TARGET, id: crypto.randomUUID() }]);

  const handleAddTarget = () => {
    setTargets([...targets, { ...DEFAULT_TARGET, id: crypto.randomUUID() }]);
  };

  const handleRemoveTarget = (id: string) => {
    setTargets(targets.filter(t => t.id !== id));
  };

  const updateTarget = (id: string, field: keyof Target | keyof Recipient | 'platform', value: any) => {
    setTargets(prev => prev.map(t => {
      if (t.id !== id) return t;
      
      if (field === 'platform') {
        const newPlatform = value as Platform;
        return {
          ...t,
          platform: newPlatform,
          constraints: PLATFORM_DEFAULTS[newPlatform]
        };
      } else if (field === 'name' || field === 'handle_or_address') {
         return { ...t, recipient: { ...t.recipient, [field]: value } };
      }
      return { ...t, [field]: value };
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const splitLines = (text: string) => text.split('\n').map(s => s.trim()).filter(Boolean);

    const inputData: ClerkInput = {
      user_goal: goal,
      audience: { relationship, tone, language },
      message_context: {
        topic,
        key_points: splitLines(keyPoints),
        must_include: splitLines(mustInclude),
        must_avoid: splitLines(mustAvoid),
        dates_times: splitLines(datesTimes),
        links: [] // Simplified for UI
      },
      targets: targets.map(({ id, ...rest }) => rest),
      draft: draft || undefined,
      user_preferences: {
        sign_off: signOff,
        brand_voice_notes: brandVoice
      }
    };
    onSubmit(inputData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Goal Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          Goal & Audience
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">What is your goal?</label>
            <textarea 
              required
              value={goal}
              onChange={e => setGoal(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              rows={2}
              placeholder="e.g. Tell my boss I'm running late..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
              <select 
                value={relationship} 
                onChange={e => setRelationship(e.target.value as Relationship)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
              >
                <option value="customer">Customer</option>
                <option value="coworker">Coworker</option>
                <option value="boss">Boss</option>
                <option value="friend">Friend</option>
                <option value="public">Public Audience</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tone</label>
              <select 
                value={tone} 
                onChange={e => setTone(e.target.value as Tone)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
              >
                <option value="formal">Formal</option>
                <option value="friendly">Friendly</option>
                <option value="urgent">Urgent</option>
                <option value="apologetic">Apologetic</option>
                <option value="salesy">Salesy</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
              <input 
                type="text" 
                value={language} 
                onChange={e => setLanguage(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200"
                placeholder="en, es, tr..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Context Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          Context & Constraints
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
              <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dates & Times (one per line)</label>
              <textarea rows={2} value={datesTimes} onChange={e => setDatesTimes(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200" />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Key Points (one per line)</label>
               <textarea rows={3} value={keyPoints} onChange={e => setKeyPoints(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Must Include (one per line)</label>
              <textarea rows={3} value={mustInclude} onChange={e => setMustInclude(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Must Avoid (one per line)</label>
              <textarea rows={3} value={mustAvoid} onChange={e => setMustAvoid(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200" />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Optional Draft</label>
              <textarea rows={2} value={draft} onChange={e => setDraft(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200" placeholder="Paste a rough draft..." />
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sign Off</label>
              <input type="text" value={signOff} onChange={e => setSignOff(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Brand Voice</label>
              <input type="text" value={brandVoice} onChange={e => setBrandVoice(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200" />
            </div>
        </div>
      </section>

      {/* 3. Targets Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Recipients & Platforms
          </h2>
          <button type="button" onClick={handleAddTarget} className="text-sm flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700">
            <Plus className="w-4 h-4" /> Add Target
          </button>
        </div>

        <div className="space-y-4">
          {targets.map((target, index) => (
            <div key={target.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 relative group">
              {targets.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => handleRemoveTarget(target.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                   <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Platform</label>
                   <select 
                      value={target.platform} 
                      onChange={e => updateTarget(target.id, 'platform', e.target.value)}
                      className="w-full p-2 rounded border border-slate-200"
                    >
                      {Object.keys(PLATFORM_DEFAULTS).map(p => (
                        <option key={p} value={p}>{p.replace('_', ' ').toUpperCase()}</option>
                      ))}
                    </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Recipient Name</label>
                  <input 
                    type="text" 
                    value={target.recipient.name}
                    onChange={e => updateTarget(target.id, 'name', e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full p-2 rounded border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Handle/Email</label>
                   <input 
                    type="text" 
                    value={target.recipient.handle_or_address}
                    onChange={e => updateTarget(target.id, 'handle_or_address', e.target.value)}
                    placeholder="e.g. alex@company.com"
                    className="w-full p-2 rounded border border-slate-200"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button 
        type="submit" 
        disabled={isGenerating}
        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99]
          ${isGenerating 
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
          }`}
      >
        {isGenerating ? (
          <>Thinking...</>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Generate Messages
          </>
        )}
      </button>
    </form>
  );
};

export default InputForm;