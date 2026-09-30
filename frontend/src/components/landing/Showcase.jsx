import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal, SectionHeading } from '../ui';
import { FileText, ListChecks, Brain, MessageSquare, ScanSearch, CheckCircle, Search, Play } from 'lucide-react';

const TABS = [
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'keypoints', label: 'Key Points', icon: ListChecks },
  { id: 'quiz', label: 'Quiz', icon: Brain },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'transcript', label: 'Transcript', icon: ScanSearch },
];

/* ------------------------------ Tab panels ------------------------------- */

function SummaryPanel() {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="label-caps !text-[10px]">Executive summary</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-bolt/10 text-bolt-soft border border-bolt/20">~7 min read</span>
        </div>
        <p className="text-[13px] text-fog leading-relaxed">
          A gentle visual introduction to neural networks. Starting from a single neuron â€”
          a weighted sum pushed through an activation function â€” the video builds up to
          multilayer perceptrons, shows why hidden layers capture structure like edges and
          loops in handwritten digits, and closes with how gradient descent tunes thousands
          of weights simultaneously during training.
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {['Perceptrons', 'Activation functions', 'Hidden layers', 'Gradient descent'].map((t) => (
          <span key={t} className="chip !py-1 !px-2.5 !text-[11px]">{t}</span>
        ))}
      </div>
      <div className="pt-1 space-y-1.5">
        {['Understand what a "layer" actually computes', 'Follow the path from neuron â†’ network â†’ learning'].map((o, i) => (
          <p key={i} className="flex items-start gap-2 text-[12px] text-fog">
            <CheckCircle size={12} className="text-bolt mt-0.5 shrink-0" /> {o}
          </p>
        ))}
      </div>
    </div>
  );
}

function KeyPointsPanel() {
  const pts = [
    ['0:00', 'A neuron is a weighted sum plus a nonlinearity'],
    ['4:18', 'Without activations, layers collapse into one linear map'],
    ['8:41', 'Hidden layers learn intermediate structure â€” edges, loops, digits'],
    ['13:05', 'Learning = gradient descent over thousands of weights'],
  ];
  return (
    <ol className="relative space-y-3.5 pl-5 before:absolute before:left-[6px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-bolt/50 before:via-edge-hi before:to-transparent">
      {pts.map(([time, text], i) => (
        <li key={i} className="relative flex items-start gap-3">
          <span className="absolute -left-5 top-1 w-[9px] h-[9px] rounded-full border-2 border-bolt bg-panel" />
          <span className="text-[10.5px] font-medium text-bolt-soft/90 tabular-nums mt-0.5 shrink-0">{time}</span>
          <span className="text-[12.5px] text-fog leading-snug">{text}</span>
        </li>
      ))}
    </ol>
  );
}

function QuizPanel() {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="label-caps !text-[10px]">Question 2 of 4</span>
        <div className="flex gap-1">{[0, 1].map((i) => <span key={i} className={`w-6 h-1 rounded-full ${i ? 'bg-mint' : 'bg-mint/40'}`} />)}</div>
      </div>
      <p className="text-[13px] font-medium text-ice leading-snug pt-1">
        What role does the bias term play inside a neuron?
      </p>
      {[
        { t: 'It shifts the activation threshold left or right', correct: true },
        { t: 'It scales each input weight individually', correct: false },
        { t: 'It stores the output of the previous layer', correct: false },
        { t: 'It prevents the network from overfitting', correct: false },
      ].map((o, i) => (
        <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-[12px] ${
          o.correct ? 'border-mint/40 bg-mint/[0.07] text-emerald-100' : 'border-edge bg-white/[0.02] text-dim'
        }`}>
          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-semibold ${o.correct ? 'bg-mint/20 text-emerald-300' : 'bg-edge text-fog'}`}>
            {String.fromCharCode(65 + i)}
          </span>
          {o.t}
          {o.correct && <CheckCircle size={13} className="ml-auto text-emerald-400" />}
        </div>
      ))}
    </div>
  );
}

function ChatPanel() {
  return (
    <div className="space-y-3.5">
      <div className="flex justify-end">
        <p className="max-w-[78%] px-3.5 py-2 rounded-2xl rounded-br-md bg-gradient-to-br from-bolt to-iris text-white text-[12.5px] leading-relaxed">
          How does the network know it's wrong during training?
        </p>
      </div>
      <div className="flex items-start gap-2.5">
        <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-bolt to-iris flex items-center justify-center shrink-0 mt-0.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M9 6.5v11l9-5.5z"/></svg>
        </span>
        <div className="max-w-[86%] space-y-2">
          <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-white/[0.05] border border-edge text-[12.5px] text-fog leading-relaxed">
            It compares its guess to the labeled answer, measures that gap with a cost
            function, then backpropagates the error so every weight nudges in the
            direction that reduces it.
          </div>
          <span className="inline-flex items-center gap-1.5 chip !py-0.5 !px-2 !text-[10px]">
            <FileText size={9} /> Grounded Â· transcript 13:05â€“15:40
          </span>
        </div>
      </div>
    </div>
  );
}

