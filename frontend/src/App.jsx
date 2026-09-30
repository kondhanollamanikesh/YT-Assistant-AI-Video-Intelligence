import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import ProductFlow from './components/landing/ProductFlow';
import Features from './components/landing/Features';
import Showcase from './components/landing/Showcase';
import HowItWorks from './components/landing/HowItWorks';
import Architecture from './components/landing/Architecture';
import Demo from './components/landing/Demo';
import { CTA, Footer } from './components/landing/CtaFooter';
import AnalysisPage from './analysis';

function ResumeBanner() {
  const { sessionId, startNewSession } = useApp();
  if (!sessionId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="fixed bottom-5 right-5 z-40 hidden md:flex items-center gap-3 glass rounded-2xl shadow-2xl pl-4 pr-2 py-2.5"
    >
      <div>
        <p className="text-xs font-semibold text-ice">Welcome back</p>
        <a
          href="/analysis"
          onClick={(e) => { e.preventDefault(); window.location.href = '/analysis'; }}
          className="text-[11px] text-bolt-soft font-medium hover:underline underline-offset-2"
        >
          Resume your last session →
        </a>
      </div>
      <button
        onClick={startNewSession}
        title="Dismiss and start fresh"
        aria-label="Dismiss session banner"
        className="p-2 rounded-lg hover:bg-white/5 text-dim hover:text-fog transition-colors"
      >
        <RotateCcw size={13} />
      </button>
    </motion.div>
  );
}

function LandingPage() {
  return (
    <div className="relative min-h-screen bg-void">
      <Navbar />
      <main>
        <Hero />
        <ProductFlow />
        <Features />
        <Showcase />
        <HowItWorks />
        <Architecture />
        <Demo />
        <CTA />
      </main>
      <Footer />
      <ResumeBanner />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
