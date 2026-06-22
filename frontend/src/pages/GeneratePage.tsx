import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, RefreshCw, ChevronDown, SlidersHorizontal } from 'lucide-react';
import * as api from '../lib/api';
import { GOALS } from '../lib/types';
import type { Profile, GeneratedOutput, OutreachGoal } from '../lib/types';
import CopyButton from '../components/CopyButton';

export default function GeneratePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');
  const [goal, setGoal] = useState<OutreachGoal>('Job Opportunity');
  const [customInstructions, setCustomInstructions] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState<GeneratedOutput | null>(null);
  const [lastInput, setLastInput] = useState<{ companyName: string; companyDesc: string; goal: OutreachGoal; customInstructions: string } | null>(null);

  useEffect(() => {
    api.getMyProfile().then(setProfile).catch(() => {}).finally(() => setLoadingProfile(false));
  }, []);

  const handleGenerate = async () => {
    if (!profile) {
      toast.error('Create a profile first');
      navigate('/profile');
      return;
    }
    if (!companyName.trim() || !companyDesc.trim()) {
      toast.error('Enter company name and description');
      return;
    }
    setGenerating(true);
    setLastInput({ companyName, companyDesc, goal, customInstructions });
    try {
      const res = await api.generate({ profile_id: profile.id, company_name: companyName, company_description: companyDesc, goal, custom_instructions: customInstructions || undefined });
      setOutput(res.output);
      if (res.draft) toast.success('Saved to drafts');
    } catch {
      toast.error('Generation failed. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!lastInput || !profile) return;
    setGenerating(true);
    try {
      const res = await api.generate({ profile_id: profile.id, company_name: lastInput.companyName, company_description: lastInput.companyDesc, goal: lastInput.goal, custom_instructions: lastInput.customInstructions || undefined });
      setOutput(res.output);
      toast.success('Regenerated and saved');
    } catch {
      toast.error('Regeneration failed. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-gray-400" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Generate Outreach</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Enter a company and pick your goal — get a ready-to-send email in seconds.
        </p>
      </div>

      {!profile && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300">
          You don't have a profile yet.{' '}
          <button onClick={() => navigate('/profile')} className="underline font-medium">Create one first →</button>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Company Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            placeholder="Stripe, Linear, Vercel…"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Company Description <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={4}
            value={companyDesc}
            onChange={e => setCompanyDesc(e.target.value)}
            placeholder="Describe the company: what they build, who they serve, what makes them interesting. The more specific, the better the email."
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Outreach Goal <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              value={goal}
              onChange={e => setGoal(e.target.value as OutreachGoal)}
              className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition pr-10"
            >
              {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowCustom(v => !v)}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <SlidersHorizontal size={14} />
            Custom instructions
            <span className="text-xs text-gray-400">(optional)</span>
            <ChevronDown size={13} className={`transition-transform ${showCustom ? 'rotate-180' : ''}`} />
          </button>
          {showCustom && (
            <div className="mt-2.5">
              <textarea
                rows={3}
                value={customInstructions}
                onChange={e => setCustomInstructions(e.target.value)}
                placeholder="e.g. Keep it under 150 words. Make it sound more casual. Mention my open-source project. Focus on their recent funding round."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-400 mt-1">These instructions are appended to the AI prompt and override the default tone/style for this generation only.</p>
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating || !profile}
          className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          {generating ? <><Loader2 size={16} className="animate-spin" /> Generating…</> : 'Generate Email'}
        </button>
      </div>

      {output && (
        <div className="mt-10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Output</h2>
            <button
              onClick={handleRegenerate}
              disabled={generating}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 text-gray-500 dark:text-gray-400 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={generating ? 'animate-spin' : ''} />
              Regenerate
            </button>
          </div>

          <Section title="Subject Line" content={output.subject_line} />
          <Section title="Opening Paragraph" content={output.opening_paragraph} />
          <Section title="Why This Company" content={output.why_company} />
          <Section title="Why You" content={output.why_user} />
          <Section title="Conversation Starter" content={output.conversation_starter} />

          <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-violet-200 dark:border-violet-800">
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Complete Email</span>
              <CopyButton text={output.full_email} />
            </div>
            <pre className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
              {output.full_email}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</span>
        <CopyButton text={content} />
      </div>
      <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {content}
      </div>
    </div>
  );
}
