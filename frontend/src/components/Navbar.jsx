import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Bell, User, LogOut, Shield, Award, BookOpen, LayoutDashboard, PlusCircle, BarChart3 } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#10141a]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0056d2] shadow-lg shadow-[#38BDF8]/20 group-hover:scale-105 transition-transform duration-300">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#38BDF8] transition-colors">
                Aetheris
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#38BDF8] uppercase -mt-1">
                Assessment
              </span>
            </div>
          </Link>

          {/* Main Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {user && (
              <>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(isAdmin ? "/admin" : "/dashboard")
                      ? "bg-[#262a31] text-[#38BDF8] border border-[#38BDF8]/30"
                      : "text-[#bdc8d2] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <Link
                  to="/quizzes"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/quizzes")
                      ? "bg-[#262a31] text-[#38BDF8] border border-[#38BDF8]/30"
                      : "text-[#bdc8d2] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Quizzes
                </Link>

                <Link
                  to="/leaderboard"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/leaderboard")
                      ? "bg-[#262a31] text-[#38BDF8] border border-[#38BDF8]/30"
                      : "text-[#bdc8d2] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Award className="h-4 w-4" />
                  Leaderboard
                </Link>

                {!isAdmin && (
                  <Link
                    to="/history"
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive("/history")
                        ? "bg-[#262a31] text-[#38BDF8] border border-[#38BDF8]/30"
                        : "text-[#bdc8d2] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    History
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin/analytics"
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive("/admin/analytics")
                        ? "bg-[#262a31] text-[#38BDF8] border border-[#38BDF8]/30"
                        : "text-[#bdc8d2] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
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
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#38BDF8] text-[#10141a] font-semibold text-sm hover:bg-[#38BDF8]/90 shadow-md shadow-[#38BDF8]/20 transition-all"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Quiz
                </Link>
              )}

              {/* Notification Icon */}
              <button
                type="button"
                className="relative p-2 rounded-lg text-[#bdc8d2] hover:text-white hover:bg-white/5 transition-colors"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#38BDF8] animate-pulse" />
              </button>

              {/* User Pill & Role Indicator */}
              <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover border border-[#38BDF8]/40"
                />
                <div className="hidden lg:flex flex-col">
                  <span className="text-sm font-semibold text-white leading-tight">{user.name}</span>
                  <span className="text-[11px] font-mono text-[#38BDF8] flex items-center gap-1">
                    {isAdmin ? <Shield className="h-3 w-3 inline text-[#6be026]" /> : null}
                    {user.role}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="p-2 rounded-lg text-[#bdc8d2] hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#bdc8d2] hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#38BDF8] text-[#10141a] hover:bg-[#38BDF8]/90 transition-all shadow-lg shadow-[#38BDF8]/20"
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
