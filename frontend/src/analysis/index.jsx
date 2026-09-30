import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, ArrowLeft, FileText, MessageSquare, Brain, Lightbulb,
  Menu, Plus, MonitorPlay, Loader2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Skeleton } from '../components/ui';
import ChatSection from './chat';
import { SummaryTab, KeyPointsTab, QuizTab } from './tabs';
import TranscriptModal from './transcript';

const TABS = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'keypoints', label: 'Key Points', icon: Lightbulb },
  { id: 'quiz', label: 'Quiz', icon: Brain },
];

/* --------------------------------- Sidebar -------------------------------- */

function Sidebar({ onHome }) {
  const {
    currentVideo, transcriptSegments, activeTab, setActiveTab,
    setTranscriptModalOpen, startNewSession,
  } = useApp();

  return (
    <>
      <div className="p-4 border-b border-edge">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-sm text-fog hover:text-ice transition-colors mb-4"
        >
          <ArrowLeft size={15} />
          Home
        </button>
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-bolt to-iris flex items-center justify-center shadow-lg shadow-bolt/25">
            <Bot size={16} className="text-white" />
          </span>
          <span className="font-display text-sm font-semibold text-ice">YT Assistant</span>
        </div>
      </div>

      {/* Video card */}
      <div className="p-4 border-b border-edge">
        <div className="rounded-xl bg-white/[0.02] border border-edge p-3">
          <div className="relative rounded-lg overflow-hidden bg-raise aspect-video mb-2.5">
            {currentVideo.thumbnail && (
              <img src={currentVideo.thumbnail} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          <p className="text-[11px] text-dim leading-relaxed line-clamp-2 break-all">{currentVideo.url}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-mint font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
            Transcript indexed
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Study tools">
        <p className="px-3 pb-2 label-caps !text-[10px]">Study tools</p>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'text-ice bg-white/[0.05]' : 'text-fog hover:bg-white/[0.03] hover:text-ice'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="analysis-tab-pill"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-gradient-to-b from-bolt to-iris"
                  transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                />
              )}
              <Icon size={17} className={isActive ? 'text-bolt-soft' : ''} />
              {tab.label}
            </button>
          );
        })}

        <button
          onClick={() => setTranscriptModalOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-fog hover:bg-white/[0.03] hover:text-ice transition-all"
        >
          <FileText size={17} />
          Transcript
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.05] text-dim tabular-nums">
            {transcriptSegments.length || '—'}
          </span>
        </button>
      </nav>

      <div className="p-3 border-t border-edge">
        <button
          onClick={startNewSession}
          className="btn-ghost w-full !justify-start !px-3 !py-2.5 !text-sm"
        >
          <Plus size={15} /> Analyze another video
        </button>
      </div>
    </>
  );
}

/* -------------------------------- Video rail ------------------------------ */

function VideoRail() {
  const { currentVideo, transcriptSegments, setTranscriptModalOpen } = useApp();

  return (
    <aside className="hidden xl:flex w-[380px] shrink-0 border-l border-edge bg-panel/60 flex-col" aria-label="Video player and transcript preview">
      <div className="p-4 border-b border-edge">
        <div className="rounded-xl overflow-hidden bg-black aspect-video shadow-lg ring-1 ring-white/10">
          {currentVideo.embedUrl && (
            <iframe
              src={`${currentVideo.embedUrl}?rel=0`}
              title="YouTube player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="label-caps !text-ice/70">Transcript</h3>
        <button
          onClick={() => setTranscriptModalOpen(true)}
          className="text-xs font-medium text-bolt-soft hover:text-ice transition-colors"
        >
          View all ({transcriptSegments.length})
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2.5">
        {transcriptSegments.slice(0, 60).map((seg, i) => (
          <div key={i} className="flex gap-2.5 group">
            <span className="text-[10px] font-medium text-bolt-soft/90 shrink-0 mt-1 tabular-nums w-10">{seg.time}</span>
            <p className="text-xs text-dim leading-relaxed line-clamp-2 group-hover:text-fog transition-colors">{seg.text}</p>
          </div>
        ))}
        {transcriptSegments.length === 0 && (
          <div className="space-y-2 pt-1">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
          </div>
        )}
      </div>
    </aside>
  );
}

/* ------------------------------- Page shell ------------------------------- */

function HydratingLoader() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-void">
      <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-bolt to-iris flex items-center justify-center mb-5 shadow-lg shadow-bolt/25">
        <Bot size={22} className="text-white animate-pulse" />
      </span>
      <Loader2 size={20} className="animate-spin text-bolt" />
    </div>
  );
}

export default function AnalysisPage() {
  const navigate = useNavigate();
  const {
    currentVideo, activeTab, isProcessingVideo,
    setTranscriptModalOpen, startNewSession, isHydrating,
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileVideoOpen, setMobileVideoOpen] = useState(false);

  useEffect(() => {
    if (!isHydrating && !currentVideo) navigate('/');
  }, [isHydrating, currentVideo, navigate]);

  if (isHydrating) return <HydratingLoader />;
  if (!currentVideo) return null;

  const ActiveIcon = TABS.find((t) => t.id === activeTab)?.icon || MessageSquare;
  const ActiveLabel = TABS.find((t) => t.id === activeTab)?.label;
  const goHome = () => { startNewSession(); navigate('/'); };

  return (
    <div className="h-screen flex bg-void overflow-hidden">
      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 z-30 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="fixed lg:hidden inset-y-0 left-0 z-40 w-64 bg-panel border-r border-edge flex flex-col"
            >
              <Sidebar onHome={goHome} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-panel border-r border-edge flex-col shrink-0">
        <Sidebar onHome={goHome} />
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-edge bg-panel/80 backdrop-blur flex items-center px-3 md:px-4 gap-2 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Menu size={18} className="text-fog" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <ActiveIcon size={16} className="text-bolt-soft shrink-0" />
            <h1 className="font-display text-sm font-semibold text-ice truncate">{ActiveLabel}</h1>
            {isProcessingVideo && <Loader2 size={13} className="animate-spin text-bolt" />}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setMobileVideoOpen((v) => !v)}
              className="xl:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-edge text-xs font-medium text-fog hover:border-bolt/40 hover:text-ice transition-all"
            >
              <MonitorPlay size={14} />
              {mobileVideoOpen ? 'Hide video' : 'Watch'}
            </button>
            <button
              onClick={() => setTranscriptModalOpen(true)}
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-edge text-xs font-medium text-fog"
            >
              <FileText size={14} /> Transcript
            </button>
          </div>
        </header>

        {/* Collapsible mobile player */}
        <AnimatePresence>
          {mobileVideoOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="xl:hidden overflow-hidden bg-black shrink-0"
            >
              <div className="aspect-video max-h-[40vh]">
                {currentVideo.embedUrl && (
                  <iframe
                    src={`${currentVideo.embedUrl}?rel=0`}
                    title="YouTube player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="flex-1 min-h-0 flex">
          <section className="flex-1 min-w-0 flex flex-col">
            {activeTab === 'chat' ? (
              <ChatSection />
            ) : (
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'summary' && <SummaryTab />}
                {activeTab === 'keypoints' && <KeyPointsTab />}
                {activeTab === 'quiz' && <QuizTab />}
              </div>
            )}
          </section>

          <VideoRail />
        </div>
      </main>

      <TranscriptModal />
    </div>
  );
}
