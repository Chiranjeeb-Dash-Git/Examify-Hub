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
  Plus, BarChart3, Bell, ChevronDown,
  Zap, Flame, PieChart, LogOut, Cpu, Activity, Pencil, Quote,
} from 'lucide-react';
import { CursorTrackingRobot } from '../../components/CursorTrackingRobot';

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
    <div ref={cardRef} style={{ opacity: 0 }}>
      <TiltCard className="metal clip-hud px-2.5 py-2 w-full h-full" maxDeg={5}>
        <div className="pop">
          <div className="flex items-start justify-between gap-1.5 mb-1.5">
            <div className={`w-7 h-7 diamond ${color.bg} border ${color.border} flex items-center justify-center shrink-0`}>
              <Icon className={`w-3 h-3 ${color.icon}`} style={{ transform: 'rotate(-45deg)' }} />
            </div>
            <div className={`text-[8px] font-bold flex items-center gap-0.5 text-right leading-tight ${up === true ? 'text-emerald-400' : up === false ? 'text-red-400' : 'text-zinc-500'}`}>
              {up === true && <TrendingUp className="w-2 h-2" />}
              {up === false && <TrendingDown className="w-2 h-2" />}
              <span>{trend}</span>
            </div>
          </div>
          <div className="font-orbitron text-lg font-black text-white leading-tight">
            <span ref={countRef}>0</span>{suf && <span className="text-[11px] text-zinc-500 ml-0.5">{suf}</span>}
          </div>
          <div className="font-orbitron text-[7px] tracking-[.18em] text-zinc-500 uppercase mt-0.5 leading-tight">{label}</div>
          <div className="micro-bar mt-1" style={{ height: 3 }}>
            <div ref={barRef} className={`micro-fill ${barColor}`} style={{ width: barW }} />
          </div>
        </div>
      </TiltCard>
    </div>
  );
}

/* ── Animated typewriter hook ── */
function useTypewriter(text, { speed = 28, startDelay = 500, loopDelay = 3500, loop = true } = {}) {
  const [out, setOut] = useState('');
  const [phase, setPhase] = useState('idle');
  const idxRef = useRef(0);
  const tRef = useRef(null);
  const loopRef = useRef(loop);
  useEffect(() => {
    loopRef.current = loop;
    setOut('');
    idxRef.current = 0;
    setPhase('waiting');
    const start = setTimeout(() => {
      setPhase('typing');
      const tick = () => {
        idxRef.current++;
        if (idxRef.current <= text.length) {
          setOut(text.slice(0, idxRef.current));
          const ch = text[idxRef.current - 1] || '';
          const variance = /[.?!,\n]/.test(ch) ? speed * 4 : /\s/.test(ch) ? speed * 0.4 : speed;
          tRef.current = setTimeout(tick, variance + (Math.random() * speed * 0.5));
        } else {
          setPhase('paused');
          if (loopRef.current) {
            tRef.current = setTimeout(() => {
              setPhase('deleting');
              const del = () => {
                idxRef.current = Math.max(0, idxRef.current - 1);
                setOut(text.slice(0, idxRef.current));
                if (idxRef.current === 0) {
                  setPhase('waiting');
                  tRef.current = setTimeout(() => { setPhase('typing'); tick(); }, startDelay * 0.6);
                } else {
                  tRef.current = setTimeout(del, speed * 0.35);
                }
              };
              del();
            }, loopDelay);
          }
        }
      };
      tick();
    }, startDelay);
    return () => { clearTimeout(start); clearTimeout(tRef.current); };
  }, [text, speed, startDelay, loopDelay]);
  return { text: out, phase };
}

