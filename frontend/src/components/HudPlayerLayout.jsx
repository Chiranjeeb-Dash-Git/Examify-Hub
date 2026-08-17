import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Bell, ChevronDown, LogOut } from 'lucide-react';

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

export const HudPlayerLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
  const initials = (n = '') => n.split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase();

  const playerNavLinks = [
    { to: '/dashboard',   label: 'Dashboard' },
    { to: '/quizzes',     label: 'Quizzes' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/history',     label: 'My Attempts' },
  ];

  return (
    <div
      className="hud-root"
      style={{ background: '#030304', minHeight: '100vh', fontFamily: "'Rajdhani', sans-serif", color: '#e4e4e7', overflowX: 'hidden' }}
    >
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
          <Link to="/dashboard" className="flex items-center gap-3 cursor-pointer group" style={{ textDecoration: 'none' }}>
            <div className="diamond glow-orange flex items-center justify-center"
              style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#fb923c,#f97316,#ef4444)', transition: 'transform .5s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'rotate(135deg) scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'rotate(45deg)'}
            >
              <Zap className="w-5 h-5 text-black" style={{ transform: 'rotate(-45deg)' }} />
            </div>
            <div>
              <div className="font-orbitron font-black text-lg tracking-widest leading-none">
                <span className="chrome-text">QUIZ</span><span className="grad-orange">FORGE</span>
              </div>
              <div className="font-orbitron mt-1" style={{ fontSize: 9, letterSpacing: '0.4em', color: '#71717a' }}>PLAYER CONSOLE</div>
            </div>
          </Link>

          {/* Nav Pills */}
          <div className="hidden lg:flex items-center gap-1.5">
            {playerNavLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                <button className={`nav-pill ${isActive(to) ? 'nav-on' : ''}`}>{label}</button>
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 hud-badge" style={{ background: 'rgba(16,185,129,.1)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,.2)' }}>
              <span className="pulse-dot" />
              Arena Open
            </div>
            <div className="flex items-center gap-2.5 btn-steel clip-hud-sm px-3 py-1.5">
              <div className="diamond flex items-center justify-center font-orbitron font-black text-black" style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#fb923c,#ea580c)', fontSize: 10 }}>
                <span style={{ transform: 'rotate(-45deg)' }}>{user ? initials(user.name) : 'ST'}</span>
              </div>
              <span className="hidden md:block text-sm font-bold tracking-wide">{user?.name?.split(' ')[0]?.toUpperCase() || 'STUDENT'}</span>
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
        {children}

        {/* ── FOOTER STRIP ── */}
        <div className="hex-divider" style={{ marginTop: 56, marginBottom: 24 }} />
        <div className="flex flex-wrap items-center justify-between gap-3 font-orbitron" style={{ fontSize: 10, letterSpacing: '0.3em', color: '#3f3f46', textTransform: 'uppercase' }}>
          <span>◤ QuizForge Player Console</span>
          <span className="flex items-center gap-2"><span className="pulse-dot" /> Arena Operational</span>
          <span>Build 2.6.0 ◢</span>
        </div>
      </main>
    </div>
  );
};

export default HudPlayerLayout;
