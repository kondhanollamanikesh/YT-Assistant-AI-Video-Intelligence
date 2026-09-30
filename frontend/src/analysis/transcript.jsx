import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default function TranscriptModal() {
  const { transcriptModalOpen, setTranscriptModalOpen, transcriptSegments } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!transcriptModalOpen) setSearchQuery('');
  }, [transcriptModalOpen]);

  const filtered = transcriptSegments.filter(
    (item) => !searchQuery || item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highlight = (text) => {
    if (!searchQuery.trim()) return text;
    return text.replace(
      new RegExp(`(${escapeRegExp(searchQuery.trim())})`, 'gi'),
      '<mark>$1</mark>'
    );
  };

  return (
    <AnimatePresence>
      {transcriptModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setTranscriptModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            role="dialog"
            aria-label="Full transcript"
            className="fixed inset-x-3 inset-y-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[580px] lg:w-[640px] md:h-[76vh] panel rounded-2xl z-50 flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-edge">
              <div className="flex items-center gap-2.5">
                <h2 className="font-display text-base font-semibold text-ice">Full transcript</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-edge text-dim tabular-nums">
                  {filtered.length} segment{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={() => setTranscriptModalOpen(false)}
                aria-label="Close transcript"
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={17} className="text-dim" />
              </button>
            </div>

            <div className="px-5 py-3 border-b border-edge">
              <div className="flex items-center gap-2 bg-white/[0.03] focus-within:bg-white/[0.05] focus-within:border-bolt/50 border border-edge rounded-lg px-3 py-2 transition-all">
                <Search size={14} className="text-dim" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in transcript…"
                  aria-label="Search in transcript"
                  className="flex-1 bg-transparent text-sm text-ice placeholder:text-dim outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} aria-label="Clear search">
                    <X size={13} className="text-dim" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {filtered.length === 0 ? (
                <p className="text-sm text-dim text-center py-8">
                  {transcriptSegments.length === 0 ? 'Transcript not loaded yet.' : `No matches for "${searchQuery}".`}
                </p>
              ) : (
                filtered.map((item, i) => (
                  <div key={i} className="flex gap-3 group">
                    <span className="text-[11px] font-medium text-bolt-soft bg-bolt/[0.08] group-hover:bg-bolt/[0.16] transition-colors rounded-md px-1.5 py-0.5 shrink-0 h-fit cursor-pointer tabular-nums">
                      {item.time}
                    </span>
                    <p
                      className="text-sm text-fog leading-relaxed group-hover:text-ice transition-colors"
                      dangerouslySetInnerHTML={{ __html: highlight(item.text) }}
                    />
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
