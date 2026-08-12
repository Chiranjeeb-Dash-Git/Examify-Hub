import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Chart from 'chart.js/auto';
import { useAuth } from '../../context/AuthContext';
import {
  Users, BookOpen, Globe, HelpCircle, ListChecks,
  Gauge, CheckCircle2, XCircle, TrendingUp, TrendingDown,
  Activity, Eye, Plus, BarChart3, Bell, ChevronDown,
  Zap, ShieldHalf, Flame, UserPlus, PieChart, LogOut, Shield
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ── tiny canvas particle engine ── */
function HudParticles() {
  const cvRef = useRef(null);
  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let W, H, animId;
    const rs = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; };
    rs();
    window.addEventListener('resize', rs);
    const cols = ['rgba(34,211,238,', 'rgba(168,85,247,', 'rgba(251,191,36,'];
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .3,
      vy: (Math.random() - .5) * .3,
      r: Math.random() * 1.8 + .4,
      c: cols[Math.floor(Math.random() * 3)],
      a: Math.random() * .4 + .08,
    }));
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fillStyle = p.c + p.a + ')'; ctx.fill();
      });
      animId = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener('resize', rs); cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={cvRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />;
}

/* ── 3D tilt hook ── */
function useTilt(ref, maxDeg = 9) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.transform = `rotateX(${(py - .5) * -2 * maxDeg}deg) rotateY(${(px - .5) * 2 * maxDeg}deg) translateZ(6px)`;
      el.style.setProperty('--mx', px * 100 + '%');
      el.style.setProperty('--my', py * 100 + '%');
    };
    const onLeave = () => { el.style.transform = 'rotateX(0) rotateY(0) translateZ(0)'; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [ref, maxDeg]);
}

/* ── Tilt Card wrapper ── */
function TiltCard({ children, className = '', maxDeg = 9, style }) {
  const ref = useRef(null);
  useTilt(ref, maxDeg);
  return (
    <div ref={ref} className={`tilt ${className}`} style={{ ...style, transformStyle: 'preserve-3d' }}>
      <div className="shine" />
      {children}
    </div>
  );
}

/* ── HUD corner brackets ── */
function Brackets({ all = false }) {
  return (
    <>
      <span className="bk bk-tl" />
      <span className="bk bk-br" />
      {all && <><span className="bk bk-tr" /><span className="bk bk-bl" /></>}
    </>
  );
}

/* ── Stat Card ── */
function StatCard({ icon: Icon, label, value, color, barColor, barW, trend, up, suf = '', revealDelay }) {
  const barRef = useRef(null);
  const countRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const fill = barRef.current;
    const countEl = countRef.current;
    if (!card) return;

    // reveal
    gsap.fromTo(card,
      { opacity: 0, y: 50, rotateX: 12, scale: .97 },
      { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: .9, ease: 'power3.out', delay: revealDelay || 0 }
    );

    // counter
    if (countEl) {
      const target = parseFloat(value) || 0;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.6, ease: 'power2.out', delay: (revealDelay || 0) + 0.3,
        onUpdate: () => { if (countEl) countEl.textContent = Math.round(obj.v).toLocaleString(); }
      });
    }

    // bar
    if (fill) {
      setTimeout(() => { fill.classList.add('animated'); }, ((revealDelay || 0) + 0.4) * 1000);
    }
  }, [value, revealDelay, barW]);

  return (
    <div ref={cardRef} className="brackets" style={{ opacity: 0 }}>
      <TiltCard className="metal clip-hud p-5 w-full h-full">
        <div className="pop">
          <div className={`w-9 h-9 diamond ${color.bg} border ${color.border} flex items-center justify-center mb-4`}>
            <Icon className={`w-4 h-4 ${color.icon}`} style={{ transform: 'rotate(-45deg)' }} />
          </div>
          <div className="font-orbitron text-2xl font-black text-white">
            <span ref={countRef}>0</span>{suf && <span className="text-sm text-zinc-500">{suf}</span>}
          </div>
          <div className="font-orbitron text-[8.5px] tracking-[.2em] text-zinc-500 uppercase mt-1">{label}</div>
          <div className="micro-bar mt-3">
            <div ref={barRef} className={`micro-fill ${barColor}`} style={{ width: barW }} />
          </div>
          <div className={`mt-2 text-xs font-bold flex items-center gap-1 ${up === true ? 'text-emerald-400' : up === false ? 'text-red-400' : 'text-zinc-500'}`}>
            {up === true && <TrendingUp className="w-3 h-3" />}
            {up === false && <TrendingDown className="w-3 h-3" />}
            {trend}
          </div>
        </div>
      </TiltCard>
      <span className="bk bk-tl" /><span className="bk bk-br" />
    </div>
  );
}

