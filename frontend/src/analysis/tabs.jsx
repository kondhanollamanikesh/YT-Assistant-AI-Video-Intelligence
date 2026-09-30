import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, X, ChevronLeft, ChevronRight, Award, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Skeleton, ErrorState } from '../components/ui';

/* --------------------------------- Summary -------------------------------- */

export function SummaryTab() {
  const { summary, isSummaryLoading, summaryError, ensureSummary } = useApp();

  useEffect(() => { ensureSummary(); }, [ensureSummary]);

  if (isSummaryLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="flex gap-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full" />)}</div>
        <Skeleton className="h-44 w-full rounded-2xl" />
      </div>
    );
  }

  if (summaryError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="font-display text-2xl font-semibold text-ice mb-6">Executive Summary</h2>
        <ErrorState message={summaryError} onRetry={ensureSummary} />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="font-display text-2xl font-semibold text-ice mb-6">Executive Summary</h2>
        <p className="text-sm text-dim">No summary available yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-display text-2xl font-semibold text-ice">Executive Summary</h2>
          {summary.readingTime && (
            <span className="px-2.5 py-1 rounded-full bg-bolt/10 text-bolt-soft text-[11px] font-medium border border-bolt/20">
              {summary.readingTime}
            </span>
          )}
        </div>
        <div className="panel rounded-2xl p-6 card-hover">
          <p className="text-[15px] text-fog leading-relaxed whitespace-pre-line">{summary.executive}</p>
        </div>
      </motion.div>

      {summary.topics?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}>
          <h3 className="label-caps !text-ice/70 mb-3">Topics covered</h3>
          <div className="flex flex-wrap gap-2">
            {summary.topics.map((topic, i) => (
              <span key={i} className="chip !px-3.5 !py-1.5 hover:border-bolt/40 hover:text-ice transition-colors">{topic}</span>
            ))}
          </div>
        </motion.div>
      )}

      {summary.objectives?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}>
          <h3 className="label-caps !text-ice/70 mb-3">Learning objectives</h3>
          <div className="panel rounded-2xl p-6 space-y-3.5">
            {summary.objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-fog">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-bolt to-iris text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------- Key points ------------------------------- */

export function KeyPointsTab() {
  const { keyPoints, isKeyPointsLoading, keyPointsError, ensureKeyPoints } = useApp();

  useEffect(() => { ensureKeyPoints(); }, [ensureKeyPoints]);

  if (isKeyPointsLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-40" />
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
      </div>
    );
  }

  if (keyPointsError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="font-display text-2xl font-semibold text-ice mb-6">Key Takeaways</h2>
        <ErrorState message={keyPointsError} onRetry={ensureKeyPoints} />
      </div>
    );
  }

  if (!keyPoints.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="font-display text-2xl font-semibold text-ice mb-6">Key Takeaways</h2>
        <p className="text-sm text-dim">No key points available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl font-semibold text-ice mb-7">
        Key Takeaways
      </motion.h2>

      <div className="relative pl-6">
        <div className="absolute left-[10px] top-3 bottom-3 w-px bg-gradient-to-b from-bolt/50 via-edge-hi to-transparent" />
        <div className="space-y-4">
          {keyPoints.map((point, i) => (
            <motion.div
              key={point.id ?? i}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="relative panel rounded-2xl p-5 card-hover"
            >
              <span className="absolute -left-6 top-6 w-6 h-6 rounded-full bg-gradient-to-br from-bolt to-iris flex items-center justify-center text-[11px] font-bold text-white shadow-md shadow-bolt/30">
                {point.number}
              </span>
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h4 className="text-[15px] font-semibold text-ice leading-snug">{point.title}</h4>
                {point.timestamp && (
                  <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-medium text-bolt-soft bg-bolt/10 px-2 py-0.5 rounded-full tabular-nums">
                    <Clock size={11} /> {point.timestamp}
                  </span>
                )}
              </div>
              <p className="text-sm text-fog leading-relaxed">{point.explanation}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------- Quiz --------------------------------- */

export function QuizTab() {
  const { quiz, isQuizLoading, quizError, ensureQuiz } = useApp();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  useEffect(() => { ensureQuiz(); }, [ensureQuiz]);

  const answeredCount = Object.keys(answers).length;
  const correctCount = quiz.filter((q) => answers[q.id] === q.correctAnswer).length;

  const restart = () => {
    setAnswers({});
    setCurrent(0);
    setFinished(false);
  };

  if (isQuizLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    );
  }

  if (quizError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="font-display text-2xl font-semibold text-ice mb-6">Quiz</h2>
        <ErrorState message={quizError} onRetry={ensureQuiz} />
      </div>
    );
  }

  if (!quiz.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="font-display text-2xl font-semibold text-ice mb-6">Quiz</h2>
        <p className="text-sm text-dim">No quiz available.</p>
      </div>
    );
  }

  /* Results screen */
  if (finished) {
    const pct = Math.round((correctCount / quiz.length) * 100);
    const verdict =
      pct === 100 ? 'Perfect score — you know this video inside out.' :
      pct >= 75 ? 'Great job — solid understanding.' :
      pct >= 50 ? 'Not bad — a quick recap might help.' :
      'Time to rewatch the video!';

    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="panel rounded-3xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-bolt to-iris flex items-center justify-center mx-auto mb-5 shadow-lg shadow-bolt/30">
            <Award size={28} className="text-white" />
          </div>
          <p className="font-display text-5xl font-semibold text-gradient mb-1">{pct}%</p>
          <p className="text-sm text-dim mb-1">{correctCount} of {quiz.length} correct</p>
          <p className="text-base font-medium text-ice mb-8">{verdict}</p>

          <div className="space-y-2 mb-8 text-left">
            {quiz.map((q, i) => (
              <div key={q.id} className="flex items-center gap-3 text-sm px-4 py-2.5 rounded-xl bg-white/[0.02] border border-edge">
                <span className="text-dim text-xs tabular-nums">Q{i + 1}</span>
                <span className="flex-1 truncate text-fog">{q.question}</span>
                {answers[q.id] === q.correctAnswer ? (
                  <CheckCircle size={15} className="text-mint shrink-0" />
                ) : (
                  <X size={15} className="text-red-400 shrink-0" />
                )}
              </div>
            ))}
          </div>

          <button onClick={restart} className="btn-primary">
            <RefreshCw size={14} /> Retake quiz
          </button>
        </motion.div>
      </div>
    );
  }

  const q = quiz[current];
  const selected = answers[q.id];
  const revealed = selected !== undefined;
  const isLast = current === quiz.length - 1;

  const pick = (idx) => {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [q.id]: idx }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl font-semibold text-ice">Quiz</h2>
        <span className="text-xs font-medium text-dim tabular-nums">Question {current + 1} of {quiz.length}</span>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5 mb-7">
        {quiz.map((item, i) => {
          const ans = answers[item.id];
          return (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              title={`Question ${i + 1}`}
              aria-label={`Go to question ${i + 1}`}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i === current ? 'bg-gradient-to-r from-bolt to-iris'
                : ans !== undefined ? (ans === item.correctAnswer ? 'bg-mint' : 'bg-red-400/80')
                : 'bg-edge hover:bg-edge-hi'
              }`}
            />
          );
        })}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.2 }}
          className="panel rounded-2xl p-6 mb-5"
        >
          <h3 className="text-lg font-medium text-ice mb-5 leading-snug">{q.question}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.correctAnswer;
              let cls = 'border-edge bg-white/[0.02] text-fog hover:border-bolt/50 hover:text-ice';
              if (revealed && isCorrect) cls = 'border-mint/50 bg-mint/[0.08] text-emerald-100';
              else if (revealed && isSelected && !isCorrect) cls = 'border-red-500/50 bg-red-500/[0.07] text-red-200';
              else if (revealed) cls = 'border-edge bg-transparent text-dim';
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={revealed}
                  className={`p-3.5 rounded-xl text-left text-sm border transition-all ${cls}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${
                      revealed && isCorrect ? 'bg-mint/20 text-emerald-300'
                      : revealed && isSelected ? 'bg-red-500/20 text-red-300'
                      : 'bg-edge text-fog'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                    {revealed && isCorrect && <CheckCircle size={15} className="text-mint shrink-0" />}
                    {revealed && isSelected && !isCorrect && <X size={15} className="text-red-400 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {revealed && (
            <motion.p
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-4 text-sm font-medium ${selected === q.correctAnswer ? 'text-mint' : 'text-red-300'}`}
            >
              {selected === q.correctAnswer ? 'Correct!' : `Incorrect — the answer is "${q.options[q.correctAnswer]}".`}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="flex gap-3">
        <button
          onClick={() => setCurrent((p) => Math.max(0, p - 1))}
          disabled={current === 0}
          className="btn-ghost flex-1 !py-3 disabled:opacity-40"
        >
          <ChevronLeft size={15} /> Previous
        </button>
        <button
          onClick={() => (isLast ? setFinished(true) : setCurrent((p) => Math.min(quiz.length - 1, p + 1)))}
          disabled={!revealed}
          className="btn-primary flex-1 disabled:opacity-40"
        >
          {isLast ? `See results (${answeredCount}/${quiz.length})` : 'Next'} <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
