import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import { QuizCard } from '../components/QuizCard';
import { HudPlayerLayout } from '../components/HudPlayerLayout';
import { api } from '../services/api';
import { gsap } from 'gsap';
import { Award, Zap, TrendingUp, Clock, Activity, Flame, Swords, Box, Shield, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { quizzes, loading: quizLoading } = useQuiz();
  const [userAttempts, setUserAttempts] = useState([]);
  const [stats, setStats] = useState({
    avgScore: user?.averageScore || 0,
    quizzesPassed: 0,
    quizzesFailed: 0,
    totalAttempts: user?.quizzesAttempted || 0,
    highestScore: user?.highestScore || 0
  });

  const xpFillRef = useRef(null);

  useEffect(() => {
    const loadUserStats = async () => {
      if (user?.id) {
        try {
          const attempts = await api.getAttemptsForUser(user.id);
          setUserAttempts(attempts);
          if (attempts.length > 0) {
            const passed = attempts.filter(a => a.status === 'PASSED').length;
            const failed = attempts.filter(a => a.status === 'FAILED').length;
            const avg = Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length);
            const highest = Math.max(...attempts.map(a => a.percentage));
            setStats({
              avgScore: avg,
              quizzesPassed: passed,
              quizzesFailed: failed,
              totalAttempts: attempts.length,
              highestScore: highest
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadUserStats();
  }, [user]);

  useEffect(() => {
    // animate XP bar after stats load
    if (xpFillRef.current) {
      setTimeout(() => {
        if (xpFillRef.current) {
          xpFillRef.current.classList.add('animated');
        }
      }, 300);
    }
  }, [stats]);

  // Gamified Level System
  const level = Math.floor(stats.quizzesPassed / 3) + 1;
  const currentLevelXp = stats.quizzesPassed % 3;
  const xpNeeded = 3;
  const xpPercentage = (currentLevelXp / xpNeeded) * 100;

  // Activity data
  const activityData = [
    { day: 'Mon', hours: 2.5, type: 'iron' },
    { day: 'Tue', hours: 4.1, type: 'gold' },
    { day: 'Wed', hours: 6.8, type: 'diamond' },
    { day: 'Thu', hours: 3.2, type: 'iron' },
    { day: 'Fri', hours: 5.4, type: 'emerald' },
    { day: 'Sat', hours: 1.8, type: 'redstone' },
    { day: 'Sun', hours: 4.0, type: 'coal' }
  ];

  const colorMap = {
    iron: '#a1a1aa',
    gold: '#fb923c',
    diamond: '#f97316',
    emerald: '#fbbf24',
    redstone: '#ef4444',
    coal: '#52525b'
  };

  return (
    <HudPlayerLayout>
      {/* ── BARK BANNER / HERO STATUS ── */}
      <section className="brackets metal clip-hud p-6 mb-8 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-grow max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="hud-badge bg-orange-500/10 text-orange-300 border border-orange-400/20">
                <span className="pulse-dot" /> COMMANDER STATUS ACTIVE
              </span>
              <span className="flex items-center gap-1 text-[10px] font-orbitron tracking-widest text-zinc-500">
                <Shield className="w-3.5 h-3.5 text-zinc-600" />
                SECURE SECTOR 7A
              </span>
            </div>

            <h1 className="font-orbitron font-black text-3xl sm:text-5xl leading-none text-white uppercase tracking-tight">
              Welcome, <span className="grad-orange" style={{ filter: 'drop-shadow(0 0 16px rgba(249,115,22,.45))' }}>{user?.name || 'VoxelCommander'}</span>
            </h1>
            <p className="text-sm text-zinc-400">
              Directives loaded. Voxel engine standing by. Execute assessments to gather XP.
            </p>

            {/* XP PROGRESS HUT */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-orbitron font-bold">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-neon-orange" />
                  LEVEL {level} EXPLORER
                </span>
                <span className="text-neon-orange">{currentLevelXp} / {xpNeeded} XP</span>
              </div>

              {/* XP bar */}
              <div className="micro-bar">
                <div
                  ref={xpFillRef}
                  className="micro-fill bg-gradient-to-r from-orange-400 to-red-500"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              <p className="text-[10px] font-orbitron tracking-wider text-zinc-500">
                {stats.quizzesPassed % 3 === 0
                  ? 'Directive required to rank up'
                  : `${xpNeeded - currentLevelXp} assessments to Level ${level + 1}`}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-black/40 border border-white/5 clip-hud-sm min-w-[160px] text-center">
            <Box className="w-8 h-8 text-orange-300 mb-2 animate-pulse" />
            <span className="text-[9px] font-orbitron tracking-widest text-zinc-500 uppercase">Current Rank</span>
            <span className="text-sm font-orbitron font-black text-white uppercase tracking-widest">Elite Vanguard</span>
          </div>
        </div>
        <span className="bk bk-tl" />
        <span className="bk bk-br" />
      </section>

      {/* ── METRIC GRIDS ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Reactor card */}
        <div className="brackets">
          <div className="tilt metal clip-hud p-6 h-full flex flex-col justify-between" style={{ transformStyle: 'preserve-3d' }}>
            <div className="shine" />
            <div className="pop flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-orbitron text-neon-orange uppercase tracking-widest font-bold">
                  Accuracy Reactor
                </span>
                <Zap className="h-5 w-5 text-orange-300" />
              </div>

              <div className="my-6 flex items-center justify-center relative">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle cx="72" cy="72" r="56" stroke="rgba(255,255,255,.05)" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="72"
                    cy="72"
                    r="56"
                    stroke="#fb923c"
                    strokeWidth="8"
                    strokeDasharray={351.8}
                    strokeDashoffset={351.8 - (351.8 * stats.avgScore) / 100}
                    strokeLinecap="square"
                    className="transition-all duration-1000 ease-out"
                    fill="transparent"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(251,146,60,.4))' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-orbitron font-black text-white">{stats.avgScore}%</span>
                  <span className="text-[8px] font-orbitron text-neon-orange tracking-widest uppercase">DIAGNOSTIC OK</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-neon-orange font-orbitron pt-3 border-t border-white/5">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+5% calibration gain this cycle</span>
              </div>
            </div>
          </div>
          <span className="bk bk-tl" /><span className="bk bk-br" />
        </div>

        {/* Conquest Totem */}
        <div className="brackets">
          <div className="tilt metal clip-hud p-6 h-full flex flex-col justify-between" style={{ transformStyle: 'preserve-3d' }}>
            <div className="shine" />
            <div className="pop flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-orbitron text-neon-orange uppercase tracking-widest font-bold">
                  Totem of Conquest
                </span>
                <Flame className="h-5 w-5 text-orange-400" />
              </div>

              <div className="my-6 flex flex-col items-center justify-center text-center">
                <span className="text-6xl font-orbitron font-black text-white tracking-tight" style={{ textShadow: '0 0 16px rgba(249,115,22,.4)' }}>
                  {stats.quizzesPassed}
                </span>
                <span className="text-xs text-zinc-500 font-orbitron uppercase tracking-widest mt-1">Quizzes Passed</span>
              </div>

              <div className="space-y-2 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between text-xs font-orbitron">
                  <span className="text-zinc-500">Success Rate</span>
                  <span className="text-neon-orange font-bold">
                    {Math.round((stats.quizzesPassed / (stats.totalAttempts || 1)) * 100)}%
                  </span>
                </div>
                <div className="micro-bar">
                  <div
                    className="micro-fill bg-gradient-to-r from-orange-500 to-red-500 animated"
                    style={{ width: `${(stats.quizzesPassed / (stats.totalAttempts || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <span className="bk bk-tl" /><span className="bk bk-br" />
        </div>

        {/* Redstone signal activity */}
        <div className="brackets">
          <div className="tilt metal clip-hud p-6 h-full flex flex-col justify-between" style={{ transformStyle: 'preserve-3d' }}>
            <div className="shine" />
            <div className="pop flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-orbitron text-neon-orange uppercase tracking-widest font-bold">
                  Signal Activity
                </span>
                <Activity className="h-5 w-5 text-orange-400" />
              </div>

              <div className="h-36 w-full my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <XAxis dataKey="day" stroke="#71717a" opacity={0.6} fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" opacity={0.6} fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0c0c10', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', fontFamily: 'Orbitron' }}
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    />
                    <Bar dataKey="hours">
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colorMap[entry.type]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-xs font-orbitron text-neon-orange pt-3 border-t border-white/5">
                <span>Signal status: High</span>
                <span className="text-zinc-500">Peak: Wed</span>
              </div>
            </div>
          </div>
          <span className="bk bk-tl" /><span className="bk bk-br" />
        </div>
      </section>

      {/* ── RECOMMENDATIONS ── */}
      <section className="space-y-6 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-orbitron text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Box className="w-5 h-5 text-orange-300" />
              Active Assessment Directives
            </h2>
            <p className="text-xs text-zinc-500">Explore active evaluation courses and skill benchmarks</p>
          </div>
          <Link to="/quizzes" style={{ textDecoration: 'none' }}>
            <button className="btn-steel clip-hud-sm px-4 py-2 font-orbitron text-[10px] tracking-[.15em] flex items-center gap-1">
              View Full Archive ({quizzes.length}) →
            </button>
          </Link>
        </div>

        {quizLoading ? (
          <div className="text-center py-12 font-orbitron text-xs tracking-widest text-zinc-500">
            LOADING MISSIONS CATALOG...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.slice(0, 3).map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </section>

      {/* ── TELEMETRY LOGS TABLE ── */}
      <section className="tilt metal clip-hud overflow-hidden">
        <div className="shine" />
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(255,255,255,.05)' }}>
          <h3 className="font-orbitron font-bold flex items-center gap-2.5" style={{ fontSize: 13, letterSpacing: '0.15em' }}>
            <Activity className="w-4 h-4 text-neon-orange" />
            <span style={{ color: '#fff' }}>ASSESSMENT TELEMETRY LOGS</span>
          </h3>
          <Link to="/history" style={{ textDecoration: 'none' }}>
            <button className="font-orbitron hover:text-white transition-colors" style={{ fontSize: 10, letterSpacing: '0.25em', color: '#fb923c', background: 'none', border: 'none', cursor: 'pointer' }}>
              ACCESS ARCHIVE →
            </button>
          </Link>
        </div>

        {userAttempts.length === 0 ? (
          <div className="text-center py-12 font-orbitron text-xs tracking-widest text-zinc-500">
            NO TELEMETRY LOGS RECORDED. INITIATE A DIRECTIVE ABOVE.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="w-full hud-tbl">
              <thead>
                <tr>
                  <th>assessment_id</th>
                  <th>score_pct</th>
                  <th>time_taken</th>
                  <th>status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {userAttempts.slice(0, 4).map((att) => (
                  <tr key={att.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="diamond flex items-center justify-center font-orbitron font-black text-black"
                          style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#fb923c,#ea580c)', fontSize: 10 }}>
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
      </section>
    </HudPlayerLayout>
  );
};

export default StudentDashboard;
