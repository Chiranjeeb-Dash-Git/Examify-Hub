import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, ArrowRight, AlertCircle, UserCheck } from 'lucide-react';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#10141a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6be026]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 relative z-10">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6be026] to-[#0056d2] shadow-lg shadow-[#6be026]/20 mb-4">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Candidate Account</h2>
          <p className="mt-1 text-xs text-[#88929b] font-mono">Join the Examify Hub assessment network</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#88929b] uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Commander Jane Doe"
              className="w-full px-4 py-3 rounded-xl bg-[#10141a] border border-white/10 text-white placeholder-[#88929b]/50 text-sm focus:outline-none focus:border-[#38BDF8] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#88929b] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@examifyhub.io"
              className="w-full px-4 py-3 rounded-xl bg-[#10141a] border border-white/10 text-white placeholder-[#88929b]/50 text-sm focus:outline-none focus:border-[#38BDF8] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#88929b] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#10141a] border border-white/10 text-white placeholder-[#88929b]/50 text-sm focus:outline-none focus:border-[#38BDF8] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#88929b] uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#10141a] border border-white/10 text-white placeholder-[#88929b]/50 text-sm focus:outline-none focus:border-[#38BDF8] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#38BDF8] text-[#10141a] font-bold text-sm hover:bg-[#38BDF8]/90 transition-all shadow-lg shadow-[#38BDF8]/20 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? 'Registering...' : 'Complete Registration'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-[#88929b]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#38BDF8] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
