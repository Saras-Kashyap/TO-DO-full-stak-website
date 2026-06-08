import React from 'react';

export function Input({ className, type = 'text', ...props }) {
  const hasBorderOverride = className && (className.includes('border-0') || className.includes('border-none'));
  const borderClass = hasBorderOverride ? '' : 'border border-slate-900 bg-slate-950/40 focus:border-indigo-500/50';

  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${borderClass} ${className || ''}`}
      {...props}
    />
  );
}
