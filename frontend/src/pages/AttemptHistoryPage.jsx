import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { History, Award, Clock, ArrowRight } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-[#050505] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-white font-body">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] tracking-[0.25em] text-white/70 uppercase">
            ✦ TELEMETRY AUDIT LOGS
          </span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight uppercase">
          Quiz Attempt <span className="text-white/80">History Log</span>
        </h1>
        <p className="text-sm text-white/60 font-mono">
          Review your previous assessment performances and candidate telemetry
        </p>
      </div>

      {/* History Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0a0a0c] backdrop-blur-xl">
        {loading ? (
          <div className="text-center py-12 text-white/40 font-mono text-xs">Loading history logs...</div>
        ) : attempts.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <History className="h-10 w-10 text-white/40 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Previous Attempts Found</h3>
            <p className="text-xs text-white/60 font-mono">Initiate an assessment directive to log attempt metrics.</p>
            <Link to="/quizzes" className="inline-block px-5 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/90 shadow-lg shadow-white/10 transition-all">
              Explore Quizzes
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white">
              <thead className="text-xs font-mono uppercase text-white/40 border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Quiz Title</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Time Taken</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-white/60">
                      {new Date(att.completedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4 font-body font-bold text-white">{att.quizTitle}</td>
                    <td className="py-4 px-4 font-bold text-white">{att.percentage}%</td>
                    <td className="py-4 px-4 text-white/60">{att.timeTaken}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono ${
                          att.status === 'PASSED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/quiz/result/${att.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/15 text-white hover:bg-white hover:text-black font-mono text-xs uppercase font-bold tracking-wider transition-all group"
                      >
                        <span>View Breakdown</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
