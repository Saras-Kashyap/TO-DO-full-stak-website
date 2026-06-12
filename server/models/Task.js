const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  // German Vocabulary Deck additions
  german: {
    type: String,
    trim: true
  },
  english: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  exampleGerman: {
    type: String,
    trim: true
  },
  exampleEnglish: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);
