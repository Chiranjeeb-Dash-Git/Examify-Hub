import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HudAdminLayout } from '../../components/HudAdminLayout';
import { api } from '../../services/api';
import { motion } from 'motion/react';
import { Search, Eye, Filter, Calendar, Award, Clock, Flame, X } from 'lucide-react';

const STATUS_STYLES = {
  ALL:    'chip-on',
  PASSED: 'chip-on',
  FAILED: 'chip-on',
};

export const AdminAttemptsPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
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

  const filteredAttempts = attempts.filter(att => {
    const matchesSearch =
      (att.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (att.quizTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || att.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: attempts.length,
    passed: attempts.filter(a => a.status === 'PASSED').length,
    failed: attempts.filter(a => a.status === 'FAILED').length,
    avgScore: attempts.length ? Math.round(attempts.reduce((s, a) => s + (Number(a.percentage) || 0), 0) / attempts.length) : 0,
  };

  return (
    <HudAdminLayout>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pb-20" style={{ paddingTop: 0 }}>
        <div className="relative space-y-10">

          {/* ═══ HEADER ═══ */}
          <div className="relative text-center">
            <div className="hex-divider mb-5" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 hud-badge bg-amber-500/10 border border-amber-500/30 mb-4">
              <span className="pulse-dot bg-amber-400" />
              <span className="font-orbitron text-[10px] tracking-[.35em] uppercase text-amber-300">
                Admin · Assessment Runs
              </span>
            </div>
            <h1 className="font-orbitron font-black text-4xl md:text-6xl tracking-tight mb-4">
              <span className="chrome-text">RUN&nbsp;</span>
              <span className="grad-neon">TELEMETRY</span>
            </h1>
            <p className="text-zinc-400 font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Track every assessment execution — scores, duration, pass/fail state — and drill into individual result breakdowns.
            </p>
            <div className="hex-divider mt-8" />
          </div>

          {/* ═══ STAT PILLS ═══ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ perspective: '1000px' }}>
            {[
              ['TOTAL RUNS', stats.total, 'text-white', Flame],
              ['PASSED', stats.passed, 'text-emerald-300', Award],
              ['FAILED', stats.failed, 'text-rose-300', X],
              ['AVG SCORE', `${stats.avgScore}%`, 'text-neon-cyan', Clock],
            ].map(([label, val, col, Icon], i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="brackets metal clip-hud p-5 relative"
              >
                <span className="bk bk-tl" /><span className="bk bk-br" />
                <div className="shine" />
                <div className="pop flex items-center justify-between">
                  <div>
                    <div className={`font-orbitron font-black text-2xl md:text-3xl ${col}`}>{val}</div>
                    <div className="font-orbitron text-[8px] tracking-[.3em] uppercase text-zinc-500 mt-1 font-bold">{label}</div>
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-black/40 border border-white/5 flex items-center justify-center ${col}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ═══ COMMAND BAR ═══ */}
          <div className="relative brackets metal clip-hud p-6 md:p-7">
            <span className="bk bk-tl" /><span className="bk bk-br" />
            <div className="shine" />

            <div className="flex flex-wrap gap-4 items-stretch">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search candidate or assessment directive…"
                  className="hud-input w-full clip-hud-sm pl-11 pr-4 py-3.5 text-xs font-orbitron tracking-wider outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                {['ALL', 'PASSED', 'FAILED'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`chip px-4 py-2 ${statusFilter === status ? 'chip-on' : 'chip-off'}`}
                  >
                    {status === 'ALL' ? 'ALL RUNS' : status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ RESULTS META ═══ */}
          <div className="flex items-center justify-between">
            <span className="font-orbitron text-[10px] tracking-[.3em] uppercase text-zinc-500 flex items-center gap-2">
              <span className="text-neon-cyan">◤</span>
              <span className="text-zinc-200 font-bold">{filteredAttempts.length}</span> Assessment Runs Located
            </span>
            <span className="font-orbitron text-[10px] tracking-[.3em] uppercase text-zinc-500 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-fuchsia-300" />
              Filter: <b className="text-zinc-200">{statusFilter}</b>
            </span>
          </div>

          {/* ═══ ATTEMPTS TABLE ═══ */}
          <div className="relative brackets metal clip-hud p-5 md:p-6">
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
                        <th className="py-4 px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Candidate</th>
                        <th className="py-4 px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Assessment</th>
                        <th className="py-4 px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Completed</th>
                        <th className="py-4 px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Duration</th>
                        <th className="py-4 px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Marks</th>
                        <th className="py-4 px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Score</th>
                        <th className="py-4 px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Status</th>
                        <th className="py-4 px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttempts.length > 0 ? (
                        filteredAttempts.map((att, idx) => (
                          <motion.tr
                            key={att.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.02, duration: 0.3 }}
                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600/50 to-fuchsia-600/50 border border-white/10 flex items-center justify-center text-[10px] font-black font-orbitron text-white shrink-0">
                                  {(att.userName || 'ST').slice(0, 2).toUpperCase()}
                                </span>
                                <div className="font-bold text-white text-sm">{att.userName || 'Student'}</div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-white/80 font-medium text-sm">{att.quizTitle}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5 text-zinc-400">
                                <Calendar className="h-3.5 w-3.5 opacity-55" />
                                <span className="font-orbitron text-[10px] tracking-wider">
                                  {new Date(att.completedAt || att.startedAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-orbitron tracking-wider text-zinc-400">{att.timeTaken || '--:--'}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-orbitron font-bold text-zinc-200">
                                {att.score} / {att.maxScore}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`font-orbitron font-black text-sm ${att.status === 'PASSED' ? 'text-emerald-300' : 'text-rose-300'}`}>
                                {att.percentage}%
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`clip-hud-sm px-3 py-1.5 text-[9px] font-orbitron tracking-[.2em] uppercase border inline-flex items-center gap-1.5 ${
                                att.status === 'PASSED'
                                  ? 'border-emerald-400/35 bg-emerald-500/10 text-emerald-300'
                                  : 'border-rose-400/35 bg-rose-500/10 text-rose-300'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${att.status === 'PASSED' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                {att.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="inline-flex items-center gap-2 justify-end">
                                <button
                                  onClick={() => setDetailAttempt(att)}
                                  className="p-2.5 clip-hud-sm bg-black/35 border border-white/10 text-zinc-400 hover:text-white hover:border-fuchsia-400/40 transition-all"
                                  title="Quick View"
                                >
                                  <Search className="w-4 h-4" />
                                </button>
                                <Link
                                  to={`/quiz/result/${att.id}`}
                                  className="p-2.5 clip-hud-sm bg-black/35 border border-white/10 text-zinc-400 hover:text-white hover:border-cyan-400/40 transition-all"
                                  title="Open Result Report"
                                >
                                  <Eye className="w-4 h-4" />
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
