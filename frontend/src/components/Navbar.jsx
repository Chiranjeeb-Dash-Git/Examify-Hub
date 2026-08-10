import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Bell, LogOut, Shield, Award, BookOpen, LayoutDashboard, PlusCircle, BarChart3, Globe } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (location.pathname === '/' || location.pathname === '/login') return null;

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-40 px-6 py-4 w-full bg-black/60 backdrop-blur-md border-b border-white/10"
    >
      <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-7xl mx-auto border border-white/10 backdrop-blur-xl">
        {/* Left side: Brand Logo & Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <Globe className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-12" />
            <span className="text-white font-semibold text-lg tracking-tight">Examify Hub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-white/80 text-sm font-medium">
            {user && (
              <>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className={`transition-colors duration-300 hover:text-white flex items-center gap-1.5 ${
                    isActive(isAdmin ? "/admin" : "/dashboard") ? "text-white font-semibold" : "text-white/80"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <Link
                  to="/quizzes"
                  className={`transition-colors duration-300 hover:text-white flex items-center gap-1.5 ${
                    isActive("/quizzes") ? "text-white font-semibold" : "text-white/80"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Quizzes
                </Link>

                <Link
                  to="/leaderboard"
                  className={`transition-colors duration-300 hover:text-white flex items-center gap-1.5 ${
                    isActive("/leaderboard") ? "text-white font-semibold" : "text-white/80"
                  }`}
                >
                  <Award className="h-4 w-4" />
                  Leaderboard
                </Link>

                {!isAdmin && (
                  <Link
                    to="/history"
                    className={`transition-colors duration-300 hover:text-white flex items-center gap-1.5 ${
                      isActive("/history") ? "text-white font-semibold" : "text-white/80"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    History
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right side: Actions & User controls */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin/quizzes/new" className="hidden sm:block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    className="liquid-glass rounded-full px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity cursor-pointer border border-white/20 flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Create Quiz</span>
                  </motion.button>
                </Link>
              )}

              <button
                type="button"
                className="relative p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-white animate-pulse" />
              </button>

              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover border border-white/20"
                />
                <div className="hidden lg:flex flex-col">
                  <span className="text-xs font-medium text-white leading-tight">{user.name}</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1">
                    {isAdmin && <Shield className="h-2.5 w-2.5 text-white" />}
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="p-2 text-white/70 hover:text-red-400 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-white/80 transition-colors text-sm font-medium cursor-pointer"
              >
                Sign Up
              </Link>
              <Link to="/login">
                <button className="liquid-glass rounded-full px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity cursor-pointer border border-white/20">
                  Login
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};
