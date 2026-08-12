import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { HudPlayerLayout } from '../components/HudPlayerLayout';
import { HudAdminLayout } from '../components/HudAdminLayout';
import { Trophy, Award, Crown, Medal } from 'lucide-react';

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

function PodiumCard({ student, rank, rankName, colorClass, borderClass, maxDeg = 8 }) {
  const cardRef = useRef(null);
  useTilt(cardRef, maxDeg);

  return (
    <div ref={cardRef} className="brackets tilt" style={{ transformStyle: 'preserve-3d', transition: 'transform 0.18s ease-out' }}>
      <div className="shine" />
      <div className={`pop metal clip-hud p-6 text-center flex flex-col items-center relative space-y-3 ${borderClass}`}>
        {rank === 1 && <Crown className="h-6 w-6 text-amber-400 animate-bounce" />}
        {rank === 2 && <Medal className="h-6 w-6 text-slate-300" />}
        {rank === 3 && <Medal className="h-6 w-6 text-amber-700" />}

        <div className="relative">
          <img
            src={student.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`}
            alt={student.name}
            className="h-16 w-16 rounded-full object-cover border border-white/10 shadow-lg"
          />
          <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 font-orbitron font-black text-[10px] px-2.5 py-0.5 clip-hud-sm ${colorClass}`}>
            #{rank}
          </span>
        </div>
        <h3 className="font-orbitron font-bold text-white text-sm pt-2">{student.name}</h3>
        <span className="text-2xl font-orbitron font-black text-white leading-none">{student.averageScore}%</span>
        <span className="font-orbitron text-[9px] tracking-wider text-zinc-500 uppercase">{student.quizzesAttempted} Missions</span>
      </div>
      <span className="bk bk-tl" /><span className="bk bk-br" />
    </div>
  );
}

export const LeaderboardPage = () => {
  const location = useLocation();
  const isAdminView = location.pathname.startsWith('/admin');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await api.getLeaderboard();
        setLeaderboard(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  const topThree = leaderboard.slice(0, 3);
  const remainingRanked = leaderboard.slice(3);

  // silver, gold, bronze
  const podiumOrder = [
    { key: 1, idx: 1, rank: 2, name: 'SILVER', color: 'bg-slate-300 text-black', border: 'border-slate-400/40 glow-violet' },
    { key: 0, idx: 0, rank: 1, name: 'GOLD', color: 'bg-amber-400 text-black', border: 'border-amber-400/50 glow-gold scale-105' },
    { key: 2, idx: 2, rank: 3, name: 'BRONZE', color: 'bg-amber-700 text-white', border: 'border-amber-700/40' }
  ];

  const LayoutWrapper = isAdminView ? HudAdminLayout : HudPlayerLayout;

  return (
    <LayoutWrapper>
      {/* ── HERO HEADER ── */}
      <header className="relative mb-12 text-center flex flex-col items-center">
        <div className="flex items-center gap-4 mb-4">
          <div style={{ height: 1, width: 56, background: 'linear-gradient(90deg, #22d3ee, transparent)' }} />
          <span className="font-orbitron text-neon-cyan uppercase" style={{ fontSize: 11, letterSpacing: '0.5em' }}>Hall of Fame</span>
          <span className="pulse-dot" />
        </div>
        <h1 className="font-orbitron font-black leading-none mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
          <span className="chrome-text">CANDIDATE</span> <span className="grad-neon" style={{ filter: 'drop-shadow(0 0 24px rgba(168,85,247,.5))' }}>LEADERBOARD</span>
        </h1>
        <p className="text-zinc-400 text-lg tracking-wide max-w-2xl">
          Top candidate telemetry ranked by accuracy, average score, and completed arena directives.
        </p>
      </header>

      <div className="hex-divider mb-10" />

      {/* ── TOP 3 PODIUM DISPLAY ── */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-3 gap-6 pt-6 max-w-3xl mx-auto items-end mb-16" style={{ perspective: 1200 }}>
          {/* Order: 2nd, 1st, 3rd */}
          {podiumOrder.map(({ key, idx, rank, color, border }) => {
            const student = topThree[idx];
            if (!student) return <div key={key} />;
            return (
              <PodiumCard
                key={key}
                student={student}
                rank={rank}
                colorClass={color}
                borderClass={border}
              />
            );
          })}
        </div>
      )}

      {/* ── FULL LEADERBOARD TABLE ── */}
      <section className="metal clip-hud overflow-hidden brackets">
        <div className="shine" />
        <div className="p-6 border-b border-white/5">
          <h3 className="font-orbitron font-bold flex items-center gap-2.5" style={{ fontSize: 13, letterSpacing: '0.15em' }}>
            <Trophy className="w-4 h-4 text-neon-cyan" />
            <span style={{ color: '#fff' }}>FULL LEADERBOARD TELEMETRY</span>
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-16 font-orbitron text-xs tracking-widest text-zinc-500">
            LOADING RANK TELEMETRY...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="w-full hud-tbl">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Candidate</th>
                  <th>Missions Completed</th>
                  <th>Highest Score</th>
                  <th style={{ textAlign: 'right' }}>Average Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="flex items-center">
                        <div className="diamond flex items-center justify-center font-orbitron font-black text-black"
                          style={{ width: 32, height: 32, background: student.rank <= 3 ? 'linear-gradient(135deg,#22d3ee,#a855f7)' : 'rgba(255,255,255,.05)', fontSize: 10 }}>
                          <span style={{ transform: 'rotate(-45deg)' }}>#{student.rank}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`}
                          alt={student.name}
                          className="h-8 w-8 rounded-full object-cover border border-white/10"
                        />
                        <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>{student.name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#71717a' }}>{student.quizzesAttempted}</td>
                    <td className="font-orbitron text-zinc-300 font-bold">{student.highestScore}%</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="font-orbitron font-black text-neon-cyan text-lg">
                        {student.averageScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <span className="bk bk-tl" />
        <span className="bk bk-br" />
      </section>
    </LayoutWrapper>
  );
};

export default LeaderboardPage;
