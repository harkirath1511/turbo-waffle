import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Upload, Save, Edit2, Loader2, GraduationCap, Briefcase,
  Wrench, Heart, Target, Sparkles, ArrowRight, type LucideIcon,
} from 'lucide-react';
import * as api from '../lib/api';
import type { Profile } from '../lib/types';

const EMPTY_FORM = {
  name: '',
  email: '',
  education: '',
  experience: '',
  skills: '',
  interests: '',
  goals: '',
  extra: '',
};

type FormData = typeof EMPTY_FORM;

const FIELDS: { key: keyof FormData; label: string; rows?: number; placeholder: string; icon?: LucideIcon; chips?: boolean }[] = [
  { key: 'name', label: 'Full Name', placeholder: 'Jane Smith' },
  { key: 'email', label: 'Email', placeholder: 'jane@example.com' },
  { key: 'education', label: 'Education', rows: 3, icon: GraduationCap, placeholder: 'BSc Computer Science, MIT, 2022. Dean\'s list. Relevant coursework: ML, distributed systems.' },
  { key: 'experience', label: 'Experience', rows: 4, icon: Briefcase, placeholder: 'Software Engineer at Stripe (2022–present). Built payment reconciliation pipeline handling $2B/month...' },
  { key: 'skills', label: 'Skills', rows: 2, icon: Wrench, chips: true, placeholder: 'TypeScript, Python, React, PostgreSQL, system design, data pipelines...' },
  { key: 'interests', label: 'Interests', rows: 2, icon: Heart, chips: true, placeholder: 'Developer tooling, fintech infrastructure, open-source contribution...' },
  { key: 'goals', label: 'Goals', rows: 2, icon: Target, placeholder: 'Looking to join an early-stage startup working on developer infrastructure...' },
  { key: 'extra', label: 'Additional Info (optional)', rows: 2, icon: Sparkles, placeholder: 'Built open-source tool with 1k GitHub stars. Published research on graph databases.' },
];

