// Import the Notification model
const Notification = require('../models/Notification');

// Controller to fetch all notifications for a given user ID
const getUserNotifications = async (req, res) => {
  const { userId } = req.params; // Get user ID from request parameters
  console.log("i am here, my id is ", userId)

  try {
    // Fetch notifications for the given user ID
    const notifications = await Notification.find({ userId }).sort({ timestamp: -1 });

    // Check if notifications are found
    if (notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found for this user." });
    }

    // Return the notifications in the response
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications.", error });
  }
};

module.exports = { getUserNotifications };
