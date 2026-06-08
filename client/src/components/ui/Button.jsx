import React from 'react';

export function Button({ className, variant = 'default', size = 'default', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer';
  
  const variants = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-550 shadow-sm border border-indigo-600/50',
    secondary: 'bg-slate-900/50 text-slate-300 hover:bg-slate-900 border border-slate-800/60',
    destructive: 'bg-red-950/20 text-red-400 hover:bg-red-950/40 border border-red-900/30',
    outline: 'border border-slate-900 bg-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200',
    ghost: 'hover:bg-slate-900/40 hover:text-slate-200 text-slate-500',
    link: 'text-indigo-400 underline-offset-4 hover:underline lowercase normal-case font-normal',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 rounded-lg px-2.5 text-[10px]',
    lg: 'h-11 rounded-xl px-6',
    icon: 'h-9 w-9',
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
