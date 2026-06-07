const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// In-Memory Database fallback for tasks
const mockTasks = [];

// @route   GET api/tasks
// @desc    Get all tasks for a user
router.get('/', auth, async (req, res) => {
  if (global.useMockDB) {
    const userTasks = mockTasks
      .filter(t => t.user === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(userTasks);
  }

  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST api/tasks
// @desc    Create a new task
router.post('/', auth, async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  if (global.useMockDB) {
    const newTask = {
      _id: 'mock_t_' + Math.random().toString(36).substring(2, 9),
      user: req.user.id,
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };
    mockTasks.unshift(newTask);
    return res.status(201).json(newTask);
  }

  try {
    const newTask = new Task({
      title,
      user: req.user.id
    });
    const task = await newTask.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task
router.put('/:id', auth, async (req, res) => {
  const { title, completed } = req.body;

  if (global.useMockDB) {
    const task = mockTasks.find(t => t._id === req.params.id && t.user === req.user.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;
    
    return res.json(task);
  }

  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
router.delete('/:id', auth, async (req, res) => {
  if (global.useMockDB) {
    const index = mockTasks.findIndex(t => t._id === req.params.id && t.user === req.user.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }
    mockTasks.splice(index, 1);
    return res.json({ message: 'Task removed successfully' });
  }

  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
