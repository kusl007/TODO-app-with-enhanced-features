// controllers/todoController.js
const Task = require('../models/Todo');

// Create a new task
const createTask = async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  const file = req.file ? req.file.path : null;
  try {
    const task = await Task.create({ title, description, dueDate, priority, file, owner: req.user._id });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// get todos

const Todo = require("../models/Todo");

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = { createTask,getTodos };
