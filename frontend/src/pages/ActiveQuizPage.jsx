import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Send, Lock, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';

/* ── tiny canvas particle engine ── */
function HudParticles() {
  const cvRef = useRef(null);
  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let W, H, animId;
    const rs = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; };
    rs();
    window.addEventListener('resize', rs);
    const cols = ['rgba(34,211,238,', 'rgba(168,85,247,', 'rgba(251,191,36,'];
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .3,
      vy: (Math.random() - .5) * .3,
      r: Math.random() * 1.8 + .4,
      c: cols[Math.floor(Math.random() * 3)],
      a: Math.random() * .4 + .08,
    }));
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fillStyle = p.c + p.a + ')'; ctx.fill();
      });
      animId = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener('resize', rs); cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={cvRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />;
}

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

const resolveQuestionText = (q) => {
  if (!q) return '';
  const direct = q.questionText ?? q.text ?? q.question ?? q.prompt ?? q.title ?? q.body ?? q.stem ?? q.statement ?? q.content ?? q.description ?? q.question_text ?? null;
  if (direct && typeof direct === 'string' && direct.trim()) return direct.trim();
  const SKIP = new Set(['id','quizId','quiz_id','difficulty','status','createdAt','updatedAt','categoryId','category_id','type','format','explanation','explain','marks','points','score','order','sort','userId','user_id','authorId','author_id','_id']);
  let best = '';
  for (const [k, v] of Object.entries(q)) {
    if (typeof v === 'string' && !SKIP.has(k) && v.length > best.length) best = v;
  }
  return best.trim();
};
const resolveOptionText = (o) => {
  if (!o) return '';
  const direct = o.text ?? o.option_text ?? o.content ?? o.label ?? o.body ?? o.value ?? o.answer ?? o.description ?? null;
  if (direct && typeof direct === 'string' && direct.trim()) return direct.trim();
  let best = '';
  for (const [k, v] of Object.entries(o)) {
    if (typeof v === 'string' && !['id','isCorrect','correct','is_correct','order','score'].includes(k) && v.length > best.length) best = v;
  }
  return best.trim();
};

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

  const mainPanelRef = useRef(null);
  const sidePanelRef = useRef(null);

  useTilt(mainPanelRef, 2);
  useTilt(sidePanelRef, 2);

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

  const currentQT = resolveQuestionText(currentQuestion);
  console.log('[ActiveQuizPage] rendering Q', currentQuestionIndex, 'raw:', currentQuestion);
  console.log('[ActiveQuizPage] resolved question text:', currentQT);

  return (
    <div className="hud-root" style={{ background: '#030304', minHeight: '100vh', fontFamily: "'Rajdhani', sans-serif", color: '#e4e4e7', overflowX: 'hidden' }}>

      {/* ═══ AMBIENT LAYERS ═══ */}
      <div className="hud-grid-floor" />
      <div className="hud-aurora" />
      <HudParticles />
      <div className="hud-beam" style={{ left: '18%' }} />
      <div className="hud-beam" style={{ left: '72%', animationDelay: '-3.5s', background: 'linear-gradient(180deg,transparent,rgba(168,85,247,.45),transparent)' }} />
      <div className="hud-scanlines" />
      <div className="hud-vignette" />

      {/* ═══ HUD MAIN SECTION ═══ */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1400, margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24, minHeight: '100vh', justifyContent: 'center' }}>

        {/* Assessment Header Toolbar */}
        <header className="metal clip-hud-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-orbitron text-neon-orange uppercase tracking-widest text-[9px]">ACTIVE DIRECTIVE TELEMETRY</span>
            <h2 className="font-orbitron text-xl font-bold text-white leading-tight mt-1">{activeQuiz.title}</h2>
          </div>

          {/* Live Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-4 py-2 clip-hud-sm font-orbitron text-sm font-bold border transition-colors ${
              isTimeCritical
                ? 'bg-red-500/10 text-red-400 border-red-500/40 animate-pulse'
                : 'bg-black/40 text-orange-300 border-orange-400/30 glow-orange'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Time Remaining: {formatTime(remainingSeconds)}</span>
          </div>
        </header>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow">

          {/* Question & Options Area (3 cols) */}
          <div ref={mainPanelRef} className="lg:col-span-3 brackets tilt metal clip-hud p-6 sm:p-8" style={{ transformStyle: 'preserve-3d', transition: 'transform 0.18s ease-out', position: 'relative' }}>
            <div className="shine" />
            <div className="pop flex flex-col gap-8" style={{ position: 'relative', zIndex: 5 }}>
              {/* Question Metadata */}
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 font-orbitron text-xs">
                  <span className="text-zinc-400 font-bold uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} of {activeQuestions.length}
                  </span>
                  {isQuestionAnswered ? (
                    <span className="hud-badge bg-emerald-500/10 text-emerald-300 border border-emerald-400/25">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                      <span>Answer Locked</span>
                    </span>
                  ) : (
                    <span className="font-orbitron text-zinc-400 bg-black/40 px-3 py-1 clip-hud-sm border border-white/5 text-[10px]">
                      Marks: {currentQuestion.marks || 2}
                    </span>
                  )}
                </div>

                <div className="w-full" style={{ position: 'relative', zIndex: 20, minHeight: 60 }}>
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed break-words" style={{ display: 'block', visibility: 'visible', opacity: 1 }}>
                    {currentQT || `Question ${currentQuestionIndex + 1}`}
                  </h3>
                </div>
              </div>

              {/* Options Grid */}
              <div className="space-y-3" style={{ position: 'relative', zIndex: 20 }}>
                {(currentQuestion.options || currentQuestion.choices || []).map((option, idx) => {
                  const optText = resolveOptionText(option);
                  const optId = option.id || `opt-${currentQuestion.id || `cq${currentQuestionIndex}`}-${idx + 1}`;
                  const isSelected = userAnswers[currentQuestion.id] === optId ||
                    (typeof userAnswers[currentQuestion.id] === 'string' &&
                      userAnswers[currentQuestion.id].toLowerCase() === optText.toLowerCase());
                  const optionLetter = String.fromCharCode(65 + idx);

                  return (
                    <button
                      key={optId || idx}
                      type="button"
                      disabled={isQuestionAnswered}
                      onClick={() => selectAnswer(currentQuestion.id, optId)}
                      className={`w-full p-4 clip-hud-sm text-left border flex items-center justify-between gap-4 transition-all duration-200 ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-400 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10'
                          : isQuestionAnswered
                          ? 'bg-black/20 border-white/5 text-zinc-600 cursor-not-allowed opacity-40'
                          : 'bg-black/40 border-white/10 text-zinc-300 hover:bg-white/5 hover:border-white/20 cursor-pointer'
                      }`}
                      style={{ position: 'relative', zIndex: 10 }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`diamond flex items-center justify-center font-orbitron font-black text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-black'
                              : 'bg-white/5 text-zinc-500 border border-white/5'
                          }`}
                          style={{ width: 32, height: 32 }}
                        >
                          <span style={{ transform: 'rotate(-45deg)' }}>{optionLetter}</span>
                        </div>
                        <span className="text-sm font-semibold leading-relaxed">
                          {optText || `Option ${optionLetter}`}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="hud-badge bg-emerald-500/15 text-emerald-300 border border-emerald-400/25">
                          <Lock className="h-3 w-3" />
                          <span>Locked</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-white/5 font-orbitron">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="btn-steel clip-hud-sm px-5 py-2.5 disabled:opacity-30 text-xs font-semibold flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                {currentQuestionIndex < activeQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(activeQuestions.length - 1, prev + 1))}
                    className="btn-neon clip-hud-sm px-5 py-2.5 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    Next Question
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="btn-neon clip-hud-sm px-6 py-2.5 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                    style={{ background: 'linear-gradient(120deg, #10b981, #059669)' }}
                  >
                    <Send className="h-4 w-4" />
                    Submit Assessment
                  </button>
                )}
              </div>
            </div>
            <span className="bk bk-tl" /><span className="bk bk-br" />
          </div>

          {/* Question Index Sidebar (1 col) */}
          <div ref={sidePanelRef} className="brackets tilt metal clip-hud p-6 flex flex-col justify-between" style={{ transformStyle: 'preserve-3d', transition: 'transform 0.18s ease-out' }}>
            <div className="shine" />
            <div className="pop flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-orbitron font-bold text-white flex items-center justify-between uppercase tracking-wider">
                  <span>Question Palette</span>
                  <span className="text-zinc-500">
                    {answeredCount}/{activeQuestions.length} Done
                  </span>
                </h4>

                {/* Grid of Question Numbers */}
                <div className="grid grid-cols-4 gap-2">
                  {activeQuestions.map((q, idx) => {
                    const isAnswered = !!userAnswers[q.id];
                    const isCurrent = idx === currentQuestionIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-9 clip-hud-sm font-orbitron text-xs font-bold transition-all relative ${
                          isCurrent
                            ? 'bg-white text-black font-black'
                            : isAnswered
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-400/25'
                            : 'bg-black/40 text-zinc-500 border border-white/5 hover:border-white/20'
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
                className="btn-neon clip-hud-sm w-full py-3.5 text-white font-orbitron text-xs uppercase font-bold tracking-wider"
                style={{ background: 'linear-gradient(120deg, #10b981, #059669)' }}
              >
                <Send className="h-4 w-4 inline mr-2" />
                Submit Final Answers
              </button>
            </div>
            <span className="bk bk-tl" /><span className="bk bk-br" />
          </div>

        </div>

      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowSubmitModal(false)}></div>
          <div className="relative metal clip-hud w-full max-w-md p-6 sm:p-8 space-y-6 brackets">
            <div className="flex items-center gap-3 text-amber-300">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="font-orbitron text-lg font-bold text-white uppercase tracking-wider">Confirm Mission Submit</h3>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed font-semibold">
              You have completed <span className="text-white font-bold">{answeredCount}</span> out of{' '}
              <span className="text-white font-bold">{activeQuestions.length}</span> question directives. Once submitted, your answers will be finalized for diagnostic scoring.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 font-orbitron">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="btn-steel clip-hud-sm px-4 py-2 text-xs font-semibold text-zinc-400"
              >
                Continue Quiz
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="btn-neon clip-hud-sm px-5 py-2 text-xs font-bold text-white"
                style={{ background: 'linear-gradient(120deg, #10b981, #059669)' }}
              >
                {submitting ? 'Calibrating...' : 'Deploy Results'}
              </button>
            </div>
            <span className="bk bk-tl" />
            <span className="bk bk-tr" />
            <span className="bk bk-bl" />
            <span className="bk bk-br" />
          </div>
        </div>
      )}

    </div>
  );
};

export default ActiveQuizPage;
