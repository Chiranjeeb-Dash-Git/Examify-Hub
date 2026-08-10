import React, { useEffect, useState } from 'react';
import { AnimatedFluidBackground } from '../../components/landing/AnimatedFluidBackground';
import { api } from '../../services/api';
import { motion } from 'motion/react';
import { Search, UserCheck, UserX, Trash2, Eye } from 'lucide-react';

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
    <div className="min-h-screen py-8 pt-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <div className="space-y-6">
        {/* Header Control */}
        <div className="liquid-glass rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/10 backdrop-blur-xl">
          <div>
            <h1 
              className="text-3xl sm:text-4xl font-medium text-white tracking-tight"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Candidate Account Registry
            </h1>
            <p className="mt-1 text-xs text-white/60 font-sans">
              Monitor candidate telemetry, activate/deactivate access, and view activity history
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidate name or email..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full liquid-glass border border-white/20 text-white placeholder-white/40 text-xs outline-none focus:border-white/40"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="liquid-glass p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
          {loading ? (
            <div className="text-center py-12 text-white/60 text-xs">Loading candidate registry...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white/90">
                <thead className="text-[10px] font-mono uppercase text-white/50 border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Attempts</th>
                    <th className="py-3.5 px-4">Avg Accuracy</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-4 font-medium text-white flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="h-8 w-8 rounded-full object-cover border border-white/20" />
                        <div>
                          <div className="font-semibold text-sm">{u.name}</div>
                          <div className="text-[11px] text-white/50 font-mono">{u.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-medium liquid-glass border border-white/20`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white/70">{u.quizzesAttempted || 0}</td>
                      <td className="py-4 px-4 text-white font-semibold">{u.averageScore || 0}%</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-medium liquid-glass ${u.status === 'ACTIVE' ? 'border border-white/40 text-white' : 'border border-white/10 text-white/40'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleViewProfile(u)}
                          className="p-2 rounded-full liquid-glass text-white/80 hover:text-white transition-all cursor-pointer border border-white/20"
                          title="View Profile & History"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {u.role !== 'ADMIN' && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(u.id)}
                              className="p-2 rounded-full liquid-glass text-white/80 hover:text-white transition-all cursor-pointer border border-white/20"
                              title={u.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
                            >
                              {u.status === 'ACTIVE' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-2 rounded-full liquid-glass text-white/80 hover:text-red-400 transition-all cursor-pointer border border-white/20"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl liquid-glass p-6 rounded-3xl border border-white/20 space-y-6 max-h-[90vh] overflow-y-auto bg-black/90">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="h-12 w-12 rounded-full object-cover border border-white/30" />
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-white/60 font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-white/60 hover:text-white text-xs font-mono">✕ Close</button>
            </div>

            {/* Profile Telemetry Stats */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl liquid-glass border border-white/10 text-center">
              <div>
                <span className="text-[10px] text-white/60 uppercase block">QUIZZES TAKEN</span>
                <span className="text-xl font-semibold text-white">{selectedUser.quizzesAttempted}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 uppercase block">AVG ACCURACY</span>
                <span className="text-xl font-semibold text-white">{selectedUser.averageScore}%</span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 uppercase block">HIGH SCORE</span>
                <span className="text-xl font-semibold text-white">{selectedUser.highestScore}%</span>
              </div>
            </div>

            {/* Quiz Attempt History */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Candidate Telemetry Log</h4>
              {userHistory.length === 0 ? (
                <p className="text-xs text-white/60">No quiz attempt records logged.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {userHistory.map(att => (
                    <div key={att.id} className="p-3 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-white font-medium block">{att.quizTitle}</span>
                        <span className="text-white/40 text-[10px]">{att.timeTaken}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-semibold block">{att.percentage}%</span>
                        <span className="text-[10px] text-white/60">{att.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
