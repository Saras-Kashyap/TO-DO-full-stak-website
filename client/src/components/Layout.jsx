import React from 'react';
import { Button } from './ui/Button';
import { Home, User, LogOut, GraduationCap, BookOpen, MessageSquare, Sparkles } from 'lucide-react';

export default function Layout({ children, currentView, setView, handleLogout }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-900 bg-slate-950/30 p-8 space-y-10">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-slate-100 block">DeutschLingo</span>
            <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block">Language Suite</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <Button
            variant={currentView === 'dashboard' ? 'default' : 'ghost'}
            className="w-full justify-start space-x-3.5 px-4 h-10 text-[10px] tracking-wide uppercase font-semibold"
            onClick={() => setView('dashboard')}
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Button>

          <Button
            variant={currentView === 'lessons' ? 'default' : 'ghost'}
            className="w-full justify-start space-x-3.5 px-4 h-10 text-[10px] tracking-wide uppercase font-semibold"
            onClick={() => setView('lessons')}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Lessons</span>
          </Button>

          <Button
            variant={currentView === 'vocabulary' ? 'default' : 'ghost'}
            className="w-full justify-start space-x-3.5 px-4 h-10 text-[10px] tracking-wide uppercase font-semibold"
            onClick={() => setView('vocabulary')}
          >
            <BookOpen className="h-4 w-4" />
            <span>Vocabulary</span>
          </Button>

          <Button
            variant={currentView === 'chattutor' ? 'default' : 'ghost'}
            className="w-full justify-start space-x-3.5 px-4 h-10 text-[10px] tracking-wide uppercase font-semibold"
            onClick={() => setView('chattutor')}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat Tutor</span>
          </Button>

          <Button
            variant={currentView === 'profile' ? 'default' : 'ghost'}
            className="w-full justify-start space-x-3.5 px-4 h-10 text-[10px] tracking-wide uppercase font-semibold"
            onClick={() => setView('profile')}
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Button>
        </nav>

        <div>
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3.5 px-4 h-10 text-[10px] tracking-wide uppercase font-semibold text-slate-500 hover:text-red-400 hover:bg-red-500/5"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Top Nav - Mobile */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-100">DeutschLingo</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant={currentView === 'dashboard' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setView('dashboard')}
            title="Dashboard"
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button
            variant={currentView === 'lessons' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setView('lessons')}
            title="Lessons"
          >
            <GraduationCap className="h-4 w-4" />
          </Button>
          <Button
            variant={currentView === 'vocabulary' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setView('vocabulary')}
            title="Vocabulary"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
          <Button
            variant={currentView === 'chattutor' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setView('chattutor')}
            title="Chat Tutor"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            variant={currentView === 'profile' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setView('profile')}
            title="Profile"
          >
            <User className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-500 hover:text-red-400"
            onClick={handleLogout}
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-6 md:p-12 overflow-y-auto w-full items-center">
        <div className="w-full max-w-4xl py-2 md:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
