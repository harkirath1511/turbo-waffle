import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Hammer, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import toast from 'react-hot-toast';

const links = [
  { to: '/profile', label: 'Profile' },
  { to: '/generate', label: 'Forge' },
  { to: '/drafts', label: 'Drafts' },
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
    <nav className="sticky top-0 z-30 backdrop-blur-md bg-[#0f1729]/70 border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid place-items-center w-9 h-9 rounded-xl text-[#042f2a] bg-gradient-to-br from-[#84e6b0] to-[#14b8a6] shadow-[0_6px_16px_-4px_rgba(20,184,166,0.7)]">
            <Hammer size={17} strokeWidth={2.4} />
          </span>
          <span className="font-display text-[18px] font-700 tracking-tight text-white">
            Intro<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#84e6b0] to-[#14b8a6]">Forge</span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <div className="nav-glass flex items-center gap-0.5 p-1">
            {links.map(l => {
              const active = pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-500 transition-colors ${
                    active
                      ? 'bg-white text-[#0f1729] shadow-sm'
                      : 'text-on-dark-soft hover:text-white'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          {user && (
            <div className="flex items-center gap-2.5 ml-1 sm:ml-3">
              <span className="hidden md:block max-w-32 truncate text-xs text-on-dark-soft">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="grid place-items-center w-9 h-9 rounded-xl text-on-dark-soft hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                title="Sign out"
                aria-label="Sign out"
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
