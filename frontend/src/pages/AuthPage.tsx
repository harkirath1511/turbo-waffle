import { useState } from 'react';
import { Hammer, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type Mode = 'login' | 'signup';

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Account created successfully!');
        navigate('/profile');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/profile')
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-canvas grid lg:grid-cols-2">
      {/* Left — the pitch, on the dark canvas */}
      <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 relative overflow-hidden">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-10 h-10 rounded-xl text-[#042f2a] bg-gradient-to-br from-[#84e6b0] to-[#14b8a6] shadow-[0_6px_16px_-4px_rgba(20,184,166,0.7)]">
            <Hammer size={19} strokeWidth={2.4} />
          </span>
          <span className="font-display text-xl font-700 tracking-tight text-white">
            Intro<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#84e6b0] to-[#14b8a6]">Forge</span>
          </span>
        </div>

        <div className="max-w-md">
          <p className="eyebrow mb-4">Cold outreach, forged to fit</p>
          <h2 className="font-display text-4xl xl:text-5xl font-800 leading-[1.1] text-white tracking-tight">
            Stop sending emails that get{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#84e6b0] to-[#14b8a6]">ignored.</span>
          </h2>
          <p className="text-on-dark-soft mt-5 text-lg leading-relaxed">
            Drop in your background once. Point us at any company.
            Get a sharp, personalised email that actually sounds like you — in seconds.
          </p>

          <div className="flex gap-8 mt-10">
            {[['3', 'steps to send'], ['~5s', 'to a draft'], ['1', 'profile, reused']].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-700 text-white">{n}</div>
                <div className="text-xs text-on-dark-soft mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-on-dark-soft/60">Raw profile in · finished outreach out</p>
      </div>

      {/* Right — the form */}
      <div className="flex items-center justify-center px-4 py-12 lg:bg-white">
        <div className="w-full max-w-sm">
          {/* compact brand for mobile */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <span className="grid place-items-center w-10 h-10 rounded-xl text-[#042f2a] bg-gradient-to-br from-[#84e6b0] to-[#14b8a6]">
              <Hammer size={19} strokeWidth={2.4} />
            </span>
            <span className="font-display text-xl font-700 tracking-tight text-white lg:text-ink">
              Intro<span className="text-accent">Forge</span>
            </span>
          </div>

          <div className="bg-white rounded-[22px] border border-line shadow-[0_20px_50px_-12px_rgba(15,23,41,0.45)] p-8 lg:shadow-none lg:border-0 lg:p-0 lg:bg-transparent">
            <h1 className="font-display text-2xl font-700 text-ink mb-1.5 tracking-tight">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-ink-soft mb-7">
              {mode === 'login' ? 'Sign in to pick up where you left off.' : 'Start shaping cold emails that land.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="eyebrow block mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="field"
                />
              </div>

              <div>
                <label className="eyebrow block mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="field"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-forge w-full py-3 text-sm flex items-center justify-center gap-2 mt-2"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <p className="text-center text-sm text-ink-soft mt-6">
              {mode === 'login' ? "New here? " : 'Already have an account? '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-accent-deep font-600 hover:underline"
              >
                {mode === 'login' ? 'Create an account' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
