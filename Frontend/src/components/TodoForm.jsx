import React, { useState } from 'react';
import axios from 'axios';

const TodoForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('incomplete');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('dueDate', dueDate);
    formData.append('priority', priority);
    formData.append('status', status);
    if (file) formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/todos/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Todo created successfully');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-4">Add a New Todo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Title</label>
          <input
            type="text"
            className="p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Description</label>
          <textarea
            className="p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Due Date</label>
          <input
            type="date"
            className="p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Priority</label>
          <select
            className="p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Status</label>
          <select
            className="p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="incomplete">Incomplete</option>
            <option value="complete">Complete</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Upload File</label>
          <input
            type="file"
            className="p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Save Todo
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
