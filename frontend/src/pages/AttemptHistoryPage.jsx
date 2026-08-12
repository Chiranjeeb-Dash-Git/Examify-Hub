import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { HudPlayerLayout } from '../components/HudPlayerLayout';
import { History, Eye, ShieldAlert } from 'lucide-react';

export const AttemptHistoryPage = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (user?.id) {
        try {
          const data = await api.getAttemptsForUser(user.id);
          setAttempts(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    };
    loadHistory();
  }, [user]);

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <HudPlayerLayout>
      {/* ── HERO HEADER ── */}
      <header className="relative mb-12">
        <div className="absolute -top-10 right-0 hidden xl:block float-y">
          <div className="w-32 h-32 diamond bg-gradient-to-br from-cyan-500/15 to-violet-600/15 border border-cyan-400/20 glow-cyan flex items-center justify-center">
            <History className="w-10 h-10 text-cyan-300/80" style={{ transform: 'rotate(-45deg)' }} />
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div style={{ height: 1, width: 56, background: 'linear-gradient(90deg, #22d3ee, transparent)' }} />
          <span className="font-orbitron text-neon-cyan uppercase" style={{ fontSize: 11, letterSpacing: '0.5em' }}>Telemetry Audit Logs</span>
          <span className="pulse-dot" />
        </div>
        <h1 className="font-orbitron font-black leading-none mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
          <span className="chrome-text">ATTEMPT</span> <span className="grad-neon" style={{ filter: 'drop-shadow(0 0 24px rgba(168,85,247,.5))' }}>HISTORY LOG</span>
        </h1>
        <p className="text-zinc-400 text-lg tracking-wide max-w-2xl">
          Review your previous assessment performances and candidate telemetry logs from the arena.
        </p>
      </header>

      <div className="hex-divider mb-10" />

      {/* ── HISTORY TELEMETRY TABLE ── */}
      <section className="metal clip-hud overflow-hidden brackets">
        <div className="shine" />
        <div className="p-6 border-b border-white/5">
          <h3 className="font-orbitron font-bold flex items-center gap-2.5" style={{ fontSize: 13, letterSpacing: '0.15em' }}>
            <History className="w-4 h-4 text-neon-cyan" />
            <span style={{ color: '#fff' }}>ATTEMPT METRICS REGISTRY</span>
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-16 font-orbitron text-xs tracking-widest text-zinc-500">
            LOADING TELEMETRY LOGS...
          </div>
        ) : attempts.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-12 h-12 diamond bg-rose-500/10 border border-rose-400/30 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6 text-rose-300" style={{ transform: 'rotate(-45deg)' }} />
            </div>
            <h3 className="font-orbitron text-sm tracking-widest text-white uppercase">No Telemetry Recorded</h3>
            <p className="text-zinc-500 text-xs">Initiate an assessment directive to log attempt metrics.</p>
            <Link to="/quizzes" style={{ textDecoration: 'none' }}>
              <button className="btn-steel clip-hud-sm px-6 py-2.5 font-orbitron text-[10px] tracking-[.2em] font-bold">
                EXPLORE QUIZZES
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="w-full hud-tbl">
              <thead>
                <tr>
                  <th>Date Completed</th>
                  <th>Quiz Mission</th>
                  <th>Score</th>
                  <th>Time Taken</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {attempts.map((att) => (
                  <tr key={att.id}>
                    <td style={{ color: '#71717a' }}>
                      {new Date(att.completedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="diamond flex items-center justify-center font-orbitron font-black text-black"
                          style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', fontSize: 10 }}>
                          <span style={{ transform: 'rotate(-45deg)' }}>QU</span>
                        </div>
                        <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>{att.quizTitle}</span>
                      </div>
                    </td>
                    <td>
                      <span className="font-orbitron font-black text-white">
                        {att.percentage}%
                      </span>
                    </td>
                    <td style={{ color: '#71717a' }}>{att.timeTaken}</td>
                    <td>
                      <span className="hud-badge" style={{
                        background: att.status === 'PASSED' ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.1)',
                        color: att.status === 'PASSED' ? '#6ee7b7' : '#fca5a5',
                        border: att.status === 'PASSED' ? '1px solid rgba(52,211,153,.25)' : '1px solid rgba(239,68,68,.25)'
                      }}>
                        {att.status === 'PASSED' ? '✓ Passed' : '✕ Failed'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/quiz/result/${att.id}`}>
                        <Eye className="w-4 h-4 text-zinc-500 hover:text-white transition-colors" />
                      </Link>
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
    </HudPlayerLayout>
  );
};

export default AttemptHistoryPage;
