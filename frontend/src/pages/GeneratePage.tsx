import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, RefreshCw, ChevronDown, SlidersHorizontal, Flame } from 'lucide-react';
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
        <Loader2 className="animate-spin text-on-dark-soft" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-7">
        <p className="eyebrow text-accent-lime! mb-2">02 · Shape the piece</p>
        <h1 className="font-display text-2xl sm:text-3xl font-700 tracking-tight text-white">Forge an email</h1>
        <p className="text-sm text-on-dark-soft mt-1.5">
          Name the company, pick your angle — get a send-ready draft in seconds.
        </p>
      </div>

      {!profile && (
        <div className="card mb-6 p-4 text-sm text-ink-soft flex items-center gap-3">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-amber-100 text-amber-600 shrink-0">!</span>
          <span>
            You haven't set up a profile yet.{' '}
            <button onClick={() => navigate('/profile')} className="text-accent-deep font-600 hover:underline">Start there →</button>
          </span>
        </div>
      )}

      <div className="card-glow p-6 sm:p-8 space-y-5">
        <div>
          <label className="eyebrow block mb-2">
            Company name <span className="text-accent ml-1">*</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            placeholder="Stripe, Linear, Vercel…"
            className="field"
          />
        </div>

        <div>
          <label className="eyebrow block mb-2">
            What they do <span className="text-accent ml-1">*</span>
          </label>
          <textarea
            rows={4}
            value={companyDesc}
            onChange={e => setCompanyDesc(e.target.value)}
            placeholder="What they build, who they serve, what makes them interesting. The more specific you are, the sharper the email."
            className="field resize-none"
          />
        </div>

        <div>
          <label className="eyebrow block mb-2.5">
            Your angle <span className="text-accent ml-1">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setGoal(g)}
                className={`px-3.5 py-2 rounded-xl text-sm font-500 border transition-colors ${
                  goal === g
                    ? 'bg-gradient-to-br from-[#84e6b0] to-[#14b8a6] text-[#042f2a] border-transparent shadow-[0_6px_16px_-6px_rgba(20,184,166,0.7)]'
                    : 'bg-card-muted text-ink-soft border-line hover:border-accent hover:text-ink'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowCustom(v => !v)}
            className="flex items-center gap-2 text-sm text-ink-soft hover:text-ink transition-colors"
          >
            <SlidersHorizontal size={14} />
            Fine-tune the tone
            <span className="text-xs text-ink-faint">(optional)</span>
            <ChevronDown size={13} className={`transition-transform ${showCustom ? 'rotate-180' : ''}`} />
          </button>
          {showCustom && (
            <div className="mt-3">
              <textarea
                rows={3}
                value={customInstructions}
                onChange={e => setCustomInstructions(e.target.value)}
                placeholder="e.g. Keep it under 150 words. Sound more casual. Mention my open-source project. Lead with their recent funding round."
                className="field resize-none"
              />
              <p className="text-xs text-ink-faint mt-1.5">Applied on top of the default style, for this draft only.</p>
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating || !profile}
          className="btn-forge w-full py-4 font-display flex items-center justify-center gap-2 text-[15px]"
        >
          {generating ? <><Loader2 size={17} className="animate-spin" /> Forging…</> : <><Flame size={17} /> Forge email</>}
        </button>
      </div>

      {output && (
        <div className="mt-9 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow text-accent-lime! mb-1">03 · Off the anvil</p>
              <h2 className="font-display text-xl font-700 text-white">Your draft</h2>
            </div>
            <button
              onClick={handleRegenerate}
              disabled={generating}
              className="btn-ghost flex items-center gap-1.5 text-sm px-3.5 py-2 disabled:opacity-50"
            >
              <RefreshCw size={13} className={generating ? 'animate-spin' : ''} />
              Reforge
            </button>
          </div>

          <Section title="Subject line" content={output.subject_line} />
          <Section title="Opening" content={output.opening_paragraph} />
          <Section title="Why this company" content={output.why_company} />
          <Section title="Why you" content={output.why_user} />
          <Section title="Conversation starter" content={output.conversation_starter} />

          <div className="card-glow overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-card-muted border-b border-line">
              <span className="eyebrow">The full email</span>
              <CopyButton text={output.full_email} />
            </div>
            <pre className="px-5 py-5 text-sm text-ink whitespace-pre-wrap font-sans leading-relaxed">
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
    <div className="card px-5 py-4">
      <div className="flex items-center justify-between mb-2">
        <span className="eyebrow">{title}</span>
        <CopyButton text={content} />
      </div>
      <div className="text-sm text-ink-soft leading-relaxed">
        {content}
      </div>
    </div>
  );
}
