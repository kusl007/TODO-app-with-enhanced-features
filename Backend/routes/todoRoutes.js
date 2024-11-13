// routes/todoRoutes.js
const express = require('express');
const { createTask } = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin, isOwner, isEveryone } = require('../middleware/roleMiddleware');
const { getTodos } = require('../controllers/todoController');
const router = express.Router();

router.post('/', protect, isOwner, createTask);
router.get('/',protect,getTodos)


module.exports = router;
