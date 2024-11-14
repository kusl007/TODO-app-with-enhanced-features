require('dotenv').config();
const express = require('express');
const cors = require('cors');  // Import the cors package
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const uploadFile=require('./routes/uploadFile')

const cloudinary =require('./config/upload')


const notificationRoutes = require('./routes/notificationRoutes');


const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();

// Connect to the database
connectDB();


app.use(
	cors({
		origin:"*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials:true,
    allowedHeaders: ['Content-Type', 'Authorization'], 
	})
)
// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: '/tmp/',
  }));


// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/notifications', notificationRoutes);
app.post('/api/upload', uploadFile);

// Set the server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
