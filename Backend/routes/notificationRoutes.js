const express = require('express');
const { getUserNotifications } = require('../controllers/notificationController'); // Import the controller
const router = express.Router();

// Define a route to get notifications by user ID
router.get('/user/:userId', getUserNotifications);

module.exports = router;