/* ══════════════════ MAIN COMPONENT ══════════════════ */
export const AdminDashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [metrics, setMetrics] = useState(null);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [allAttempts, setAllAttempts] = useState([]);
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const chTime = useRef(null);
  const chPf   = useRef(null);
  const chPop  = useRef(null);
  const chReg  = useRef(null);
  const charts = useRef([]);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  const initials = (n = '') => n.split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase();

  /* ─ data fetch ─ */
  useEffect(() => {
    Promise.all([
      api.getAdminAnalytics(),
      api.getAllAttempts ? api.getAllAttempts() : Promise.resolve([]),
      api.getUsers ? api.getUsers() : Promise.resolve([]),
      api.getQuizzes ? api.getQuizzes() : Promise.resolve([]),
    ]).then(([m, atts, usrs, qzs]) => {
      setMetrics(m);
      setAllAttempts(atts || []);
      setRecentAttempts((atts || []).slice(0, 5));
      setUsers(usrs || []);
      setQuizzes(qzs || []);
    }).catch(console.error);
  }, []);

  /* ─ charts ─ */
  useEffect(() => {
    if (!metrics) return;
    charts.current.forEach(c => c?.destroy());
    charts.current = [];

    Chart.defaults.color = '#52525b';
    Chart.defaults.font.family = 'Rajdhani';
    Chart.defaults.font.weight = '600';

    const glowFill = (ctx, c) => {
      const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 260);
      g.addColorStop(0, c + '66'); g.addColorStop(1, c + '00'); return g;
    };

    const now = new Date();

    // 1. Attempts over time (14 days)
    const attemptLabels = [], attemptCounts = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      attemptLabels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      attemptCounts.push(allAttempts.filter(a => {
        const ad = new Date(a.completedAt || a.startedAt).toISOString().split('T')[0];
        return ad === ds;
      }).length);
    }
    if (chTime.current) {
      charts.current.push(new Chart(chTime.current, {
        type: 'line',
        data: {
          labels: attemptLabels,
          datasets: [{ data: attemptCounts, borderColor: '#22d3ee', backgroundColor: c => glowFill(c, '#22d3ee'), fill: true, tension: .45, borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: '#22d3ee', pointBorderColor: '#000', pointHoverRadius: 7 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.04)' }, ticks: { precision: 0 } }, x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } } } }
      }));
    }

    // 2. Pass / Fail
    const passed = allAttempts.filter(a => a.status === 'PASSED').length;
    const failed = allAttempts.filter(a => a.status === 'FAILED').length;
    if (chPf.current) {
      charts.current.push(new Chart(chPf.current, {
        type: 'doughnut',
        data: { labels: ['Passed', 'Failed'], datasets: [{ data: [passed || 1, failed || 0], backgroundColor: ['#22d3ee', '#f43f5e'], borderColor: '#0a0a0d', borderWidth: 5, hoverOffset: 14 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { position: 'bottom', labels: { color: '#a1a1aa', padding: 18, usePointStyle: true, font: { family: 'Orbitron', size: 9 } } } } }
      }));
    }

    // 3. Popular quizzes (top 5)
    const quizStats = {};
    quizzes.forEach(q => { quizStats[q.id] = { title: q.title, count: 0 }; });
    allAttempts.forEach(a => { if (quizStats[a.quizId]) quizStats[a.quizId].count++; });
    const top5 = Object.values(quizStats).sort((a, b) => b.count - a.count).slice(0, 5);
    if (chPop.current) {
      charts.current.push(new Chart(chPop.current, {
        type: 'bar',
        data: { labels: top5.map(q => q.title) || ['No Data'], datasets: [{ data: top5.map(q => q.count) || [0], backgroundColor: ['#22d3ee', '#a855f7', '#fbbf24', '#f472b6', '#34d399'], borderRadius: 3, barThickness: 22 }] },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.04)' }, ticks: { precision: 0 } }, y: { grid: { display: false }, ticks: { color: '#d4d4d8', font: { weight: '700' } } } } }
      }));
    }

    // 4. Registrations (10 days)
    const regLabels = [], regCounts = [];
    for (let i = 9; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      regLabels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      regCounts.push(users.filter(u => u.role === 'STUDENT' && u.registrationDate === ds).length);
    }
    if (chReg.current) {
      charts.current.push(new Chart(chReg.current, {
        type: 'line',
        data: { labels: regLabels, datasets: [{ data: regCounts, borderColor: '#a855f7', backgroundColor: c => glowFill(c, '#a855f7'), fill: true, tension: .45, borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: '#a855f7', pointBorderColor: '#000', pointHoverRadius: 7 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.04)' }, ticks: { precision: 0 } }, x: { grid: { display: false } } } }
      }));
    }

    return () => { charts.current.forEach(c => c?.destroy()); };
  }, [metrics, allAttempts, users, quizzes]);

  /* ─ chart panel scroll reveal ─ */
  useEffect(() => {
    if (!metrics) return;
    const panels = document.querySelectorAll('.chart-panel');
    panels.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 60, rotateX: 12, scale: .97 },
        { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 1, ease: 'power3.out', delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
        }
      );
    });
    const tableSection = document.querySelector('.attempts-table-section');
    if (tableSection) {
      gsap.fromTo(tableSection,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: tableSection, start: 'top 88%' }
        }
      );
    }
  }, [metrics]);

  const passRate = metrics
    ? Math.round((metrics.totalPassed ?? (metrics.totalAttempts * .75)) / (metrics.totalAttempts || 1) * 100)
    : 0;

  const statCards = metrics ? [
    { icon: Users,        label: 'Total Students',   value: metrics.totalStudents,   color: { bg: 'bg-cyan-500/10',   border: 'border-cyan-400/40',   icon: 'text-cyan-300'   }, barColor: 'bg-gradient-to-r from-cyan-400 to-cyan-200',     barW: '82%',  trend: '+12.4%', up: true  },
    { icon: BookOpen,     label: 'Total Quizzes',    value: metrics.totalQuizzes,    color: { bg: 'bg-violet-500/10', border: 'border-violet-400/40', icon: 'text-violet-300' }, barColor: 'bg-gradient-to-r from-violet-400 to-fuchsia-300', barW: '66%',  trend: '+3 new', up: true  },
    { icon: Globe,        label: 'Published',        value: metrics.publishedQuizzes,color: { bg: 'bg-emerald-500/10',border: 'border-emerald-400/40',icon: 'text-emerald-300'}, barColor: 'bg-gradient-to-r from-emerald-400 to-teal-300',  barW: '78%',  trend: '78% of library', up: null },
    { icon: HelpCircle,   label: 'Questions',        value: metrics.totalQuestions ?? 0, color: { bg: 'bg-sky-500/10', border: 'border-sky-400/40', icon: 'text-sky-300' },   barColor: 'bg-gradient-to-r from-sky-400 to-cyan-300',      barW: '88%',  trend: '+46', up: true },
    { icon: ListChecks,   label: 'Attempts',         value: metrics.totalAttempts,   color: { bg: 'bg-fuchsia-500/10',border: 'border-fuchsia-400/40',icon: 'text-fuchsia-300'}, barColor: 'bg-gradient-to-r from-fuchsia-400 to-pink-300',  barW: '92%',  trend: '+18.2%', up: true },
    { icon: Gauge,        label: 'Avg Score',        value: metrics.avgScore ?? 0,   color: { bg: 'bg-rose-500/10',  border: 'border-rose-400/40',   icon: 'text-rose-300'   }, barColor: 'bg-gradient-to-r from-rose-400 to-orange-300',   barW: `${Math.round(metrics.avgScore ?? 76)}%`, suf: '%', trend: '+4.1%', up: true },
    { icon: CheckCircle2, label: 'Passed',           value: metrics.totalPassed ?? Math.round((metrics.totalAttempts || 0) * .75), color: { bg: 'bg-teal-500/10', border: 'border-teal-400/40', icon: 'text-teal-300' }, barColor: 'bg-gradient-to-r from-teal-400 to-emerald-300', barW: '75%', trend: `${passRate}% pass rate`, up: null },
    { icon: XCircle,      label: 'Failed',           value: metrics.totalFailed ?? Math.round((metrics.totalAttempts || 0) * .25), color: { bg: 'bg-red-500/10', border: 'border-red-400/40', icon: 'text-red-300' }, barColor: 'bg-gradient-to-r from-red-400 to-rose-300', barW: '25%', trend: '-2.3%', up: false },
  ] : [];

  const adminNavLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/quizzes', label: 'Quizzes' },
    { to: '/admin/categories', label: 'Categories' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/attempts', label: 'Attempts' },
    { to: '/admin/leaderboard', label: 'Leaderboard' },
  ];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Placeholder attempts when empty
  const placeholderAttempts = [
    { initials: 'RS', name: 'Rahul Sharma',  quiz: 'JavaScript Fundamentals',  date: 'Aug 10', score: 92, passed: true,  from: 'from-cyan-400',    to: 'to-blue-600' },
    { initials: 'PP', name: 'Priya Patel',   quiz: 'React Essentials',          date: 'Aug 10', score: 88, passed: true,  from: 'from-fuchsia-400', to: 'to-violet-600' },
    { initials: 'AK', name: 'Amit Kumar',    quiz: 'Python Basics',             date: 'Aug 09', score: 46, passed: false, from: 'from-amber-400',   to: 'to-red-500' },
    { initials: 'SR', name: 'Sneha Reddy',   quiz: 'Cyber Security Essentials', date: 'Aug 09', score: 81, passed: true,  from: 'from-emerald-400', to: 'to-teal-600' },
  ];

  if (!metrics) return (
    <div className="hud-root fixed inset-0 flex items-center justify-center" style={{ background: '#030304', fontFamily: 'Orbitron, sans-serif' }}>
      <div className="hud-grid-floor" />
      <div className="hud-aurora" />
      <div className="hud-scanlines" />
      <div className="hud-vignette" />
      <div className="relative z-10 text-center">
        <div className="font-orbitron text-[11px] tracking-[.5em] text-neon-cyan uppercase mb-4">Initializing Systems…</div>
        <div className="font-orbitron text-lg chrome-text">COMMAND CENTER</div>
      </div>
    </div>
  );

  return (
    <div className="hud-root" style={{ background: '#030304', minHeight: '100vh', fontFamily: "'Rajdhani', sans-serif", color: '#e4e4e7', overflowX: 'hidden' }}>

      {/* ═══ AMBIENT LAYERS ═══ */}
      <div className="hud-grid-floor" />
      <div className="hud-aurora" />
      <HudParticles />
      <div className="hud-beam" style={{ left: '18%' }} />
      <div className="hud-beam" style={{ left: '72%', animationDelay: '-3.5s', background: 'linear-gradient(180deg,transparent,rgba(168,85,247,.45),transparent)' }} />
      <div className="hud-scanlines" />
      <div className="hud-vignette" />

      {/* ═══ HUD NAVBAR ═══ */}
      <nav className="fixed top-0 w-full z-50 metal" style={{ position: 'fixed', clipPath: 'none', borderLeft: 0, borderRight: 0, borderTop: 0 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

          {/* Logo */}
          <Link to="/admin" className="flex items-center gap-3 cursor-pointer group" style={{ textDecoration: 'none' }}>
            <div className="diamond glow-cyan flex items-center justify-center"
              style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#22d3ee,#a855f7,#f472b6)', transition: 'transform .5s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'rotate(135deg) scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'rotate(45deg)'}
            >
              <Zap className="w-5 h-5 text-black" style={{ transform: 'rotate(-45deg)' }} />
            </div>
            <div>
              <div className="font-orbitron font-black text-lg tracking-widest leading-none">
                <span className="chrome-text">QUIZ</span><span className="grad-neon">FORGE</span>
              </div>
              <div className="font-orbitron mt-1" style={{ fontSize: 9, letterSpacing: '0.4em', color: '#71717a' }}>ADMIN OS v2.6</div>
            </div>
          </Link>

          {/* Nav Pills */}
          <div className="hidden lg:flex items-center gap-1.5">
            {adminNavLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                <button className={`nav-pill ${isActive(to) ? 'nav-on' : ''}`}>{label}</button>
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 hud-badge" style={{ background: 'rgba(16,185,129,.1)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,.2)' }}>
              <span className="pulse-dot" />
              Systems Online
            </div>
            <button className="relative clip-hud-sm metal flex items-center justify-center text-zinc-400 hover:text-cyan-300 transition-colors" style={{ width: 40, height: 40 }}>
              <Bell className="w-4 h-4" />
              <span className="absolute rounded-full bg-cyan-400" style={{ top: 8, right: 10, width: 6, height: 6, boxShadow: '0 0 8px #22d3ee' }} />
            </button>
            <div className="flex items-center gap-2.5 btn-steel clip-hud-sm px-3 py-1.5">
              <div className="diamond flex items-center justify-center font-orbitron font-black text-black" style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#22d3ee,#7c3aed)', fontSize: 10 }}>
                <span style={{ transform: 'rotate(-45deg)' }}>{user ? initials(user.name) : 'AD'}</span>
              </div>
              <span className="hidden md:block text-sm font-bold tracking-wide">{user?.name?.split(' ')[0]?.toUpperCase() || 'ADMIN'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <button
              onClick={async () => { await logout(); navigate('/login'); }}
              className="p-2 text-zinc-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="hex-divider" />
      </nav>

      {/* ═══ MAIN CONTENT ═══ */}
      <main style={{ position: 'relative', zIndex: 10, paddingTop: 120, paddingBottom: 96, paddingLeft: 20, paddingRight: 20, maxWidth: 1400, margin: '0 auto', perspective: 1600 }}>

        {/* ── HERO HEADER ── */}
        <header style={{ position: 'relative', marginBottom: 48 }}>
          {/* Floating orb */}
          <div className="absolute hidden xl:flex items-center justify-center float-y" style={{ top: -40, right: 0 }}>
            <div className="diamond glow-cyan flex items-center justify-center" style={{ width: 128, height: 128, background: 'linear-gradient(135deg, rgba(34,211,238,.15), rgba(168,85,247,.15))', border: '1px solid rgba(34,211,238,.2)' }}>
              <ShieldHalf className="w-10 h-10" style={{ transform: 'rotate(-45deg)', color: 'rgba(34,211,238,.8)' }} />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div style={{ height: 1, width: 56, background: 'linear-gradient(90deg, #22d3ee, transparent)' }} />
            <span className="font-orbitron text-neon-cyan uppercase" style={{ fontSize: 11, letterSpacing: '0.5em' }}>Admin Control Panel</span>
            <span className="pulse-dot" />
          </div>

          <h1 className="font-orbitron font-black leading-none mb-4" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)', letterSpacing: '-0.02em' }}>
            <span className="chrome-text">COMMAND</span>{' '}
            <span className="grad-neon" style={{ filter: 'drop-shadow(0 0 24px rgba(168,85,247,.5))' }}>CENTER</span>
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-5">
            <p style={{ color: '#a1a1aa', fontSize: 18, letterSpacing: '0.04em' }}>
              Full platform oversight · <span style={{ color: '#e4e4e7', fontWeight: 600 }}>{today}</span> · Region{' '}
              <span className="text-neon-cyan font-bold">AP-SOUTH</span>
            </p>
            <div className="flex gap-3">
              <Link to="/admin/quizzes/new">
                <button className="btn-neon clip-hud-sm flex items-center gap-2 font-orbitron font-bold text-white"
                  style={{ padding: '12px 28px', fontSize: 12, letterSpacing: '0.2em' }}>
                  <Plus className="w-4 h-4" /> NEW QUIZ
                </button>
              </Link>
            </div>
          </div>
        </header>

        <div className="hex-divider" style={{ marginBottom: 48 }} />

        {/* ── 9-STAT CARDS GRID ── */}
        <section className="grid gap-4 mb-12"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', perspective: 1200 }}>
          {statCards.map((card, i) => (
            <StatCard key={i} {...card} revealDelay={i * 0.055} />
          ))}
        </section>

        {/* ── CHART PANELS 2×2 ── */}
        <section className="grid gap-6 mb-12" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>

          {/* Attempts over time */}
          <div className="chart-panel brackets" style={{ opacity: 0 }}>
            <TiltCard className="metal clip-hud p-6 w-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-orbitron font-bold flex items-center gap-2.5" style={{ fontSize: 13, letterSpacing: '0.15em' }}>
                  <TrendingUp className="w-4 h-4 text-neon-cyan" />
                  <span style={{ color: '#fff' }}>ATTEMPTS OVER TIME</span>
                </h3>
                <span className="hud-badge" style={{ background: 'rgba(34,211,238,.1)', color: '#67e8f9', border: '1px solid rgba(34,211,238,.25)' }}>◉ Live Feed</span>
              </div>
              <div style={{ height: 256 }}><canvas ref={chTime} /></div>
            </TiltCard>
            <Brackets all />
          </div>

          {/* Pass/Fail ratio */}
          <div className="chart-panel brackets" style={{ opacity: 0 }}>
            <TiltCard className="metal clip-hud p-6 w-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-orbitron font-bold flex items-center gap-2.5" style={{ fontSize: 13, letterSpacing: '0.15em' }}>
                  <PieChart className="w-4 h-4 text-neon-violet" />
                  <span style={{ color: '#fff' }}>PASS / FAIL RATIO</span>
                </h3>
                <span className="hud-badge" style={{ background: 'rgba(16,185,129,.1)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,.25)' }}>{passRate}% Pass</span>
              </div>
              <div style={{ height: 256 }}><canvas ref={chPf} /></div>
            </TiltCard>
            <Brackets all />
          </div>

          {/* Popular quizzes */}
          <div className="chart-panel brackets" style={{ opacity: 0 }}>
            <TiltCard className="metal clip-hud p-6 w-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-orbitron font-bold flex items-center gap-2.5" style={{ fontSize: 13, letterSpacing: '0.15em' }}>
                  <Flame className="w-4 h-4 text-neon-gold" />
                  <span style={{ color: '#fff' }}>MOST POPULAR QUIZZES</span>
                </h3>
                <span className="hud-badge" style={{ background: 'rgba(245,158,11,.1)', color: '#fcd34d', border: '1px solid rgba(251,191,36,.25)' }}>Top 5</span>
              </div>
              <div style={{ height: 256 }}><canvas ref={chPop} /></div>
            </TiltCard>
            <Brackets all />
          </div>

          {/* Student registrations */}
          <div className="chart-panel brackets" style={{ opacity: 0 }}>
            <TiltCard className="metal clip-hud p-6 w-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-orbitron font-bold flex items-center gap-2.5" style={{ fontSize: 13, letterSpacing: '0.15em' }}>
                  <UserPlus className="w-4 h-4 text-neon-cyan" />
                  <span style={{ color: '#fff' }}>STUDENT REGISTRATIONS</span>
                </h3>
                <span className="hud-badge" style={{ background: 'rgba(16,185,129,.1)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,.25)' }}>+34 Month</span>
              </div>
              <div style={{ height: 256 }}><canvas ref={chReg} /></div>
            </TiltCard>
            <Brackets all />
          </div>

        </section>

        {/* ── RECENT ATTEMPTS TABLE ── */}
        <section className="attempts-table-section tilt metal clip-hud overflow-hidden" style={{ opacity: 0 }}>
          <div className="shine" />
          <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(255,255,255,.05)' }}>
            <h3 className="font-orbitron font-bold flex items-center gap-2.5" style={{ fontSize: 13, letterSpacing: '0.15em' }}>
              <Activity className="w-4 h-4 text-neon-cyan" />
              <span style={{ color: '#fff' }}>RECENT ATTEMPTS</span>
            </h3>
            <Link to="/admin/attempts">
              <button className="font-orbitron hover:text-white transition-colors" style={{ fontSize: 10, letterSpacing: '0.25em', color: '#22d3ee', background: 'none', border: 'none', cursor: 'pointer' }}>
                VIEW ALL →
              </button>
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="w-full hud-tbl">
              <thead>
                <tr>
                  <th>Operative</th>
                  <th>Quiz Mission</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {recentAttempts.length > 0 ? recentAttempts.map((att, i) => {
                  const nm = att.userName || 'Student';
                  const ini = nm.split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase();
                  return (
                    <tr key={att.id || i}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="diamond flex items-center justify-center font-orbitron font-black text-black"
                            style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', fontSize: 10 }}>
                            <span style={{ transform: 'rotate(-45deg)' }}>{ini}</span>
                          </div>
                          <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>{nm}</span>
                        </div>
                      </td>
                      <td style={{ color: '#d4d4d8' }}>{att.quizTitle}</td>
                      <td style={{ color: '#71717a' }}>{new Date(att.date || att.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                      <td>
                        <span className="font-orbitron font-black" style={{ color: att.passed ? '#34d399' : '#f87171', textShadow: att.passed ? '0 0 12px rgba(52,211,153,.5)' : '0 0 12px rgba(248,113,113,.5)' }}>
                          {att.percentage}%
                        </span>
                      </td>
                      <td>
                        <span className="hud-badge" style={{ background: att.passed ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.1)', color: att.passed ? '#6ee7b7' : '#fca5a5', border: att.passed ? '1px solid rgba(52,211,153,.25)' : '1px solid rgba(239,68,68,.25)' }}>
                          {att.passed ? '✓ Passed' : '✕ Failed'}
                        </span>
                      </td>
                      <td>
                        <Link to={`/quiz/result/${att.id}`}><Eye className="w-4 h-4" style={{ color: '#52525b' }} /></Link>
                      </td>
                    </tr>
                  );
                }) : placeholderAttempts.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-3">
                      <div className={`diamond flex items-center justify-center font-orbitron font-black text-black bg-gradient-to-br ${r.from} ${r.to}`}
                          style={{ width: 36, height: 36, fontSize: 10 }}
                        >
                          <span style={{ transform: 'rotate(-45deg)' }}>{r.initials}</span>
                        </div>
                        <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>{r.name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#d4d4d8' }}>{r.quiz}</td>
                    <td style={{ color: '#71717a' }}>{r.date}</td>
                    <td>
                      <span className="font-orbitron font-black" style={{ color: r.passed ? '#34d399' : '#f87171', textShadow: r.passed ? '0 0 12px rgba(52,211,153,.5)' : '0 0 12px rgba(248,113,113,.5)' }}>
                        {r.score}%
                      </span>
                    </td>
                    <td>
                      <span className="hud-badge" style={{ background: r.passed ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.1)', color: r.passed ? '#6ee7b7' : '#fca5a5', border: r.passed ? '1px solid rgba(52,211,153,.25)' : '1px solid rgba(239,68,68,.25)' }}>
                        {r.passed ? '✓ Passed' : '✕ Failed'}
                      </span>
                    </td>
                    <td><Eye className="w-4 h-4" style={{ color: '#52525b' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── FOOTER STRIP ── */}
        <div className="hex-divider" style={{ marginTop: 56, marginBottom: 24 }} />
        <div className="flex flex-wrap items-center justify-between gap-3 font-orbitron" style={{ fontSize: 10, letterSpacing: '0.3em', color: '#3f3f46', textTransform: 'uppercase' }}>
          <span>◤ QuizForge Command Center</span>
          <span className="flex items-center gap-2"><span className="pulse-dot" /> All Systems Operational</span>
          <span>Build 2.6.0 ◢</span>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboardPage;
