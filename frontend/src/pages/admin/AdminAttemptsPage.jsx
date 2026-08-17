import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HudAdminLayout } from '../../components/HudAdminLayout';
import { api } from '../../services/api';
import { motion } from 'motion/react';
import { Search, Eye, Filter, Calendar, Award, Clock, Flame, X, Target, Tag, LayoutGrid, CheckCircle2, XCircle } from 'lucide-react';

export const AdminAttemptsPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [detailAttempt, setDetailAttempt] = useState(null);

  const loadAttempts = async () => {
    try {
      setLoading(true);
      const data = await api.getAllAttempts();
      setAttempts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttempts();
  }, []);

  const filteredAttempts = useMemo(() => {
    let list = attempts.filter(att => {
      const s = searchTerm.toLowerCase();
      const matchesSearch = !s ||
        (att.userName || '').toLowerCase().includes(s) ||
        (att.quizTitle || '').toLowerCase().includes(s);
      const matchesStatus = statusFilter === 'ALL' || att.status === statusFilter;
      const pct = Number(att.percentage) || 0;
      let matchesScore = true;
      if (scoreFilter === 'high') matchesScore = pct >= 80;
      else if (scoreFilter === 'mid') matchesScore = pct >= 50 && pct < 80;
      else if (scoreFilter === 'low') matchesScore = pct < 50;
      return matchesSearch && matchesStatus && matchesScore;
    });
    if (sortBy === 'score') list = [...list].sort((a, b) => (Number(b.percentage) || 0) - (Number(a.percentage) || 0));
    else if (sortBy === 'scoreAsc') list = [...list].sort((a, b) => (Number(a.percentage) || 0) - (Number(b.percentage) || 0));
    else list = [...list].sort((a, b) => new Date(b.completedAt || b.startedAt) - new Date(a.completedAt || a.startedAt));
    return list;
  }, [attempts, searchTerm, statusFilter, scoreFilter, sortBy]);

  const stats = {
    total: attempts.length,
    passed: attempts.filter(a => a.status === 'PASSED').length,
    failed: attempts.filter(a => a.status === 'FAILED').length,
    avgScore: attempts.length ? Math.round(attempts.reduce((s, a) => s + (Number(a.percentage) || 0), 0) / attempts.length) : 0,
  };

  const allQuizzes = useMemo(() => {
    const set = new Set(attempts.map(a => a.quizTitle).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [attempts]);

  return (
    <HudAdminLayout>
      <div className="relative w-full px-0 pb-12" style={{ paddingTop: 0 }}>
        <div className="relative">

          {/* ═══ HEADER ═══ */}
          <div className="relative mb-5">
            <div className="hex-divider mb-4" />
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 hud-badge bg-amber-500/10 border border-amber-500/30 mb-2">
                  <span className="pulse-dot bg-amber-400" />
                  <span className="font-orbitron text-[10px] tracking-[.35em] uppercase text-amber-300">
                    Admin · Assessment Runs
                  </span>
                </div>
                <h1 className="font-orbitron font-black text-2xl sm:text-3xl md:text-4xl tracking-tight">
                  <span className="chrome-text">RUN&nbsp;</span>
                  <span className="grad-neon">TELEMETRY</span>
                </h1>
                <p className="text-zinc-400 font-light text-xs sm:text-sm max-w-2xl mt-1.5 leading-relaxed">
                  Track every assessment execution — scores, duration, pass/fail state — and drill into individual result breakdowns.
                </p>
              </div>
            </div>
            <div className="hex-divider" />
          </div>

          {/* ═══ MAIN LAYOUT: SIDEBAR FILTERS + TABLE ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[250px_1fr] gap-4 md:gap-5 lg:gap-6">

            {/* ═══ LEFT SIDEBAR: FILTERS ═══ */}
            <aside className="space-y-4 md:space-y-5 order-2 lg:order-1">
              {/* Search */}
              <div className="relative brackets metal clip-hud p-4">
                <span className="bk bk-tl" /><span className="bk bk-br" />
                <div className="shine" />
                <div className="pop space-y-4">
                  <div className="font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 flex items-center gap-1.5 mb-1">
                    <Search className="w-3 h-3 text-amber-300" /> Search Runs
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Candidate / quiz…"
                      className="hud-input w-full clip-hud-sm pl-9 pr-3 py-2.5 text-[10px] font-orbitron tracking-wider outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="relative brackets metal clip-hud p-4">
                <span className="bk bk-tl" /><span className="bk bk-br" />
                <div className="shine" />
                <div className="pop space-y-2.5">
                  <div className="font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 flex items-center gap-1.5 mb-1">
                    <Target className="w-3 h-3 text-neon-cyan" /> Outcome Filter
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {[
                      ['ALL', 'All Runs', LayoutGrid, 'text-white'],
                      ['PASSED', 'Passed Only', CheckCircle2, 'text-emerald-300'],
                      ['FAILED', 'Failed Only', XCircle, 'text-rose-300'],
                    ].map(([val, label, Ico, col]) => (
                      <button
                        key={val}
                        onClick={() => setStatusFilter(val)}
                        className={`text-left px-3 py-2 clip-hud-sm font-orbitron text-[10px] tracking-wider transition-all flex items-center gap-2 ${
                          statusFilter === val
                            ? `bg-${val === 'PASSED' ? 'emerald' : val === 'FAILED' ? 'rose' : 'cyan'}-500/15 border border-${val === 'PASSED' ? 'emerald' : val === 'FAILED' ? 'rose' : 'cyan'}-400/40 ${col}`
                            : 'bg-black/25 border border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <Ico className="w-3 h-3" /> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Score Range */}
              <div className="relative brackets metal clip-hud p-4">
                <span className="bk bk-tl" /><span className="bk bk-br" />
                <div className="shine" />
                <div className="pop space-y-2.5">
                  <div className="font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 flex items-center gap-1.5 mb-1">
                    <Award className="w-3 h-3 text-neon-gold" /> Score Band
                  </div>
                  <select value={scoreFilter} onChange={e => setScoreFilter(e.target.value)}
                    className="hud-input w-full clip-hud-sm px-3 py-2.5 text-[10px] font-orbitron tracking-wider cursor-pointer">
                    <option value="all">All Scores</option>
                    <option value="high">≥ 80% (High)</option>
                    <option value="mid">50–79% (Mid)</option>
                    <option value="low">≤ 49% (Low)</option>
                  </select>
                </div>
              </div>

              {/* Sort */}
              <div className="relative brackets metal clip-hud p-4">
                <span className="bk bk-tl" /><span className="bk bk-br" />
                <div className="shine" />
                <div className="pop space-y-2.5">
                  <div className="font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 flex items-center gap-1.5 mb-1">
                    <Filter className="w-3 h-3 text-fuchsia-300" /> Sort Order
                  </div>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="hud-input w-full clip-hud-sm px-3 py-2.5 text-[10px] font-orbitron tracking-wider cursor-pointer">
                    <option value="recent">Most Recent</option>
                    <option value="score">Highest Score</option>
                    <option value="scoreAsc">Lowest Score</option>
                  </select>
                </div>
              </div>

              {/* Stat cards sidebar */}
              <div className="relative brackets metal clip-hud p-4">
                <span className="bk bk-tl" /><span className="bk bk-br" />
                <div className="shine" />
                <div className="pop space-y-3">
                  {[
                    ['TOTAL', stats.total, 'text-white', Flame],
                    ['PASSED', stats.passed, 'text-emerald-300', Award],
                    ['FAILED', stats.failed, 'text-rose-300', X],
                    ['AVG', `${stats.avgScore}%`, 'text-neon-cyan', Clock],
                  ].map(([label, val, col, Ico]) => (
                    <div key={label} className="flex items-center justify-between">
                      <div>
                        <div className={`font-orbitron font-black text-lg ${col}`}>{val}</div>
                        <div className="font-orbitron text-[7px] tracking-[.3em] uppercase text-zinc-500">{label}</div>
                      </div>
                      <div className={`w-8 h-8 rounded-full bg-black/40 border border-white/5 flex items-center justify-center ${col}`}>
                        <Ico className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results count */}
              <div className="px-1 pt-2 space-y-1">
                <div className="font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 flex items-center gap-1.5">
                  <span className="text-neon-cyan">◤</span>
                  <span className="text-zinc-200 font-bold">{filteredAttempts.length}</span> Located
                </div>
                <div className="font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 opacity-50" />
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </aside>

            {/* ═══ RIGHT / MAIN: ATTEMPTS TABLE ═══ */}
            <section className="min-w-0 order-1 lg:order-2 space-y-5">
              {/* Top stat cards (on wide screens shown here instead sidebar) */}
              <div className="hidden sm:grid lg:hidden grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ['TOTAL', stats.total, 'text-white', Flame],
                  ['PASSED', stats.passed, 'text-emerald-300', Award],
                  ['FAILED', stats.failed, 'text-rose-300', X],
                  ['AVG SCORE', `${stats.avgScore}%`, 'text-neon-cyan', Clock],
                ].map(([label, val, col, Icon], i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="brackets metal clip-hud p-4 relative"
                  >
                    <span className="bk bk-tl" /><span className="bk bk-br" />
                    <div className="shine" />
                    <div className="pop flex items-center justify-between">
                      <div>
                        <div className={`font-orbitron font-black text-xl ${col}`}>{val}</div>
                        <div className="font-orbitron text-[7px] tracking-[.3em] uppercase text-zinc-500 mt-0.5 font-bold">{label}</div>
                      </div>
                      <div className={`w-8 h-8 rounded-full bg-black/40 border border-white/5 flex items-center justify-center ${col}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Main table */}
              <div className="relative brackets metal clip-hud p-3 md:p-4 lg:p-5">
                <span className="bk bk-tl" /><span className="bk bk-br" />
                <div className="shine" />
                <div className="pop">
                  {loading ? (
                    <div className="text-center py-16 text-zinc-500 font-orbitron text-[11px] tracking-[.3em]">
                      <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-2" />
                      Querying historical run telemetry...
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-zinc-300 font-sans">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="py-3 px-3 md:px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Candidate</th>
                            <th className="py-3 px-3 md:px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Assessment</th>
                            <th className="py-3 px-3 md:px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Completed</th>
                            <th className="py-3 px-3 md:px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Dur</th>
                            <th className="py-3 px-3 md:px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Marks</th>
                            <th className="py-3 px-3 md:px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Score</th>
                            <th className="py-3 px-3 md:px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Status</th>
                            <th className="py-3 px-3 md:px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold text-right">Act</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAttempts.length > 0 ? (
                            filteredAttempts.map((att, idx) => (
                              <motion.tr
                                key={att.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.015, duration: 0.3 }}
                                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                              >
                                <td className="py-3 px-3 md:px-4">
                                  <div className="flex items-center gap-2 md:gap-3">
                                    <span className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-indigo-600/50 to-fuchsia-600/50 border border-white/10 flex items-center justify-center text-[10px] font-black font-orbitron text-white shrink-0">
                                      {(att.userName || 'ST').slice(0, 2).toUpperCase()}
                                    </span>
                                    <div className="font-bold text-white text-xs md:text-sm truncate max-w-[140px]">{att.userName || 'Student'}</div>
                                  </div>
                                </td>
                                <td className="py-3 px-3 md:px-4 text-white/80 font-medium text-xs md:text-sm truncate max-w-[200px]">{att.quizTitle}</td>
                                <td className="py-3 px-3 md:px-4">
                                  <div className="flex items-center gap-1.5 text-zinc-400">
                                    <Calendar className="h-3 w-3 opacity-55 shrink-0" />
                                    <span className="font-orbitron text-[9px] md:text-[10px] tracking-wider whitespace-nowrap">
                                      {new Date(att.completedAt || att.startedAt).toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-3 md:px-4">
                                  <span className="font-orbitron tracking-wider text-zinc-400 text-[10px] md:text-xs">{att.timeTaken || '--:--'}</span>
                                </td>
                                <td className="py-3 px-3 md:px-4">
                                  <span className="font-orbitron font-bold text-zinc-200 text-[10px] md:text-xs">
                                    {att.score}/{att.maxScore}
                                  </span>
                                </td>
                                <td className="py-3 px-3 md:px-4">
                                  <span className={`font-orbitron font-black text-xs md:text-sm ${att.status === 'PASSED' ? 'text-emerald-300' : 'text-rose-300'}`}>
                                    {att.percentage}%
                                  </span>
                                </td>
                                <td className="py-3 px-3 md:px-4">
                                  <span className={`clip-hud-sm px-2.5 py-1.5 text-[8px] md:text-[9px] font-orbitron tracking-[.2em] uppercase border inline-flex items-center gap-1.5 ${
                                    att.status === 'PASSED'
                                      ? 'border-emerald-400/35 bg-emerald-500/10 text-emerald-300'
                                      : 'border-rose-400/35 bg-rose-500/10 text-rose-300'
                                  }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${att.status === 'PASSED' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                    <span className="hidden md:inline">{att.status}</span>
                                    <span className="md:hidden">{att.status === 'PASSED' ? '✓' : '✗'}</span>
                                  </span>
                                </td>
                                <td className="py-3 px-3 md:px-4 text-right">
                                  <div className="inline-flex items-center gap-1 md:gap-2 justify-end">
                                    <button
                                      onClick={() => setDetailAttempt(att)}
                                      className="p-2 clip-hud-sm bg-black/35 border border-white/10 text-zinc-400 hover:text-white hover:border-fuchsia-400/40 transition-all"
                                      title="Quick View"
                                    >
                                      <Search className="w-3.5 h-3.5" />
                                    </button>
                                    <Link
                                      to={`/quiz/result/${att.id}`}
                                      className="p-2 clip-hud-sm bg-black/35 border border-white/10 text-zinc-400 hover:text-white hover:border-cyan-400/40 transition-all"
                                      title="Open Result Report"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </Link>
                                  </div>
                                </td>
                              </motion.tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="py-14 text-center text-zinc-500">
                                <Clock className="w-8 h-8 mx-auto mb-3 opacity-30" />
                                <p className="font-orbitron tracking-[.25em] uppercase text-[11px]">
                                  NO ASSESSMENT RUNS MATCH SELECTION
                                </p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* ═══ QUICK VIEW MODAL ═══ */}
        {detailAttempt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
               onClick={() => setDetailAttempt(null)}>
            <motion.div
              initial={{ scale: 0.88, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="relative brackets metal clip-hud w-full max-w-xl"
              onClick={e => e.stopPropagation()}
            >
              <span className="bk bk-tl" /><span className="bk bk-br" />
              <div className="shine" />
              <div className="pop p-8 space-y-7">
                <div className="flex items-center justify-between pb-5 border-b border-white/10">
                  <div>
                    <div className="font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 mb-1 font-bold">RUN SUMMARY</div>
                    <h3 className="font-orbitron text-xl font-bold text-white tracking-wide">{detailAttempt.quizTitle}</h3>
                    <p className="text-[10px] text-zinc-500 font-orbitron tracking-wider mt-1">Candidate: {detailAttempt.userName || 'Student'}</p>
                  </div>
                  <button
                    onClick={() => setDetailAttempt(null)}
                    className="w-10 h-10 clip-hud-sm bg-black/50 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-rose-400/30 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['MARKS', `${detailAttempt.score} / ${detailAttempt.maxScore}`, 'text-white'],
                    ['SCORE', `${detailAttempt.percentage}%`, detailAttempt.status === 'PASSED' ? 'text-emerald-300' : 'text-rose-300'],
                    ['DURATION', detailAttempt.timeTaken || '--:--', 'text-neon-cyan'],
                    ['STATUS', detailAttempt.status, detailAttempt.status === 'PASSED' ? 'text-emerald-300' : 'text-rose-300'],
                  ].map(([label, val, col], i) => (
                    <div key={i} className="bg-black/30 border border-white/5 clip-hud-sm p-4 text-center">
                      <div className="font-orbitron text-[7px] tracking-[.3em] text-zinc-500 uppercase font-bold">{label}</div>
                      <div className={`font-orbitron font-black text-xl mt-1 ${col}`}>{val}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <Link
                    to={`/quiz/result/${detailAttempt.id}`}
                    onClick={() => setDetailAttempt(null)}
                    className="flex-1"
                  >
                    <button className="btn-neon w-full py-3.5 clip-hud-sm font-orbitron text-[10px] tracking-[.25em] font-bold text-white flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" /> OPEN FULL REPORT
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </HudAdminLayout>
  );
};

export default AdminAttemptsPage;
