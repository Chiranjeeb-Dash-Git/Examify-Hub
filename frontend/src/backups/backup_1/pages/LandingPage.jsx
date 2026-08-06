import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Zap,
  Cpu,
  Activity,
  CheckCircle2,
  Clock,
  BarChart3,
  Layers,
  ChevronRight,
  Sparkles,
  Lock,
  Play,
  Terminal,
} from 'lucide-react';
import { Hero3DCanvas } from '../components/landing/Hero3DCanvas';
import { Reveal } from '../components/landing/Reveal';

export const LandingPage = () => {
  const [timerMs, setTimerMs] = useState(1428841);
  const [activeRole, setActiveRole] = useState('candidate');
  const [scrolled, setScrolled] = useState(false);

  // Live millisecond timer simulation for Bento Grid
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerMs((prev) => prev + 47);
    }, 47);
    return () => clearInterval(interval);
  }, []);

  // Header scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTimer = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}.${String(milliseconds).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 selection:text-white font-body overflow-x-hidden">
      {/* 1. Header / Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#050505]/85 backdrop-blur-md border-b border-white/10 py-3.5'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-2.5 w-2.5 bg-white rounded-none transition-transform duration-500 group-hover:rotate-45" />
            <span className="font-display font-extrabold text-sm tracking-[0.2em] text-white uppercase">
              EXAMIFY HUB
            </span>
            <span className="font-mono text-[10px] text-white/40 border border-white/10 px-1.5 py-0.5 rounded tracking-wider">
              v2.4
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#manifesto"
              className="font-mono text-xs tracking-[0.25em] text-white/60 hover:text-white transition-colors uppercase"
            >
              MANIFESTO
            </a>
            <a
              href="#system"
              className="font-mono text-xs tracking-[0.25em] text-white/60 hover:text-white transition-colors uppercase"
            >
              SYSTEM
            </a>
            <a
              href="#telemetry"
              className="font-mono text-xs tracking-[0.25em] text-white/60 hover:text-white transition-colors uppercase"
            >
              TELEMETRY
            </a>
            <a
              href="#access"
              className="font-mono text-xs tracking-[0.25em] text-white/60 hover:text-white transition-colors uppercase"
            >
              ACCESS
            </a>
          </nav>

          {/* CTA Action */}
          <div className="flex items-center gap-4">
            <Link
              to="/quizzes"
              className="hidden sm:inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors"
            >
              EXPLORE
            </Link>
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 font-mono text-xs tracking-[0.2em] uppercase text-white font-medium"
            >
              <span>GET ACCESS</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section
        id="top"
        className="relative min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Stack */}
          <div className="lg:col-span-7 space-y-8 z-10">
            <Reveal delay={100}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] tracking-[0.3em] text-white/70 uppercase">
                  ✦ ASSESSMENT, ENGINEERED.
                </span>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-[84px] leading-[0.92] tracking-tighter text-white uppercase">
                PRECISION <br />
                <span className="text-white/40">EVALUATION.</span> <br />
                ZERO NOISE.
              </h1>
            </Reveal>

            <Reveal delay={300}>
              <p className="font-body text-base sm:text-lg text-white/60 max-w-xl leading-relaxed">
                Server-validated timing, real-time proctoring telemetry, and adaptive skill diagnostic engines built for high-stakes evaluation.
              </p>
            </Reveal>

            <Reveal delay={400}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/register"
                  className="group px-7 py-4 rounded-full bg-white text-black font-mono text-xs tracking-[0.25em] uppercase font-bold hover:bg-white/90 hover:scale-[1.02] transition-all shadow-xl shadow-white/10 flex items-center gap-3"
                >
                  <span>START EVALUATION</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/quizzes"
                  className="px-7 py-4 rounded-full border border-white/20 text-white font-mono text-xs tracking-[0.25em] uppercase font-medium hover:border-white/50 hover:bg-white/5 transition-all flex items-center gap-2.5"
                >
                  <Play className="h-3.5 w-3.5 text-white/80 fill-white/80" />
                  <span>EXPLORE DEMO</span>
                </Link>
              </div>
            </Reveal>

            {/* Micro Metadata */}
            <Reveal delay={500}>
              <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-6">
                <div>
                  <div className="font-mono text-xs text-white/40 uppercase tracking-wider">LATENCY</div>
                  <div className="font-display font-bold text-xl text-white mt-1">&lt; 12ms</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-white/40 uppercase tracking-wider">PROCTORING</div>
                  <div className="font-display font-bold text-xl text-white mt-1">REALTIME</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-white/40 uppercase tracking-wider">INTEGRITY</div>
                  <div className="font-display font-bold text-xl text-white mt-1">100% SECURE</div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* 3D WebGL Canvas Component */}
          <div className="lg:col-span-5 relative h-[450px] sm:h-[550px] w-full flex items-center justify-center">
            <Hero3DCanvas />
          </div>
        </div>
      </section>

      {/* 3. Infinite Marquee Section */}
      <section className="bg-[#070707] py-6 border-y border-white/10 overflow-hidden relative">
        <div className="animate-marquee gap-12 items-center select-none">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 whitespace-nowrap">
              <span className="font-mono text-xs tracking-[0.35em] text-white/40 uppercase flex items-center gap-12">
                <span>PRECISION</span> <span className="text-white/20">✳</span>
                <span>INTEGRITY</span> <span className="text-white/20">✳</span>
                <span>TELEMETRY</span> <span className="text-white/20">✳</span>
                <span>ADAPTIVE ROUTING</span> <span className="text-white/20">✳</span>
                <span>DISCIPLINE</span> <span className="text-white/20">✳</span>
                <span>ZERO BIAS</span> <span className="text-white/20">✳</span>
                <span>HIGH FIDELITY</span> <span className="text-white/20">✳</span>
                <span>SERVER VALIDATED</span> <span className="text-white/20">✳</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Manifesto Section */}
      <section id="manifesto" className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#050505]">
        <div className="grid md:grid-cols-12 gap-12 md:gap-16">
          {/* Left Sticky Sidebar */}
          <div className="md:col-span-5 md:sticky md:top-32 md:self-start space-y-6">
            <Reveal>
              <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase">
                MANIFESTO / 01
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tighter leading-tight uppercase">
                BUILT ON TELEMETRY, <br />
                <span className="text-white/40">NOT ASSUMPTIONS.</span>
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="font-body text-base text-white/60 leading-relaxed">
                Traditional online testing platforms rely on client-side timers, static question lists, and vulnerable submission loops. Examify Hub rebuilds the assessment stack with server-side validation and live integrity signals.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-white hover:text-white/70 transition-colors uppercase pt-4 group"
              >
                <span>EXPLORE MANIFESTO</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>

          {/* Right Content Stack */}
          <div className="md:col-span-6 md:col-start-7 space-y-16">
            {/* Card 01 */}
            <Reveal delay={100}>
              <div className="group border-b border-white/10 pb-12 space-y-4">
                <div className="font-mono text-3xl font-bold text-white/15 group-hover:text-white/40 transition-colors">
                  01
                </div>
                <h3 className="font-display font-extrabold text-2xl text-white tracking-tight">
                  Deterministic Timing Protocol
                </h3>
                <p className="font-body text-sm text-white/60 leading-relaxed">
                  Local device clocks can skew or be manipulated. Examify Hub executes sub-millisecond server timestamping for every answer action, ensuring absolute evaluation parity regardless of local system offsets.
                </p>
              </div>
            </Reveal>

            {/* Card 02 */}
            <Reveal delay={200}>
              <div className="group border-b border-white/10 pb-12 space-y-4">
                <div className="font-mono text-3xl font-bold text-white/15 group-hover:text-white/40 transition-colors">
                  02
                </div>
                <h3 className="font-display font-extrabold text-2xl text-white tracking-tight">
                  Adaptive Skill Trajectory
                </h3>
                <p className="font-body text-sm text-white/60 leading-relaxed">
                  Questions aren't static lists. Our difficulty routing matrix measures live accuracy vectors and response times to dynamically select questions that drill directly into candidate competence limits.
                </p>
              </div>
            </Reveal>

            {/* Card 03 */}
            <Reveal delay={300}>
              <div className="group border-b border-white/10 pb-12 space-y-4">
                <div className="font-mono text-3xl font-bold text-white/15 group-hover:text-white/40 transition-colors">
                  03
                </div>
                <h3 className="font-display font-extrabold text-2xl text-white tracking-tight">
                  Continuous Focus Telemetry
                </h3>
                <p className="font-body text-sm text-white/60 leading-relaxed">
                  Real-time focus telemetry captures window blur events, paste attempts, and anomalous solving patterns, building an instant audit log without intrusive spyware installations.
                </p>
              </div>
            </Reveal>

            {/* Visual Image / Telemetry Preview */}
            <Reveal delay={400}>
              <div className="relative rounded-2xl bg-[#0a0a0a] border border-white/10 p-6 overflow-hidden group hover:border-white/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-xs text-white/70 uppercase tracking-wider">
                      LIVE AUDIT LOG // TEST-8942
                    </span>
                  </div>
                  <span className="font-mono text-xs text-white/40">TIMESTAMP: SERVER_ACK</span>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between text-white/60 bg-white/5 p-2 rounded">
                    <span>[00:04.12] QUESTION_01_ANSWERED</span>
                    <span className="text-emerald-400">PASSED (450ms)</span>
                  </div>
                  <div className="flex justify-between text-white/60 bg-white/5 p-2 rounded">
                    <span>[00:09.84] TELEMETRY_FOCUS_VERIFIED</span>
                    <span className="text-emerald-400">100% FOCUS</span>
                  </div>
                  <div className="flex justify-between text-white/60 bg-white/5 p-2 rounded">
                    <span>[00:14.28] ADAPTIVE_NEXT_ITEM</span>
                    <span className="text-white/80">LEVEL_DIFFICULTY_HARD</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. System Architecture Bento Grid Section */}
      <section id="system" className="py-28 bg-[#070707] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="space-y-4 mb-16">
            <Reveal>
              <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase">
                SYSTEM ARCHITECTURE / 02
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tighter uppercase">
                THE ASSESSMENT ENGINE.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="font-body text-base text-white/60 max-w-2xl">
                Modular high-performance architecture built for sub-millisecond execution and real-time candidate insights.
              </p>
            </Reveal>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Bento 1: Large Server-Validated Timing Card */}
            <div className="md:col-span-7 md:row-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-white/30 transition-all duration-500 group relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-mono text-[11px] text-white/40 tracking-widest uppercase border border-white/10 px-2.5 py-1 rounded-full">
                    CORE SYSTEM
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight pt-2">
                  Server-Validated Precision Timing
                </h3>
                <p className="font-body text-sm text-white/60 leading-relaxed max-w-md">
                  Sub-millisecond latency telemetry with cryptographic checksum verification for every question submission.
                </p>
              </div>

              {/* Interactive Timer Box */}
              <div className="mt-8 p-6 rounded-xl bg-[#050505] border border-white/10 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white/40 uppercase">ACTIVE SESSION TIMECODE</span>
                  <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    LIVE TELEMETRY
                  </span>
                </div>

                <div className="font-mono font-bold text-3xl sm:text-4xl text-white tracking-wider">
                  {formatTimer(timerMs)}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full w-[68%] transition-all duration-300" />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-white/40">
                    <span>Q 14 OF 20</span>
                    <span>68% COMPLETED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento 2: Adaptive Skill Diagnostic Card */}
            <div className="md:col-span-5 bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-500 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-display font-extrabold text-xl text-white tracking-tight">
                  Adaptive Skill Trajectories
                </h3>
                <p className="font-body text-xs text-white/60 leading-relaxed">
                  Real-time telemetry continuously calculates skill probability metrics for targeted evaluation.
                </p>
              </div>

              {/* Vector Bar Chart */}
              <div className="mt-6 space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-white/60 mb-1">
                    <span>ALGORITHMS</span>
                    <span className="text-white">94.2%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full w-[94%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-white/60 mb-1">
                    <span>SYSTEM DESIGN</span>
                    <span className="text-white">88.5%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/70 rounded-full w-[88%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bento 3: Proctor & Role Control */}
            <div className="md:col-span-5 bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-500 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-display font-extrabold text-xl text-white tracking-tight">
                  Dual Role Controls
                </h3>
                <p className="font-body text-xs text-white/60 leading-relaxed">
                  Seamlessly toggle between candidate exam interface and high-fidelity examiner proctoring metrics.
                </p>
              </div>

              {/* Interactive Role Toggle */}
              <div className="mt-6 p-2 rounded-xl bg-[#050505] border border-white/10 flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => setActiveRole('candidate')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    activeRole === 'candidate'
                      ? 'bg-white text-black font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  CANDIDATE
                </button>
                <button
                  onClick={() => setActiveRole('examiner')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    activeRole === 'examiner'
                      ? 'bg-white text-black font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  EXAMINER
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Metrics & Telemetry Stats Section */}
      <section id="telemetry" className="py-20 bg-[#050505] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <Reveal delay={100} className="pt-4 md:pt-0 md:px-6">
              <div className="font-mono text-xs text-white/40 uppercase tracking-widest">
                TELEMETRY PRECISION
              </div>
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tighter mt-2">
                99.98%
              </div>
            </Reveal>

            <Reveal delay={200} className="pt-4 md:pt-0 md:px-6">
              <div className="font-mono text-xs text-white/40 uppercase tracking-widest">
                LATENCY BENCHMARK
              </div>
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tighter mt-2">
                &lt; 12ms
              </div>
            </Reveal>

            <Reveal delay={300} className="pt-4 md:pt-0 md:px-6">
              <div className="font-mono text-xs text-white/40 uppercase tracking-widest">
                ASSESSMENTS EVALUATED
              </div>
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tighter mt-2">
                2.4M+
              </div>
            </Reveal>

            <Reveal delay={400} className="pt-4 md:pt-0 md:px-6">
              <div className="font-mono text-xs text-white/40 uppercase tracking-widest">
                INTEGRITY SCORE
              </div>
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tighter mt-2">
                100%
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 7. Direct Access / CTA Section */}
      <section id="access" className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#050505]">
        <div className="grid md:grid-cols-12 gap-12 items-center border border-white/10 rounded-3xl p-8 sm:p-14 bg-[#070707] relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text */}
          <div className="md:col-span-7 space-y-6">
            <Reveal>
              <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase">
                DIRECT ACCESS / 03
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tighter uppercase leading-[0.95]">
                DEPLOY EXAMIFY HUB TODAY.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="font-body text-base text-white/60 max-w-lg leading-relaxed">
                Take your assessments to the next level with server-verified timing, real-time proctoring telemetry, and instant analytics.
              </p>
            </Reveal>
          </div>

          {/* Right Action Box */}
          <div className="md:col-span-5 flex flex-col gap-4 z-10">
            <Reveal delay={300}>
              <Link
                to="/register"
                className="w-full py-4 px-6 rounded-full bg-white text-black font-mono text-xs tracking-[0.25em] font-bold uppercase hover:bg-white/90 transition-all text-center flex items-center justify-center gap-3 group shadow-xl shadow-white/10"
              >
                <span>CREATE ACCOUNT</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>

            <Reveal delay={400}>
              <Link
                to="/quizzes"
                className="w-full py-4 px-6 rounded-full border border-white/20 text-white font-mono text-xs tracking-[0.25em] font-medium uppercase hover:border-white/50 hover:bg-white/5 transition-all text-center flex items-center justify-center gap-2"
              >
                <span>BROWSE ALL QUIZZES</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 8. Minimalist Footer */}
      <footer className="py-12 border-t border-white/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-white" />
            <span className="font-display font-extrabold text-xs tracking-widest text-white uppercase">
              EXAMIFY HUB
            </span>
            <span className="font-mono text-[10px] text-white/40">
              © {new Date().getFullYear()} ALL RIGHTS RESERVED.
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400 border border-white/10 px-3 py-1 rounded-full bg-white/5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-white/50">
            <Link to="/quizzes" className="hover:text-white transition-colors">
              QUIZZES
            </Link>
            <Link to="/leaderboard" className="hover:text-white transition-colors">
              LEADERBOARD
            </Link>
            <Link to="/login" className="hover:text-white transition-colors">
              SIGN IN
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
