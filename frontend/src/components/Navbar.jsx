import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Zap, LayoutDashboard, BookOpen, FolderTree, Users,
  ListChecks, BarChart3, Trophy, Plus, ChevronDown, LogOut, Shield
} from 'lucide-react';

const initials = (n = '') => n.split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase();

export const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') return null;

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const studentLinks = [
    { to: '/dashboard',   label: 'Dashboard',   Icon: LayoutDashboard },
    { to: '/quizzes',     label: 'Quizzes',      Icon: BookOpen },
    { to: '/history',     label: 'History',      Icon: ListChecks },
    { to: '/leaderboard', label: 'Leaderboard',  Icon: Trophy },
  ];

  const adminLinks = [
    { to: '/admin',            label: 'Dashboard',   Icon: LayoutDashboard },
    { to: '/admin/quizzes',    label: 'Quizzes',      Icon: BookOpen },
    { to: '/admin/categories', label: 'Categories',   Icon: FolderTree },
    { to: '/admin/users',      label: 'Users',        Icon: Users },
    { to: '/admin/attempts',   label: 'Attempts',     Icon: ListChecks },
    { to: '/leaderboard',      label: 'Leaderboard',  Icon: Trophy },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <nav className="fixed top-0 w-full z-50 glass-strong border-x-0 border-t-0">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg hidden sm:block">
            Quiz<span className="grad-text">Forge</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-0.5 overflow-x-auto max-w-[55vw] md:max-w-none">
          {links.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link flex items-center gap-1.5 ${isActive(to) ? 'nav-active' : ''}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          ))}
        </div>

        {/* User pill */}
        {user ? (
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <Link to="/admin/quizzes/new">
                <button className="btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 hidden sm:flex">
                  <Plus className="w-4 h-4" /> New Quiz
                </button>
              </Link>
            )}
            <div className="flex items-center gap-2 btn-ghost rounded-full pl-1 pr-3 py-1">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold shrink-0">
                {initials(user.name)}
              </span>
              <span className="hidden md:block text-sm font-semibold max-w-[100px] truncate">{user.name?.split(' ')[0]}</span>
              {isAdmin && <Shield className="w-3 h-3 text-indigo-300 shrink-0" />}
            </div>
            <button
              onClick={async () => { await logout(); navigate('/login'); }}
              className="p-2 text-zinc-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="btn-primary px-5 py-2 rounded-xl text-sm font-bold text-white">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
