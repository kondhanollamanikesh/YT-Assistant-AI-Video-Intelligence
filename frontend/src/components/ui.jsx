import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle } from 'lucide-react';

const EASE = [0.21, 0.65, 0.32, 1];

export function Reveal({ children, delay = 0, y = 26, className = '', once = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-70px' }}
      transition={{ duration: 0.65, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ tag, title, accent, sub, align = 'center' }) {
  const alignCls = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';
  return (
    <div className={`flex flex-col gap-4 max-w-2xl ${alignCls}`}>
      {tag && <Reveal><span className="pill-badge">{tag}</span></Reveal>}
      <Reveal delay={0.05}>
        <h2 className="font-display text-[28px] sm:text-4xl md:text-[44px] leading-[1.12] font-semibold tracking-tight text-ice">
          {title} {accent && <span className="text-gradient">{accent}</span>}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.1}>
          <p className="text-base md:text-lg text-fog leading-relaxed">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`skeleton rounded-lg ${className}`} aria-hidden="true" />;
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center py-14 text-center">
      <div className="w-11 h-11 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <AlertTriangle size={19} className="text-red-400" />
      </div>
      <p className="text-sm text-fog mb-5 max-w-xs leading-relaxed">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary !py-2.5 !px-5 text-xs">
          <RefreshCw size={13} /> Try again
        </button>
      )}
    </div>
  );
}

export function Spinner({ size = 28 }) {
  return <div className="h-full flex flex-col items-center justify-center py-14 gap-3" role="status" aria-label="Loading">
    <div className="animate-spin rounded-full border-2 border-edge-hi border-t-bolt" style={{ width: size, height: size }} />
  </div>;
}
