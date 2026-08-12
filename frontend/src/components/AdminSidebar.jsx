import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, BookOpen, Layers, PlusCircle,
  Zap, ChevronRight, LogOut, Shield, ListChecks
} from 'lucide-react';

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isActive = (path) => location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
  const initials = (n = '') => n.split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase();

  const navItems = [
    { path: '/admin',            label: 'Platform Analytics', icon: LayoutDashboard },
    { path: '/admin/quizzes',    label: 'Quiz Management',    icon: BookOpen },
    { path: '/admin/users',      label: 'Student Management', icon: Users },
    { path: '/admin/categories', label: 'Categories',         icon: Layers },
    { path: '/admin/attempts',   label: 'Attempts',           icon: ListChecks },
  ];

  return (
    <aside
      className="metal shrink-0 hidden md:flex flex-col justify-between"
      style={{
        width: 260,
        minHeight: 'calc(100vh - 70px)',
        padding: 24,
        borderTop: 0,
        borderLeft: 0,
        borderBottom: 0,
        position: 'sticky',
        top: 70,
      }}
    >
      {/* top section */}
      <div>
        {/* header */}
        <div style={{ paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
            <Shield className="w-3.5 h-3.5" style={{ color: '#22d3ee' }} />
            <span className="font-orbitron" style={{ fontSize: 9, letterSpacing: '0.3em', color: '#71717a', textTransform: 'uppercase' }}>Admin Gateway</span>
          </div>
          <div className="font-orbitron font-black" style={{ fontSize: 16, letterSpacing: '0.05em' }}>
            <span className="chrome-text">QUIZ</span><span className="grad-neon">FORGE</span>
          </div>
          <div className="font-orbitron" style={{ fontSize: 9, letterSpacing: '0.3em', color: '#52525b', marginTop: 4 }}>COMMAND CENTER</div>
        </div>

        {/* nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link key={path} to={path} style={{ textDecoration: 'none' }}>
                <div
                  className={`clip-hud-sm flex items-center gap-3 transition-all`}
                  style={{
                    padding: '10px 14px',
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: 10,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    color: active ? '#22d3ee' : '#71717a',
                    background: active ? 'rgba(34,211,238,.08)' : 'transparent',
                    textShadow: active ? '0 0 10px rgba(34,211,238,.6)' : 'none',
                    borderLeft: active ? '2px solid #22d3ee' : '2px solid transparent',
                    transition: 'all .25s',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,.04)'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#71717a'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  <Icon style={{ width: 14, height: 14, flexShrink: 0, color: active ? '#22d3ee' : '#52525b' }} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {active && <ChevronRight style={{ width: 10, height: 10 }} />}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* bottom section */}
      <div style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,.07)' }}>
        {/* user pill */}
        <div className="flex items-center gap-3 clip-hud-sm" style={{ padding: '10px 12px', marginBottom: 12, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
          <div
            className="diamond flex items-center justify-center font-orbitron font-black text-black"
            style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#22d3ee,#7c3aed)', fontSize: 9, flexShrink: 0 }}
          >
            <span style={{ transform: 'rotate(-45deg)' }}>{user ? initials(user.name) : 'AD'}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-orbitron" style={{ fontSize: 10, letterSpacing: '0.1em', color: '#e4e4e7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name?.toUpperCase() || 'ADMIN'}
            </div>
            <div className="font-orbitron text-neon-cyan" style={{ fontSize: 8, letterSpacing: '0.2em' }}>ADMINISTRATOR</div>
          </div>
        </div>

        {/* Create quiz CTA */}
        <Link to="/admin/quizzes/new" style={{ textDecoration: 'none' }}>
          <button className="btn-neon clip-hud-sm w-full font-orbitron font-bold flex items-center justify-center gap-2"
            style={{ padding: '11px 16px', fontSize: 10, letterSpacing: '0.2em', color: '#fff', width: '100%', cursor: 'pointer', marginBottom: 8 }}>
            <PlusCircle style={{ width: 14, height: 14 }} />
            CREATE NEW QUIZ
          </button>
        </Link>

        {/* logout */}
        <button
          onClick={async () => { await logout(); navigate('/login'); }}
          className="btn-steel clip-hud-sm w-full font-orbitron flex items-center justify-center gap-2"
          style={{ padding: '8px 16px', fontSize: 10, letterSpacing: '0.15em', color: '#71717a', width: '100%', cursor: 'pointer' }}
        >
          <LogOut style={{ width: 12, height: 12 }} />
          SIGN OUT
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
