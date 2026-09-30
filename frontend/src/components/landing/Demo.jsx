import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal, SectionHeading } from '../ui';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Loader2, AlertCircle, Play, Check, Sparkles } from 'lucide-react';

/* --------------------------- Processing overlay --------------------------- */

const LOADING_STEPS = [
  { label: 'Fetching video transcript', hint: 'Downloading captions…' },
  { label: 'Building knowledge index', hint: 'Embedding transcript into vector store…' },
  { label: 'Waking up the AI assistant', hint: 'Almost there…' },
];

function ProcessingOverlay({ visible }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!visible) { setStepIndex(0); return; }
    const timers = [
      setTimeout(() => setStepIndex(1), 4000),
      setTimeout(() => setStepIndex(2), 12000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            role="status"
            aria-live="polite"
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[420px] panel rounded-2xl shadow-2xl p-7 z-[61]"
          >
            <h3 className="font-display text-base font-semibold text-ice mb-1">Analyzing your video</h3>
            <p className="text-xs text-dim mb-6">This usually takes under a minute.</p>

            <ul className="space-y-4">
              {LOADING_STEPS.map((step, i) => {
                const done = i < stepIndex;
                const active = i === stepIndex;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      done ? 'bg-mint' : active ? 'bg-gradient-to-br from-bolt to-iris' : 'bg-edge'
                    }`}>
                      {done ? (
                        <Check size={13} className="text-black/80" />
                      ) : active ? (
                        <Loader2 size={12} className="animate-spin text-white" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-dim" />
                      )}
                    </span>
                    <div>
                      <p className={`text-sm font-medium ${done || active ? 'text-ice' : 'text-dim'}`}>{step.label}</p>
                      {active && <p className="text-xs text-dim mt-0.5 animate-pulse">{step.hint}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 h-1 rounded-full bg-edge overflow-hidden">
              <motion.div
                animate={{ width: `${Math.min(((stepIndex + 1) / 3) * 92, 92)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-bolt to-iris"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* --------------------------------- Samples -------------------------------- */

const SAMPLES = [
  {
    title: 'But what is a neural network?',
    channel: '3Blue1Brown',
    url: 'https://www.youtube.com/watch?v=aircAruvnKk',
  },
  {
    title: 'The Essence of Calculus',
    channel: '3Blue1Brown',
    url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
  },
  {
    title: 'How to speak so that people want to listen',
    channel: 'TED',
    url: 'https://www.youtube.com/watch?v=eIho2S0ZahI',
  },
];

/* ---------------------------------- Demo ---------------------------------- */

export default function Demo() {
  const { loadVideo, isProcessingVideo } = useApp();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const isValidUrl = (value) => /(?:v=|\/v\/|youtu\.be\/|embed\/|^)([a-zA-Z0-9_-]{11})/.test(value.trim());

  const handleLoadVideo = async (videoUrl) => {
    const target = (videoUrl ?? url).trim();
    if (!target || isProcessingVideo) return;

    if (!isValidUrl(target)) {
      setError("That doesn't look like a valid YouTube URL. Example: https://youtube.com/watch?v=…");
      inputRef.current?.focus();
      return;
    }

    setError('');
    setUrl(target);
    try {
      await loadVideo(target);
      navigate('/analysis');
    } catch (err) {
      setError(err.message || 'Failed to load video');
    }
  };

  return (
    <section id="demo" className="relative py-20 md:py-28 scroll-mt-16 overflow-hidden">
      <div className="glow-spot top-0 left-1/2 -translate-x-1/2" aria-hidden="true" />
      <ProcessingOverlay visible={isProcessingVideo} />

      <div className="relative max-w-[860px] mx-auto px-4 sm:px-6">
        <SectionHeading
          tag="Live demo"
          title="Try it"
          accent="yourself."
          sub="Paste any YouTube URL — the full pipeline runs on your video in seconds."
        />

        <Reveal delay={0.1}>
          <form
            onSubmit={(e) => { e.preventDefault(); handleLoadVideo(url); }}
            className="mt-10 md:mt-12"
          >
            <div className="rounded-2xl p-[1px] bg-gradient-to-br from-bolt/50 via-edge-hi/40 to-iris/50 focus-within:from-bolt focus-within:to-iris transition-all">
              <div className="flex items-center gap-2 sm:gap-3 rounded-2xl bg-panel p-2 pl-4 sm:pl-5">
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(''); }}
                  placeholder="https://youtube.com/watch?v=…"
                  aria-label="YouTube video URL"
                  disabled={isProcessingVideo}
                  className="flex-1 min-w-0 py-3 bg-transparent text-sm md:text-[15px] text-ice placeholder:text-dim outline-none"
                />
                <button type="submit" disabled={!url.trim() || isProcessingVideo} className="btn-primary !py-2.5 !px-5 group shrink-0">
                  {isProcessingVideo ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <>
                      Analyze
                      <ArrowRight size={15} className="arrow-shift" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  role="alert"
                  className="flex items-center justify-center gap-2 mt-3 text-xs text-red-400"
                >
                  <AlertCircle size={13} /> {error}
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </Reveal>

        {/* Samples */}
        <Reveal delay={0.16}>
          <div className="flex items-center justify-center gap-4 mt-10 mb-5">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-edge-hi" />
            <span className="label-caps">Or try an example</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-edge-hi" />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SAMPLES.map((v, i) => (
            <Reveal key={v.url} delay={i * 0.08}>
              <button
                onClick={() => handleLoadVideo(v.url)}
                disabled={isProcessingVideo}
                className="group relative w-full rounded-xl overflow-hidden border border-edge card-hover text-left focus-visible:outline-bolt"
                aria-label={`Analyze example video: ${v.title}`}
              >
                <div className="relative aspect-video bg-raise">
                  <img
                    src={`https://img.youtube.com/vi/${v.url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)[1]}/mqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-[1.04] transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="w-11 h-11 rounded-full glass flex items-center justify-center">
                      <Play size={14} fill="#fff" className="text-white ml-0.5" />
                    </span>
                  </span>
                  <div className="absolute bottom-0 inset-x-0 p-3">
                    <p className="text-[12.5px] font-semibold text-white leading-snug line-clamp-2">{v.title}</p>
                    <p className="text-[10.5px] text-white/60 mt-0.5">{v.channel}</p>
                  </div>
                </div>
                <span className="absolute top-2.5 right-2.5 chip !py-0.5 !px-2 !text-[9px] !bg-black/50 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles size={9} /> Analyze
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
