import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2, Loader2, ListChecks } from 'lucide-react';

export function TaskSkeleton() {
  return (
    <div className="space-y-3 w-full">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse bg-slate-900/30 border-slate-800/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="h-5 w-5 rounded-md bg-slate-800" />
              <div className="h-4 bg-slate-800 rounded w-2/3" />
            </div>
            <div className="h-5 w-5 rounded bg-slate-800" />
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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/60">
        <div className="flex items-center space-x-2">
          <ListChecks className="h-6 w-6 text-indigo-500" />
          <div>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>Manage and track your todos</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {error && <div className="error-message bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">{error}</div>}

        <form onSubmit={addTask} className="flex gap-2">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={addingTask}
            required
          />
          <Button type="submit" disabled={addingTask} className="aspect-square p-2.5">
            {addingTask ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </form>

        {loading ? (
          <TaskSkeleton />
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
            <ListChecks className="h-10 w-10 text-slate-600 mb-3" />
            <p className="text-sm text-slate-400">No tasks yet. Create one above to get started!</p>
          </div>
        ) : (
          <ul className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {tasks.map((task) => (
                <motion.li
                  key={task._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center justify-between bg-slate-900/30 border border-slate-800/50 hover:border-slate-700/60 hover:bg-slate-900/60 rounded-xl p-3.5 transition-all group ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div
                    className="flex items-center space-x-3 flex-1 cursor-pointer select-none"
                    onClick={() => toggleComplete(task._id, task.completed)}
                  >
                    <div
                      className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {task.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-sm text-slate-200 transition-all break-all ${
                        task.completed ? 'line-through text-slate-500' : ''
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-lg"
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
