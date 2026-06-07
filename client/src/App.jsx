import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './components/TodoList';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [view, setView] = useState('login'); // 'login' or 'register'

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
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-brand">
          <span className="logo-icon">🔒</span>
          <h1>SecureTask</h1>
        </div>
        <p className="tagline">A full-stack MERN auth application</p>
      </header>

      <main className="app-main">
        {token ? (
          <PrivateRoute token={token} setView={setView}>
            <TodoList handleLogout={handleLogout} />
          </PrivateRoute>
        ) : view === 'login' ? (
          <Login setToken={setToken} setView={setView} />
        ) : (
          <Register setToken={setToken} setView={setView} />
        )}
      </main>

      <footer className="app-footer-bar">
        <p>&copy; {new Date().getFullYear()} SecureTask. Built with MongoDB, Express, React, and Node.</p>
      </footer>
    </div>
  );
}

export default App;
