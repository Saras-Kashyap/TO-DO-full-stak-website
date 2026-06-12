const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// In-Memory Database fallback for tasks
const mockTasks = [];

// @route   GET api/tasks
// @desc    Get all tasks/vocab cards for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  if (global.useMockDB) {
    const userTasks = mockTasks
      .filter(t => t.owner === req.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(userTasks);
  }

  try {
    const tasks = await Task.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST api/tasks
// @desc    Create a new task/vocab card for the logged-in user
router.post('/', authMiddleware, async (req, res) => {
  const { title, german, english, category, exampleGerman, exampleEnglish } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  if (global.useMockDB) {
    const newTask = {
      _id: 'mock_t_' + Math.random().toString(36).substring(2, 9),
      owner: req.userId,
      title,
      completed: false,
      german: german || '',
      english: english || '',
      category: category || '',
      exampleGerman: exampleGerman || '',
      exampleEnglish: exampleEnglish || '',
      createdAt: new Date().toISOString()
    };
    mockTasks.unshift(newTask);
    return res.status(201).json(newTask);
  }

  try {
    const newTask = new Task({
      title,
      owner: req.userId,
      german,
      english,
      category,
      exampleGerman,
      exampleEnglish
    });
    const task = await newTask.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task/vocab card belonging to the logged-in user
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, completed, german, english, category, exampleGerman, exampleEnglish } = req.body;

  if (global.useMockDB) {
    const task = mockTasks.find(t => t._id === req.params.id && t.owner === req.userId);
    if (!task) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;
    if (german !== undefined) task.german = german;
    if (english !== undefined) task.english = english;
    if (category !== undefined) task.category = category;
    if (exampleGerman !== undefined) task.exampleGerman = exampleGerman;
    if (exampleEnglish !== undefined) task.exampleEnglish = exampleEnglish;
    
    return res.json(task);
  }

  try {
    let task = await Task.findOne({ _id: req.params.id, owner: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;
    if (german !== undefined) task.german = german;
    if (english !== undefined) task.english = english;
    if (category !== undefined) task.category = category;
    if (exampleGerman !== undefined) task.exampleGerman = exampleGerman;
    if (exampleEnglish !== undefined) task.exampleEnglish = exampleEnglish;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task/vocab card belonging to the logged-in user
router.delete('/:id', authMiddleware, async (req, res) => {
  if (global.useMockDB) {
    const index = mockTasks.findIndex(t => t._id === req.params.id && t.owner === req.userId);
    if (index === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }
    mockTasks.splice(index, 1);
    return res.json({ message: 'Item removed successfully' });
  }

  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