function TranscriptPanel() {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-edge mb-1">
        <Search size={12} className="text-dim" />
        <span className="text-[11.5px] text-fog">hidden layer</span>
      </div>
      {[
        ['8:41', true], ['9:26', false], ['16:02', false],
      ].map(([time, hit]) => (
        <div key={time} className="flex gap-2.5 items-start group cursor-default">
          <span className={`text-[10px] tabular-nums mt-0.5 px-1.5 py-0.5 rounded-md shrink-0 transition-colors ${hit ? 'bg-bolt/15 text-bolt-soft' : 'bg-white/[0.04] text-dim group-hover:text-fog'}`}>{time}</span>
          <p className="text-[12px] text-dim leading-relaxed group-hover:text-fog transition-colors">
            â€¦you can think of a <mark>hidden layer</mark> as learning its own useful decompositionâ€¦
          </p>
        </div>
      ))}
    </div>
  );
}

const PANELS = {
  summary: SummaryPanel,
  keypoints: KeyPointsPanel,
  quiz: QuizPanel,
  chat: ChatPanel,
  transcript: TranscriptPanel,
};

/* -------------------------------- Section -------------------------------- */

export default function Showcase() {
  const [tab, setTab] = useState('summary');
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setTab((cur) => TABS[(TABS.findIndex((t) => t.id === cur) + 1) % TABS.length].id);
    }, 4200);
    return () => clearInterval(id);
  }, [auto]);

  const Panel = PANELS[tab];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden border-y border-edge/60 bg-abyss/50 noise">
      <div className="glow-spot top-[-10%] right-[-8%]" aria-hidden="true" />
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <SectionHeading
          tag="The product"
          title="One video."
          accent="Six ways to understand it."
          sub="This is the actual workspace you get after pasting a link â€” not a mockup of a dream."
        />

        <Reveal delay={0.1}>
          <div className="mt-12 md:mt-16 panel rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_40px_100px_-30px_rgba(30,50,140,0.35)]">
            {/* Window chrome */}
            <div className="flex items-center gap-3 px-4 sm:px-5 h-11 border-b border-edge bg-white/[0.02]">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/80" />
              </div>
              <div className="mx-auto flex items-center gap-2 px-3 sm:px-5 py-1 rounded-md bg-black/40 border border-edge max-w-[320px] w-full justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-mint" aria-hidden="true" />
                <span className="text-[10.5px] text-dim truncate">yt-assistant.app / workspace / neural-networks</span>
              </div>
              <div className="w-10 hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 min-w-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              {/* Player side */}
              <div className="relative border-b lg:border-b-0 lg:border-r border-edge bg-black min-h-[220px]">
                <img
                  src="https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg"
                  onError={(e) => { e.currentTarget.src = 'https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg'; }}
                  alt="Video preview"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="group w-14 h-14 rounded-full glass flex items-center justify-center hover:scale-105 transition-transform" aria-label="Play video preview">
                    <Play size={18} className="text-white ml-0.5" fill="white" />
                  </button>
                </div>
                {/* Fake controls */}
                <div className="absolute bottom-0 inset-x-0 px-4 pb-3">
                  <div className="h-1 rounded-full bg-white/15 overflow-hidden mb-2">
                    <motion.div
                      key={tab}
                      initial={{ width: '12%' }}
                      animate={{ width: `${34 + TABS.findIndex((t) => t.id === tab) * 11}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-bolt to-iris"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-white/60 tabular-nums">
                    <span>07:{String(TABS.findIndex((t) => t.id === tab) * 9 + 12).padStart(2, '0')}</span>
                    <span>19:13</span>
                  </div>
                </div>
              </div>

              {/* AI panel side */}
              <div className="bg-panel flex flex-col min-w-0">
                <div className="flex items-center gap-2 px-4 sm:px-5 h-12 border-b border-edge overflow-x-auto hide-scrollbar w-full">
                  {TABS.map((t) => {
                    const Icon = t.icon;
                    const active = t.id === tab;
                    return (
                      <button
                        key={t.id}
                        onClick={() => { setTab(t.id); setAuto(false); }}
                        className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-colors ${
                          active ? 'text-ice' : 'text-dim hover:text-fog'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="showcase-tab"
                            className="absolute inset-0 rounded-lg bg-white/[0.06] border border-edge-hi/70"
                            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                          />
                        )}
                        <Icon size={12} className={`relative z-10 ${active ? 'text-bolt-soft' : ''}`} />
                        <span className="relative z-10">{t.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 sm:p-5 min-h-[300px] md:min-h-[330px]" aria-live="polite">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                    >
                      <Panel />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
