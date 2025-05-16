// models/Todo.js - Todo model schema
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a Title'],
    trim: true,
  },
    description: {
    type: String,
    required: [true, 'Please add a Description'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed'], 
    required: true,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Todo', todoSchema);