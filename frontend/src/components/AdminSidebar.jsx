import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, BookOpen, Layers, PlusCircle, ShieldAlert } from 'lucide-react';

export const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/admin', label: 'Platform Analytics', icon: LayoutDashboard },
    { path: '/admin/quizzes', label: 'Quiz Management', icon: BookOpen },
    { path: '/admin/users', label: 'Student Management', icon: Users },
    { path: '/admin/categories', label: 'Categories', icon: Layers },
  ];

  return (
    <aside className="w-64 liquid-glass border-r border-white/10 p-6 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-5rem)] z-20 my-4 ml-4 rounded-3xl backdrop-blur-xl">
      <div className="space-y-6">
        {/* Command Center Title */}
        <div className="border-b border-white/10 pb-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-1.5 text-white/80">
            <ShieldAlert className="h-3.5 w-3.5 text-white" />
            ADMIN GATEWAY
          </span>
          <h2 
            className="text-xl font-medium text-white mt-1 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Examify Hub Admin
          </h2>
        </div>

        {/* Navigation Group */}
        <nav className="space-y-2 text-xs font-medium tracking-wide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 ${
                    active
                      ? "liquid-glass text-white font-semibold shadow-inner border border-white/30"
                      : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-white" : "text-white/60"}`} />
                  <span>{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quick Action Button */}
      <div className="pt-6 border-t border-white/10">
        <Link to="/admin/quizzes/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 liquid-glass rounded-full text-xs font-medium text-white hover:opacity-90 transition-all duration-300 cursor-pointer border border-white/20"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Quiz</span>
          </motion.button>
        </Link>
      </div>
    </aside>
  );
};
