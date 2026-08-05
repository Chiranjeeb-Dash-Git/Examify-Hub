import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Shield, User, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      const demoEmail = role === 'ADMIN' ? 'admin@aetheris.io' : 'student@aetheris.io';
      const demoPass = role === 'ADMIN' ? 'adminpassword' : 'password123';
      const loggedUser = await login(demoEmail, demoPass);
      navigate(loggedUser.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#10141a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#38BDF8]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 relative z-10">
        {/* Header Logo */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#0056d2] shadow-lg shadow-[#38BDF8]/30 mb-4">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Access Command Center</h2>
          <p className="mt-1 text-xs text-[#88929b] font-mono">Authenticate your assessment credentials</p>
        </div>

        {/* Quick Demo Login Buttons */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#10141a] rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => handleDemoLogin('STUDENT')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-[#181c22] text-[#38BDF8] border border-[#38BDF8]/30 hover:bg-[#38BDF8]/10 transition-all"
          >
            <User className="h-3.5 w-3.5" />
            Demo Student
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('ADMIN')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-[#181c22] text-[#6be026] border border-[#6be026]/30 hover:bg-[#6be026]/10 transition-all"
          >
            <Shield className="h-3.5 w-3.5" />
            Demo Admin
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-[#88929b] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@aetheris.io"
              className="w-full px-4 py-3 rounded-xl bg-[#10141a] border border-white/10 text-white placeholder-[#88929b]/50 text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono text-[#88929b] uppercase tracking-wider">
                Password
              </label>
              <a href="#forgot" className="text-xs text-[#38BDF8] hover:underline">Forgot password?</a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#10141a] border border-white/10 text-white placeholder-[#88929b]/50 text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#38BDF8] text-[#10141a] font-bold text-sm hover:bg-[#38BDF8]/90 transition-all shadow-lg shadow-[#38BDF8]/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-[#88929b]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#38BDF8] font-semibold hover:underline">
              Create Candidate Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
