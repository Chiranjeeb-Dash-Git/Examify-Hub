import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../services/api';
import { Users, BookOpen, CheckCircle, AlertTriangle, TrendingUp, Activity, BarChart2, Zap, Shield, Radio, ArrowUpRight } from 'lucide-react';
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

  const [timeRange, setTimeRange] = useState('7D');

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
    { userId: 'USR-8991X', name: 'Rahul Sharma', quiz: 'Quantum Physics 101', status: 'Active', ping: '12ms' },
    { userId: 'USR-7724A', name: 'Priya Patel', quiz: 'Renaissance Art History', status: 'Paused', ping: '45ms' },
    { userId: 'USR-1029B', name: 'Amit Kumar', quiz: 'Advanced Cryptography', status: 'Active', ping: '8ms' },
    { userId: 'USR-4412K', name: 'Jane Doe', quiz: 'JavaScript Fundamentals', status: 'Active', ping: '16ms' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-body">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Command Center Workspace */}
      <main className="flex-grow p-6 sm:p-8 space-y-8 overflow-y-auto">
        {/* Cinematic Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] tracking-[0.25em] text-white/70 uppercase">
                ✦ LIVE TELEMETRY MATRIX // v2.4
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight uppercase">
              PLATFORM <span className="text-white/80">ANALYTICS</span>
            </h1>
            <p className="text-sm text-white/60 font-mono">
              Real-time candidate telemetry, engagement metrics, and evaluation streams
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#0a0a0c] rounded-xl border border-white/10 text-xs font-mono">
            {['7D', '30D', 'YTD', 'ALL'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-white text-black font-bold shadow-md shadow-white/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Cinematic Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Registrations */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 bg-[#0a0a0c] hover:border-white/30 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                TOTAL REGISTRATIONS
              </span>
              <Users className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                {metrics.totalStudents.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 font-mono text-xs">
              <div className="flex items-center gap-1 text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+14.2% GROWTH</span>
              </div>
              <span className="text-white/40 text-[10px]">VS LAST PERIOD</span>
            </div>
          </div>

          {/* Card 2: Quiz Attempts */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 bg-[#0a0a0c] hover:border-white/30 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                QUIZ ATTEMPTS
              </span>
              <BookOpen className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                {metrics.totalAttempts > 1000000 ? `${(metrics.totalAttempts / 1000000).toFixed(1)}M` : metrics.totalAttempts}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 font-mono text-xs">
              <div className="flex items-center gap-1 text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+5.8% VOLUME</span>
              </div>
              <span className="text-white/40 text-[10px]">HIGH INTENSITY</span>
            </div>
          </div>

          {/* Card 3: Avg Completion Rate */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 bg-[#0a0a0c] hover:border-white/30 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                AVG SCORE ACCURACY
              </span>
              <Activity className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                {metrics.avgScore}%
              </span>
            </div>

            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${metrics.avgScore}%` }} />
            </div>
          </div>

          {/* Card 4: System Anomalies */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 bg-[#0a0a0c] hover:border-white/30 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                SYSTEM ANOMALIES
              </span>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">3</span>
              <span className="font-mono text-[10px] text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full bg-amber-500/10">
                PENDING REVIEW
              </span>
            </div>

            <div className="pt-2 border-t border-white/5 font-mono text-[11px] text-white/40">
              <span>AUTOMATED AUDIT ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Engagement Trends & Category Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Engagement Trends Area Chart (2 cols) */}
          <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 bg-[#0a0a0c]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-xl text-white tracking-tight">
                  Engagement Velocity Trends
                </h3>
                <p className="text-xs text-white/60 font-mono mt-0.5">
                  Daily question completion trajectories and telemetry throughput
                </p>
              </div>

              <div className="font-mono text-xs text-emerald-400 flex items-center gap-1.5 border border-emerald-500/30 px-3 py-1 rounded-full bg-emerald-500/10">
                <Radio className="h-3.5 w-3.5 animate-pulse" />
                <span>LIVE STREAM</span>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} fontFamily="JetBrains Mono" />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} fontFamily="JetBrains Mono" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050505', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff', fontFamily: 'JetBrains Mono' }}
                  />
                  <Area type="monotone" dataKey="attempts" stroke="#ffffff" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAttempts)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Categories Distribution Matrix (1 col) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 bg-[#0a0a0c]">
            <div>
              <h3 className="font-display font-extrabold text-xl text-white tracking-tight">
                Domain Skill Distribution
              </h3>
              <p className="text-xs text-white/60 font-mono mt-0.5">
                Evaluation share by category node
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-white">
                  <span>JavaScript</span>
                  <span className="text-white/80 font-bold">45%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-white rounded-full w-[45%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-white">
                  <span>React</span>
                  <span className="text-white/80 font-bold">30%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-white/80 rounded-full w-[30%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-white">
                  <span>Cyber Security</span>
                  <span className="text-white/80 font-bold">15%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full w-[15%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-white">
                  <span>Python</span>
                  <span className="text-white/80 font-bold">10%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-white/50 rounded-full w-[10%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Candidate Sessions Table */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 bg-[#0a0a0c]">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-display font-extrabold text-xl text-white tracking-tight">
                Live Active Sessions Terminal
              </h3>
              <p className="text-xs text-white/60 font-mono mt-0.5">
                Real-time candidate telemetry pings and focus audit
              </p>
            </div>
            <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
              STATUS: AUDIT_ACTIVE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white">
              <thead className="text-xs font-mono uppercase text-white/40 border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Candidate ID</th>
                  <th className="py-3 px-4">Directive Node</th>
                  <th className="py-3 px-4">Proctoring Status</th>
                  <th className="py-3 px-4 text-right">Telemetry Ping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {activeSessions.map((session, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                      <span>{session.userId} ({session.name})</span>
                    </td>
                    <td className="py-4 px-4 text-white/70">{session.quiz}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono ${
                          session.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            session.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                          }`}
                        />
                        {session.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-white/90">{session.ping}</td>
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