// Best-effort split of a field into chips. The value may arrive as a plain
// string, an array (from the résumé parser), or something else — normalize first.
function toChips(value: unknown): string[] {
  const text = Array.isArray(value) ? value.join(', ') : String(value ?? '');
  return text
    .split(/[,;/\n•·|]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);

  useEffect(() => {
    api.getMyProfile().then(p => {
      setProfile(p);
      setForm({
        name: p.name,
        email: p.email ?? '',
        education: p.education,
        experience: p.experience,
        skills: p.skills,
        interests: p.interests,
        goals: p.goals,
        extra: p.extra ?? '',
      });
    }).catch((err) => {
      // 404 means no profile yet — start in create mode
      if (err?.response?.status !== 404) toast.error('Failed to load profile');
      setEditing(true);
    }).finally(() => setLoading(false));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true);
    try {
      const extracted = await api.parseResume(file);
      setForm(f => ({ ...f, ...extracted }));
      setEditing(true);
      toast.success('Resume parsed — review and save your profile');
    } catch {
      toast.error('Could not parse resume. Try manual entry.');
    } finally {
      setParsing(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.education || !form.experience || !form.skills || !form.interests || !form.goals) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      if (profile) {
        const updated = await api.updateProfile(profile.id, form);
        setProfile(updated);
        toast.success('Profile updated');
      } else {
        const created = await api.createProfile(form);
        setProfile(created);
        toast.success('Profile created');
      }
      setEditing(false);
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-ink-faint" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {!editing && profile ? (
        <div className="space-y-6">
          {/* Hero identity card */}
          <div className="rounded-[22px] bg-white border border-line shadow-[0_20px_50px_-12px_rgba(15,23,41,0.45)]">
            <div className="rounded-t-[22px] bg-gradient-to-br from-[#0f1729] to-[#13324a] px-6 sm:px-8 pt-7 pb-7">
              <p className="eyebrow text-accent-lime! mb-3">01 · Your raw material</p>
              <h1 className="font-display text-2xl sm:text-3xl font-700 tracking-tight text-white">
                {profile.name}
              </h1>
              {profile.email && <p className="text-on-dark-soft text-sm mt-1">{profile.email}</p>}
            </div>
            <div className="px-6 sm:px-8 py-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl grid place-items-center font-display text-xl font-700 text-[#042f2a] bg-gradient-to-br from-[#84e6b0] to-[#14b8a6] shadow-[0_8px_20px_-6px_rgba(20,184,166,0.6)]">
                  {initials(profile.name)}
                </div>
                <div>
                  <div className="font-display font-600 text-ink">Profile complete</div>
                  <div className="text-xs text-ink-faint">Ready to forge outreach</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="btn-ghost flex items-center gap-1.5 text-sm px-3.5 py-2"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <label className={`btn-ghost flex items-center gap-1.5 text-sm px-3.5 py-2 cursor-pointer ${parsing ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  {parsing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {parsing ? 'Reading…' : 'Résumé'}
                  <input ref={fileRef} type="file" accept=".pdf,.txt" onChange={handleFileUpload} disabled={parsing} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Detail cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {FIELDS.filter(f => f.key !== 'name' && f.key !== 'email').map(field => {
              const value = form[field.key];
              const Icon = field.icon;
              const wide = field.key === 'experience' || field.key === 'goals' || field.key === 'extra';
              return (
                <div key={field.key} className={`card p-5 ${wide ? 'sm:col-span-2' : ''}`}>
                  <div className="flex items-center gap-2 mb-3">
                    {Icon && (
                      <span className="grid place-items-center w-7 h-7 rounded-lg bg-accent-tint text-accent-deep">
                        <Icon size={15} />
                      </span>
                    )}
                    <span className="eyebrow">{field.label}</span>
                  </div>
                  {!value ? (
                    <span className="text-ink-faint italic text-sm">Not provided</span>
                  ) : field.chips ? (
                    <div className="flex flex-wrap gap-2">
                      {toChips(value).map((c, i) => <span key={i} className="chip">{c}</span>)}
                    </div>
                  ) : (
                    <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-wrap">{value}</p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/generate')}
            className="btn-forge w-full py-4 font-display flex items-center justify-center gap-2 text-[15px]"
          >
            Forge an email <ArrowRight size={17} />
          </button>
        </div>
      ) : (
        <>
          <div className="mb-7">
            <p className="eyebrow mb-2">01 · Your raw material</p>
            <h1 className="font-display text-2xl sm:text-3xl font-700 tracking-tight text-white">
              {profile ? 'Edit your profile' : 'Build your profile'}
            </h1>
            <p className="text-sm text-on-dark-soft mt-1.5">
              Shape it once — every email you forge is drawn from here.
            </p>
          </div>

          <div className="card-glow p-6 sm:p-8 space-y-5">
            <label className={`flex items-center justify-center gap-2 text-sm py-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
              parsing ? 'border-line text-ink-faint cursor-not-allowed' : 'border-accent/40 text-accent-deep hover:bg-accent-tint'
            }`}>
              {parsing ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {parsing ? 'Reading your résumé…' : 'Upload a résumé to auto-fill (PDF or TXT)'}
              <input ref={fileRef} type="file" accept=".pdf,.txt" onChange={handleFileUpload} disabled={parsing} className="hidden" />
            </label>

            {FIELDS.map(field => (
              <div key={field.key}>
                <label className="eyebrow block mb-2">
                  {field.label}
                  {field.key !== 'extra' && field.key !== 'email' && (
                    <span className="text-accent ml-1">*</span>
                  )}
                </label>
                {field.rows ? (
                  <textarea
                    rows={field.rows}
                    value={form[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="field resize-none"
                  />
                ) : (
                  <input
                    type={field.key === 'email' ? 'email' : 'text'}
                    value={form[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="field"
                  />
                )}
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-forge flex items-center gap-2 px-6 py-3 text-sm"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? 'Saving…' : 'Save profile'}
              </button>
              {profile && (
                <button
                  onClick={() => { setEditing(false); setForm({ name: profile.name, email: profile.email ?? '', education: profile.education, experience: profile.experience, skills: profile.skills, interests: profile.interests, goals: profile.goals, extra: profile.extra ?? '' }); }}
                  className="btn-ghost px-6 py-3 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
