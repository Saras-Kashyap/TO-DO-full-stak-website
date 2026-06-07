const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'SecureTask MERN Auth API is running',
    dbMode: global.useMockDB ? 'IN-MEMORY MOCK DATABASE' : 'REAL MONGODB DATABASE'
  });
});

// Database Connection & Server Startup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Set default fallback database mode
global.useMockDB = false;

const startServer = () => {
  app.listen(PORT, () => {
    console.log('======================================================');
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📂 DB Mode: ${global.useMockDB ? '⚠️ IN-MEMORY MOCK DATABASE (No Persistence)' : '❇️ REAL MONGODB DATABASE'}`);
    console.log('======================================================');
  });
};

if (!MONGO_URI) {
  console.log('\n⚠️ No MONGO_URI environment variable detected.');
  console.log('🔗 Falling back to IN-MEMORY database mode.');
  global.useMockDB = true;
  startServer();
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('\n❇️ Connected to MongoDB successfully.');
      startServer();
    })
    .catch((error) => {
      console.log('\n❌ MongoDB connection failed:', error.message);
      console.log('🔗 Falling back to IN-MEMORY database mode.');
      global.useMockDB = true;
      startServer();
    });
}
