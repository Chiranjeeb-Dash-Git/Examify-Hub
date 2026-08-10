import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ToonHubCarousel } from '../components/landing/ToonHubCarousel';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 selection:text-white font-body overflow-x-hidden">
      {/* TOONHUB Carousel — full-viewport hero */}
      <ToonHubCarousel />
    </div>
  );
};

export default LandingPage;
