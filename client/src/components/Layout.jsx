import React from 'react';
import { Button } from './ui/Button';
import { Home, User, LogOut, CheckSquare } from 'lucide-react';

export default function Layout({ children, currentView, setView, handleLogout }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900/30 p-6 space-y-8">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/35">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">SecureTask</span>
        </div>

        <nav className="flex-1 space-y-1">
          <Button
            variant={currentView === 'home' ? 'default' : 'ghost'}
            className="w-full justify-start space-x-3"
            onClick={() => setView('home')}
          >
            <Home className="h-4 w-4" />
            <span>Tasks</span>
          </Button>

          <Button
            variant={currentView === 'profile' ? 'default' : 'ghost'}
            className="w-full justify-start space-x-3"
            onClick={() => setView('profile')}
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Button>
        </nav>

        <div>
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Top Nav - Mobile */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/30">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <CheckSquare className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-bold">SecureTask</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant={currentView === 'home' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('home')}
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button
            variant={currentView === 'profile' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('profile')}
          >
            <User className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center p-6 md:p-12 overflow-y-auto max-w-xl mx-auto w-full">
        <div className="w-full py-4 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
