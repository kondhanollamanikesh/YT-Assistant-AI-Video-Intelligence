import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';

const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#demo', label: 'Demo' },
];

export function LogoMark({ size = 34 }) {
  return (
    <span
      className="relative flex items-center justify-center rounded-[10px] shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg,#4d7df7,#8b7cf6)',
        boxShadow: '0 6px 20px -6px rgba(93,118,250,.55), inset 0 1px 0 rgba(255,255,255,.25)',
      }}
    >
      <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M9 6.5v11l9-5.5z" />
      </svg>
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.21, 0.65, 0.32, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]' : 'bg-transparent border-transparent'
      }`}
      style={{ borderBottom: scrolled ? undefined : '1px solid transparent' }}
    >
      <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[60px] md:h-[64px] flex items-center justify-between" aria-label="Main">
        <a href="#top" className="flex items-center gap-2.5 group">
          <LogoMark />
          <span className="font-display font-semibold text-[15px] tracking-tight text-ice">
            YT Assistant
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13.5px] font-medium text-fog hover:text-ice transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href="#demo" className="hidden sm:inline-flex btn-primary !py-2 !px-4 !text-[13px] group">
            Try it free
            <ArrowRight size={14} className="arrow-shift" />
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="md:hidden p-2 rounded-lg text-fog hover:text-ice hover:bg-white/5 transition-colors"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="md:hidden overflow-hidden glass border-x-0 border-b-0"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-fog hover:text-ice hover:bg-white/5 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a href="#demo" onClick={() => setOpen(false)} className="btn-primary mt-2 justify-center">
                Try it free <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
