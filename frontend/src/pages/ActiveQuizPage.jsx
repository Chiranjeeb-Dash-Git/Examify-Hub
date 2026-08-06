import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Send, Lock, ShieldCheck } from 'lucide-react';

export const ActiveQuizPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    activeQuiz,
    activeQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    userAnswers,
    selectAnswer,
    remainingSeconds,
    setRemainingSeconds,
    submitActiveQuizSession
  } = useQuiz();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if no active session
  useEffect(() => {
    if (!activeQuiz || !activeQuestions || activeQuestions.length === 0) {
      navigate('/quizzes');
    }
  }, [activeQuiz, activeQuestions, navigate]);

  // Countdown timer interval
  useEffect(() => {
    if (remainingSeconds <= 0 && activeQuiz) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, activeQuiz]);

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await submitActiveQuizSession(user?.id);
      navigate(`/quiz/result/${result.id}`);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  if (!activeQuiz || activeQuestions.length === 0) return null;

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const isQuestionAnswered = !!userAnswers[currentQuestion.id];
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const answeredCount = Object.keys(userAnswers).length;
  const isTimeCritical = remainingSeconds < 120; // < 2 mins

  return (
    <div className="min-h-screen bg-[#050505] py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col space-y-6 text-white font-body">
      {/* Assessment Header Toolbar */}
      <header className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-4 z-30 bg-[#0a0a0c]/90 backdrop-blur-xl">
        <div>
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">ACTIVE DIRECTIVE TELEMETRY</span>
          <h2 className="font-display text-xl font-bold text-white leading-tight">{activeQuiz.title}</h2>
        </div>

        {/* Live Countdown Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold border transition-colors ${
            isTimeCritical
              ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
              : 'bg-[#050505] text-white border-white/20'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Time Remaining: {formatTime(remainingSeconds)}</span>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow">
        {/* Question & Options Area (3 cols) */}
        <div className="lg:col-span-3 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between space-y-8 bg-[#0a0a0c]">
          {/* Question Metadata */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-xs">
              <span className="text-white/80 font-bold uppercase tracking-wider">
                Question {currentQuestionIndex + 1} of {activeQuestions.length}
              </span>
              {isQuestionAnswered ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>🔒 Answer Locked</span>
                </span>
              ) : (
                <span className="text-white/50 bg-[#050505] px-3 py-1 rounded-md border border-white/10">
                  Marks: {currentQuestion.marks || 2}
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug font-body">
              {currentQuestion.questionText}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {(currentQuestion.options || []).map((option, idx) => {
              const optId = option.id || `opt-${currentQuestion.id}-${idx + 1}`;
              const isSelected = userAnswers[currentQuestion.id] === optId || userAnswers[currentQuestion.id] === option.text;
              const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

              return (
                <button
                  key={optId || idx}
                  type="button"
                  disabled={isQuestionAnswered}
                  onClick={() => selectAnswer(currentQuestion.id, optId)}
                  className={`w-full p-4 rounded-2xl text-left border flex items-center justify-between gap-4 transition-all duration-200 ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-100 font-bold shadow-xl shadow-emerald-500/10'
                      : isQuestionAnswered
                      ? 'bg-[#050505]/40 border-white/5 text-white/30 cursor-not-allowed opacity-50'
                      : 'bg-[#050505] border-white/10 text-white/80 hover:bg-white/5 hover:border-white/20 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-emerald-400 text-black'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {optionLetter}
                    </div>
                    <span className="text-sm font-medium leading-relaxed">{option.text || option.option_text}</span>
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider shrink-0">
                      <Lock className="h-3 w-3" />
                      <span>Locked</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10 font-mono">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 text-xs font-semibold text-white flex items-center gap-2 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {currentQuestionIndex < activeQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(activeQuestions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-white/10 transition-all"
              >
                Next Question
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-400 text-black hover:bg-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-400/20 transition-all"
              >
                <Send className="h-4 w-4" />
                Submit Assessment
              </button>
            )}
          </div>
        </div>

        {/* Question Index Sidebar (1 col) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6 flex flex-col justify-between bg-[#0a0a0c]">
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-white flex items-center justify-between uppercase tracking-wider">
              <span>Question Palette</span>
              <span className="text-white/60">
                {answeredCount}/{activeQuestions.length} Done
              </span>
            </h4>

            {/* Grid of Question Numbers */}
            <div className="grid grid-cols-4 gap-2.5">
              {activeQuestions.map((q, idx) => {
                const isAnswered = !!userAnswers[q.id];
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-10 rounded-xl font-mono text-xs font-bold transition-all relative ${
                      isCurrent
                        ? 'bg-white text-black ring-2 ring-white/50'
                        : isAnswered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-[#050505] text-white/40 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Submit */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="w-full py-3.5 rounded-xl bg-emerald-400 text-black font-mono text-xs uppercase font-bold tracking-wider hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-400/20"
          >
            <Send className="h-4 w-4" />
            Submit Final Answers
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 bg-[#0a0a0c]">
            <div className="flex items-center gap-3 text-amber-300">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="font-display text-lg font-bold text-white">Confirm Assessment Submission</h3>
            </div>

            <p className="text-xs text-white/60 font-mono leading-relaxed">
              You have answered <span className="text-white font-bold">{answeredCount}</span> out of{' '}
              <span className="text-white font-bold">{activeQuestions.length}</span> questions. Once submitted, answers cannot be edited.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 font-mono">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/5 text-xs font-semibold text-white hover:bg-white/10 border border-white/10"
              >
                Continue Quiz
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider hover:bg-emerald-300"
              >
                {submitting ? 'Processing Score...' : 'Yes, Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
