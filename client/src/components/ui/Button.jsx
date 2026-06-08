import React from 'react';

export function Button({ className, variant = 'default', size = 'default', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer';
  
  const variants = {
    default: 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-500/30 hover:-translate-y-0.5',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700/50',
    destructive: 'bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-500 hover:shadow-red-500/30 hover:-translate-y-0.5',
    outline: 'border border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-100',
    ghost: 'hover:bg-slate-850 hover:text-slate-100 text-slate-400 hover:bg-slate-800',
    link: 'text-indigo-400 underline-offset-4 hover:underline',
  };

  const sizes = {
    default: 'h-11 px-5 py-2.5',
    sm: 'h-9 rounded-lg px-3 text-xs',
    lg: 'h-12 rounded-xl px-8',
    icon: 'h-10 w-10',
  };

  const variantStyle = variants[variant] || variants.default;
  const sizeStyle = sizes[size] || sizes.default;

  return (
    <button
      className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className || ''}`}
      {...props}
    />
  );
}
