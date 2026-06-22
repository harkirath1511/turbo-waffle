import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-4">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="text-center sm:text-left">
          <p className="font-display font-600 text-white text-sm">Harkirat Singh</p>
          <a
            href="mailto:singharkirath1511@gmail.com"
            className="inline-flex items-center gap-1.5 text-sm text-on-dark-soft hover:text-accent-lime transition-colors mt-0.5"
          >
            <Mail size={13} />
            singharkirath1511@gmail.com
          </a>
        </div>

        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-forge inline-flex items-center px-5 py-2.5 text-sm"
        >
          Built for Digital Heroes
        </a>
      </div>
    </footer>
  );
}
