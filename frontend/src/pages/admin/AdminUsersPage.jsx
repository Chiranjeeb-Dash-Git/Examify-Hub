import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../services/api';
import { Search, UserCheck, UserX, Trash2, Eye, ShieldAlert, Award, Clock } from 'lucide-react';

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
    <div className="min-h-screen bg-[#050505] flex text-white font-body">
      <AdminSidebar />

      <main className="flex-grow p-6 sm:p-8 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Candidate <span className="text-white/80">Management</span>
            </h1>
            <p className="mt-1 text-sm text-white/60 font-mono">
              Monitor, activate, or deactivate candidate accounts
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidate name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0a0c] border border-white/10 text-white placeholder-white/30 text-xs font-mono focus:outline-none focus:border-white/40"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          {loading ? (
            <div className="text-center py-12 text-[#88929b]">Loading candidate registry...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#dfe2eb]">
                <thead className="text-xs font-mono uppercase text-[#88929b] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Quizzes Attempted</th>
                    <th className="py-3 px-4">Average Score</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-sans font-medium text-white flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="h-8 w-8 rounded-full object-cover border border-white/10" />
                        <div>
                          <div className="font-bold">{u.name}</div>
                          <div className="text-xs text-[#88929b] font-mono">{u.email}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className={`px-2.5 py-0.5 rounded-full ${u.role === 'ADMIN' ? 'bg-[#6be026]/20 text-[#6be026]' : 'bg-[#38BDF8]/20 text-[#38BDF8]'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#88929b]">{u.quizzesAttempted || 0}</td>
                      <td className="py-3.5 px-4 text-[#38BDF8] font-bold">{u.averageScore || 0}%</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono ${u.status === 'ACTIVE' ? 'bg-[#6be026]/20 text-[#6be026]' : 'bg-red-500/20 text-red-400'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans space-x-2">
                        <button
                          onClick={() => handleViewProfile(u)}
                          className="p-1.5 rounded-lg bg-[#262a31] text-[#38BDF8] hover:bg-[#38BDF8] hover:text-[#10141a] transition-all"
                          title="View Profile & History"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {u.role !== 'ADMIN' && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(u.id)}
                              className={`p-1.5 rounded-lg transition-all ${u.status === 'ACTIVE' ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-[#10141a]' : 'bg-[#6be026]/20 text-[#6be026] hover:bg-[#6be026] hover:text-[#10141a]'}`}
                              title={u.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
                            >
                              {u.status === 'ACTIVE' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
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
      </main>

      {/* Candidate Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl glass-panel p-6 rounded-3xl border border-white/10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="h-12 w-12 rounded-full object-cover border border-[#38BDF8]" />
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                  <p className="text-xs font-mono text-[#88929b]">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-[#88929b] hover:text-white font-mono text-sm">✕ Close</button>
            </div>

            {/* Profile Telemetry Stats */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#10141a] font-mono text-center">
              <div>
                <span className="text-[10px] text-[#88929b] uppercase block">QUIZZES TAKEN</span>
                <span className="text-xl font-bold text-white">{selectedUser.quizzesAttempted}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#88929b] uppercase block">AVG ACCURACY</span>
                <span className="text-xl font-bold text-[#38BDF8]">{selectedUser.averageScore}%</span>
              </div>
              <div>
                <span className="text-[10px] text-[#88929b] uppercase block">HIGH SCORE</span>
                <span className="text-xl font-bold text-[#6be026]">{selectedUser.highestScore}%</span>
              </div>
            </div>

            {/* Quiz Attempt History */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Candidate Attempt Log</h4>
              {userHistory.length === 0 ? (
                <p className="text-xs text-[#88929b]">No quiz attempt records logged.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {userHistory.map(att => (
                    <div key={att.id} className="p-3 rounded-xl bg-[#10141a] border border-white/5 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-white font-bold block">{att.quizTitle}</span>
                        <span className="text-[#88929b] text-[10px]">{att.timeTaken}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#38BDF8] font-bold block">{att.percentage}%</span>
                        <span className={`text-[10px] ${att.status === 'PASSED' ? 'text-[#6be026]' : 'text-red-400'}`}>{att.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
