import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, HelpCircle, Clock, Award, ArrowLeft, RefreshCw, BookOpen } from 'lucide-react';

export const ResultPage = () => {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttempt = async () => {
      try {
        const att = await api.getAttemptById(id);
        setAttempt(att);
        const qList = await api.getQuestionsForQuiz(att.quizId);
        setQuestions(qList);

        if (att.status === 'PASSED') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadAttempt();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#88929b] font-mono text-sm">
        Calculating assessment result telemetry...
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-white">
        Result record not found.
      </div>
    );
  }

  const isPassed = attempt.status === 'PASSED';

  return (
    <div className="min-h-screen bg-[#10141a] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-mono text-[#38BDF8] hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <span className="text-xs font-mono text-[#88929b]">ATTEMPT LOG: {attempt.id}</span>
      </div>

      {/* Main Result Card (Matching Section 14) */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-6 relative overflow-hidden">
        {/* Glow Halo */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[140px] pointer-events-none ${
            isPassed ? 'bg-[#6be026]/10' : 'bg-red-500/10'
          }`}
        />

        <div className="space-y-1">
          <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-widest">QUIZ ASSESSMENT RESULT</span>
          <h1 className="text-3xl font-extrabold text-white">{attempt.quizTitle}</h1>
        </div>

        {/* Big Score Counter Badge */}
        <div className="inline-flex flex-col items-center justify-center p-6 rounded-3xl bg-[#10141a] border border-white/10 min-w-48 shadow-xl">
          <span className="text-5xl font-extrabold text-white tracking-tight">{attempt.percentage}%</span>
          <span
            className={`mt-2 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              isPassed
                ? 'bg-[#6be026]/20 text-[#6be026] border-[#6be026]/30'
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}
          >
            {attempt.status}
          </span>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#10141a] border border-white/5 font-mono text-left">
          <div className="space-y-1">
            <span className="text-[10px] text-[#88929b] uppercase">CORRECT</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#6be026]">
              <CheckCircle2 className="h-4 w-4" />
              <span>{attempt.correctAnswers}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#88929b] uppercase">INCORRECT</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-red-400">
              <XCircle className="h-4 w-4" />
              <span>{attempt.incorrectAnswers}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#88929b] uppercase">UNANSWERED</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-amber-400">
              <HelpCircle className="h-4 w-4" />
              <span>{attempt.unanswered}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#88929b] uppercase">TIME TAKEN</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <Clock className="h-4 w-4 text-[#38BDF8]" />
              <span>{attempt.timeTaken}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            to={`/quizzes/${attempt.quizId}`}
            className="px-5 py-2.5 rounded-xl bg-[#262a31] text-xs font-semibold text-white hover:bg-white/10 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Re-attempt Quiz
          </Link>
          <Link
            to="/quizzes"
            className="px-5 py-2.5 rounded-xl bg-[#38BDF8] text-[#10141a] text-xs font-bold hover:bg-[#38BDF8]/90 flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Explore More Quizzes
          </Link>
        </div>
      </div>

      {/* Answer Review Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Detailed Answer Review</h3>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userAnsRecord = attempt.answers?.find(a => a.questionId === q.id);
            const userSelId = userAnsRecord?.selectedOptionId;
            const correctOpt = q.options.find(o => o.isCorrect);
            const isCorrect = userAnsRecord?.isCorrect;

            return (
              <div key={q.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                  <span className="text-xs font-mono text-[#38BDF8]">
                    Question {idx + 1}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono ${
                      isCorrect
                        ? 'bg-[#6be026]/20 text-[#6be026]'
                        : userSelId
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {isCorrect ? 'Correct (+2)' : userSelId ? 'Incorrect (0)' : 'Unanswered (0)'}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white leading-snug">{q.questionText}</h4>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => {
                    const isUserSelected = userSelId === opt.id;
                    const isOptionCorrect = opt.isCorrect;

                    let optBg = 'bg-[#10141a] border-white/5 text-[#88929b]';
                    if (isOptionCorrect) {
                      optBg = 'bg-[#6be026]/10 border-[#6be026]/40 text-[#6be026] font-semibold';
                    } else if (isUserSelected && !isOptionCorrect) {
                      optBg = 'bg-red-500/10 border-red-500/40 text-red-400 font-semibold';
                    }

                    return (
                      <div key={opt.id} className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optBg}`}>
                        <span>{opt.text}</span>
                        {isOptionCorrect && <CheckCircle2 className="h-4 w-4 text-[#6be026] shrink-0" />}
                        {isUserSelected && !isOptionCorrect && <XCircle className="h-4 w-4 text-red-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-3.5 rounded-xl bg-[#181c22] border border-white/5 text-xs text-[#bdc8d2] space-y-1">
                    <span className="font-mono text-[#38BDF8] font-bold block">EXPLANATION:</span>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
