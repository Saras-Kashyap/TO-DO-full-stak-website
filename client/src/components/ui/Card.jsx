import React from 'react';

export function Card({ className, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl text-slate-100 shadow-xl ${className || ''}`}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={`flex flex-col space-y-1.5 p-6 ${className || ''}`}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent ${className || ''}`}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={`text-sm text-slate-400 ${className || ''}`}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={`p-6 pt-0 ${className || ''}`} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={`flex items-center p-6 pt-0 ${className || ''}`}
      {...props}
    />
  );
}
