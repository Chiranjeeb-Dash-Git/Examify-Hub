import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Send } from 'lucide-react';

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
      // Auto submit on time expiry!
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
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const answeredCount = Object.keys(userAnswers).length;
  const isTimeCritical = remainingSeconds < 120; // < 2 mins

  return (
    <div className="min-h-screen bg-[#10141a] py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col space-y-6">
      {/* Assessment Header Toolbar */}
      <header className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-4 z-30">
        <div>
          <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-widest">ACTIVE DIRECTIVE</span>
          <h2 className="text-xl font-bold text-white leading-tight">{activeQuiz.title}</h2>
        </div>

        {/* Live Countdown Timer (Matching Stitch Design) */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold border transition-colors ${
            isTimeCritical
              ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
              : 'bg-[#181c22] text-[#38BDF8] border-[#38BDF8]/30'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Time Remaining: {formatTime(remainingSeconds)}</span>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow">
        {/* Question & Options Area (3 cols) */}
        <div className="lg:col-span-3 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between space-y-8">
          {/* Question Metadata */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-[#38BDF8]">
                Question {currentQuestionIndex + 1} of {activeQuestions.length}
              </span>
              <span className="text-xs font-mono text-[#88929b] bg-[#262a31] px-2.5 py-1 rounded-md">
                Marks: {currentQuestion.marks || 2}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {currentQuestion.questionText}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = userAnswers[currentQuestion.id] === option.id;
              const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

              return (
                <button
                  key={option.id}
                  onClick={() => selectAnswer(currentQuestion.id, option.id)}
                  className={`w-full p-4 rounded-2xl text-left border flex items-center gap-4 transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#38BDF8]/15 border-[#38BDF8] text-white shadow-lg shadow-[#38BDF8]/10'
                      : 'bg-[#181c22] border-white/5 text-[#dfe2eb] hover:bg-[#262a31] hover:border-white/20'
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#38BDF8] text-[#10141a]'
                        : 'bg-[#262a31] text-[#88929b]'
                    }`}
                  >
                    {optionLetter}
                  </div>
                  <span className="text-sm font-medium leading-relaxed">{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-5 py-2.5 rounded-xl bg-[#262a31] hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-[#262a31] text-xs font-semibold text-white flex items-center gap-2 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {currentQuestionIndex < activeQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(activeQuestions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-[#38BDF8] text-[#10141a] hover:bg-[#38BDF8]/90 text-xs font-bold flex items-center gap-2 shadow-md shadow-[#38BDF8]/20 transition-all"
              >
                Next Question
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-2.5 rounded-xl bg-[#6be026] text-[#10141a] hover:bg-[#6be026]/90 text-xs font-bold flex items-center gap-2 shadow-md shadow-[#6be026]/20 transition-all"
              >
                <Send className="h-4 w-4" />
                Submit Assessment
              </button>
            )}
          </div>
        </div>

        {/* Question Index Sidebar (1 col) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Question Palette</span>
              <span className="text-xs font-mono text-[#38BDF8]">
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
                        ? 'bg-[#38BDF8] text-[#10141a] ring-2 ring-[#38BDF8]/50'
                        : isAnswered
                        ? 'bg-[#6be026]/20 text-[#6be026] border border-[#6be026]/40'
                        : 'bg-[#181c22] text-[#88929b] border border-white/5 hover:border-white/20'
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
            className="w-full py-3 rounded-xl bg-[#6be026] text-[#10141a] font-bold text-xs hover:bg-[#6be026]/90 transition-all flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            Submit Final Answers
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-bold text-white">Confirm Assessment Submission</h3>
            </div>

            <p className="text-xs text-[#88929b] leading-relaxed">
              You have answered <span className="text-[#38BDF8] font-bold">{answeredCount}</span> out of{' '}
              <span className="text-white font-bold">{activeQuestions.length}</span> questions. Once submitted, answers cannot be edited.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl bg-[#262a31] text-xs font-semibold text-white hover:bg-white/10"
              >
                Continue Quiz
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-[#6be026] text-[#10141a] text-xs font-bold hover:bg-[#6be026]/90"
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
