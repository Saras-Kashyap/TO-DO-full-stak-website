import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import Lessons from './components/Lessons';
import VocabularyDeck from './components/VocabularyDeck';
import GermanChatTutor from './components/GermanChatTutor';
import api from './api';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [view, setView] = useState('login'); // 'login' or 'register'
  const [dashboardView, setDashboardView] = useState('dashboard'); // 'dashboard', 'lessons', 'vocabulary', 'chattutor', 'profile'
  
  // Game/Learning State
  const [xp, setXp] = useState(25);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [starredVocab, setStarredVocab] = useState([]);
  const [loadingVocab, setLoadingVocab] = useState(false);

  // Watch token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load stats and database vocab when logged in
  useEffect(() => {
    if (token) {
      // Load XP
      const savedXp = localStorage.getItem(`deutsch_xp_${token}`);
      if (savedXp) setXp(parseInt(savedXp, 10));
      else setXp(25);

      // Load completed lessons
      const savedLessons = localStorage.getItem(`deutsch_lessons_${token}`);
      if (savedLessons) setCompletedLessons(JSON.parse(savedLessons));
      else setCompletedLessons([]);

      // Fetch vocabulary items from DB
      fetchStarredVocab();
    }
  }, [token]);

  const fetchStarredVocab = async () => {
    setLoadingVocab(true);
    try {
      const response = await api.get('/tasks');
      setStarredVocab(response.data);
    } catch (err) {
      console.error('Failed to fetch starred vocab deck', err);
    } finally {
      setLoadingVocab(false);
    }
  };

  const addStarredVocab = async (vocabItem) => {
    try {
      const payload = {
        title: vocabItem.german, // backward compatibility
        german: vocabItem.german,
        english: vocabItem.english,
        category: vocabItem.category,
        exampleGerman: vocabItem.exampleGerman,
        exampleEnglish: vocabItem.exampleEnglish
      };
      const response = await api.post('/tasks', payload);
      setStarredVocab(prev => [response.data, ...prev]);
    } catch (err) {
      console.error('Failed to star vocabulary item', err);
    }
  };

  const removeStarredVocab = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setStarredVocab(prev => prev.filter(v => v._id !== id));
    } catch (err) {
      console.error('Failed to unstar vocabulary item', err);
    }
  };

  const toggleCompleteVocab = async (id, completed) => {
    try {
      const response = await api.put(`/tasks/${id}`, { completed: !completed });
      setStarredVocab(prev => prev.map(v => v._id === id ? response.data : v));
    } catch (err) {
      console.error('Failed to update vocabulary item status', err);
    }
  };

  const toggleStarVocab = async (vocabItem) => {
    const match = starredVocab.find(sv => sv.german === vocabItem.german);
    if (match) {
      await removeStarredVocab(match._id);
    } else {
      await addStarredVocab(vocabItem);
    }
  };

  const addXp = (amount) => {
    const nextXp = xp + amount;
    setXp(nextXp);
    localStorage.setItem(`deutsch_xp_${token}`, nextXp.toString());
  };

  const markLessonComplete = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      const nextLessons = [...completedLessons, lessonId];
      setCompletedLessons(nextLessons);
      localStorage.setItem(`deutsch_lessons_${token}`, JSON.stringify(nextLessons));
    }
  };

  const handleLogout = () => {
    setToken('');
    setView('login');
    setDashboardView('dashboard');
  };

  // Logged in View (Dashboard Layout)
  if (token) {
    return (
      <PrivateRoute token={token} setView={setView}>
        <Layout currentView={dashboardView} setView={setDashboardView} handleLogout={handleLogout}>
          {dashboardView === 'dashboard' && (
            <Dashboard 
              xp={xp} 
              addXp={addXp} 
              completedLessons={completedLessons} 
              starredVocab={starredVocab} 
              setView={setDashboardView} 
            />
          )}
          {dashboardView === 'lessons' && (
            <Lessons 
              addXp={addXp} 
              completedLessons={completedLessons} 
              markLessonComplete={markLessonComplete} 
              starredVocab={starredVocab}
              toggleStarVocab={toggleStarVocab}
            />
          )}
          {dashboardView === 'vocabulary' && (
            <VocabularyDeck 
              starredVocab={starredVocab} 
              addStarredVocab={addStarredVocab} 
              removeStarredVocab={removeStarredVocab} 
              toggleCompleteVocab={toggleCompleteVocab} 
              loadingVocab={loadingVocab}
            />
          )}
          {dashboardView === 'chattutor' && (
            <GermanChatTutor 
              addXp={addXp} 
            />
          )}
          {dashboardView === 'profile' && (
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
          <span className="text-xl">✨</span>
          <h1 className="text-xl font-semibold text-slate-100 tracking-tight">DeutschLingo</h1>
        </div>
        <p className="text-xs text-slate-500">Secure full-stack German study platform</p>
      </header>

      <main className="flex-1 flex items-center justify-center w-full max-w-md my-8">
        {view === 'login' ? (
          <Login setToken={setToken} setView={setView} />
        ) : (
          <Register setToken={setToken} setView={setView} />
        )}
      </main>

      <footer className="text-center text-[10px] text-slate-650 tracking-wide">
        &copy; {new Date().getFullYear()} DeutschLingo Study Suite. Built with MongoDB, Express, React, and Node.
      </footer>
    </div>
  );
}

export default App;
