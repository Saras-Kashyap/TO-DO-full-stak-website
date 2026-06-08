import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './components/TodoList';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Profile from './components/Profile';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [view, setView] = useState('login'); // 'login' or 'register'
  const [dashboardView, setDashboardView] = useState('home'); // 'home' or 'profile'

  // Watch token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleLogout = () => {
    setToken('');
    setView('login');
    setDashboardView('home');
  };

  // Logged in View (Dashboard Layout)
  if (token) {
    return (
      <PrivateRoute token={token} setView={setView}>
        <Layout currentView={dashboardView} setView={setDashboardView} handleLogout={handleLogout}>
          {dashboardView === 'home' ? (
            <TodoList />
          ) : (
            <Profile />
          )}
        </Layout>
      </PrivateRoute>
    );
  }

  // Logged out View (Auth Cards)
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-between items-center py-12 px-6">
      <header className="flex flex-col items-center text-center max-w-sm w-full mt-4">
        <div className="flex items-center space-x-2.5 mb-2">
          <span className="text-xl">🔒</span>
          <h1 className="text-xl font-semibold text-slate-100 tracking-tight">SecureTask</h1>
        </div>
        <p className="text-xs text-slate-500">A full-stack MERN auth application</p>
      </header>

      <main className="flex-1 flex items-center justify-center w-full max-w-md my-8">
        {view === 'login' ? (
          <Login setToken={setToken} setView={setView} />
        ) : (
          <Register setToken={setToken} setView={setView} />
        )}
      </main>

      <footer className="text-center text-[10px] text-slate-650 tracking-wide">
        &copy; {new Date().getFullYear()} SecureTask. Built with MongoDB, Express, React, and Node.
      </footer>
    </div>
  );
}

export default App;