/* ══════════════════ MAIN COMPONENT ══════════════════ */
export const AdminDashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [metrics, setMetrics] = useState(null);
  const [allAttempts, setAllAttempts] = useState([]);
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const aboutText = `Examify Hub is a next-generation online assessment platform designed to reimagine how organizations, educators, and institutions measure learning outcomes. We blend intelligent automation with a polished, user-centric experience so that every exam feels rigorous yet effortless, and every result carries a clear path toward growth.

Our platform empowers exam creators to design comprehensive assessments in minutes, while giving learners the fair, focused, and supportive environment they need to perform at their best. With built-in proctor intelligence, performance analytics that surface the real story behind every score, and a modern experience crafted for engagement, Examify Hub raises the standard for what an assessment platform can deliver — today, and for the next wave of digital learning.

Examify Hub isn't just about running exams. It's about building trust in evaluation, unlocking potential, and turning every assessment into a stepping stone toward measurable outcomes that matter.`;

  const typed = useTypewriter(aboutText, { speed: 22, startDelay: 700, loopDelay: 4500, loop: true });

  const chTime = useRef(null);
  const chPf   = useRef(null);
  const chPop  = useRef(null);
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
      <main style={{ position: 'relative', zIndex: 10, paddingTop: 88, paddingBottom: 40, paddingLeft: 20, paddingRight: 20, maxWidth: 1680, margin: '0 auto', perspective: 1600 }}>

        {/* ═══════════ TWO COLUMN LAYOUT ═══════════ */}
        <div className="grid gap-0" style={{ gridTemplateColumns: 'minmax(180px, 190px) minmax(0, 1fr)', alignItems: 'start', columnGap: 12 }}>

          {/* ═══ LEFT COLUMN: STAT TELEMETRY SIDEBAR ═══ */}
          <aside className="space-y-1 sticky" style={{ top: 80 }}>

            {/* Sidebar header label */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, transparent, rgba(34,211,238,.6))' }} />
              <span className="font-orbitron text-[7.5px] tracking-[.4em] uppercase text-neon-cyan whitespace-nowrap">Sys Telemetry</span>
            </div>

            {/* Stat cards stacked compact */}
            <div className="space-y-1">
              {statCards.map((card, i) => (
                <StatCard key={i} {...card} revealDelay={i * 0.04} />
              ))}
            </div>

            {/* Sidebar footer strip */}
            <div className="mt-1.5 pt-0.5" style={{ opacity: 0 }}>
              <TiltCard className="metal clip-hud px-2 py-1.5 w-full text-center" maxDeg={5}>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="pulse-dot bg-emerald-400" style={{ width: 5, height: 5 }} />
                    <span className="font-orbitron text-[7px] tracking-[.35em] uppercase text-zinc-400">Uplink Stable</span>
                  </div>
                  <div className="font-orbitron text-[8.5px] tracking-widest text-zinc-500">NODE-01 · {new Date().toLocaleTimeString('en-US', { hour12: false })}</div>
                </div>
              </TiltCard>
            </div>

          </aside>

          {/* ═══ RIGHT COLUMN: COMMAND CENTER + ANALYTICS ═══ */}
          <section className="min-w-0 space-y-2">

            {/* ── HERO HEADER ── */}
            <header style={{ position: 'relative' }}>

              <div className="flex items-center gap-4 mb-1">
                <div style={{ height: 1, width: 56, background: 'linear-gradient(90deg, #22d3ee, transparent)' }} />
                <span className="font-orbitron text-neon-cyan uppercase" style={{ fontSize: 11, letterSpacing: '0.5em' }}>Admin Control Panel</span>
                <span className="pulse-dot" />
              </div>

              <div className="flex flex-wrap items-end justify-between gap-3 pt-1">
                <div>
                  <h1 className="font-orbitron font-black leading-none mb-1" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 2.7rem)', letterSpacing: '-0.02em' }}>
                    <span className="chrome-text">COMMAND</span>{' '}
                    <span className="grad-neon" style={{ filter: 'drop-shadow(0 0 24px rgba(168,85,247,.5))' }}>CENTER</span>
                  </h1>
                  <p style={{ color: '#a1a1aa', fontSize: 13.5, letterSpacing: '0.04em' }}>
                    Full platform oversight · <span style={{ color: '#e4e4e7', fontWeight: 600 }}>{today}</span> · Region{' '}
                    <span className="text-neon-cyan font-bold">AP-SOUTH</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link to="/admin/quizzes/new">
                    <button className="btn-neon clip-hud-sm flex items-center gap-2 font-orbitron font-bold text-white"
                      style={{ padding: '9px 22px', fontSize: 11, letterSpacing: '0.2em' }}>
                      <Plus className="w-3.5 h-3.5" /> NEW QUIZ
                    </button>
                  </Link>
                </div>
              </div>
            </header>

            <div className="hex-divider" style={{ marginBottom: 0, marginTop: 2 }} />

            {/* ── PRIMARY CHART: ATTEMPTS OVER TIME (FULL WIDTH) — compact ── */}
            <div className="chart-panel" style={{ opacity: 0 }}>
              <TiltCard className="metal clip-hud px-3 py-2.5 w-full" maxDeg={3}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-orbitron font-bold flex items-center gap-1.5" style={{ fontSize: 11, letterSpacing: '0.15em' }}>
                    <TrendingUp className="w-3 h-3 text-neon-cyan" />
                    <span style={{ color: '#fff' }}>ATTEMPTS OVER TIME</span>
                  </h3>
                  <span className="hud-badge" style={{ padding: '2px 7px', fontSize: 8.5, background: 'rgba(34,211,238,.1)', color: '#67e8f9', border: '1px solid rgba(34,211,238,.25)' }}>◉ Live Feed</span>
                </div>
                <div style={{ height: 190 }}><canvas ref={chTime} /></div>
              </TiltCard>
            </div>

            {/* ── SECOND ROW: PASS/FAIL + POPULAR QUIZZES + AI CO-PILOT ROBOT (3 cols edge-to-edge) ── */}
            <div className="grid gap-0" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(180px, 228px)', alignItems: 'stretch', columnGap: 12 }}>

              {/* Pass/Fail ratio */}
              <div className="chart-panel" style={{ opacity: 0 }}>
                <TiltCard className="metal clip-hud px-3 py-2.5 w-full h-full" maxDeg={3}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-orbitron font-bold flex items-center gap-1.5" style={{ fontSize: 11, letterSpacing: '0.15em' }}>
                      <PieChart className="w-3 h-3 text-neon-violet" />
                      <span style={{ color: '#fff' }}>PASS / FAIL RATIO</span>
                    </h3>
                    <span className="hud-badge" style={{ padding: '2px 7px', fontSize: 8.5, background: 'rgba(16,185,129,.1)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,.25)' }}>{passRate}% Pass</span>
                  </div>
                  <div style={{ height: 200 }}><canvas ref={chPf} /></div>
                </TiltCard>
              </div>

              {/* Popular quizzes */}
              <div className="chart-panel" style={{ opacity: 0 }}>
                <TiltCard className="metal clip-hud px-3 py-2.5 w-full h-full" maxDeg={3}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-orbitron font-bold flex items-center gap-1.5" style={{ fontSize: 11, letterSpacing: '0.15em' }}>
                      <Flame className="w-3 h-3 text-neon-gold" />
                      <span style={{ color: '#fff' }}>MOST POPULAR QUIZZES</span>
                    </h3>
                    <span className="hud-badge" style={{ padding: '2px 7px', fontSize: 8.5, background: 'rgba(245,158,11,.1)', color: '#fcd34d', border: '1px solid rgba(251,191,36,.25)' }}>Top 5</span>
                  </div>
                  <div style={{ height: 200 }}><canvas ref={chPop} /></div>
                </TiltCard>
              </div>

              {/* Robot companion panel (3rd column, same row — no empty space) */}
              <div className="chart-panel relative" style={{ opacity: 0 }}>
                <TiltCard className="metal clip-hud w-full h-full" maxDeg={2} style={{ padding: '7px 5px 8px' }}>
                  <div className="w-full h-full flex flex-col items-center justify-start">
                    <div className="w-full flex items-center justify-between px-1 mb-0">
                      <h3 className="font-orbitron font-bold flex items-center gap-1" style={{ fontSize: 8.5, letterSpacing: '0.2em' }}>
                        <Cpu className="w-2.5 h-2.5 text-neon-cyan" />
                        <span style={{ color: '#fff' }}>AI CO-PILOT</span>
                      </h3>
                      <span className="hud-badge flex items-center gap-0.5" style={{ padding: '1.5px 5px', background: 'rgba(168,85,247,.1)', color: '#c4b5fd', border: '1px solid rgba(168,85,247,.25)', fontSize: 7 }}>
                        <Activity className="w-1.5 h-1.5 animate-pulse" /> LIVE
                      </span>
                    </div>
                    <div className="flex items-center justify-center flex-1" style={{ marginTop: -3 }}>
                      <CursorTrackingRobot size={200} />
                    </div>
                    <div className="mt-0 w-full px-1 grid grid-cols-3 gap-0.5">
                      <div className="text-center rounded-md bg-black/30 border border-white/5 py-0.5 px-0">
                        <div className="font-orbitron text-[7px] tracking-widest text-zinc-500 uppercase">Mode</div>
                        <div className="font-orbitron text-[8.5px] font-black text-cyan-300">AWARE</div>
                      </div>
                      <div className="text-center rounded-md bg-black/30 border border-white/5 py-0.5 px-0">
                        <div className="font-orbitron text-[7px] tracking-widest text-zinc-500 uppercase">Sync</div>
                        <div className="font-orbitron text-[8.5px] font-black text-fuchsia-300">98%</div>
                      </div>
                      <div className="text-center rounded-md bg-black/30 border border-white/5 py-0.5 px-0">
                        <div className="font-orbitron text-[7px] tracking-widest text-zinc-500 uppercase">Visor</div>
                        <div className="font-orbitron text-[8.5px] font-black text-amber-300">ON</div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>

            </div>

            {/* ── ABOUT / PROJECT STORY (clean industry-style with animated writing + pen) ── */}
            <div style={{ marginTop: 14, opacity: 0 }} className="chart-panel">
              <div className="relative">
                <style>{`
                  @keyframes pen-write-bob {
                    0%, 100% { transform: translate(0, 0) rotate(-18deg); }
                    45% { transform: translate(0, -1px) rotate(-14deg); }
                    55% { transform: translate(0.5px, 1px) rotate(-20deg); }
                  }
                  @keyframes pen-tap {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 1; }
                  }
                  @keyframes caret-blink {
                    0%, 49% { opacity: 1; }
                    50%, 100% { opacity: 0; }
                  }
                  @keyframes accent-line {
                    0% { transform: scaleX(0); transform-origin: left; }
                    100% { transform: scaleX(1); transform-origin: left; }
                  }
                  .pen-writing { animation: pen-write-bob 0.55s ease-in-out infinite; transform-origin: 20% 80%; }
                  .pen-tap     { animation: pen-tap 1.1s ease-in-out infinite; }
                  .caret-blink { animation: caret-blink 0.95s steps(2,end) infinite; }
                  .about-accent-line {
                    height: 2px;
                    background: linear-gradient(90deg, #22d3ee 0%, #a855f7 60%, transparent 100%);
                    transform-origin: left;
                    animation: accent-line 1.4s cubic-bezier(.22,.61,.36,1) 0.2s both;
                  }
                `}</style>

                {/* Header row */}
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg, rgba(34,211,238,.14), rgba(168,85,247,.14))', border: '1px solid rgba(34,211,238,.22)' }}>
                      <Quote className="w-4 h-4 text-cyan-300" />
                    </div>
                    <div>
                      <div className="font-orbitron uppercase tracking-[.32em] text-zinc-500" style={{ fontSize: 9.5 }}>About the Platform</div>
                      <div className="font-orbitron font-black text-white uppercase tracking-[.14em]" style={{ fontSize: 16 }}>
                        <span className="text-neon-cyan">EXAMIFY</span> · <span className="text-neon-violet">HUB</span>
                      </div>
                    </div>
                  </div>

                  {/* Animated pen (top-right) */}
                  <div className="hidden sm:flex items-center gap-2 pr-1" style={{ pointerEvents: 'none' }}>
                    <div className="relative">
                      <div className={`${typed.phase === 'typing' ? 'pen-writing' : 'pen-tap'}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 6px 10px rgba(168,85,247,.35))' }}>
                        <div
                          className="diamond"
                          style={{
                            width: 30,
                            height: 30,
                            background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 60%, #ec4899 100%)',
                            border: '1px solid rgba(255,255,255,.2)',
                          }}
                        >
                          <Pencil className="w-4 h-4 text-white" style={{ transform: 'rotate(-45deg)' }} />
                        </div>
                      </div>
                      {/* Pen tip mini dot */}
                      <div
                        className={`absolute rounded-full ${typed.phase === 'typing' ? 'pen-tap' : ''}`}
                        style={{
                          width: 4, height: 4, background: '#22d3ee',
                          bottom: -2, left: -4,
                          boxShadow: '0 0 8px #22d3ee',
                        }}
                      />
                    </div>
                    <div className="text-right leading-tight">
                      <div className="font-orbitron uppercase tracking-[.3em] text-zinc-500" style={{ fontSize: 8 }}>Currently Writing</div>
                      <div className="font-orbitron font-black text-neon-cyan" style={{ fontSize: 12 }}>
                        {typed.phase === 'typing' && '… crafting the story'}
                        {typed.phase === 'paused' && '✓ Full narrative loaded'}
                        {typed.phase === 'deleting' && '↻ Rewinding'}
                        {typed.phase === 'waiting' && '● Standby'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="about-accent-line mb-4" />

                {/* Paragraph with smooth writing effect */}
                <div
                  className="relative"
                  style={{
                    padding: '8px 4px 10px 10px',
                    fontSize: 14.5,
                    lineHeight: 1.85,
                    color: '#cbd5e1',
                    fontWeight: 500,
                    letterSpacing: 0.2,
                  }}
                >
                  {typed.text.split('\n').map((para, i, arr) => (
                    <React.Fragment key={i}>
                      <p style={{ textIndent: '1.4em', margin: 0 }}>
                        {para}
                        {i === arr.length - 1 && typed.phase === 'typing' && (
                          <span
                            aria-hidden
                            className="caret-blink inline-block align-middle"
                            style={{
                              width: 2,
                              height: '1.05em',
                              marginLeft: 3,
                              marginBottom: 2,
                              background: 'linear-gradient(180deg, #22d3ee, #a855f7)',
                              boxShadow: '0 0 8px rgba(34,211,238,.7)',
                            }}
                          />
                        )}
                      </p>
                      {i < arr.length - 1 && <div style={{ height: 10 }} />}
                    </React.Fragment>
                  ))}

                  {/* Pen icon repositioned next to end of paragraph when writing (inline follow pen) */}
                  <span className="inline-block align-middle ml-1 sm:hidden">
                    <Pencil className={`w-3.5 h-3.5 text-cyan-300 ${typed.phase === 'typing' ? 'pen-writing' : 'pen-tap'}`} />
                  </span>
                </div>

                {/* Bottom signature + progress */}
                <div className="mt-2 flex items-end justify-between gap-3 flex-wrap">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg, rgba(34,211,238,.8), transparent)' }} />
                    <div className="font-orbitron" style={{ fontSize: 10.5, letterSpacing: '.18em', color: '#a1a1aa' }}>
                      <span style={{ color: '#e4e4e7', fontWeight: 800 }}>Product Narrative</span> · v2.6 Release
                    </div>
                  </div>

                  {/* Progress meter */}
                  <div className="flex items-center gap-2" style={{ minWidth: 180 }}>
                    <div className="font-orbitron text-zinc-500" style={{ fontSize: 9, letterSpacing: '.3em' }}>WRITE</div>
                    <div className="flex-1 relative rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,.05)' }}>
                      <div
                        className="rounded-full"
                        style={{
                          width: `${Math.round((typed.text.length / Math.max(1, aboutText.length)) * 100)}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #22d3ee, #a855f7, #ec4899)',
                          boxShadow: '0 0 10px rgba(34,211,238,.5)',
                          transition: 'width 120ms linear',
                        }}
                      />
                    </div>
                    <div className="font-orbitron text-zinc-300 font-black" style={{ fontSize: 9.5, minWidth: 32, textAlign: 'right' }}>
                      {Math.round((typed.text.length / Math.max(1, aboutText.length)) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </section>
        </div>

        {/* ── FOOTER STRIP ── */}
        <div className="hex-divider" style={{ marginTop: 14, marginBottom: 8 }} />
        <div className="flex flex-wrap items-center justify-between gap-3 font-orbitron" style={{ fontSize: 9, letterSpacing: '0.3em', color: '#3f3f46', textTransform: 'uppercase' }}>
          <span>◤ QuizForge Command Center</span>
          <span className="flex items-center gap-2"><span className="pulse-dot" /> All Systems Operational</span>
          <span>Build 2.6.0 ◢</span>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboardPage;
