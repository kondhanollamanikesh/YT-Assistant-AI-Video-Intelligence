import { Reveal, SectionHeading } from '../ui';
import { ClipboardPaste, Cpu, GraduationCap } from 'lucide-react';

const STEPS = [
  {
    n: '01',
    icon: ClipboardPaste,
    title: 'Paste a video',
    desc: 'Drop in any YouTube URL. The transcript is fetched automatically — and non-English videos are translated to English on the fly.',
  },
  {
    n: '02',
    icon: Cpu,
    title: 'AI builds knowledge',
    desc: 'The transcript is chunked, embedded, and indexed into a vector store — a searchable knowledge representation of the video.',
  },
  {
    n: '03',
    icon: GraduationCap,
    title: 'Start learning',
    desc: 'Ask questions, generate summaries, search every sentence, and test yourself with quizzes generated from the content.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 md:py-28 scroll-mt-16 overflow-hidden">
      <div className="glow-spot left-[30%] bottom-[-30%]" aria-hidden="true" />
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <SectionHeading
          tag="Process"
          title="From link to insights"
          accent="in three steps."
        />

        <div className="relative mt-14 md:mt-20">
          {/* Connecting rail */}
          <div
            className="hidden lg:block absolute top-[52px] left-[12%] right-[12%] h-px bg-gradient-to-r from-bolt/40 via-iris/40 to-mint/30 flow-line"
            style={{ strokeDasharray: 'none', backgroundImage: 'repeating-linear-gradient(90deg, rgba(123,160,255,.5) 0 6px, transparent 6px 14px)' }}
            aria-hidden="true"
          />

          <ol className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.n} delay={i * 0.12}>
                  <li className="relative flex lg:flex-col items-start lg:items-center gap-5 lg:gap-0 lg:text-center">
                    <div className="relative shrink-0">
                      <span className="absolute inset-[-7px] rounded-2xl border border-bolt/25 animate-ping [animation-duration:2.6s] hidden lg:block" aria-hidden="true" />
                      <span className="relative flex items-center justify-center w-[88px] h-[88px] rounded-3xl panel bg-panel">
                        <Icon size={28} className="text-bolt-soft" />
                        <span className="absolute -top-2.5 -right-2.5 font-display text-[11px] font-bold text-white bg-gradient-to-br from-bolt to-iris rounded-full w-7 h-7 flex items-center justify-center shadow-lg shadow-bolt/30">
                          {s.n}
                        </span>
                      </span>
                    </div>
                    <div className="lg:mt-6 max-w-xs">
                      <h3 className="font-display text-lg font-semibold text-ice tracking-tight">{s.title}</h3>
                      <p className="mt-2 text-sm text-fog leading-relaxed">{s.desc}</p>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
