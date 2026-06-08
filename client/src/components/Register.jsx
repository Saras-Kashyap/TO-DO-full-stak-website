import React, { useState } from 'react';
import api from '../api';
import { User, Mail, Lock, Shield, ArrowRight } from 'lucide-react';

const Register = ({ setToken, setView }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.15)] text-slate-800 transition-all duration-300">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
          <Shield className="h-7 w-7" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Create Account</h2>
        <p className="text-sm text-slate-500 mt-2">Join SecureTask to start managing tasks</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50/80 border border-red-100 text-red-600 text-sm px-4 py-3.5 rounded-xl flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="username" className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
            Username
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
              <User className="h-5 w-5" />
            </span>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all duration-200"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
              <Mail className="h-5 w-5" />
            </span>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all duration-200"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
              <Lock className="h-5 w-5" />
            </span>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all duration-200"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-indigo-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
        Already have an account?{' '}
        <button
          onClick={() => setView('login')}
          className="text-indigo-600 font-semibold hover:underline hover:text-indigo-550 cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Register;
