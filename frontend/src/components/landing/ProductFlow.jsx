import { Reveal } from '../ui';
import { MonitorPlay, FileText, Database, Brain, GraduationCap } from 'lucide-react';

const STEPS = [
  { icon: MonitorPlay, label: 'YouTube Video' },
  { icon: FileText, label: 'Transcript' },
  { icon: Database, label: 'RAG Index' },
  { icon: Brain, label: 'AI Intelligence' },
  { icon: GraduationCap, label: 'Knowledge' },
];

export default function ProductFlow() {
  return (
    <section className="relative py-16 md:py-24 border-y border-edge/60 bg-abyss/60">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-10 md:mb-14">
          <p className="font-display text-xl sm:text-2xl md:text-[28px] font-medium tracking-tight text-ice">
            One video. <span className="text-gradient">An entire knowledge layer.</span>
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div
            className="flex items-center justify-start sm:justify-center gap-0 overflow-x-auto hide-scrollbar pb-1"
            role="list"
            aria-label="How a video becomes knowledge"
          >
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} role="listitem" className="flex items-center shrink-0">
                  <div className={`flex items-center gap-2.5 px-3.5 sm:px-5 py-3 rounded-xl border transition-colors ${
                    i === STEPS.length - 1
                      ? 'border-bolt/40 bg-bolt/[0.07]'
                      : 'border-edge bg-panel/80'
                  }`}>
                    <Icon size={15} className={i === STEPS.length - 1 ? 'text-bolt-soft' : 'text-dim'} />
                    <span className="text-[11px] sm:text-[13px] font-medium text-fog whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && <div className="connector mx-1 sm:mx-2" aria-hidden="true" />}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
