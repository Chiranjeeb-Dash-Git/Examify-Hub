import React from 'react';
import { useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const Footer = () => {
  const location = useLocation();
  if (location.pathname === '/' || location.pathname === '/login') return null;

  return (
    <footer className="w-full border-t border-white/10 bg-[#10141a] py-10 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#38BDF8]/20 border border-[#38BDF8]/30">
            <Zap className="h-4 w-4 text-[#38BDF8]" />
          </div>
          <span className="text-lg font-bold text-white">Examify Hub</span>
          <span className="text-xs text-[#88929b] pl-2 border-l border-white/10">
            © 2026 Examify Hub Assessment Platform. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-[#88929b]">
          <a href="#privacy" className="hover:text-[#38BDF8] transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-[#38BDF8] transition-colors">Terms of Service</a>
          <a href="#api" className="hover:text-[#38BDF8] transition-colors">API Docs</a>
          <a href="#contact" className="hover:text-[#38BDF8] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};
