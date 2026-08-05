import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Cpu, Globe, ArrowRight, Award, CheckCircle2, Play } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#10141a] flex flex-col relative overflow-hidden">
      {/* Background Neon Glow Orbs */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#38BDF8]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[400px] bg-[#6be026]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181c22] border border-[#38BDF8]/30 mb-8 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#38BDF8] animate-ping" />
          <span className="text-xs font-mono tracking-wider text-[#38BDF8] uppercase font-semibold">
            AETHERIS COMMAND CENTER v2.4
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight max-w-4xl leading-[1.1]">
          Knowledge <span className="bg-gradient-to-r from-[#38BDF8] via-[#88ceff] to-[#6be026] bg-clip-text text-transparent">Reimagined</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[#88929b] max-w-2xl font-normal leading-relaxed">
          Deploy advanced assessments, track elite-tier telemetry, and elevate learning environments through immersive, data-driven interfaces.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-4 rounded-xl bg-[#38BDF8] text-[#10141a] font-bold text-base hover:bg-[#38BDF8]/90 transition-all shadow-lg shadow-[#38BDF8]/25 flex items-center gap-2 group"
          >
            <span>Start Journey</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/quizzes"
            className="px-8 py-4 rounded-xl bg-[#181c22] hover:bg-[#262a31] text-[#dfe2eb] font-semibold text-base border border-white/10 transition-all flex items-center gap-2"
          >
            <Play className="h-4 w-4 text-[#38BDF8] fill-[#38BDF8]" />
            <span>Explore Quizzes</span>
          </Link>
        </div>
      </section>

      {/* Operational Capabilities Section (Matching Stitch Design) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">Operational Capabilities</h2>
            <p className="mt-2 text-sm text-[#88929b] font-mono">Engineered for precision and deep analytical insight.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-[#38BDF8]/40 transition-all">
              <div className="h-12 w-12 rounded-xl bg-[#38BDF8]/10 flex items-center justify-center border border-[#38BDF8]/20 mb-4">
                <Cpu className="h-6 w-6 text-[#38BDF8]" />
              </div>
              <h3 className="text-xl font-bold text-white">Dynamic Routing</h3>
              <p className="mt-2 text-sm text-[#88929b] leading-relaxed">
                Questions adapt in real-time based on candidate performance trajectories and knowledge node parameters.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-[#38BDF8]/40 transition-all">
              <div className="h-12 w-12 rounded-xl bg-[#6be026]/10 flex items-center justify-center border border-[#6be026]/20 mb-4">
                <Zap className="h-6 w-6 text-[#6be026]" />
              </div>
              <h3 className="text-xl font-bold text-white">Lightning-Fast Processing</h3>
              <p className="mt-2 text-sm text-[#88929b] leading-relaxed">
                Edge-compute architecture ensures zero latency between question submission and analytical modeling.
              </p>
            </div>

            {/* Feature 3 - Wide Card */}
            <div className="md:col-span-2 glass-panel p-8 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Globe className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Global Assessment Mapping</h3>
                <p className="text-sm text-[#88929b] leading-relaxed">
                  Visualize skill distributions across demographics with high-fidelity telemetry, real-time leaderboard sync, and candidate benchmarking.
                </p>
                <Link to="/quizzes" className="inline-flex items-center gap-2 text-sm font-semibold text-[#38BDF8] hover:underline">
                  <span>Explore Metrics</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Map Illustration Box */}
              <div className="w-full md:w-80 h-48 rounded-xl bg-[#10141a] border border-white/10 flex items-center justify-center p-4 relative overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
                  alt="World Map Tech"
                  className="w-full h-full object-cover rounded-lg opacity-70 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10141a] to-transparent" />
                <span className="absolute bottom-3 left-4 text-xs font-mono text-[#38BDF8] flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#6be026] animate-pulse" />
                  Live Telemetry Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
