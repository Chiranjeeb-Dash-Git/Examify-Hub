import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, HelpCircle, Award, Flame, Play } from 'lucide-react';

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

export const QuizCard = ({ quiz }) => {
  const cardRef = useRef(null);
  useTilt(cardRef, 8);

  const isUrl = (str) => str && (str.startsWith('http') || str.startsWith('/') || str.startsWith('data:'));

  const diffClass = `d-${quiz.difficulty || 'Intermediate'}`;

  return (
    <div ref={cardRef} className="brackets tilt metal clip-hud overflow-hidden flex flex-col h-full" style={{ transformStyle: 'preserve-3d' }}>
      <div className="shine" />
      <div className="pop flex flex-col h-full">
        {/* Banner image/thumbnail area */}
        <div className="q-banner">
          {isUrl(quiz.thumbnail) ? (
            <img
              src={quiz.thumbnail}
              alt={quiz.title}
              className="absolute inset-0 h-full w-full object-cover opacity-30 q-thumb"
            />
          ) : (
            <span className="q-thumb pop select-none">{quiz.thumbnail || '⚡'}</span>
          )}
          <span className="absolute top-3 left-3 hud-badge bg-black/60 text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5">
            <HelpCircle className="w-3 h-3" />
            {quiz.categoryName || 'General'}
          </span>
          <span className={`absolute top-3 right-3 diff-b ${diffClass}`}>
            {quiz.difficulty || 'Intermediate'}
          </span>
        </div>

        {/* Content body */}
        <div className="p-5 flex-grow flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="q-title font-orbitron font-bold text-base tracking-wide text-white">
              {quiz.title}
            </h3>
            <span className="font-orbitron text-[9px] tracking-widest text-zinc-600 mt-1 shrink-0">
              ID-{String(quiz.id || '').slice(-3).toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-zinc-400 clamp2 mb-4 flex-grow">{quiz.description}</p>

          {/* HUD Stats slots */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-black/30 border border-white/5 clip-hud-sm p-2 text-center">
              <div className="font-orbitron font-black text-sm text-white">{quiz.questionsCount || quiz.questions?.length || 5}</div>
              <div className="font-orbitron text-[7px] tracking-[.2em] text-zinc-500 uppercase">Questions</div>
            </div>
            <div className="bg-black/30 border border-white/5 clip-hud-sm p-2 text-center">
              <div className="font-orbitron font-black text-sm text-neon-cyan">{quiz.duration}<span className="text-[9px] text-zinc-500">m</span></div>
              <div className="font-orbitron text-[7px] tracking-[.2em] text-zinc-500 uppercase">Duration</div>
            </div>
            <div className="bg-black/30 border border-white/5 clip-hud-sm p-2 text-center">
              <div className="font-orbitron font-black text-sm text-neon-violet">{quiz.passingScore}%</div>
              <div className="font-orbitron text-[7px] tracking-[.2em] text-zinc-500 uppercase">Pass Score</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-orbitron tracking-widest text-zinc-500 mb-1.5">
            <span>MAX ATTEMPTS: {quiz.maxAttempts || 3}</span>
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              {quiz.attemptsCount || 0} PLAYS
            </span>
          </div>

          {/* Button */}
          <Link to={`/quizzes/${quiz.id}`} className="mt-2 block" style={{ textDecoration: 'none' }}>
            <button className="btn-neon w-full py-3 clip-hud-sm font-orbitron text-[10px] tracking-[.25em] font-bold text-white flex items-center justify-center gap-2">
              <Play className="w-3.5 h-3.5" /> ENTER MISSION
            </button>
          </Link>
        </div>
      </div>
      <span className="bk bk-tl" />
      <span className="bk bk-br" />
    </div>
  );
};

export default QuizCard;
