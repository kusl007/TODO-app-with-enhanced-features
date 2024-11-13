// routes/todoRoutes.js
const express = require('express');
const { createTask } = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin, isOwner, isEveryone } = require('../middleware/roleMiddleware');
const { getTodos,updateTodo, deleteTodo,getMyTodos } = require('../controllers/todoController.js');

const router = express.Router();

router.post('/', protect, isOwner, createTask);
router.get('/',protect,getTodos);
// Route to update a task (accessible by admins and owners only)
router.put('/update/:id', protect, updateTodo);
router.delete('/delete/:id', protect, deleteTodo);
router.get('/myTodos', protect, getMyTodos)
//filter todos
// router.get('/filter', filterTodos); 




module.exports = router;
