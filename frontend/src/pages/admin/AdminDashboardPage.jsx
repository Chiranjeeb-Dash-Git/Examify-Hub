import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { AnimatedFluidBackground } from '../../components/landing/AnimatedFluidBackground';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { Users, BookOpen, AlertTriangle, Activity, BarChart2, Radio, ArrowRight, Check, Sparkles } from 'lucide-react';
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

  // CTA Interactive Form State matching requested hero animation
  const [ctaState, setCtaState] = useState('button'); // 'button' | 'form'
  const [emailInput, setEmailInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');

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

  // Typewriter effect logic when CTA opens or submits
  useEffect(() => {
    if (ctaState === 'form') {
      const fullText = submitted 
        ? "You Will Receive Notifications By Email"
        : "Enter Your Email Here For Early Access";
      
      setPlaceholderText('');
      let currentIdx = 0;
      const interval = setInterval(() => {
        if (currentIdx < fullText.length) {
          setPlaceholderText(fullText.slice(0, currentIdx + 1));
          currentIdx++;
        } else {
          clearInterval(interval);
        }
      }, 60);

      // Reset back after 4s after submission
      let timeout;
      if (submitted) {
        timeout = setTimeout(() => {
          setCtaState('button');
          setSubmitted(false);
          setEmailInput('');
        }, 4000);
      }

      return () => {
        clearInterval(interval);
        if (timeout) clearTimeout(timeout);
      };
    }
  }, [ctaState, submitted]);

  const handleCtaSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubmitted(true);
  };

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
    <div className="admin-bg-wrap flex-col md:flex-row selection:bg-white selection:text-black">
      {/* Animated Fluid Blue/Purple Background */}
      <AnimatedFluidBackground />

      {/* Scanline overlay for subtle texture */}
      <div className="bg-scanlines" style={{ zIndex: 2 }} />

      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Workspace */}
      <main className="relative z-10 flex-grow p-4 md:p-6 overflow-y-auto space-y-6 max-h-[calc(100vh-4rem)]">
        {/* Top Navbar & Header Control */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="liquid-glass rounded-full px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto backdrop-blur-xl border border-white/10">
          <div className="flex items-center gap-3">

            <div className="h-8 w-8 flex items-center justify-center liquid-glass rounded-full">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span className="font-medium text-white text-sm">Examify Hub Command Telemetry</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 glass-pill px-3 py-1">
            {['7D', '30D', 'YTD', 'ALL'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  timeRange === range
                    ? 'liquid-glass text-white font-bold border border-white/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Hero Section Banner */}
        <section className="relative flex flex-col items-center justify-center px-4 py-8 text-center max-w-5xl mx-auto gap-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase"
          >
            REAL-TIME ASSESSMENT TELEMETRY & CONTROL
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-4xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.1] bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent max-w-4xl"
          >
            A new way to think and create <br className="hidden md:block" /> with assessment intelligence
          </motion.h1>

          {/* Email Capture CTA Area */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="min-h-[50px] mt-2 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {ctaState === 'button' ? (
                <motion.button
                  key="cta-btn"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setCtaState('form')}
                  className="px-10 py-3 text-[14px] font-medium border border-white/10 rounded-full hover:border-white/30 hover:bg-white/[0.02] transition-all duration-300 text-white/90 backdrop-blur-sm cursor-pointer"
                >
                  Get early access
                </motion.button>
              ) : (
                <motion.form
                  key="cta-form"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleCtaSubmit}
                  className="flex items-center gap-2 pl-5 pr-1.5 py-1.5 text-[14px] font-medium border border-white/20 rounded-full bg-white/[0.02] backdrop-blur-sm w-full max-w-[340px] focus-within:border-white/40 transition-colors duration-300"
                >
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={placeholderText}
                    autoFocus
                    className="bg-transparent text-white placeholder-white/45 outline-none text-xs w-full"
                  />
                  <button
                    type="submit"
                    className="h-8 w-8 rounded-full liquid-glass flex items-center justify-center text-white shrink-0 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {submitted ? <Check className="h-4 w-4 text-emerald-400" /> : <ArrowRight className="h-4 w-4" />}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* 4 Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {/* Card 1 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="liquid-glass p-5 rounded-3xl backdrop-blur-xl border border-white/10 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-white/70 uppercase tracking-wider">TOTAL REGISTRATIONS</span>
              <Users className="h-4 w-4 text-white/80" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-semibold text-white tracking-tight">{metrics.totalStudents.toLocaleString()}</span>
            </div>
            <div className="text-[11px] font-medium text-white/60 mt-2">
              +14.2% from last cycle
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="liquid-glass p-5 rounded-3xl backdrop-blur-xl border border-white/10 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-white/70 uppercase tracking-wider">QUIZ ATTEMPTS</span>
              <BookOpen className="h-4 w-4 text-white/80" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {metrics.totalAttempts > 1000000 ? `${(metrics.totalAttempts / 1000000).toFixed(1)}M` : metrics.totalAttempts}
              </span>
            </div>
            <div className="text-[11px] font-medium text-white/60 mt-2">
              +5.8% active completion
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="liquid-glass p-5 rounded-3xl backdrop-blur-xl border border-white/10 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-white/70 uppercase tracking-wider">AVG ACCURACY</span>
              <Activity className="h-4 w-4 text-white/80" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-semibold text-white tracking-tight">{metrics.avgScore}%</span>
            </div>
            <div className="w-full h-1 rounded-full overflow-hidden mt-3 bg-white/10">
              <div className="bg-white h-full rounded-full" style={{ width: `${metrics.avgScore}%` }} />
            </div>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="liquid-glass p-5 rounded-3xl backdrop-blur-xl border border-white/10 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-white/70 uppercase tracking-wider">SYSTEM ANOMALIES</span>
              <AlertTriangle className="h-4 w-4 text-white/80" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-3xl font-semibold text-white tracking-tight">3</span>
              <span className="text-[10px] font-semibold text-white/80 liquid-glass px-2.5 py-1 rounded-full">AUDIT OK</span>
            </div>
            <div className="text-[11px] font-medium text-white/60 mt-2">
              Automated telemetry active
            </div>
          </motion.div>
        </div>

        {/* Engagement Velocity & Active Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Chart */}
          <div className="lg:col-span-2 liquid-glass p-6 rounded-3xl backdrop-blur-xl border border-white/10 flex flex-col min-h-[350px]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-white tracking-tight">Engagement Velocity</h3>
                <p className="text-xs text-white/60">Daily question completion trajectory</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 liquid-glass text-white/80 text-xs font-medium rounded-full">
                <Radio className="h-3 w-3 text-white animate-pulse" />
                LIVE
              </div>
            </div>

            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.95)', borderColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '16px', color: '#fff' }}
                    itemStyle={{ color: '#fff', fontWeight: 500 }}
                  />
                  <Area type="monotone" dataKey="attempts" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorAttempts)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Candidate Telemetry Sessions */}
          <div className="liquid-glass p-6 rounded-3xl backdrop-blur-xl border border-white/10 flex flex-col min-h-[350px]">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-white tracking-tight">Active Candidate Telemetry</h3>
              <p className="text-xs text-white/60">Real-time candidate telemetry</p>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1">
              {activeSessions.map((session, idx) => (
                <div key={idx} className="liquid-glass p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{session.name}</span>
                    <span className="text-xs text-white/50 truncate max-w-[140px]">{session.quiz}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full liquid-glass text-white/90">
                      {session.status}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">{session.ping}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
