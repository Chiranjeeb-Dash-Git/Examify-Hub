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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/40 font-mono text-xs uppercase tracking-widest">
        Calculating assessment result telemetry...
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono text-sm">
        Result record not found.
      </div>
    );
  }

  const isPassed = attempt.status === 'PASSED';

  return (
    <div className="min-h-screen bg-[#050505] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-white font-body">
      {/* Top Header */}
      <div className="flex items-center justify-between font-mono text-xs">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-white/40">ATTEMPT LOG: {attempt.id}</span>
      </div>

      {/* Main Result Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-6 relative overflow-hidden bg-[#0a0a0c] backdrop-blur-xl shadow-2xl">
        {/* Glow Halo */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[140px] pointer-events-none ${
            isPassed ? 'bg-emerald-500/10' : 'bg-red-500/10'
          }`}
        />

        <div className="space-y-1">
          <span className="text-xs font-mono text-white/50 uppercase tracking-widest">QUIZ ASSESSMENT RESULT</span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">{attempt.quizTitle}</h1>
        </div>

        {/* Big Score Counter Badge */}
        <div className="inline-flex flex-col items-center justify-center p-6 rounded-3xl bg-[#050505] border border-white/20 min-w-48 shadow-xl">
          <span className="font-display font-extrabold text-5xl text-white tracking-tight">{attempt.percentage}%</span>
          <span
            className={`mt-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
              isPassed
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-red-500/20 text-red-400 border-red-500/40'
            }`}
          >
            {attempt.status}
          </span>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#050505] border border-white/10 font-mono text-left">
          <div className="space-y-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">CORRECT</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>{attempt.correctAnswers}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">INCORRECT</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-red-400">
              <XCircle className="h-4 w-4" />
              <span>{attempt.incorrectAnswers}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">UNANSWERED</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-amber-300">
              <HelpCircle className="h-4 w-4" />
              <span>{attempt.unanswered}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">TIME TAKEN</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <Clock className="h-4 w-4 text-white/80" />
              <span>{attempt.timeTaken}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 font-mono text-xs uppercase tracking-wider font-bold">
          <Link
            to={`/quizzes/${attempt.quizId}`}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white hover:bg-white/10 flex items-center gap-2 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Re-attempt Quiz</span>
          </Link>
          <Link
            to="/quizzes"
            className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 flex items-center gap-2 shadow-lg shadow-white/10 transition-all"
          >
            <BookOpen className="h-4 w-4" />
            <span>Explore More Quizzes</span>
          </Link>
        </div>
      </div>

      {/* Answer Review Section */}
      <div className="space-y-4">
        <h3 className="font-display font-extrabold text-xl text-white tracking-tight">Detailed Answer Review</h3>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userAnsRecord = attempt.answers?.find(a => a.questionId === q.id);
            const userSelId = userAnsRecord?.selectedOptionId;
            const correctOpt = q.options.find(o => o.isCorrect);
            const isCorrect = userAnsRecord?.isCorrect;

            return (
              <div key={q.id} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 bg-[#0a0a0c]">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 font-mono text-xs">
                  <span className="text-white/60">
                    Question {idx + 1}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                      isCorrect
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : userSelId
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {isCorrect ? 'Correct (+2)' : userSelId ? 'Incorrect (0)' : 'Unanswered (0)'}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white leading-snug font-body">{q.questionText}</h4>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                  {q.options.map((opt) => {
                    const isUserSelected = userSelId === opt.id;
                    const isOptionCorrect = opt.isCorrect;

                    let optBg = 'bg-[#050505] border-white/10 text-white/60';
                    if (isOptionCorrect) {
                      optBg = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold';
                    } else if (isUserSelected && !isOptionCorrect) {
                      optBg = 'bg-red-500/10 border-red-500/40 text-red-400 font-bold';
                    }

                    return (
                      <div key={opt.id} className={`p-3.5 rounded-xl border flex items-center justify-between ${optBg}`}>
                        <span>{opt.text}</span>
                        {isOptionCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                        {isUserSelected && !isOptionCorrect && <XCircle className="h-4 w-4 text-red-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-4 rounded-2xl bg-[#050505] border border-white/10 text-xs text-white/70 space-y-1 font-mono">
                    <span className="text-white font-bold block">EXPLANATION:</span>
                    <p className="leading-relaxed font-body text-white/60">{q.explanation}</p>
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
