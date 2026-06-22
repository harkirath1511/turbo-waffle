import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import toast from 'react-hot-toast';

const links = [
  { to: '/profile', label: 'Profile' },
  { to: '/generate', label: 'Generate' },
  { to: '/drafts', label: 'Saved Drafts' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    navigate('/auth');
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
          <Zap size={18} className="text-violet-600" />
          Startup Icebreaker
        </Link>

        <div className="flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname.startsWith(l.to)
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}

          {user && (
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block max-w-35 truncate">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
