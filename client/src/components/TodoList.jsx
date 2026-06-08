import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Loader2, ListChecks } from 'lucide-react';

export function TaskSkeleton() {
  return (
    <div className="space-y-3 w-full">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse bg-slate-950/20 border-slate-900/40">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="h-4.5 w-4.5 rounded-full bg-slate-800" />
              <div className="h-4 bg-slate-800 rounded w-1/2" />
            </div>
            <div className="h-4 w-4 rounded bg-slate-800" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingTask, setAddingTask] = useState(false);

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

    setAddingTask(true);
    try {
      const response = await api.post('/tasks', { title });
      setTasks([response.data, ...tasks]);
      setTitle('');
    } catch (err) {
      setError('Failed to create task.');
    } finally {
      setAddingTask(false);
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
    <Card className="w-full border-slate-900 bg-slate-950/20 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-slate-900/60 p-8">
        <div className="flex items-center space-x-3">
          <ListChecks className="h-5 w-5 text-indigo-500" />
          <div>
            <CardTitle className="text-lg font-medium text-slate-100">Tasks</CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">Focus on what matters next.</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 space-y-6">
        {error && <div className="text-red-400 bg-red-950/10 border border-red-900/30 p-3 rounded-lg text-xs">{error}</div>}

        <form onSubmit={addTask} className="flex items-center gap-3 py-1 border-b border-slate-900/60 focus-within:border-indigo-500/40 transition-all duration-300">
          <Input
            type="text"
            placeholder="Write a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={addingTask}
            className="border-0 bg-transparent px-0 py-2.5 h-11 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent placeholder:text-slate-650 text-slate-200 flex-1"
            required
          />
          <Button type="submit" disabled={addingTask} size="sm" variant="ghost" className="h-9 w-9 p-0 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/5 rounded-lg shrink-0">
            {addingTask ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Plus className="h-4.5 w-4.5" />}
          </Button>
        </form>

        {loading ? (
          <TaskSkeleton />
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-slate-900 rounded-xl bg-slate-950/5">
            <ListChecks className="h-8 w-8 text-slate-700 mb-3" />
            <p className="text-xs text-slate-500">No tasks. Enjoy your clean space!</p>
          </div>
        ) : (
          <ul className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {tasks.map((task) => (
                <motion.li
                  key={task._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
                  className={`flex items-center justify-between bg-slate-950/10 border border-slate-900/40 hover:border-slate-800/80 hover:bg-slate-950/20 rounded-xl p-4 transition-all duration-300 hover:scale-[1.01] group ${
                    task.completed ? 'opacity-50' : ''
                  }`}
                >
                  <div
                    className="flex items-center space-x-3.5 flex-1 cursor-pointer select-none"
                    onClick={() => toggleComplete(task._id, task.completed)}
                  >
                    {!task.completed ? (
                      <div className="h-4.5 w-4.5 rounded-full border border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all duration-200 shrink-0" />
                    ) : (
                      <span className="text-emerald-500 font-bold text-xs shrink-0 select-none">✓</span>
                    )}
                    <span
                      className={`text-sm transition-all duration-300 break-all leading-relaxed ${
                        task.completed ? 'line-through text-slate-500' : 'text-slate-350'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-lg shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task._id);
                    }}
                    title="Delete Task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoList;
