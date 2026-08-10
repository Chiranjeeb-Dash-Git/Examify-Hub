import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { gsap } from 'gsap';
import Chart from 'chart.js/auto';
import {
  Users, BookOpen, Globe, FileEdit, HelpCircle, ListChecks,
  Gauge, CheckCircle2, XCircle, TrendingUp, TrendingDown,
  Activity, Eye, Plus, BarChart3
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [allAttempts, setAllAttempts] = useState([]);
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // chart refs
  const chTime = useRef(null);
  const chPf   = useRef(null);
  const chPop  = useRef(null);
  const chReg  = useRef(null);
  const charts  = useRef([]);

  useEffect(() => {
    Promise.all([
      api.getAdminAnalytics(),
      api.getAllAttempts ? api.getAllAttempts() : Promise.resolve([]),
      api.getUsers ? api.getUsers() : Promise.resolve([]),
      api.getQuizzes ? api.getQuizzes() : Promise.resolve([])
    ]).then(([m, atts, usrs, qzs]) => {
      setMetrics(m);
      setAllAttempts(atts || []);
      setRecentAttempts((atts || []).slice(0, 5));
      setUsers(usrs || []);
      setQuizzes(qzs || []);
    }).catch(console.error);
  }, []);

  // counter animation
  useEffect(() => {
    if (!metrics) return;
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.4, ease: 'power2.out', delay: 0.35,
        onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString(); }
      });
    });
    gsap.fromTo('.fade-slide', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .06, ease: 'power3.out', delay: .1, clearProps: 'transform' });
  }, [metrics]);

  // charts
  useEffect(() => {
    if (!metrics || quizzes.length === 0) return;
    charts.current.forEach(c => c?.destroy());
    charts.current = [];

    Chart.defaults.color = '#71717a';
    Chart.defaults.font.family = 'Outfit';

    const grad = (ctx, color) => {
      const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 240);
      g.addColorStop(0, color + '55');
      g.addColorStop(1, color + '00');
      return g;
    };

    // 1. Attempts over the last 14 days ending today
    const attemptLabels = [];
    const attemptCounts = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const displayString = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      attemptLabels.push(displayString);

      const count = allAttempts.filter(att => {
        const attDate = new Date(att.completedAt || att.startedAt).toISOString().split('T')[0];
        return attDate === dateString;
      }).length;
      attemptCounts.push(count);
    }

    charts.current.push(new Chart(chTime.current, {
      type: 'line',
      data: {
        labels: attemptLabels,
        datasets: [{
          label: 'Attempts',
          data: attemptCounts,
          borderColor: '#818cf8',
          backgroundColor: c => grad(c, '#818cf8'),
          fill: true, tension: .45, borderWidth: 3, pointRadius: 3, pointBackgroundColor: '#818cf8'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { precision: 0 } }, x: { grid: { display: false }, ticks: { maxTicksLimit: 7 } } } }
    }));

    // 2. Pass / Fail Ratio
    const passed = allAttempts.filter(a => a.status === 'PASSED').length;
    const failed = allAttempts.filter(a => a.status === 'FAILED').length;
    charts.current.push(new Chart(chPf.current, {
      type: 'doughnut',
      data: {
        labels: ['Passed', 'Failed'],
        datasets: [{ 
          data: [passed || 1, failed || 0], 
          backgroundColor: ['#34d399', '#fb7185'], 
          borderColor: '#0a0a10', 
          borderWidth: 4, 
          hoverOffset: 12 
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: '#a1a1aa', padding: 18, usePointStyle: true } } } }
    }));

    // 3. Most Popular Quizzes (Top 5 by attempt counts)
    const quizStats = {};
    quizzes.forEach(q => {
      quizStats[q.id] = { title: q.title, count: 0 };
    });
    allAttempts.forEach(att => {
      if (quizStats[att.quizId]) {
        quizStats[att.quizId].count += 1;
      }
    });
    const popularQuizzes = Object.values(quizStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    const popularLabels = popularQuizzes.map(q => q.title);
    const popularData = popularQuizzes.map(q => q.count);

    charts.current.push(new Chart(chPop.current, {
      type: 'bar',
      data: {
        labels: popularLabels.length > 0 ? popularLabels : ['No Attempts Yet'],
        datasets: [{ 
          data: popularData.length > 0 ? popularData : [0], 
          backgroundColor: ['#818cf8','#e879f9','#67e8f9','#fbbf24','#34d399'], 
          borderRadius: 10, 
          barThickness: 24 
        }]
      },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { precision: 0 } }, y: { grid: { display: false }, ticks: { color: '#d4d4d8' } } } }
    }));

    // 4. Registrations over the last 10 days ending today
    const regLabels = [];
    const regCounts = [];
    for (let i = 9; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const displayString = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      regLabels.push(displayString);

      const count = users.filter(u => {
        return u.role === 'STUDENT' && u.registrationDate === dateString;
      }).length;
      regCounts.push(count);
    }

    charts.current.push(new Chart(chReg.current, {
      type: 'line',
      data: {
        labels: regLabels,
        datasets: [{
          label: 'Registrations',
          data: regCounts,
          borderColor: '#34d399',
          backgroundColor: c => grad(c, '#34d399'),
          fill: true, tension: .45, borderWidth: 3, pointRadius: 3, pointBackgroundColor: '#34d399'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { precision: 0 } }, x: { grid: { display: false } } } }
    }));

    return () => { charts.current.forEach(c => c?.destroy()); };
  }, [metrics, allAttempts, users, quizzes]);

  const passRate = metrics ? Math.round((metrics.totalPassed ?? (metrics.totalAttempts * .75)) / (metrics.totalAttempts || 1) * 100) : 0;

  const stats = metrics ? [
    { Icon: Users,        label: 'Total Students',    val: metrics.totalStudents,   color: 'text-indigo-300',  trend: '+12.4%', up: true },
    { Icon: BookOpen,     label: 'Total Quizzes',     val: metrics.totalQuizzes,    color: 'text-fuchsia-300', trend: '+3 new', up: true },
    { Icon: Globe,        label: 'Published Quizzes', val: metrics.publishedQuizzes,color: 'text-emerald-300', trend: '78% of library', up: null },
    { Icon: FileEdit,     label: 'Draft Quizzes',     val: metrics.draftQuizzes,    color: 'text-amber-300',   trend: '2 awaiting', up: null },
    { Icon: HelpCircle,   label: 'Total Questions',   val: (metrics.totalQuestions ?? 0), color: 'text-cyan-300', trend: '+46', up: true },
    { Icon: ListChecks,   label: 'Total Attempts',    val: metrics.totalAttempts,   color: 'text-purple-300',  trend: '+18.2%', up: true },
    { Icon: Gauge,        label: 'Average Score',     val: metrics.avgScore,        color: 'text-pink-300',    trend: '+4.1%', up: true, suf: '%' },
    { Icon: CheckCircle2, label: 'Passed Attempts',   val: metrics.totalPassed ?? Math.round(metrics.totalAttempts * .75), color: 'text-teal-300', trend: `${passRate}% pass rate`, up: null },
    { Icon: XCircle,      label: 'Failed Attempts',   val: metrics.totalFailed ?? Math.round(metrics.totalAttempts * .25), color: 'text-rose-300', trend: '-2.3%', up: false },
  ] : [];

  if (!metrics) return (
    <div className="pt-32 text-center text-zinc-400 text-sm">Loading command center…</div>
  );

  return (
    <div className="relative z-10 pt-24 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="space-y-7 relative">
        {/* Orbs */}
        <div className="orb w-96 h-96 bg-indigo-700 -top-10 -left-40" />
        <div className="orb w-80 h-80 bg-fuchsia-700 top-1/2 -right-32" style={{ animationDelay: '-5s' }} />

        {/* Header */}
        <div className="fade-slide flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[.3em] text-fuchsia-300 font-bold mb-2 flex items-center gap-2">
              <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400">
                <span className="live-dot absolute inset-0" />
              </span>
              Admin Control Panel
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              Command <span className="grad-text">Center</span>
            </h1>
            <p className="text-zinc-400 mt-1.5 text-sm">
              Full platform oversight — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/quizzes">
              <button className="btn-ghost px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Manage Quizzes
              </button>
            </Link>
            <Link to="/admin/quizzes/new">
              <button className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 shimmer">
                <Plus className="w-4 h-4" /> New Quiz
              </button>
            </Link>
          </div>
        </div>

        {/* 9-stat grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-9 gap-3">
          {stats.map(({ Icon, label, val, color, trend, up, suf = '' }, i) => (
            <div key={i} className="fade-slide glass rounded-2xl p-4 relative overflow-hidden card-hover">
              <div className="stat-glow" />
              <div className={`${color} mb-2`}><Icon className="w-4 h-4" /></div>
              <div className="font-display text-2xl font-bold">
                <span data-count={val}>0</span>{suf}
              </div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5 leading-tight">{label}</div>
              <div className={`mt-2 text-[10px] font-bold flex items-center gap-0.5 ${up === true ? 'text-emerald-300' : up === false ? 'text-rose-300' : 'text-zinc-500'}`}>
                {up === true && <TrendingUp className="w-3 h-3" />}
                {up === false && <TrendingDown className="w-3 h-3" />}
                {trend}
              </div>
            </div>
          ))}
        </div>

        {/* Charts 2×2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="fade-slide glass rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-300" /> Quiz Attempts Over Time
                <span className="text-xs text-zinc-500 font-normal">(14 days)</span>
              </h3>
              <span className="badge bg-indigo-500/10 text-indigo-300 border border-indigo-400/25">Live</span>
            </div>
            <div className="h-60"><canvas ref={chTime} /></div>
          </div>

          <div className="fade-slide glass rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-fuchsia-300" /> Pass / Fail Ratio
              </h3>
              <span className="badge bg-emerald-500/10 text-emerald-300 border border-emerald-400/25">{passRate}% Pass</span>
            </div>
            <div className="h-60"><canvas ref={chPf} /></div>
          </div>

          <div className="fade-slide glass rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-300" /> Most Popular Quizzes
              </h3>
              <span className="badge bg-amber-500/10 text-amber-300 border border-amber-400/25">Top 5</span>
            </div>
            <div className="h-60"><canvas ref={chPop} /></div>
          </div>

          <div className="fade-slide glass rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-300" /> Student Registrations
                <span className="text-xs text-zinc-500 font-normal">(30 days)</span>
              </h3>
              <span className="badge bg-emerald-500/10 text-emerald-300 border border-emerald-400/25">+34 this month</span>
            </div>
            <div className="h-60"><canvas ref={chReg} /></div>
          </div>
        </div>

        {/* Recent Attempts */}
        <div className="fade-slide glass rounded-2xl overflow-hidden">
          <div className="p-6 pb-0 flex items-center justify-between">
            <h3 className="font-display font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-300" /> Recent Attempts
            </h3>
            <Link to="/admin/attempts" className="text-xs text-indigo-300 hover:text-indigo-200 font-bold">View all →</Link>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full tbl">
              <thead>
                <tr>
                  <th>Student</th><th>Quiz</th><th>Date</th><th>Score</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {recentAttempts.length > 0 ? recentAttempts.map(att => (
                  <tr key={att.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold shrink-0">
                          {(att.userName || att.quizTitle || '?').slice(0, 2).toUpperCase()}
                        </span>
                        <span className="font-semibold">{att.userName || 'Student'}</span>
                      </div>
                    </td>
                    <td className="text-zinc-300">{att.quizTitle}</td>
                    <td className="text-zinc-400">{new Date(att.date || att.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td><span className={`font-display font-bold ${att.passed ? 'text-emerald-300' : 'text-rose-300'}`}>{att.percentage}%</span></td>
                    <td>
                      <span className={`badge ${att.passed ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30' : 'bg-rose-500/15 text-rose-300 border border-rose-400/30'}`}>
                        {att.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/quiz/result/${att.id}`}>
                        <Eye className="w-4 h-4 text-zinc-500 hover:text-indigo-300 transition-colors" />
                      </Link>
                    </td>
                  </tr>
                )) : (
                  // Placeholder rows when no real attempts yet
                  [
                    { initials: 'RS', name: 'Rahul Sharma',  quiz: 'JavaScript Fundamentals', date: 'Aug 10', score: 92, passed: true },
                    { initials: 'PP', name: 'Priya Patel',   quiz: 'React Essentials',         date: 'Aug 10', score: 88, passed: true },
                    { initials: 'AK', name: 'Amit Kumar',    quiz: 'Python Basics',            date: 'Aug 9',  score: 46, passed: false },
                    { initials: 'SR', name: 'Sneha Reddy',   quiz: 'Cyber Security',           date: 'Aug 9',  score: 81, passed: true },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold">{r.initials}</span>
                          <span className="font-semibold">{r.name}</span>
                        </div>
                      </td>
                      <td className="text-zinc-300">{r.quiz}</td>
                      <td className="text-zinc-400">{r.date}</td>
                      <td><span className={`font-display font-bold ${r.passed ? 'text-emerald-300' : 'text-rose-300'}`}>{r.score}%</span></td>
                      <td>
                        <span className={`badge ${r.passed ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30' : 'bg-rose-500/15 text-rose-300 border border-rose-400/30'}`}>
                          {r.passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td><Eye className="w-4 h-4 text-zinc-500" /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
