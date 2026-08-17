import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { HudPlayerLayout } from '../components/HudPlayerLayout';
import { Clock, HelpCircle, Award, ShieldAlert, ArrowLeft, Rocket, Play, Sparkles, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';

export const QuizDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quizzes, startQuizSession, loading: quizLoading } = useQuiz();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const cardRef = useRef(null);

  useEffect(() => {
    const q = quizzes.find(item => item.id === id);
    if (q) setQuiz(q);
  }, [id, quizzes]);

  useEffect(() => {
    if (quiz && cardRef.current) {
      gsap.fromTo(cardRef.current,
        { scale: .93, y: 30, opacity: 0, rotateX: 8 },
        { scale: 1, y: 0, opacity: 1, rotateX: 0, duration: .6, ease: 'power3.out' }
      );
    }
  }, [quiz]);

  const handleStartQuiz = async () => {
    setStarting(true);
    setAiGenerating(false);
    setError('');
    const aiThresholdTimer = setTimeout(() => {
      setAiGenerating(true);
    }, 1200);
    try {
      await startQuizSession(quiz.id);
      navigate(`/quiz/${quiz.id}/attempt`);
    } catch (err) {
      setError(err.message || 'Failed to start quiz session.');
      setStarting(false);
    } finally {
      clearTimeout(aiThresholdTimer);
      setAiGenerating(false);
    }
  };

  if (!quiz) {
    return (
      <div className="hud-root fixed inset-0 flex items-center justify-center" style={{ background: '#030304', fontFamily: 'Orbitron, sans-serif' }}>
        <div className="hud-grid-floor" />
        <div className="hud-aurora" />
        <div className="hud-scanlines" />
        <div className="hud-vignette" />
        <div className="text-zinc-500 font-orbitron text-xs tracking-widest uppercase animate-pulse">Loading mission parameters…</div>
      </div>
    );
  }

  const diffClass = `d-${quiz.difficulty || 'Intermediate'}`;

  const metaItems = [
    { icon: HelpCircle, label: 'Questions', val: quiz.questionsCount || quiz.questions?.length || 5, color: 'text-orange-300' },
    { icon: Clock, label: 'Duration', val: `${quiz.duration} min`, color: 'text-orange-300' },
    { icon: Award, label: 'Pass Score', val: `${quiz.passingScore}%`, color: 'text-amber-400' },
    { icon: ShieldAlert, label: 'Max Attempts', val: quiz.maxAttempts || 3, color: 'text-orange-400' },
    { icon: Award, label: 'Total Marks', val: (quiz.questionsCount || quiz.questions?.length || 5) * 2, color: 'text-yellow-400' },
    { icon: Play, label: 'Total Plays', val: quiz.attemptsCount || 0, color: 'text-red-300' },
  ];

  return (
    <HudPlayerLayout>
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/quizzes"
          className="inline-flex items-center gap-2 text-xs font-orbitron text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
          style={{ textDecoration: 'none' }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Mission Selection</span>
        </Link>
      </div>

      {/* Main Detail Header Card */}
      <div ref={cardRef} className="brackets metal clip-hud w-full max-w-2xl mx-auto overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
        {/* Banner area */}
        <div className="q-banner !h-44">
          <span style={{ fontSize: '5rem' }} className="q-thumb select-none">{quiz.thumbnail || '⚡'}</span>
          <span className="absolute top-4 left-4 hud-badge bg-black/60 text-orange-300 border border-orange-400/30 flex items-center gap-1.5">
            <HelpCircle className="w-3 h-3" />
            {quiz.categoryName || 'General'}
          </span>
          <span className={`absolute top-4 right-4 diff-b ${diffClass}`}>
            {quiz.difficulty || 'Intermediate'}
          </span>
        </div>

        {/* Content body */}
        <div className="p-8">
          <div className="font-orbitron text-[9px] tracking-[.4em] text-neon-orange mb-2">◤ MISSION BRIEFING · ID-{String(quiz.id).slice(-3).toUpperCase()}</div>
          <h2 className="font-orbitron text-3xl font-black chrome-text mb-3">{quiz.title}</h2>
          <p className="text-zinc-400 text-lg mb-6 leading-relaxed">{quiz.description}</p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {metaItems.map((m, idx) => (
              <div key={idx} className="bg-black/30 border border-white/5 clip-hud-sm p-3.5">
                <div className={`${m.color} mb-1`}><m.icon className="w-4 h-4" /></div>
                <div className="font-orbitron text-[8px] tracking-[.25em] text-zinc-500 uppercase">{m.label}</div>
                <div className="font-orbitron font-black text-white">{m.val}</div>
              </div>
            ))}
          </div>

          {/* Guidelines box */}
          <div className="bg-black/40 border border-orange-400/15 clip-hud p-5 mb-6">
            <div className="font-orbitron text-[9px] tracking-[.35em] text-neon-orange mb-3">▸ ENGAGEMENT PROTOCOL</div>
            <ul className="text-zinc-400 space-y-1.5 text-[15px] font-semibold tracking-wide">
              <li>◈ Timer starts immediately — auto-submit on expiry.</li>
              <li>◈ Free navigation between questions before submission.</li>
              <li>◈ Each question carries its own marks. No negative marking.</li>
              <li>◈ Requires <b className="text-neon-orange">{quiz.passingScore}%</b> to clear this mission.</li>
            </ul>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-xs font-orbitron text-red-400">
              {error}
            </div>
          )}

          {/* Deploy Button */}
          <button
            onClick={handleStartQuiz}
            disabled={starting}
            className="btn-neon w-full py-4 clip-hud font-orbitron text-xs tracking-[.3em] font-bold text-white flex items-center justify-center gap-2"
          >
            {aiGenerating ? (
              <>
                <Sparkles className="w-4 h-4 text-orange-300 animate-pulse" />
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>GENERATING AI QUESTIONS · PLEASE WAIT…</span>
              </>
            ) : starting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>DEPLOYING BRIEFING DIRECTIVE...</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 animate-bounce" />
                <span>DEPLOY · START MISSION</span>
              </>
            )}
          </button>
        </div>
        <span className="bk bk-tl" />
        <span className="bk bk-tr" />
        <span className="bk bk-bl" />
        <span className="bk bk-br" />
      </div>
    </HudPlayerLayout>
  );
};

export default QuizDetailPage;
