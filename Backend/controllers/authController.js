// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');


// Create a reusable function to create notifications
async function createNotification(userId,activityType) {
  console.log("hello from create notification")
 await Notification.create({ userId, activityType });
}


// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    console.log("i am in registratio, ","the data provided are",req.body)
    const user = await User.create({ username, email, password, role });
    // Log a notification after successful registration
    await createNotification(user._id, "User registered  successfully");
    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: 'Server error', error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {

      // Log a notification after successful login
      await createNotification(user._id, "User logged in successfully");
      console.log("Logged in sucessfully")
      res.json({
        user:user,
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };
