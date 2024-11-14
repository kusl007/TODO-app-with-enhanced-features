// controllers/todoController.js
const Task = require("../models/Todo");
const fs = require("fs");
const path = require("path");
const Notification = require('../models/Notification');
const {uploadImageToCloudinary}=require('./uploadController')

// Create a reusable function to create notifications
async function createNotification(userId,activityType, message) {
  console.log("hello from create notification")
 await Notification.create({ userId, activityType,message });
}

// Create a new task
const createTask = async (req, res) => {
  try {
    // Destructure the fields from the request body
    const { title, description, dueDate, priority, status } = req.body;
    console.log(req.body);
    console.log("my id is ", req.user.id);
    const file = req.files?.file; // If the file exists in the request
    console.log("i am here jst before calling cloudinaary")

    const result=await uploadImageToCloudinary(file)
    console.log(result);
    // Validate required fields
    if (!title || !description || !dueDate || !priority || !status) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if file is provided
    let filePath = null;
    if (file) {
      // Generate a path where the file will be stored
      filePath = path.join(
        __dirname,
        "..",
        "uploads",
        `${Date.now()}.${file.name.split(".").pop()}`
      );

      // Move the file to the server directory
      file.mv(filePath, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "File upload failed.", error: err });
        }
      });
    }

    console.log("i am here");
    // Create a new Todo
    const newTodo = new Todo({
      title,
      description,
      dueDate,
      priority,
      status,
      owner:req.user.id,
      
      file: result, // Save the file path if file is uploaded
    });

    // Save the new Todo to the database
    await newTodo.save();

    // Create a notification for the task creation
    await createNotification(req.user.id, `Created a new task`, title);

    res
      .status(201)
      .json({ message: "Todo created successfully", todo: newTodo });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Something went wrong. Please try again later.",
        error,
      });
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
    console.log("hello the update todo data are ",req.body)
    const taskId = req.params.id;
    const userId = req.user.id;  // Assumes req.user is set by authentication middleware
    const { title, description, dueDate, priority, status } = req.body;
    const file=req.files?.file

    // Find the task
    const todo = await Todo.findById(taskId);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Check if the user is the owner or an admin
    if (todo.owner.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to update this todo' });
    }

    // Update fields if provided
    if (title) todo.title = title;
    if (description) todo.description = description;
    if (dueDate) todo.dueDate = dueDate;
    if (priority) todo.priority = priority;
    if (status) todo.status = status;
    if (file){
      const result=await uploadImageToCloudinary(file)
    console.log(result);
    todo.file=result
    }

    await todo.save();
    // Create a notification for the task updation
    await createNotification(req.user.id, `updated the task`, title);

    res.json({ message: 'Todo updated successfully', todo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Delete a todo item

const deleteTodo = async (req, res) => {
  try {
    console.log("hello")
    const taskId = req.params.id;
    const userId = req.user.id; 
  console.log("userid is, ", userId);
  console.log("taskId is, ",taskId );
    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the user is the owner or an admin
    console.log("userid=> ", userId, "owner id=> ", task.owner.toString());
    if (task.owner.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // delete the task with request body data
    await Todo.findByIdAndDelete(taskId);
    // Create a notification for the task deletion
    await createNotification(req.user.id, `deleted the task`, "");

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};






// Controller to fetch all tasks created by the authenticated user

const getMyTodos = async (req, res) => {
  try {
    // Get user ID from the decoded token (set by the authenticateToken middleware)
    const userId = req.user.id;
    console.log(userId);

    // Fetch tasks where the userId matches the authenticated user's ID
    const tasks = await Task.find({ owner: userId });
    console.log("the todos are", tasks);

    // If no tasks are found, return a message
    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found for this user." });
    }

    // Send the found tasks back in the response
    res.status(200).json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  createTask,
  getTodos,
  updateTodo,
  deleteTodo,
  getMyTodos,
};
