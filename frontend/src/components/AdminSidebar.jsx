import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Layers, BarChart3, Settings, Shield, PlusCircle } from 'lucide-react';

export const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 glass-panel border-r border-white/10 p-6 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)] bg-[#050505]/80">
      <div className="space-y-6">
        {/* Command Center Title */}
        <div className="border-b border-white/10 pb-4">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            COMMAND CENTER
          </span>
          <h2 className="text-xl font-extrabold text-white mt-1 font-display">Elite Tier Admin</h2>
        </div>

        {/* Navigation Group */}
        <nav className="space-y-1.5 font-mono text-xs uppercase tracking-wider">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              isActive("/admin")
                ? "bg-white text-black font-bold shadow-lg shadow-white/10"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Platform Analytics
          </Link>

          <Link
            to="/admin/quizzes"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              isActive("/admin/quizzes")
                ? "bg-white text-black font-bold shadow-lg shadow-white/10"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Quiz Management
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              isActive("/admin/users")
                ? "bg-white text-black font-bold shadow-lg shadow-white/10"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="h-4 w-4" />
            Student Management
          </Link>

          <Link
            to="/admin/categories"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              isActive("/admin/categories")
                ? "bg-white text-black font-bold shadow-lg shadow-white/10"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers className="h-4 w-4" />
            Categories
          </Link>
        </nav>
      </div>

      {/* Quick Action Button */}
      <div className="pt-6 border-t border-white/10">
        <Link
          to="/admin/quizzes/new"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/20 text-white font-mono text-xs uppercase tracking-wider font-bold hover:bg-white hover:text-black transition-all duration-300"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Quiz</span>
        </Link>
      </div>
    </aside>
  );
};
