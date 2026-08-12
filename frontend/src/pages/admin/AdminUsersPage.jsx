import React, { useEffect, useState } from 'react';
import { HudAdminLayout } from '../../components/HudAdminLayout';
import { api } from '../../services/api';
import { motion } from 'motion/react';
import { Search, UserCheck, UserX, Trash2, Eye, Award, Calendar, Target, X } from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userHistory, setUserHistory] = useState([]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      await api.toggleUserStatus(userId);
      await loadUsers();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this candidate account?')) {
      try {
        await api.deleteUser(userId);
        await loadUsers();
      } catch (e) {
        alert(e.message);
      }
    }
  };

  const handleViewProfile = async (user) => {
    setSelectedUser(user);
    try {
      const attempts = await api.getAttemptsForUser(user.id);
      setUserHistory(attempts);
    } catch (e) {
      setUserHistory([]);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <HudAdminLayout>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pb-20" style={{ paddingTop: 0 }}>
        <div className="relative space-y-10">

          {/* ═══ HEADER ═══ */}
          <div className="relative text-center">
            <div className="hex-divider mb-5" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 hud-badge bg-fuchsia-500/10 border border-fuchsia-500/30 mb-4">
              <span className="pulse-dot bg-fuchsia-400" />
              <span className="font-orbitron text-[10px] tracking-[.35em] uppercase text-fuchsia-300">
                Admin · Candidate Registry
              </span>
            </div>
            <h1 className="font-orbitron font-black text-4xl md:text-6xl tracking-tight mb-4">
              <span className="chrome-text">OPERATOR&nbsp;</span>
              <span className="grad-neon">DATABASE</span>
            </h1>
            <p className="text-zinc-400 font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Monitor candidate telemetry, activate/deactivate access, review quiz attempt history, and account details.
            </p>
            <div className="hex-divider mt-8" />
          </div>

          {/* ═══ COMMAND BAR ═══ */}
          <div className="relative brackets metal clip-hud p-6 md:p-7">
            <span className="bk bk-tl" /><span className="bk bk-br" />
            <div className="shine" />

            <div className="flex flex-wrap gap-4 items-center">
              <div className="font-orbitron text-[11px] tracking-[.3em] uppercase text-zinc-500 flex items-center gap-2">
                <span className="text-neon-cyan">◢</span>
                <span>SEARCH REGISTRY</span>
              </div>
              <div className="relative flex-1 min-w-[260px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by candidate name or system email..."
                  className="hud-input w-full clip-hud-sm pl-11 pr-4 py-3.5 text-xs font-orbitron tracking-wider outline-none"
                />
              </div>
              <div className="font-orbitron text-[10px] tracking-[.3em] uppercase text-zinc-500 flex items-center gap-2 ml-auto">
                <span className="pulse-dot bg-emerald-400" />
                LIVE SYNC
              </div>
            </div>
          </div>

          {/* ═══ RESULTS META ═══ */}
          <div className="flex items-center justify-between">
            <span className="font-orbitron text-[10px] tracking-[.3em] uppercase text-zinc-500 flex items-center gap-2">
              <span className="text-neon-cyan">◤</span>
              <span className="text-zinc-200 font-bold">{filteredUsers.length}</span> Operators Located
            </span>
            <span className="font-orbitron text-[10px] tracking-[.3em] uppercase text-zinc-500 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 opacity-50" />
              Access roster · {new Date().toLocaleDateString()}
            </span>
          </div>

          {/* ═══ USERS TABLE ═══ */}
          <div className="relative brackets metal clip-hud p-5 md:p-6">
            <span className="bk bk-tl" /><span className="bk bk-br" />
            <div className="shine" />
            <div className="pop">
              {loading ? (
                <div className="text-center py-16 text-zinc-500 font-orbitron text-[11px] tracking-[.3em]">
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-2" />
                  Querying candidate registry telemetry...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300 font-sans">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-4 px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Candidate</th>
                        <th className="py-4 px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Role</th>
                        <th className="py-4 px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Attempts</th>
                        <th className="py-4 px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Avg Accuracy</th>
                        <th className="py-4 px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold">Status</th>
                        <th className="py-4 px-4 font-orbitron text-[9px] tracking-[.3em] uppercase text-zinc-500 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u, idx) => (
                        <motion.tr
                          key={u.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03, duration: 0.3 }}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600/50 to-cyan-600/50 border border-white/10 flex items-center justify-center font-orbitron font-bold text-xs text-white shrink-0">
                                {(u.name || 'OP').slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-white text-sm">{u.name}</div>
                                <div className="text-[10px] text-zinc-500 font-orbitron tracking-wider">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`clip-hud-sm px-3 py-1.5 text-[9px] font-orbitron tracking-[.2em] uppercase border ${
                              u.role === 'ADMIN'
                                ? 'border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-300'
                                : 'border-cyan-400/30 bg-cyan-500/10 text-cyan-300'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-orbitron font-black text-white">{u.quizzesAttempted || 0}</span>
                            <span className="font-orbitron text-[8px] tracking-[.2em] text-zinc-600 uppercase ml-1">RUNS</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-orbitron font-black text-neon-cyan">{u.averageScore || 0}%</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`clip-hud-sm px-3 py-1.5 text-[9px] font-orbitron tracking-[.2em] uppercase border flex items-center gap-1.5 inline-flex ${
                              u.status === 'ACTIVE'
                                ? 'border-emerald-400/35 bg-emerald-500/10 text-emerald-300'
                                : 'border-zinc-600/40 bg-black/30 text-zinc-500'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                              {u.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="inline-flex items-center gap-2 justify-end">
                              <button
                                onClick={() => handleViewProfile(u)}
                                className="p-2.5 clip-hud-sm bg-black/35 border border-white/10 text-zinc-400 hover:text-white hover:border-cyan-400/40 transition-all"
                                title="Inspect Profile & History"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {u.role !== 'ADMIN' && (
                                <>
                                  <button
                                    onClick={() => handleToggleStatus(u.id)}
                                    className={`p-2.5 clip-hud-sm bg-black/35 border border-white/10 transition-all ${
                                      u.status === 'ACTIVE'
                                        ? 'text-zinc-400 hover:text-amber-300 hover:border-amber-400/40'
                                        : 'text-zinc-400 hover:text-emerald-300 hover:border-emerald-400/40'
                                    }`}
                                    title={u.status === 'ACTIVE' ? 'Revoke Access' : 'Grant Access'}
                                  >
                                    {u.status === 'ACTIVE' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="p-2.5 clip-hud-sm bg-black/35 border border-white/10 text-zinc-400 hover:text-rose-400 hover:border-rose-400/40 transition-all"
                                    title="Erase Record"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && !loading && (
                    <div className="text-center py-14 text-zinc-500">
                      <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                      <p className="font-orbitron tracking-[.25em] uppercase text-[11px]">No matching operator records</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ PROFILE MODAL ═══ */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
               onClick={() => setSelectedUser(null)}>
            <motion.div
              initial={{ scale: 0.88, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="relative brackets metal clip-hud w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <span className="bk bk-tl" /><span className="bk bk-br" />
              <div className="shine" />
              <div className="pop p-8 space-y-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600/50 to-fuchsia-600/50 border border-white/15 flex items-center justify-center font-orbitron font-bold text-white text-lg">
                      {(selectedUser.name || 'OP').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-orbitron text-xl font-bold text-white tracking-wide">{selectedUser.name}</h3>
                      <p className="text-[10px] text-zinc-500 font-orbitron tracking-wider">{selectedUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="w-10 h-10 clip-hud-sm bg-black/50 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-rose-400/30 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Telemetry Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    [Target, 'Quizzes Taken', selectedUser.quizzesAttempted, 'text-neon-cyan'],
                    [Award, 'Avg Accuracy', `${selectedUser.averageScore}%`, 'text-neon-violet'],
                    ['🏆', 'High Score', `${selectedUser.highestScore}%`, 'text-amber-300'],
                  ].map(([Icon, label, val, col], i) => (
                    <div key={i} className="bg-black/30 border border-white/5 clip-hud-sm p-4 text-center">
                      {typeof Icon === 'string' ? (
                        <div className="text-lg mb-1">{Icon}</div>
                      ) : (
                        <Icon className={`w-4 h-4 mb-1 mx-auto ${col}`} />
                      )}
                      <div className="font-orbitron text-[7px] tracking-[.25em] text-zinc-500 uppercase font-bold">{label}</div>
                      <div className={`font-orbitron font-black text-lg mt-1 ${col}`}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* History */}
                <div className="space-y-3">
                  <h4 className="font-orbitron text-[10px] tracking-[.3em] uppercase text-zinc-500 font-bold flex items-center gap-2">
                    <span className="text-neon-cyan">◢</span>
                    Assessment Telemetry Log
                  </h4>
                  {userHistory.length === 0 ? (
                    <div className="py-8 text-center text-zinc-500 font-orbitron text-[10px] tracking-[.2em]">
                      NO QUIZ RUNS RECORDED
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {userHistory.map((att, i) => (
                        <motion.div
                          key={att.id}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="bg-black/30 border border-white/5 clip-hud-sm p-3.5 flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <div className="font-bold text-white text-sm truncate">{att.quizTitle}</div>
                            <div className="text-[10px] text-zinc-500 font-orbitron tracking-wider">{att.timeTaken}</div>
                          </div>
                          <div className="text-right flex items-center gap-4 shrink-0">
                            <div>
                              <div className={`font-orbitron font-black text-sm ${
                                att.status === 'PASSED' ? 'text-emerald-300' : 'text-rose-300'
                              }`}>{att.percentage}%</div>
                            </div>
                            <span className={`clip-hud-sm px-2.5 py-1 text-[8px] font-orbitron tracking-[.2em] uppercase border ${
                              att.status === 'PASSED'
                                ? 'border-emerald-400/35 bg-emerald-500/10 text-emerald-300'
                                : 'border-rose-400/35 bg-rose-500/10 text-rose-300'
                            }`}>
                              {att.status}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </HudAdminLayout>
  );
};

export default AdminUsersPage;
