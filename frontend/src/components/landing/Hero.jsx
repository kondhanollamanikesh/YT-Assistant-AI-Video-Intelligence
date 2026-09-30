import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import HeroCanvas from './HeroCanvas';

const EASE = [0.21, 0.65, 0.32, 1];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden noise">
      {/* Background layers */}
      <div className="absolute inset-0 grid-bg" aria-hidden="true" />
      <div className="glow-spot -top-40 left-[8%]" aria-hidden="true" />
      <div className="glow-spot violet top-[30%] right-[-10%]" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-void pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 pt-32 md:pt-40 pb-16 md:pb-24 grid lg:grid-cols-[1.02fr_0.98fr] gap-12 lg:gap-6 items-center">
        {/* Copy */}
        <div className="max-w-xl">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }}>
            <span className="pill-badge">
              <Sparkles size={12} />
              AI Video Intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
            className="mt-6 font-display font-semibold tracking-tight leading-[1.04] text-[40px] sm:text-[56px] lg:text-[62px]"
          >
            Turn any video into an{' '}
            <span className="text-gradient">interactive AI knowledge base.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: EASE }}
            className="mt-6 text-base md:text-lg text-fog leading-relaxed"
          >
            Paste a YouTube link and instantly transform it into summaries, key insights,
            quizzes, searchable knowledge — and a conversation grounded in what the
            video actually says.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3.5"
          >
            <a href="#demo" className="btn-primary group">
              Analyze a video
              <ArrowRight size={15} className="arrow-shift" />
            </a>
            <a href="#how-it-works" className="btn-ghost">
              See how it works
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-dim"
          >
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-bolt" /> 6 study tools per video
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-iris" /> Answers grounded in the transcript
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-mint/70" /> Works with non-English videos
            </span>
          </motion.div>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.25, ease: EASE }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="absolute inset-0 m-auto w-[70%] aspect-square rounded-full bg-bolt/5 blur-3xl" aria-hidden="true" />
          <HeroCanvas />
        </motion.div>
      </div>
    </section>
  );
}
