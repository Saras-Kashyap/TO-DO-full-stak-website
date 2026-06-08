import React from 'react';

export function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={`flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950/50 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${className || ''}`}
      {...props}
    />
  );
}
