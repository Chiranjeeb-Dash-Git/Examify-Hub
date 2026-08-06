import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../services/api';
import { Users, BookOpen, CheckCircle, AlertTriangle, TrendingUp, Activity, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState({
    totalStudents: 124592,
    totalQuizzes: 48,
    publishedQuizzes: 42,
    draftQuizzes: 6,
    totalAttempts: 8400000,
    avgScore: 76.3,
    totalPassed: 6400000,
    totalFailed: 2000000
  });

  useEffect(() => {
    const loadAdminMetrics = async () => {
      try {
        const data = await api.getAdminAnalytics();
        setMetrics(prev => ({ ...prev, ...data }));
      } catch (e) {
        console.error(e);
      }
    };
    loadAdminMetrics();
  }, []);

  const engagementData = [
    { time: 'Day 1', attempts: 4200 },
    { time: 'Day 2', attempts: 5800 },
    { time: 'Day 3', attempts: 7200 },
    { time: 'Day 4', attempts: 6100 },
    { time: 'Day 5', attempts: 9400 },
    { time: 'Day 6', attempts: 8300 },
    { time: 'Day 7', attempts: 11200 }
  ];

  const activeSessions = [
    { userId: 'USR-8991X', quiz: 'Quantum Physics 101', status: 'Active', ping: '12ms' },
    { userId: 'USR-7724A', quiz: 'Renaissance Art History', status: 'Paused', ping: '45ms' },
    { userId: 'USR-1029B', quiz: 'Advanced Cryptography', status: 'Active', ping: '8ms' },
    { userId: 'USR-4412K', quiz: 'JavaScript Fundamentals', status: 'Active', ping: '16ms' }
  ];

  return (
    <div className="min-h-screen bg-[#10141a] flex">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Command Center Workspace */}
      <main className="flex-grow p-6 sm:p-8 space-y-8 overflow-y-auto">
        {/* Header (Matching Stitch Screenshot 3) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Platform Analytics
            </h1>
            <p className="mt-1 text-sm text-[#88929b] font-mono">
              Real-time telemetry and user engagement metrics.
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-1 p-1 bg-[#181c22] rounded-xl border border-white/10 text-xs font-mono text-[#88929b]">
            <button className="px-3 py-1.5 rounded-lg bg-[#38BDF8] text-[#10141a] font-bold">7D</button>
            <button className="px-3 py-1.5 rounded-lg hover:text-white">30D</button>
            <button className="px-3 py-1.5 rounded-lg hover:text-white">YTD</button>
          </div>
        </div>

        {/* 4 Stat Cards Grid (Matching Stitch Design) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Registrations */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
            <span className="text-[10px] font-mono text-[#88929b] uppercase tracking-wider block">
              TOTAL REGISTRATIONS
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {metrics.totalStudents.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#6be026] font-mono pt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+14.2%</span>
            </div>
          </div>

          {/* Card 2: Quiz Attempts */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
            <span className="text-[10px] font-mono text-[#88929b] uppercase tracking-wider block">
              QUIZ ATTEMPTS
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {metrics.totalAttempts > 1000000 ? `${(metrics.totalAttempts / 1000000).toFixed(1)}M` : metrics.totalAttempts}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#6be026] font-mono pt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+5.8%</span>
            </div>
          </div>

          {/* Card 3: Avg Completion Rate */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
            <span className="text-[10px] font-mono text-[#88929b] uppercase tracking-wider block">
              AVG COMPLETION RATE
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {metrics.avgScore}%
              </span>
            </div>
            <div className="w-full bg-[#262a31] h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-[#38BDF8] h-full rounded-full" style={{ width: `${metrics.avgScore}%` }} />
            </div>
          </div>

          {/* Card 4: System Anomalies */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
            <span className="text-[10px] font-mono text-[#88929b] uppercase tracking-wider block">
              SYSTEM ANOMALIES
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white tracking-tight">3</span>
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <span className="text-xs text-[#88929b] font-mono block pt-1">Pending review</span>
          </div>
        </div>

        {/* Engagement Trends & Top Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Engagement Trends Area Chart (2 cols) */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Engagement Trends</h3>
              <span className="text-xs font-mono text-[#38BDF8]">Live Telemetry</span>
            </div>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#88929b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#88929b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#181c22', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="attempts" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#colorAttempts)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Categories Progress Distribution (1 col) */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
            <h3 className="text-lg font-bold text-white">Top Categories</h3>
            
            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#dfe2eb]">
                  <span>JavaScript</span>
                  <span className="text-[#38BDF8]">45%</span>
                </div>
                <div className="h-2 rounded-full bg-[#262a31] overflow-hidden">
                  <div className="h-full bg-[#38BDF8] w-[45%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[#dfe2eb]">
                  <span>React</span>
                  <span className="text-[#38BDF8]">30%</span>
                </div>
                <div className="h-2 rounded-full bg-[#262a31] overflow-hidden">
                  <div className="h-full bg-[#b2c5ff] w-[30%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[#dfe2eb]">
                  <span>Cyber Security</span>
                  <span className="text-[#38BDF8]">15%</span>
                </div>
                <div className="h-2 rounded-full bg-[#262a31] overflow-hidden">
                  <div className="h-full bg-[#6be026] w-[15%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[#dfe2eb]">
                  <span>Python</span>
                  <span className="text-[#38BDF8]">10%</span>
                </div>
                <div className="h-2 rounded-full bg-[#262a31] overflow-hidden">
                  <div className="h-full bg-[#87fe45] w-[10%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Active Sessions Table (Matching Stitch Screenshot 3) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Recent Active Sessions</h3>
            <span className="text-xs font-mono text-[#88929b]">View All</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#dfe2eb]">
              <thead className="text-xs font-mono uppercase text-[#88929b] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Quiz Node</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {activeSessions.map((session, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{session.userId}</td>
                    <td className="py-3.5 px-4 text-[#88929b]">{session.quiz}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono ${
                          session.status === 'Active'
                            ? 'bg-[#6be026]/20 text-[#6be026] border border-[#6be026]/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            session.status === 'Active' ? 'bg-[#6be026] animate-pulse' : 'bg-amber-400'
                          }`}
                        />
                        {session.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#38BDF8]">{session.ping}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
