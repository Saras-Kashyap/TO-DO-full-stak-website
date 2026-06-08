import React from 'react';
import { Button } from './ui/Button';
import { Home, User, LogOut, CheckSquare } from 'lucide-react';

export default function Layout({ children, currentView, setView, handleLogout }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-900 bg-slate-950/30 p-8 space-y-10">
        <div className="flex items-center space-x-3.5">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-100">SecureTask</span>
        </div>

        <nav className="flex-1 space-y-2">
          <Button
            variant={currentView === 'home' ? 'default' : 'ghost'}
            className="w-full justify-start space-x-3.5 px-4 h-10 text-xs tracking-wide uppercase font-semibold"
            onClick={() => setView('home')}
          >
            <Home className="h-4 w-4" />
            <span>Tasks</span>
          </Button>

          <Button
            variant={currentView === 'profile' ? 'default' : 'ghost'}
            className="w-full justify-start space-x-3.5 px-4 h-10 text-xs tracking-wide uppercase font-semibold"
            onClick={() => setView('profile')}
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Button>
        </nav>

        <div>
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3.5 px-4 h-10 text-xs tracking-wide uppercase font-semibold text-slate-500 hover:text-red-400 hover:bg-red-500/5"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Top Nav - Mobile */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between px-6 py-5 border-b border-slate-900 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
            <CheckSquare className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-100">SecureTask</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Button
            variant={currentView === 'home' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => setView('home')}
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button
            variant={currentView === 'profile' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => setView('profile')}
          >
            <User className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-slate-500 hover:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center p-8 md:p-16 overflow-y-auto w-full">
        <div className="w-full max-w-xl py-4 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
