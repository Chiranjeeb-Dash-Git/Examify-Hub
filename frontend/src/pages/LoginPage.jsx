import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, ArrowRight, AlertCircle, Lock, Sparkles, Terminal } from 'lucide-react';
import { Hero3DCanvas } from '../components/landing/Hero3DCanvas';
import { Reveal } from '../components/landing/Reveal';

const ADMIN_PORTAL_EMAIL = 'admin@examify.io';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordInputRef = useRef(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate credentials');
    } finally {
      setLoading(false);
    }
  };

  const selectPortal = (role) => {
    setError('');
    setEmail(role === 'ADMIN' ? ADMIN_PORTAL_EMAIL : '');
    setPassword('');
    passwordInputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 selection:text-white font-body relative overflow-hidden flex flex-col justify-between">
      {/* Background Radial Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Header Logo Bar */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-20">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="h-2.5 w-2.5 bg-white rounded-none transition-transform duration-500 group-hover:rotate-45" />
          <span className="font-display font-extrabold text-sm tracking-[0.2em] text-white uppercase">
            EXAMIFY HUB
          </span>
          <span className="font-mono text-[10px] text-white/40 border border-white/10 px-1.5 py-0.5 rounded tracking-wider">
            v2.4
          </span>
        </Link>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: 3D WebGL Hero Display */}
          <div className="lg:col-span-6 space-y-6 hidden sm:block">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] tracking-[0.3em] text-white/70 uppercase">
                  ✦ AUTHENTICATION GATEWAY
                </span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tighter uppercase leading-[0.95]">
                AUTHENTICATE <br />
                <span className="text-white/40">CREDENTIALS.</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="font-body text-sm sm:text-base text-white/60 max-w-md leading-relaxed">
                Access your candidate dashboard, real-time telemetry assessment engines, and proctoring logs.
              </p>
            </Reveal>

            {/* 3D WebGL Interactive Crystal */}
            <div className="relative h-[380px] w-full flex items-center justify-center">
              <Hero3DCanvas />
            </div>
          </div>

          {/* Right Column: Obsidian Glass Login Form Card */}
          <div className="lg:col-span-6 lg:col-start-7 w-full max-w-md mx-auto lg:max-w-none">
            <Reveal delay={200}>
              <div className="bg-[#0a0a0a] border border-white/10 p-8 sm:p-10 rounded-3xl backdrop-blur-xl shadow-2xl space-y-7 hover:border-white/20 transition-all duration-500 relative">
                {/* Header */}
                <div className="space-y-2 border-b border-white/10 pb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest">
                      SYSTEM ACCESS // ID-SYS
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full bg-emerald-500/10">
                      ● SECURE PORTAL
                    </span>
                  </div>
                  <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">
                    Sign in to Examify Hub
                  </h2>
                </div>

                {/* Portal selector keeps the fixed admin password out of browser code. */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider block">
                    FIXED PORTAL ACCESS
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => selectPortal('STUDENT')}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-mono text-xs text-white border border-white/15 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 group"
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>CANDIDATE LOGIN</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => selectPortal('ADMIN')}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-mono text-xs text-white border border-white/15 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 group"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      <span>ADMIN LOGIN</span>
                    </button>
                  </div>
                  <p className="font-mono text-[10px] text-white/30 leading-relaxed">
                    Candidates can create their own accounts. Admin Login selects the fixed Supabase-backed administrator account; enter its credentials to open the control portal.
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block font-mono text-[11px] text-white/60 uppercase tracking-wider">
                      EMAIL ADDRESS // SYSTEM_ID
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@examifyhub.io"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#050505] border border-white/10 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-white/40 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-mono text-[11px] text-white/60 uppercase tracking-wider">
                        PASSCODE
                      </label>
                      <a
                        href="#forgot"
                        className="font-mono text-[11px] text-white/40 hover:text-white transition-colors"
                      >
                        FORGOT PASSCODE?
                      </a>
                    </div>
                    <input
                      ref={passwordInputRef}
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#050505] border border-white/10 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-white/40 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-white text-black font-mono text-xs tracking-[0.25em] font-bold uppercase hover:bg-white/90 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-3 group mt-2"
                  >
                    <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN TO SYSTEM'}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                {/* Register Link */}
                <div className="text-center pt-2 border-t border-white/10">
                  <p className="font-mono text-xs text-white/50">
                    NEW OPERATOR?{' '}
                    <Link
                      to="/register"
                      className="text-white font-bold hover:underline tracking-wider"
                    >
                      CREATE CANDIDATE ACCOUNT
                    </Link>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </main>

      {/* Footer Minimalist Credit */}
      <footer className="py-6 border-t border-white/10 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between font-mono text-[11px] text-white/40">
          <span>EXAMIFY HUB SYSTEM AUTHENTICATION</span>
          <span>© {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
        </div>
      </footer>
    </div>
  );
};
