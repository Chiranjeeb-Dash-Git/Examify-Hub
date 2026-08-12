import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { HudPlayerLayout } from '../components/HudPlayerLayout';
import { CheckCircle2, XCircle, HelpCircle, Clock, Award, ArrowLeft, RefreshCw, BookOpen, Sparkles, Loader2, Bot } from 'lucide-react';
import { gsap } from 'gsap';

/* ── 3D tilt hook ── */
function useTilt(ref, maxDeg = 8) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.transform = `rotateX(${(py - .5) * -2 * maxDeg}deg) rotateY(${(px - .5) * 2 * maxDeg}deg) translateZ(6px)`;
      el.style.setProperty('--mx', px * 100 + '%');
      el.style.setProperty('--my', py * 100 + '%');
    };
    const onLeave = () => { el.style.transform = 'rotateX(0) rotateY(0) translateZ(0)'; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [ref, maxDeg]);
}

const NORM = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');

export const ResultPage = () => {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState({});
  const [loadingAi, setLoadingAi] = useState({});

  const scoreCardRef = useRef(null);
  useTilt(scoreCardRef, 4);

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
        setTimeout(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, 50);
      }
    };
    loadAttempt();
  }, [id]);

  useEffect(() => {
    if (attempt && scoreCardRef.current) {
      gsap.fromTo(scoreCardRef.current,
        { opacity: 0.4, y: 30, scale: .98, rotateX: 4 },
        { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: .6, ease: 'power3.out' }
      );
    }
  }, [attempt]);

  const handleFetchAiExplanation = async (question) => {
    const qId = question.id;
    setLoadingAi(prev => ({ ...prev, [qId]: true }));
    try {
      const userAnsRecord = attempt.answers?.find(a => a.conceptKey === qId || a.questionId === qId);
      const normOpts = (question.options || []).map(o => ({ ...o, text: o.text || o.option_text || o.content || '' }));
      const rawSelId = userAnsRecord?.selectedOptionId;
      const rawSelText = userAnsRecord?.selectedOptionText;
      const userSelOpt = rawSelId
        ? normOpts.find(o => o.id === rawSelId) || normOpts.find(o => NORM(o.text) === NORM(rawSelId)) || normOpts.find(o => NORM(o.text) === NORM(rawSelText))
        : null;
      const correctOpt = normOpts.find(o => !!o.isCorrect) || normOpts.find(o => !!o.correct) || normOpts.find(o => !!o.is_correct);

      const insight = await api.explainAnswerAi(
        question.questionText || question.text || question.question || '',
        userSelOpt?.text || (rawSelText && !rawSelId?.startsWith('opt-') ? rawSelText : 'Unanswered'),
        correctOpt?.text || 'N/A',
        question.explanation || question.explain || ''
      );

      setAiInsights(prev => ({ ...prev, [qId]: insight }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(prev => ({ ...prev, [qId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="hud-root fixed inset-0 flex items-center justify-center" style={{ background: '#030304', fontFamily: 'Orbitron, sans-serif' }}>
        <div className="hud-grid-floor" />
        <div className="hud-aurora" />
        <div className="hud-scanlines" />
        <div className="hud-vignette" />
        <div className="text-zinc-500 font-orbitron text-xs tracking-widest uppercase animate-pulse">Calculating result telemetry…</div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="hud-root fixed inset-0 flex items-center justify-center" style={{ background: '#030304', fontFamily: 'Orbitron, sans-serif' }}>
        <div className="hud-grid-floor" />
        <div className="hud-aurora" />
        <div className="hud-scanlines" />
        <div className="hud-vignette" />
        <div className="text-red-400 font-orbitron text-xs tracking-widest uppercase">Result record not found.</div>
      </div>
    );
  }

  const isPassed = attempt.status === 'PASSED';

  return (
    <HudPlayerLayout>
      {/* Top Header */}
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-orbitron text-zinc-500 hover:text-white transition-colors uppercase tracking-wider" style={{ textDecoration: 'none' }}>
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Result Card */}
      <div ref={scoreCardRef} className="brackets tilt metal clip-hud p-8 text-center space-y-6 relative overflow-hidden mb-12" style={{ transformStyle: 'preserve-3d', transition: 'transform 0.18s ease-out' }}>
        <div className="shine" />
        {/* Glow Halo */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[140px] pointer-events-none ${
            isPassed ? 'bg-cyan-500/10' : 'bg-rose-500/10'
          }`}
        />

        <div className="pop space-y-4">
          <div className="space-y-1">
            <span className="font-orbitron text-[9px] tracking-[.3em] text-zinc-500 uppercase">Quiz Assessment Result</span>
            <h1 className="font-orbitron font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none mt-1">{attempt.quizTitle}</h1>
          </div>

          {/* Big Score Counter Badge */}
          <div className="inline-flex flex-col items-center justify-center p-6 rounded-3xl bg-black/40 border border-white/10 min-w-[200px] shadow-xl relative z-10">
            <span className="font-orbitron font-black text-5xl text-white tracking-tight">{attempt.percentage}%</span>
            <span className="hud-badge mt-2" style={{
              background: isPassed ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.1)',
              color: isPassed ? '#6ee7b7' : '#fca5a5',
              border: isPassed ? '1px solid rgba(52,211,153,.25)' : '1px solid rgba(239,68,68,.25)',
            }}>
              {attempt.status}
            </span>
          </div>

          {/* Detailed Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/30 border border-white/5 font-orbitron text-left">
            <div className="space-y-1">
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Correct</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>{attempt.correctAnswers}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Incorrect</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-red-400">
                <XCircle className="h-4 w-4" />
                <span>{attempt.incorrectAnswers}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Unanswered</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-amber-400">
                <HelpCircle className="h-4 w-4" />
                <span>{attempt.unanswered}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Time Taken</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                <Clock className="h-4 w-4 text-zinc-400" />
                <span>{attempt.timeTaken}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 font-orbitron text-xs uppercase tracking-wider font-bold">
            <Link to={`/quizzes/${attempt.quizId}`} style={{ textDecoration: 'none' }}>
              <button className="btn-steel clip-hud-sm px-5 py-2.5 flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>Re-attempt Quiz</span>
              </button>
            </Link>
            <Link to="/quizzes" style={{ textDecoration: 'none' }}>
              <button className="btn-neon clip-hud-sm px-6 py-2.5 text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Explore More Quizzes</span>
              </button>
            </Link>
          </div>
        </div>
        <span className="bk bk-tl" /><span className="bk bk-br" />
      </div>

      {/* Answer Review Section */}
      <section className="space-y-6">
        <h3 className="font-orbitron font-bold text-xl text-white uppercase tracking-wider">Detailed Answer Review</h3>

        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userAnsRecord = attempt.answers?.find(a => a.conceptKey === q.id || a.questionId === q.id);
            const rawUserSelId = userAnsRecord?.selectedOptionId;
            const rawUserSelText = userAnsRecord?.selectedOptionText;

            // ═══ ROBUST OPTION RESOLUTION ═══
            const normalizeOption = (o) => ({ ...o, text: o.text || o.option_text || o.content || o.label || '' });
            const normOpts = (q.options || []).map(normalizeOption);
            const correctOpt = normOpts.find(o => !!o.isCorrect) || normOpts.find(o => !!o.correct) || normOpts.find(o => !!o.is_correct);

            // Match user selection: try ID match first, then normalized text match
            const userSelOpt = rawUserSelId
              ? normOpts.find(o => o.id === rawUserSelId) || normOpts.find(o => NORM(o.text) === NORM(rawUserSelId)) || normOpts.find(o => NORM(o.text) === NORM(rawUserSelText))
              : null;

            const finalUserSelId = userSelOpt ? userSelOpt.id : (rawUserSelId || null);
            const finalUserSelText = userSelOpt ? userSelOpt.text : (rawUserSelText || '');

            // Accurate correctness check
            const isUnanswered = !rawUserSelId && !rawUserSelText;
            const isActuallyCorrect = correctOpt && userSelOpt && (
              correctOpt.id === userSelOpt.id || NORM(correctOpt.text) === NORM(userSelOpt.text)
            );
            const finalIsCorrect = !isUnanswered && !!isActuallyCorrect;

            const marks = q.marks || 2;

            const aiInsight = aiInsights[q.id];
            const isAiLoading = loadingAi[q.id];

            const statusBadgeStyle = finalIsCorrect
              ? { bg: 'rgba(16,185,129,.12)', fg: '#34d399', border: '1px solid rgba(16,185,129,.35)' }
              : isUnanswered
              ? { bg: 'rgba(245,158,11,.12)', fg: '#fbbf24', border: '1px solid rgba(245,158,11,.35)' }
              : { bg: 'rgba(239,68,68,.12)', fg: '#f87171', border: '1px solid rgba(239,68,68,.35)' };

            const statusLabel = finalIsCorrect
              ? `CORRECT  +${marks}`
              : isUnanswered
              ? `UNANSWERED  0`
              : `INCORRECT  0`;

            const questionTextSafe = q.questionText || q.text || q.question || q.prompt || q.title || '(Question text not available)';

            return (
              <div key={q.id} className="brackets metal clip-hud p-6 space-y-5" style={{ borderTop: `3px solid ${statusBadgeStyle.fg}` }}>
                {/* Question header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-white/5 pb-3 font-orbitron text-xs">
                  <span className="text-zinc-500 font-bold tracking-wider">
                    QUESTION {String(idx + 1).padStart(2, '0')}  ·  {marks} MARK{marks > 1 ? 'S' : ''}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleFetchAiExplanation(q)}
                      disabled={isAiLoading}
                      className="hud-badge bg-violet-500/10 text-violet-300 border border-violet-400/20 hover:bg-violet-500/20 cursor-pointer"
                    >
                      {isAiLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                      ) : (
                        <Sparkles className="h-3 w-3 text-violet-400 mr-1.5" />
                      )}
                      <span>Gemini AI Insight</span>
                    </button>

                    <span className="hud-badge font-bold tracking-wider" style={{
                      background: statusBadgeStyle.bg,
                      color: statusBadgeStyle.fg,
                      border: statusBadgeStyle.border
                    }}>
                      {finalIsCorrect ? <CheckCircle2 className="h-3.5 w-3.5 inline mr-1" /> : isUnanswered ? <HelpCircle className="h-3.5 w-3.5 inline mr-1" /> : <XCircle className="h-3.5 w-3.5 inline mr-1" />}
                      {statusLabel}
                    </span>
                  </div>
                </div>

                {/* Question text */}
                <h4 className="text-lg font-bold text-white leading-relaxed tracking-tight">{questionTextSafe}</h4>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-orbitron text-xs">
                  {normOpts.map((opt) => {
                    const optId = opt.id;
                    const optText = opt.text || '(Option text missing)';

                    const isUserSelected = finalUserSelId === optId || NORM(optText) === NORM(finalUserSelText);
                    const isOptionCorrect = correctOpt && (correctOpt.id === optId || NORM(correctOpt.text) === NORM(optText));

                    let optBg;
                    if (isOptionCorrect) {
                      optBg = 'bg-emerald-500/15 border-emerald-400/60 text-emerald-200 font-bold shadow-[0_0_0_1px_rgba(16,185,129,0.25)]';
                    } else if (isUserSelected && !isOptionCorrect) {
                      optBg = 'bg-red-500/15 border-red-400/60 text-red-200 font-bold shadow-[0_0_0_1px_rgba(239,68,68,0.25)]';
                    } else {
                      optBg = 'bg-black/30 border-white/5 text-zinc-400';
                    }

                    return (
                      <div key={optId || optText} className={`p-4 clip-hud-sm border flex items-center justify-between gap-4 ${optBg}`}>
                        <span className="leading-relaxed">{optText}</span>
                        <div className="flex shrink-0 items-center gap-1.5">
                          {isOptionCorrect && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />}
                          {isUserSelected && !isOptionCorrect && <XCircle className="h-4.5 w-4.5 text-red-400" />}
                          {isUserSelected && isOptionCorrect && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-300" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ═══ CORRECT ANSWER CALLOUT (shown when wrong or unanswered) ═══ */}
                {!finalIsCorrect && correctOpt && (
                  <div className="space-y-2">
                    {!isUnanswered && userSelOpt && (
                      <div className="p-4 rounded-xl border text-xs space-y-1.5" style={{ background: 'rgba(239,68,68,.08)', borderColor: 'rgba(239,68,68,.40)' }}>
                        <span className="font-orbitron font-bold tracking-wider block" style={{ color: '#f87171' }}>
                          <XCircle className="h-3.5 w-3.5 inline mr-1.5" /> YOUR ANSWER (WRONG):
                        </span>
                        <p className="leading-relaxed font-semibold text-red-200">{userSelOpt.text || finalUserSelText || 'Invalid selection'}</p>
                      </div>
                    )}
                    {isUnanswered && (
                      <div className="p-4 rounded-xl border text-xs space-y-1.5" style={{ background: 'rgba(245,158,11,.08)', borderColor: 'rgba(245,158,11,.40)' }}>
                        <span className="font-orbitron font-bold tracking-wider block" style={{ color: '#fbbf24' }}>
                          <HelpCircle className="h-3.5 w-3.5 inline mr-1.5" /> YOU DID NOT ANSWER THIS QUESTION:
                        </span>
                        <p className="leading-relaxed font-semibold text-amber-200">No option was selected.</p>
                      </div>
                    )}
                    <div className="p-4 rounded-xl border text-xs space-y-1.5" style={{ background: 'rgba(16,185,129,.08)', borderColor: 'rgba(16,185,129,.40)' }}>
                      <span className="font-orbitron font-bold tracking-wider block" style={{ color: '#34d399' }}>
                        <CheckCircle2 className="h-3.5 w-3.5 inline mr-1.5" /> CORRECT ANSWER:
                      </span>
                      <p className="leading-relaxed font-semibold text-emerald-200">{correctOpt.text}</p>
                    </div>
                  </div>
                )}

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-400 space-y-1.5">
                    <span className="font-orbitron font-bold text-white block uppercase tracking-wider">Reference Explanation:</span>
                    <p className="leading-relaxed font-semibold text-zinc-300">{q.explanation}</p>
                  </div>
                )}

                {/* Gemini AI Breakdown Insight */}
                {aiInsight && (
                  <div className="p-4 rounded-xl bg-violet-950/15 border border-violet-500/20 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-violet-400 font-bold font-orbitron">
                      <Bot className="h-4 w-4" />
                      <span>GEMINI AI EVALUATION INSIGHT:</span>
                      {aiInsight.conceptKey && (
                        <span className="text-[9px] px-2 py-0.5 clip-hud bg-violet-500/10 border border-violet-500/20 text-violet-300 uppercase tracking-widest font-bold">
                          {aiInsight.conceptKey}
                        </span>
                      )}
                    </div>
                    <p className="leading-relaxed font-semibold text-violet-200/90 pt-1">{aiInsight.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </HudPlayerLayout>
  );
};

export default ResultPage;
