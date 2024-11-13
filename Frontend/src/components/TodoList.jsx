import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  // Fetch todos from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/todos')
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
      });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Todo List</h1>
      <ul className="space-y-4">
        {todos.map(todo => (
          <li key={todo._id} className="bg-white p-4 rounded-lg shadow-lg">
            <h5 className="text-xl font-semibold">{todo.title}</h5>
            <p className="text-gray-600">{todo.description}</p>
            <p><strong>Due Date:</strong> {new Date(todo.dueDate).toLocaleDateString()}</p>
            <p><strong>Priority:</strong> {todo.priority}</p>
            <p><strong>Status:</strong> {todo.status}</p>
            {todo.file && (
              <img src={`http://localhost:5000${todo.file}`} alt="file" className="w-24 h-24 object-cover mt-2" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
