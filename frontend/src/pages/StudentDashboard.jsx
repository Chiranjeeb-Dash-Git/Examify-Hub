import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import { QuizCard } from '../components/QuizCard';
import { api } from '../services/api';
import { Award, Zap, TrendingUp, CheckCircle, Clock, ArrowRight, Activity, Flame } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { quizzes, loading: quizLoading } = useQuiz();
  const [userAttempts, setUserAttempts] = useState([]);
  const [stats, setStats] = useState({
    avgScore: user?.averageScore || 85,
    quizzesPassed: 12,
    quizzesFailed: 3,
    totalAttempts: user?.quizzesAttempted || 15,
    highestScore: user?.highestScore || 96
  });

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

  // Mock activity data for heatmap
  const activityData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 4.1 },
    { day: 'Wed', hours: 6.8 },
    { day: 'Thu', hours: 3.2 },
    { day: 'Fri', hours: 5.4 },
    { day: 'Sat', hours: 1.8 },
    { day: 'Sun', hours: 4.0 }
  ];

  return (
    <div className="min-h-screen bg-[#050505] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header (Matching Stitch Design) */}
      <div className="space-y-1">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Welcome back, <span className="text-white/80">{user?.name || 'Commander'}</span>
        </h1>
        <p className="text-base text-white/60 font-normal">
          Here is your intelligence briefing for today.
        </p>
      </div>

      {/* Intelligence Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Average Score Circular Dial */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between relative overflow-hidden bg-[#0a0a0c]">
          <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
            AVERAGE SCORE
          </span>

          <div className="my-4 flex items-center justify-center relative">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="56"
                stroke="currentColor"
                strokeWidth="10"
                className="text-white/10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="56"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={351.8}
                strokeDashoffset={351.8 - (351.8 * stats.avgScore) / 100}
                strokeLinecap="round"
                className="text-white transition-all duration-1000 ease-out"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white">{stats.avgScore}%</span>
              <span className="text-[10px] font-mono text-emerald-400">Accuracy</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-[#6be026] font-mono">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+5% performance gain this week</span>
          </div>
        </div>

        {/* Card 2: Quizzes Passed & Current Rank */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#88929b] uppercase tracking-wider">
              QUIZZES PASSED
            </span>
            <Flame className="h-5 w-5 text-amber-400" />
          </div>

          <div className="my-2">
            <span className="text-5xl font-extrabold text-white tracking-tight">{stats.quizzesPassed}</span>
            <span className="text-xs text-[#88929b] ml-2">/ {stats.totalAttempts} Attempted</span>
          </div>

          <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#88929b]">Current Rank</span>
              <span className="text-[#38BDF8] font-bold">Elite Vanguard</span>
            </div>
            {/* Rank Progress Bar */}
            <div className="h-2 w-full rounded-full bg-[#262a31] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#38BDF8] to-[#6be026] w-[78%] rounded-full" />
            </div>
          </div>
        </div>

        {/* Card 3: Activity Heatmap Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#88929b] uppercase tracking-wider">
              ACTIVITY HEATMAP
            </span>
            <Activity className="h-5 w-5 text-[#38BDF8]" />
          </div>

          <div className="h-36 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#88929b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#88929b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#181c22', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  cursor={{ fill: 'rgba(56,189,248,0.1)' }}
                />
                <Bar dataKey="hours" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-[#88929b] pt-2 border-t border-white/5">
            <span>12h tracked</span>
            <span className="text-[#38BDF8]">Peak: Wed</span>
          </div>
        </div>
      </div>

      {/* Recommended Directives Catalog */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">Available Assessment Directives</h2>
            <p className="text-xs text-white/60 font-mono mt-0.5">Explore active evaluation courses and skill benchmarks</p>
          </div>
          <Link
            to="/quizzes"
            className="text-xs font-mono font-bold text-white/80 hover:text-white border border-white/20 px-3.5 py-1.5 rounded-full hover:bg-white/10 transition-all flex items-center gap-1.5"
          >
            <span>View Full Archive ({quizzes.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {quizLoading ? (
          <div className="text-center py-12 text-white/40 font-mono text-xs">Loading assessment catalog...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Attempts Table */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Recent Assessment Telemetry</h3>
          <Link to="/history" className="text-xs text-[#38BDF8] hover:underline font-mono">
            View Complete Log
          </Link>
        </div>

        {userAttempts.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#88929b]">
            No recent attempts logged. Initiate a quiz directive above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#dfe2eb]">
              <thead className="text-xs font-mono uppercase text-[#88929b] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Assessment</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Time Taken</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {userAttempts.slice(0, 4).map((att) => (
                  <tr key={att.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-medium text-white">{att.quizTitle}</td>
                    <td className="py-3.5 px-4 text-[#38BDF8] font-bold">{att.percentage}%</td>
                    <td className="py-3.5 px-4 text-[#88929b]">{att.timeTaken}</td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 text-right font-sans">
                      <Link
                        to={`/quiz/result/${att.id}`}
                        className="text-xs text-[#38BDF8] hover:underline"
                      >
                        Review Breakdown
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
