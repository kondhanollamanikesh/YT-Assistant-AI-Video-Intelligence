import { Reveal } from '../ui';
import { ArrowRight } from 'lucide-react';
import { LogoMark } from './Navbar';

export function CTA() {
  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-[1000px] mx-auto">
        <Reveal>
          <div className="relative rounded-3xl p-[1px] overflow-hidden bg-gradient-to-br from-bolt/50 via-edge-hi/30 to-iris/50">
            <div className="relative rounded-3xl bg-panel px-6 py-14 md:py-20 text-center overflow-hidden noise">
              <div className="glow-spot -top-24 left-1/2 -translate-x-1/2 !opacity-[0.12]" aria-hidden="true" />
              <h2 className="relative font-display text-3xl sm:text-4xl md:text-[44px] font-semibold tracking-tight leading-[1.1]">
                Ready to master <span className="text-gradient">any video?</span>
              </h2>
              <p className="relative mt-4 text-base text-fog max-w-md mx-auto">
                Your next video is already a knowledge base waiting to happen.
              </p>
              <a href="#demo" className="relative inline-flex mt-8 btn-primary group">
                Start analyzing — free
                <ArrowRight size={15} className="arrow-shift" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Demo', href: '#demo' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-edge bg-abyss/70">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <LogoMark size={30} />
              <span className="font-display font-semibold text-[14px] tracking-tight text-ice">YT Assistant</span>
            </div>
            <p className="text-sm text-dim leading-relaxed max-w-[240px]">
              AI-powered video intelligence for smarter learning.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 chip !py-1 !text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
              All systems operational
            </span>
          </div>

          <div>
            <h4 className="label-caps !text-ice/80 mb-4">Product</h4>
            <ul className="space-y-2.5">
              {COLUMNS[0].links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-fog hover:text-ice transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label-caps !text-ice/80 mb-4">Technology</h4>
            <ul className="space-y-2.5 text-sm text-fog">
              <li>LangChain RAG pipeline</li>
              <li>FAISS vector search</li>
              <li>NVIDIA NIM models</li>
              <li>Whisper fallback transcription</li>
            </ul>
          </div>

          <div>
            <h4 className="label-caps !text-ice/80 mb-4">Principle</h4>
            <p className="text-sm text-fog leading-relaxed">
              Every answer is grounded in the video's transcript — with the source to prove it.
            </p>
          </div>
        </div>

        <div className="border-t border-edge pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-dim">© {new Date().getFullYear()} YT Assistant. Built for curious minds.</p>
          <p className="text-xs text-dim">Summaries · Key points · Quizzes · Chat · Search</p>
        </div>
      </div>
    </footer>
  );
}
