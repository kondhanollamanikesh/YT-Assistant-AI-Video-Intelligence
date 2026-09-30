import { Reveal, SectionHeading } from '../ui';
import { Search, CheckCircle } from 'lucide-react';

/* ------------------------------ Mini mockups ------------------------------ */

function SummaryMock() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="label-caps !text-[10px]">Executive summary</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-bolt/10 text-bolt-soft border border-bolt/20">7 min read</span>
      </div>
      <p className="text-[12.5px] text-fog leading-relaxed">
        The video introduces how individual neurons compute weighted sums and apply
        activation functions, then scales the idea into layered networks capable of
        learning non-linear decision boundaries.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {['Neurons', 'Weights & biases', 'Activation', 'Layers'].map((t) => (
          <span key={t} className="chip !py-1 !px-2.5 !text-[11px]">{t}</span>
        ))}
      </div>
    </div>
  );
}

function KeyPointsMock() {
  const points = [
    ['A neuron is just a weighted sum + nonlinearity', '0:42'],
    ['Stacking layers lets networks model any function', '4:18'],
    ['Backpropagation nudges thousands of weights at once', '9:03'],
  ];
  return (
    <ol className="space-y-3">
      {points.map(([title, time], i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-0.5 w-5 h-5 rounded-md bg-gradient-to-br from-bolt to-iris text-[10px] font-bold text-white flex items-center justify-center shrink-0">{i + 1}</span>
          <span className="flex-1 text-[12.5px] text-fog leading-snug">{title}</span>
          <span className="text-[10.5px] font-medium text-bolt-soft/90 tabular-nums shrink-0 mt-0.5">{time}</span>
        </li>
      ))}
    </ol>
  );
}

function QuizMock() {
  return (
    <div className="space-y-2.5">
      <p className="text-[12.5px] font-medium text-ice leading-snug">
        Why are activation functions essential in neural networks?
      </p>
      {[
        { t: 'To introduce non-linearity between layers', correct: true },
        { t: 'To make training faster on CPUs', correct: false },
        { t: 'To reduce the number of parameters', correct: false },
      ].map((o, i) => (
        <div
          key={i}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-[12px] ${
            o.correct
              ? 'border-mint/40 bg-mint/[0.07] text-emerald-100'
              : 'border-edge bg-white/[0.02] text-dim'
          }`}
        >
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

function ChatMock() {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <p className="max-w-[80%] px-3.5 py-2 rounded-2xl rounded-br-md bg-gradient-to-br from-bolt to-iris text-white text-[12px] leading-relaxed">
          What happens if we remove all activation functions?
        </p>
      </div>
      <div className="flex items-start gap-2.5">
        <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-bolt to-iris flex items-center justify-center shrink-0 mt-0.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a5 5 0 015 5v1a4 4 0 013 3.87V16a5 5 0 01-5 5H9a5 5 0 01-5-5v-4.13A4 4 0 017 8V7a5 5 0 015-5z" opacity=".9"/></svg>
        </span>
        <div className="max-w-[85%] px-3.5 py-2 rounded-2xl rounded-bl-md bg-white/[0.05] border border-edge text-[12px] text-fog leading-relaxed">
          Without activations, every layer collapses into one linear map — depth adds no
          expressive power. <span className="inline-flex items-center gap-1 ml-1 align-middle chip !py-0 !px-1.5 !text-[9px]"><CheckCircle size={8} className="text-bolt-soft" /> transcript 4:18</span>
        </div>
      </div>
    </div>
  );
}

function TranscriptSearchMock() {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-edge">
        <Search size={12} className="text-dim" />
        <span className="text-[11.5px] text-fog">backpropagation</span>
        <span className="ml-auto text-[9.5px] text-dim">3 hits</span>
      </div>
      {[
        ['9:03', false], ['12:47', true], ['18:21', false],
      ].map(([time, hit]) => (
        <div key={time} className="flex gap-2.5 items-start">
          <span className={`text-[10px] tabular-nums mt-0.5 px-1.5 py-0.5 rounded-md shrink-0 ${hit ? 'bg-bolt/15 text-bolt-soft' : 'bg-white/[0.04] text-dim'}`}>{time}</span>
          <p className="text-[11.5px] text-dim leading-relaxed">
            …the network learns by propagating the error <mark>backward</mark> through each layer…
          </p>
        </div>
      ))}
    </div>
  );
}

function WatchLearnMock() {
  return (
    <div className="grid grid-cols-[1fr_92px] gap-2.5 items-stretch">
      <div className="relative rounded-xl overflow-hidden bg-black border border-edge aspect-video">
        <img
          src="https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg"
          alt=""
          loading="lazy"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-9 h-9 rounded-full glass flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M9 6.5v11l9-5.5z" /></svg>
          </span>
        </div>
        <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded bg-black/70 text-white/80 tabular-nums">19:13</span>
      </div>
      <div className="rounded-xl border border-edge bg-white/[0.02] p-2.5 space-y-2 overflow-hidden">
        <span className="label-caps !text-[8.5px] block">AI panel</span>
        {['Summary', 'Key points', 'Quiz'].map((x) => (
          <p key={x} className="text-[10.5px] text-fog truncate">· {x}</p>
        ))}
        <div className="h-1 rounded-full bg-gradient-to-r from-bolt to-iris" />
      </div>
    </div>
  );
}

/* -------------------------------- Section -------------------------------- */

const FEATURES = [
  {
    n: '01',
    title: 'Smart Summaries',
    desc: 'Long videos condensed into structured executive summaries with topics and objectives.',
    span: 'lg:col-span-7',
    mock: <SummaryMock />,
  },
  {
    n: '02',
    title: 'Key Points',
    desc: 'The ideas that matter, with timestamp references back into the video.',
    span: 'lg:col-span-5',
    mock: <KeyPointsMock />,
  },
  {
    n: '03',
    title: 'AI Quizzes',
    desc: 'Generated multiple-choice questions that test what you actually retained.',
    span: 'lg:col-span-5',
    mock: <QuizMock />,
  },
  {
    n: '04',
    title: 'Chat with Video',
    desc: 'Ask anything — every answer cites the part of the transcript it came from.',
    span: 'lg:col-span-7',
    mock: <ChatMock />,
  },
  {
    n: '05',
    title: 'Transcript Search',
    desc: 'Full-text search across the entire transcript, instantly.',
    span: 'lg:col-span-6',
    mock: <TranscriptSearchMock />,
  },
  {
    n: '06',
    title: 'Watch & Learn',
    desc: 'The player and your AI knowledge panel, side by side.',
    span: 'lg:col-span-6',
    mock: <WatchLearnMock />,
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-20 md:py-28 scroll-mt-16 overflow-hidden">
      <div className="glow-spot violet top-10 left-[-15%]" aria-hidden="true" />
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <SectionHeading
          tag="Capabilities"
          title="Everything you need to"
          accent="understand a video."
          sub="Six tools built on the video's own transcript — not generic answers scraped from the web."
        />

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.n} delay={(i % 2) * 0.08} className={`md:col-span-1 ${f.span}`}>
              <article className="panel card-hover rounded-2xl p-5 md:p-6 h-full flex flex-col">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="font-display text-lg font-semibold text-ice tracking-tight">{f.title}</h3>
                  <span className="font-display text-xs font-semibold text-dim/80 tabular-nums">{f.n}</span>
                </div>
                <div className="rounded-xl border border-edge/70 bg-black/30 p-4 mb-4">
                  {f.mock}
                </div>
                <p className="text-sm text-fog leading-relaxed mt-auto">{f.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
