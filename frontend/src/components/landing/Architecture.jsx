import { Reveal, SectionHeading } from '../ui';
import { MonitorPlay, FileText, Scissors, Boxes, Database, Route, Brain, ShieldCheck } from 'lucide-react';

const PIPELINE = [
  { icon: MonitorPlay, label: 'YouTube' },
  { icon: FileText, label: 'Transcript' },
  { icon: Scissors, label: 'Chunking' },
  { icon: Boxes, label: 'Embeddings' },
  { icon: Database, label: 'FAISS' },
  { icon: Route, label: 'Retriever' },
  { icon: Brain, label: 'LLM' },
];

const TECH = ['LangChain', 'RAG pipeline', 'FAISS vector search', 'NVIDIA NIM'];

export default function Architecture() {
  return (
    <section id="architecture" className="relative py-20 md:py-28 border-y border-edge/60 bg-abyss/50 overflow-hidden noise">
      <div className="glow-spot violet top-[20%] left-[-10%]" aria-hidden="true" />
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <SectionHeading
          tag="Under the hood"
          title="Answers grounded in"
          accent="the video."
          sub="Not a chatbot with a YouTube habit. A retrieval-augmented pipeline where every response is constrained to passages retrieved from the transcript."
        />

        {/* Pipeline strip */}
        <Reveal delay={0.1}>
          <div
            className="mt-12 md:mt-16 panel rounded-2xl p-4 sm:p-6 overflow-x-auto hide-scrollbar"
            role="img"
            aria-label="Pipeline: YouTube, Transcript, Chunking, Embeddings, FAISS, Retriever, LLM, grounded answer"
          >
            <div className="flex items-center min-w-max">
              {PIPELINE.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex items-center shrink-0">
                    <div className="flex flex-col items-center gap-2 w-[92px]">
                      <span className={`flex items-center justify-center w-11 h-11 rounded-xl border transition-colors ${
                        i === PIPELINE.length - 1
                          ? 'border-iris/50 bg-iris/10'
                          : i >= 3 ? 'border-bolt/40 bg-bolt/[0.08]' : 'border-edge bg-white/[0.03]'
                      }`}>
                        <Icon size={17} className={i >= 3 ? 'text-bolt-soft' : 'text-fog'} />
                      </span>
                      <span className="text-[11px] font-medium text-dim">{step.label}</span>
                    </div>
                    {i < PIPELINE.length - 1 && <div className="connector mx-2 mb-5" aria-hidden="true" />}
                  </div>
                );
              })}
              <div className="connector mx-2 mb-5 !bg-none border-t border-dashed border-edge-hi/70" aria-hidden="true" style={{ animation: 'none', background: 'none', height: 0, borderTop: '1px dashed rgba(42,51,72,.9)' }} />
              <div className="flex flex-col items-center gap-2 w-[110px] shrink-0">
                <span className="flex items-center justify-center w-11 h-11 rounded-xl border border-mint/40 bg-mint/[0.08]">
                  <ShieldCheck size={17} className="text-emerald-300" />
                </span>
                <span className="text-[11px] font-medium text-emerald-200/80">Grounded answer</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Grounding example */}
        <div className="mt-6 grid md:grid-cols-2 gap-4 md:gap-5">
          <Reveal delay={0.15}>
            <div className="panel rounded-2xl p-5 md:p-6 h-full card-hover">
              <span className="label-caps block mb-3">Without grounding</span>
              <p className="text-[13px] text-dim leading-relaxed line-through decoration-red-400/50">
                "Neural networks were invented in 1943 by McCulloch and Pitts, and you should
                definitely learn TensorFlow first…" — plausible-sounding, unsourced, possibly wrong.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="rounded-2xl p-[1px] h-full bg-gradient-to-br from-bolt/60 via-edge to-iris/60">
              <div className="rounded-2xl bg-panel p-5 md:p-6 h-full">
                <span className="label-caps !text-bolt-soft block mb-3">With YT Assistant</span>
                <p className="text-[13px] text-fog leading-relaxed mb-3">
                  "In this video, hidden layers are introduced at 8:41 as intermediate
                  representations between input and output — edges and loops before digits."
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="chip !py-0.5 !px-2 !text-[10px]">transcript 8:41</span>
                  <span className="chip !py-0.5 !px-2 !text-[10px]">similarity 0.91</span>
                  <span className="chip !py-0.5 !px-2 !text-[10px]">FAISS k=4</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Tech badges */}
        <Reveal delay={0.28}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {TECH.map((t) => (
              <span key={t} className="chip !px-4 !py-2 !text-[12px] font-display">{t}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
