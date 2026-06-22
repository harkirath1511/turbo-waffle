import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
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
        <Loader2 className="animate-spin text-gray-400" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Saved Drafts</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {drafts.length === 0 ? 'No saved drafts yet.' : `${drafts.length} draft${drafts.length !== 1 ? 's' : ''} saved.`}
        </p>
      </div>

      {drafts.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-600">
          <p className="text-lg">Nothing here yet.</p>
          <p className="text-sm mt-1">Generated emails are saved automatically.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map(draft => (
            <div key={draft.id} className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div
                className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-950 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                onClick={() => setExpanded(expanded === draft.id ? null : draft.id)}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{draft.company_name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300">
                      {draft.goal}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 truncate">
                    {draft.subject_line}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(draft.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(draft.id); }}
                    disabled={deleting === draft.id}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    {deleting === draft.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                  {expanded === draft.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </div>

              {expanded === draft.id && (
                <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4 space-y-4">
                  <SmallSection title="Subject Line" content={draft.subject_line} />
                  <SmallSection title="Opening" content={draft.opening_paragraph} />
                  <SmallSection title="Why Company" content={draft.why_company} />
                  <SmallSection title="Why You" content={draft.why_user} />
                  <SmallSection title="Conversation Starter" content={draft.conversation_starter} />
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Complete Email</span>
                      <CopyButton text={draft.full_email} />
                    </div>
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed bg-white dark:bg-gray-950 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
                      {draft.full_email}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SmallSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{title}</span>
        <CopyButton text={content} />
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">{content}</p>
    </div>
  );
}
