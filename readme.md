# Todo App with Enhanced Features

## Project Overview
This project is a basic Todo application built using the MERN stack (MongoDB, Express.js, React, Node.js) with additional features like Role-Based Access Control (RBAC), file upload, search, sorting, filtering, and a fake notification service.

### Key Features:
- **User Registration & Login** with JWT authentication.
- **Role-Based Access Control (RBAC)** for different user roles (Admin, Owner, and Everyone).
- **Todo Module** for CRUD operations (Create, Read, Update, Delete) with the ability to attach files to todos.
- **Search, Sort, and Filter** todos by title, description, due date, creation date, or status.
- **Notification Service** to simulate sending a "Welcome" notification when a new user is created.
- **Simple UI** with separate pages for login, registration, and managing todos.

## Technologies Used

- **Frontend:**
  - React.js
  -  Tailwind CSS

- **Backend:**
  - Node.js
  - Express.js 

- **Database:**
  - MongoDB with Mongoose

- **Authentication:**
  - JWT (JSON Web Tokens)

- **File Upload:**
  - Express-fileupload for handling file uploads (e.g., images, documents)

## Features

### 1. User Registration & Login:
- Users can register and log in using JWT-based authentication.
- **RBAC** is implemented for different roles:
  - **Admin**: Can manage all users and todos.
  - **Owner**: Can only update/delete their todos.
  - **Everyone**: Can view todos but cannot edit or delete.
  
### 2. Todo Module:
- Users can perform CRUD operations on todos.
- Each todo has:
  - **Title** (string)
  - **Description** (string)
  - **Due Date** (date)
  - **Priority** (high, medium, low)
  - **Status** (complete, incomplete)

### 3. File Upload:
- Users can upload files (images, documents) related to each todo using **Cloudinary**.
- File metadata (file name, path) is stored in MongoDB.

### 4. Search, Sort, and Filter:
- **Search**: Todos can be searched by title and description.
- **Sort**: Todos can be sorted by due date.
- **Filter**: Todos can be filtered by creation date and status.

### 5. Notification Service:
- A fake notification system sends a "Welcome" notification when a user is created.
- Notifications are stored in the database and are shown to the user when they log in for the first time.

### 6. UI and Design:
- Simple UI with pages for login, user registration, and viewing todos.
- Todos are displayed with options to search, sort, and filter.
- Uploaded files are shown in the todo list.
- Notifications appear on first login.


## Installation and Setup

### 1. Clone the repository:
```bash
git https://github.com/kusl007/TODO-app-with-enhanced-features
cd TODO-app-with-enhanced-features 
```

## 2.Backend Setup:
- Navigate to the backend folder:
```bash
cd Backend
```
- Install dependencies:
```bash
npm install
```

- Create a .env file in the root of the backend folder and add the following environment variables:

```bash
MONGO_URI=your_mongo_database_uri
JWT_SECRET=your_jwt_secret_key
PORT=your_preferred_port
```
- Start the server:
```bash
npm run dev 
```

## Frontend Setup

### 1. Navigate to the frontend folder:
```bash
cd Frontend
```
### 2. Install dependencies:
```bash
npm install
```
### 3. Configure environment variables:
```bash
VITE_BASE_URI="http://localhost:8000"  # URL of the backend API
```
### 4. Start the frontend development server:
```bash
npm run dev
```
### The application should now be running at http://localhost:3000 (by default). You can view the app in your browser at this URL.


