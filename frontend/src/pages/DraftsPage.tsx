import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Trash2, ChevronDown, ChevronUp, Inbox } from 'lucide-react';
import * as api from '../lib/api';
import type { Draft } from '../lib/types';
import CopyButton from '../components/CopyButton';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    api.getDrafts().then(setDrafts).catch(() => toast.error('Failed to load drafts')).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await api.deleteDraft(id);
      setDrafts(d => d.filter(draft => draft.id !== id));
      if (expanded === id) setExpanded(null);
      toast.success('Draft deleted');
    } catch {
      toast.error('Failed to delete draft');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-on-dark-soft" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-7">
        <p className="eyebrow text-accent-lime! mb-2">Your rack</p>
        <h1 className="font-display text-2xl sm:text-3xl font-700 tracking-tight text-white">Saved drafts</h1>
        <p className="text-sm text-on-dark-soft mt-1.5">
          {drafts.length === 0 ? 'Nothing forged yet.' : `${drafts.length} draft${drafts.length !== 1 ? 's' : ''} on the rack.`}
        </p>
      </div>

      {drafts.length === 0 ? (
        <div className="card-glow text-center py-16 px-6">
          <span className="grid place-items-center w-14 h-14 rounded-2xl mx-auto mb-4 bg-accent-tint text-accent-deep">
            <Inbox size={26} />
          </span>
          <p className="font-display text-lg font-600 text-ink">The rack is empty</p>
          <p className="text-sm text-ink-soft mt-1.5">Every email you forge lands here automatically.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {drafts.map(draft => {
            const open = expanded === draft.id;
            return (
            <div key={draft.id} className={`card overflow-hidden transition-shadow ${open ? 'shadow-[0_20px_50px_-12px_rgba(15,23,41,0.4)]' : ''}`}>
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-card-muted transition-colors"
                onClick={() => setExpanded(open ? null : draft.id)}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-display font-700 text-ink">{draft.company_name}</span>
                    <span className="chip text-[11px] py-0.5!">{draft.goal}</span>
                  </div>
                  <div className="text-sm text-ink-soft mt-1 truncate">
                    {draft.subject_line}
                  </div>
                  <div className="eyebrow eyebrow-faint mt-2 text-[10px]">
                    {new Date(draft.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 ml-3 shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(draft.id); }}
                    disabled={deleting === draft.id}
                    className="grid place-items-center w-9 h-9 rounded-lg text-ink-faint hover:text-danger hover:bg-red-50 transition-colors disabled:opacity-50"
                    aria-label="Delete draft"
                  >
                    {deleting === draft.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                  <span className="grid place-items-center w-9 h-9 rounded-lg text-ink-faint">
                    {open ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                  </span>
                </div>
              </div>

              {open && (
                <div className="px-5 pb-5 pt-1 space-y-4 border-t border-line bg-card-muted">
                  <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4 pt-4">
                    <SmallSection title="Subject line" content={draft.subject_line} />
                    <SmallSection title="Opening" content={draft.opening_paragraph} />
                    <SmallSection title="Why this company" content={draft.why_company} />
                    <SmallSection title="Why you" content={draft.why_user} />
                    <div className="sm:col-span-2">
                      <SmallSection title="Conversation starter" content={draft.conversation_starter} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="eyebrow">The full email</span>
                      <CopyButton text={draft.full_email} />
                    </div>
                    <pre className="card text-sm text-ink whitespace-pre-wrap font-sans leading-relaxed p-4">
                      {draft.full_email}
                    </pre>
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SmallSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="eyebrow">{title}</span>
        <CopyButton text={content} />
      </div>
      <p className="text-sm text-ink-soft leading-relaxed">{content}</p>
    </div>
  );
}
