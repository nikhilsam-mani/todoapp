const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Get all todos (with optional status filter)
// Get all todos with optional status filter and pagination
router.get('/all', async (req, res) => {
  try {
    const { status, page = 1 } = req.query;
    const ITEMS_PER_PAGE = 10;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const totalCount = await Todo.countDocuments(filter);
    const todos = await Todo.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.json({
      page: Number(page),
      totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
      totalItems: totalCount,
      itemsPerPage: ITEMS_PER_PAGE,
      todos
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Get a single todo
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a todo
router.post('/create', async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !description || !status) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const todo = await Todo.create({ title, description, status });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a todo
router.put('/update/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (status !== undefined) todo.status = status;

    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a todo
router.delete('/delete/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;