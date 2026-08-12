import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Bell, ChevronDown, LogOut } from 'lucide-react';

/**
 * HudAdminLayout — wraps all admin pages with the Command Center HUD ambient
 * layers, fixed navbar, and dark metallic background. No sidebar.
 */
export const HudAdminLayout = ({ children, activeNav }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) =>
    path === activeNav ||
    location.pathname === path ||
    (path !== '/admin' && location.pathname.startsWith(path));

  const initials = (n = '') =>
    n.split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase();

  const navLinks = [
    { to: '/admin',            label: 'Dashboard'    },
    { to: '/admin/quizzes',    label: 'Quizzes'      },
    { to: '/admin/categories', label: 'Categories'   },
    { to: '/admin/users',      label: 'Users'        },
    { to: '/admin/attempts',   label: 'Attempts'     },
    { to: '/admin/leaderboard',label: 'Leaderboard'  },
  ];

  return (
    <div
      className="hud-root"
      style={{ background: '#030304', minHeight: '100vh', fontFamily: "'Rajdhani', sans-serif", color: '#e4e4e7', overflowX: 'hidden' }}
    >
      {/* Ambient Layers */}
      <div className="hud-grid-floor" />
      <div className="hud-aurora" />
      <div className="hud-beam" style={{ left: '20%' }} />
      <div className="hud-beam" style={{ left: '75%', animationDelay: '-3.5s', background: 'linear-gradient(180deg,transparent,rgba(168,85,247,.45),transparent)' }} />
      <div className="hud-scanlines" />
      <div className="hud-vignette" />

      {/* HUD Navbar */}
      <nav className="fixed top-0 w-full z-50 metal" style={{ position: 'fixed', clipPath: 'none', borderLeft: 0, borderRight: 0, borderTop: 0 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

          <Link to="/admin" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
            <div className="diamond glow-cyan flex items-center justify-center"
              style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#22d3ee,#a855f7,#f472b6)' }}>
              <Zap className="w-5 h-5 text-black" style={{ transform: 'rotate(-45deg)' }} />
            </div>
            <div>
              <div className="font-orbitron font-black text-lg tracking-widest leading-none">
                <span className="chrome-text">QUIZ</span><span className="grad-neon">FORGE</span>
              </div>
              <div className="font-orbitron mt-1" style={{ fontSize: 9, letterSpacing: '0.4em', color: '#71717a' }}>ADMIN OS v2.6</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1.5">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                <button className={`nav-pill ${isActive(to) ? 'nav-on' : ''}`}>{label}</button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 hud-badge"
              style={{ background: 'rgba(16,185,129,.1)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,.2)' }}>
              <span className="pulse-dot" />Systems Online
            </div>
            <button className="relative clip-hud-sm metal flex items-center justify-center text-zinc-400 hover:text-cyan-300 transition-colors"
              style={{ width: 40, height: 40 }}>
              <Bell className="w-4 h-4" />
              <span className="absolute rounded-full bg-cyan-400"
                style={{ top: 8, right: 10, width: 6, height: 6, boxShadow: '0 0 8px #22d3ee' }} />
            </button>
            <div className="flex items-center gap-2.5 btn-steel clip-hud-sm px-3 py-1.5">
              <div className="diamond flex items-center justify-center font-orbitron font-black text-black"
                style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#22d3ee,#7c3aed)', fontSize: 10 }}>
                <span style={{ transform: 'rotate(-45deg)' }}>{user ? initials(user.name) : 'AD'}</span>
              </div>
              <span className="hidden md:block text-sm font-bold tracking-wide">
                {user?.name?.split(' ')[0]?.toUpperCase() || 'ADMIN'}
              </span>
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

      {/* Page body */}
      <div style={{ paddingTop: 70 }}>
        {/* Main content */}
        <main style={{ position: 'relative', zIndex: 10, padding: '32px 20px', maxWidth: 1400, margin: '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default HudAdminLayout;
