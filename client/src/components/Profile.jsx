import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { motion } from 'framer-motion';
import { User, Mail, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        setProfile(response.data);
      } catch (err) {
        setError('Failed to fetch profile info.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 space-y-4 w-full">
        <div className="h-16 w-16 rounded-full bg-slate-800 mx-auto" />
        <div className="h-6 bg-slate-800 rounded w-1/3 mx-auto" />
        <div className="h-4 bg-slate-800 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="w-full">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto h-20 w-20 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
            <User className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-bold">{profile?.username || 'User Profile'}</CardTitle>
          <CardDescription>SecureTask SaaS Member</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/50">
              <Mail className="h-5 w-5 text-indigo-400" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email Address</p>
                <p className="text-sm text-slate-200">{profile?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/50">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Account Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 mt-0.5">
                  Verified Active
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
