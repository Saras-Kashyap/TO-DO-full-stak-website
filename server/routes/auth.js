const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// In-Memory Database fallback for user records
const mockUsers = [];
global.mockUsers = mockUsers; // Make global so it can be referenced across models if needed

// @route   POST api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // Mock Database Mode
  if (global.useMockDB) {
    const userExists = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() || u.username === username);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        _id: 'mock_u_' + Math.random().toString(36).substring(2, 9),
        username,
        email: email.toLowerCase(),
        password: hashedPassword
      };
      mockUsers.push(newUser);

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
      return res.json({ token, user: { id: newUser._id, username, email } });
    } catch (err) {
      return res.status(500).json({ message: 'Error registering user in mock mode' });
    }
  }

  // Real MongoDB Mode
  try {
    let user = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Mock Database Mode
  if (global.useMockDB) {
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
    return res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  }

  // Real MongoDB Mode
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/auth/me
// @desc    Get current user's profile
router.get('/me', require('../middleware/authMiddleware'), async (req, res) => {
  if (global.useMockDB) {
    const user = mockUsers.find(u => u._id === req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ id: user._id, username: user.username, email: user.email });
  }

  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user._id, username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
