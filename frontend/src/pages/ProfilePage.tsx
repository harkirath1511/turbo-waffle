import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Upload, Save, Edit2, Loader2, User } from 'lucide-react';
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

const FIELDS: { key: keyof FormData; label: string; rows?: number; placeholder: string }[] = [
  { key: 'name', label: 'Full Name', placeholder: 'Jane Smith' },
  { key: 'email', label: 'Email', placeholder: 'jane@example.com' },
  { key: 'education', label: 'Education', rows: 3, placeholder: 'BSc Computer Science, MIT, 2022. Dean\'s list. Relevant coursework: ML, distributed systems.' },
  { key: 'experience', label: 'Experience', rows: 4, placeholder: 'Software Engineer at Stripe (2022–present). Built payment reconciliation pipeline handling $2B/month...' },
  { key: 'skills', label: 'Skills', rows: 2, placeholder: 'TypeScript, Python, React, PostgreSQL, system design, data pipelines...' },
  { key: 'interests', label: 'Interests', rows: 2, placeholder: 'Developer tooling, fintech infrastructure, open-source contribution...' },
  { key: 'goals', label: 'Goals', rows: 2, placeholder: 'Looking to join an early-stage startup working on developer infrastructure...' },
  { key: 'extra', label: 'Additional Info (optional)', rows: 2, placeholder: 'Built open-source tool with 1k GitHub stars. Published research on graph databases.' },
];

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
    api.getProfiles().then(profiles => {
      if (profiles.length > 0) {
        setProfile(profiles[0]);
        setForm({
          name: profiles[0].name,
          email: profiles[0].email ?? '',
          education: profiles[0].education,
          experience: profiles[0].experience,
          skills: profiles[0].skills,
          interests: profiles[0].interests,
          goals: profiles[0].goals,
          extra: profiles[0].extra ?? '',
        });
      } else {
        setEditing(true);
      }
    }).catch(() => {
      toast.error('Failed to load profile');
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
        <Loader2 className="animate-spin text-gray-400" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create once, use for every outreach email.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!editing && profile && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <Edit2 size={14} />
              Edit
            </button>
          )}
          <label className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
            parsing
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950'
          }`}>
            {parsing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {parsing ? 'Parsing…' : 'Upload Resume'}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileUpload}
              disabled={parsing}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {!editing && profile ? (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
              <User size={18} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{profile.name}</div>
              {profile.email && <div className="text-sm text-gray-500">{profile.email}</div>}
            </div>
          </div>
          {FIELDS.filter(f => f.key !== 'name' && f.key !== 'email').map(field => (
            <div key={field.key}>
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{field.label}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {form[field.key] || <span className="text-gray-400 italic">Not provided</span>}
              </div>
            </div>
          ))}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => navigate('/generate')}
              className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
            >
              Generate Outreach Email →
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {FIELDS.map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {field.label}
                {field.key !== 'extra' && field.key !== 'email' && (
                  <span className="text-red-400 ml-0.5">*</span>
                )}
              </label>
              {field.rows ? (
                <textarea
                  rows={field.rows}
                  value={form[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                />
              ) : (
                <input
                  type={field.key === 'email' ? 'email' : 'text'}
                  value={form[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                />
              )}
            </div>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-xl font-medium transition-colors"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
            {profile && (
              <button
                onClick={() => { setEditing(false); setForm({ name: profile.name, email: profile.email ?? '', education: profile.education, experience: profile.experience, skills: profile.skills, interests: profile.interests, goals: profile.goals, extra: profile.extra ?? '' }); }}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
