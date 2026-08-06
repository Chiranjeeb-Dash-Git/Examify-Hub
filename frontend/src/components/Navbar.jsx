import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Bell, User, LogOut, Shield, Award, BookOpen, LayoutDashboard, PlusCircle, BarChart3 } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (location.pathname === '/' || location.pathname === '/login') return null;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#050505]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-2.5 w-2.5 bg-white rounded-none transition-transform duration-500 group-hover:rotate-45" />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-sm tracking-[0.2em] text-white uppercase">
                EXAMIFY HUB
              </span>
              <span className="font-mono text-[10px] text-white/40 tracking-wider uppercase -mt-0.5">
                v2.4 TELEMETRY
              </span>
            </div>
          </Link>

          {/* Main Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider">
            {user && (
              <>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                    isActive(isAdmin ? "/admin" : "/dashboard")
                      ? "bg-white/10 text-white border border-white/20 font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 text-white" />
                  Dashboard
                </Link>

                <Link
                  to="/quizzes"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                    isActive("/quizzes")
                      ? "bg-white/10 text-white border border-white/20 font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <BookOpen className="h-4 w-4 text-white" />
                  Quizzes
                </Link>

                <Link
                  to="/leaderboard"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                    isActive("/leaderboard")
                      ? "bg-white/10 text-white border border-white/20 font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Award className="h-4 w-4 text-white" />
                  Leaderboard
                </Link>

                {!isAdmin && (
                  <Link
                    to="/history"
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                      isActive("/history")
                        ? "bg-white/10 text-white border border-white/20 font-bold"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 text-white" />
                    History
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin/analytics"
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                      isActive("/admin/analytics")
                        ? "bg-white/10 text-white border border-white/20 font-bold"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 text-white" />
                    Analytics
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin/quizzes/new"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/90 shadow-lg shadow-white/10 transition-all"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Quiz
                </Link>
              )}

              {/* Notification Icon */}
              <button
                type="button"
                className="relative p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              {/* User Pill & Role Indicator */}
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover border border-white/20"
                />
                <div className="hidden lg:flex flex-col">
                  <span className="text-sm font-semibold text-white leading-tight">{user.name}</span>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1">
                    {isAdmin ? <Shield className="h-3 w-3 inline text-emerald-400" /> : null}
                    {user.role}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="p-2 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-white/60 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-all shadow-lg shadow-white/10"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
