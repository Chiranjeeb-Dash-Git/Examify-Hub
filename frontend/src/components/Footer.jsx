import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export const Footer = () => {
  const location = useLocation();
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') return null;

  return (
    <footer className="w-full border-t border-white/10 bg-[#050505]/90 backdrop-blur-xl py-8 mt-auto z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-2.5 w-2.5 bg-white rounded-none transition-transform duration-500 group-hover:rotate-45" />
            <span className="font-display font-extrabold text-sm tracking-[0.2em] text-white uppercase">
              EXAMIFY HUB
            </span>
          </Link>
          <span className="font-mono text-xs text-white/40 pl-3 border-l border-white/10">
            © 2026 EXAMIFY HUB ASSESSMENT PLATFORM. ALL RIGHTS RESERVED.
          </span>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs text-white/50 uppercase tracking-wider">
          <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#api" className="hover:text-white transition-colors">API Docs</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};
