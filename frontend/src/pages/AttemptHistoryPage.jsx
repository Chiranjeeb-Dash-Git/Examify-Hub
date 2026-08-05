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
    <div className="min-h-screen bg-[#10141a] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Quiz Attempt <span className="text-[#38BDF8]">History Log</span>
        </h1>
        <p className="mt-1 text-sm text-[#88929b] font-mono">
          Review your previous assessment performances and telemetry
        </p>
      </div>

      {/* History Table */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10">
        {loading ? (
          <div className="text-center py-12 text-[#88929b]">Loading history logs...</div>
        ) : attempts.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <History className="h-10 w-10 text-[#88929b] mx-auto" />
            <h3 className="text-lg font-bold text-white">No Previous Attempts Found</h3>
            <p className="text-xs text-[#88929b]">Initiate an assessment directive to log attempt metrics.</p>
            <Link to="/quizzes" className="inline-block px-4 py-2 rounded-xl bg-[#38BDF8] text-[#10141a] font-bold text-xs">
              Explore Quizzes
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#dfe2eb]">
              <thead className="text-xs font-mono uppercase text-[#88929b] border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Quiz Title</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Time Taken</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-xs text-[#88929b]">
                      {new Date(att.completedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4 font-sans font-bold text-white">{att.quizTitle}</td>
                    <td className="py-4 px-4 text-[#38BDF8] font-bold">{att.percentage}%</td>
                    <td className="py-4 px-4 text-[#88929b]">{att.timeTaken}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono ${
                          att.status === 'PASSED'
                            ? 'bg-[#6be026]/20 text-[#6be026] border border-[#6be026]/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-sans">
                      <Link
                        to={`/quiz/result/${att.id}`}
                        className="inline-flex items-center gap-1 text-xs text-[#38BDF8] hover:underline"
                      >
                        <span>View Breakdown</span>
                        <ArrowRight className="h-3.5 w-3.5" />
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
