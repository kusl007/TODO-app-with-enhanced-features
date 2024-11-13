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

// Update a todo item
const updateTodo = async (req, res) => {
  try {
      const taskId = req.params.id;
      const userId = req.user.id;  // Assumes req.user is set by auth middleware

      // Find the task
      const task = await Task.findById(taskId);
      if (!task) {
          return res.status(404).json({ message: 'Task not found' });
      }

      // Check if the user is the owner or an admin
      console.log("userid=> " , userId,"owner id=> ", task.owner.toString())
      if (task.owner.toString() !== userId && req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Access denied' });
      }

      // Update the task with request body data
      const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
          new: true, // Return the updated document
          runValidators: true, // Validate before updating
      });

      res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Delete a todo item

const deleteTodo = async (req, res) => {
  try {
      const taskId = req.params.id;
      const userId = req.user.id;  // Assumes req.user is set by auth middleware

      // Find the task
      const task = await Task.findById(taskId);
      if (!task) {
          return res.status(404).json({ message: 'Task not found' });
      }

      // Check if the user is the owner or an admin
      console.log("userid=> " , userId,"owner id=> ", task.owner.toString())
      if (task.owner.toString() !== userId && req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Access denied' });
      }

      // delete the task with request body data
      await Todo.findByIdAndDelete(taskId);

      res.json({ message: 'Task deleted successfully'});
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Filter todos
const filterTodos = async (req, res) => {
  try {
    const { name, sortBy, filterBy, status } = req.query;
    let query = {};

    // Filter todos by name (title or user name)
    if (name) {
      // Check if 'name' refers to title or user name
      query.title = { $regex: name, $options: 'i' }; // Case-insensitive search for title
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Sort options
    const sortOptions = {};
    if (sortBy === 'dueDate') {
      sortOptions.dueDate = 1; // Ascending order (use -1 for descending order)
    }

    // Filter by creation date (if filterBy is 'createdAt')
    if (filterBy === 'createdAt') {
      query.createdAt = { $gte: new Date('2024-01-01') }; // Example: filter todos after January 1, 2024
    }

    // Retrieve todos with applied query, sort, and filter
    const todos = await Todo.find(query).sort(sortOptions);

    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { createTask,getTodos ,updateTodo,deleteTodo,filterTodos};
