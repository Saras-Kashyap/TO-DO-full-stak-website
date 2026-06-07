import React, { useState, useEffect } from 'react';
import api from '../api';

const TodoList = ({ handleLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await api.post('/tasks', { title });
      setTasks([response.data, ...tasks]);
      setTitle('');
    } catch (err) {
      setError('Failed to create task.');
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const response = await api.put(`/tasks/${id}`, { completed: !completed });
      setTasks(tasks.map(task => task._id === id ? response.data : task));
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>Your Tasks</h2>
        <button onClick={handleLogout} className="btn btn-secondary">
          Sign Out
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={addTask} className="todo-form">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </form>

      {loading ? (
        <div className="loading-spinner">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Create one above to get started!</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-left" onClick={() => toggleComplete(task._id, task.completed)}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {}} // Handled by outer click
                />
                <span className="task-title">{task.title}</span>
              </div>
              <button onClick={() => deleteTask(task._id)} className="btn-delete" title="Delete Task">
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
