import { useState } from 'react';
import api from '../api';

const Login = ({ setToken, setView }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const response = await api.post('/auth/login', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl rounded-3xl p-12 shadow-2xl text-slate-200 transition-all duration-300">
      <div className="flex flex-col items-center text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
        <p className="text-sm text-slate-400 mt-2">Sign in to your SecureTask account</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-950/20 border border-red-900/30 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-11 px-3 bg-slate-950/50 border-0 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm text-white placeholder:text-slate-500 transition-all duration-200"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full h-11 px-3 bg-slate-950/50 border-0 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm text-white placeholder:text-slate-500 transition-all duration-200"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-[85%] mx-auto h-11 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold tracking-wide uppercase rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 cursor-pointer mt-2"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 text-center text-xs text-slate-500 border-t border-white/5 pt-6">
        Don't have an account?{' '}
        <button
          onClick={() => setView('register')}
          className="text-indigo-400 font-semibold hover:underline hover:text-indigo-350 cursor-pointer"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
