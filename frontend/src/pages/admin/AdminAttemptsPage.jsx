import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedFluidBackground } from '../../components/landing/AnimatedFluidBackground';
import { api } from '../../services/api';
import { motion } from 'motion/react';
import { Search, Eye, Filter, Calendar, Award } from 'lucide-react';

export const AdminAttemptsPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

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
    
    const matchesStatus = 
      statusFilter === 'ALL' || 
      att.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="relative z-10 pt-24 pb-16 px-4 max-w-7xl mx-auto min-h-screen selection:bg-white selection:text-black">
      <AnimatedFluidBackground />
      <div className="bg-scanlines" style={{ zIndex: 2 }} />

      <div className="relative z-10 space-y-6">
        {/* Header Control */}
        <div className="liquid-glass rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10 backdrop-blur-xl">
          <div>
            <h1 
              className="text-3xl sm:text-4xl font-medium text-white tracking-tight"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Candidate Assessment Runs
            </h1>
            <p className="mt-1 text-xs text-white/60 font-sans">
              Track attempt status, scores, durations, and examine individual response templates
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student or quiz..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full liquid-glass border border-white/20 text-white placeholder-white/40 text-xs outline-none focus:border-white/40"
              />
            </div>

            {/* Filter */}
            <div className="relative w-full sm:w-44 flex items-center">
              <Filter className="absolute left-4 h-4 w-4 text-white/40 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-full liquid-glass border border-white/20 text-white text-xs outline-none appearance-none cursor-pointer focus:border-white/40"
              >
                <option value="ALL">All Run Statuses</option>
                <option value="PASSED">Passed Only</option>
                <option value="FAILED">Failed Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Attempts Table */}
        <div className="liquid-glass p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
          {loading ? (
            <div className="text-center py-12 text-white/60 text-xs font-mono">Querying historical runs telemetry...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white/90">
                <thead className="text-[10px] font-mono uppercase text-white/50 border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Assessment Quiz</th>
                    <th className="py-3.5 px-4">Completed Date</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Marks Obtained</th>
                    <th className="py-3.5 px-4">Score</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {filteredAttempts.length > 0 ? (
                    filteredAttempts.map((att) => (
                      <tr key={att.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-4 px-4 font-semibold text-white">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {(att.userName || 'Student').slice(0, 2).toUpperCase()}
                            </span>
                            <span className="font-semibold text-sm">{att.userName || 'Student'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-white/80 font-medium text-sm">{att.quizTitle}</td>
                        <td className="py-4 px-4 text-white/60 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 opacity-55" />
                            {new Date(att.completedAt || att.startedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-white/60 font-mono">{att.timeTaken || '--:--'}</td>
                        <td className="py-4 px-4 text-white/80 font-mono">
                          {att.score} / {att.maxScore}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`font-mono font-bold text-sm ${att.status === 'PASSED' ? 'text-emerald-300' : 'text-rose-300'}`}>
                            {att.percentage}%
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider ${
                            att.status === 'PASSED' 
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30' 
                              : 'bg-rose-500/15 text-rose-300 border border-rose-400/30'
                          }`}>
                            {att.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link
                            to={`/quiz/result/${att.id}`}
                            className="inline-flex p-2 rounded-full liquid-glass text-white/80 hover:text-white hover:border-white/40 transition-all border border-white/20"
                            title="Inspect Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-white/40 text-xs font-mono">
                        No historical assessment runs found matching selection
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
  );
};

export default AdminAttemptsPage;
