import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Layers, BarChart3, Settings, Shield, PlusCircle } from 'lucide-react';

export const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 glass-panel border-r border-white/10 p-6 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Command Center Title */}
        <div className="border-b border-white/10 pb-4">
          <span className="text-[10px] font-mono text-[#6be026] uppercase tracking-widest flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-[#6be026]" />
            COMMAND CENTER
          </span>
          <h2 className="text-xl font-extrabold text-white mt-1">Elite Tier Admin</h2>
        </div>

        {/* Navigation Group */}
        <nav className="space-y-1 font-sans">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isActive("/admin")
                ? "bg-[#38BDF8] text-[#10141a] shadow-lg shadow-[#38BDF8]/20"
                : "text-[#bdc8d2] hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Platform Analytics
          </Link>

          <Link
            to="/admin/quizzes"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isActive("/admin/quizzes")
                ? "bg-[#38BDF8] text-[#10141a] shadow-lg shadow-[#38BDF8]/20"
                : "text-[#bdc8d2] hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Quiz Management
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isActive("/admin/users")
                ? "bg-[#38BDF8] text-[#10141a] shadow-lg shadow-[#38BDF8]/20"
                : "text-[#bdc8d2] hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="h-4 w-4" />
            Student Management
          </Link>

          <Link
            to="/admin/categories"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isActive("/admin/categories")
                ? "bg-[#38BDF8] text-[#10141a] shadow-lg shadow-[#38BDF8]/20"
                : "text-[#bdc8d2] hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers className="h-4 w-4" />
            Categories
          </Link>
        </nav>
      </div>

      {/* Quick Action Box */}
      <div className="p-4 rounded-2xl bg-[#10141a] border border-white/10 space-y-3">
        <span className="text-[10px] font-mono text-[#88929b] block">QUICK ACTIONS</span>
        <Link
          to="/admin/quizzes/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#6be026] text-[#10141a] font-bold text-xs hover:bg-[#6be026]/90 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Quiz
        </Link>
      </div>
    </aside>
  );
};
