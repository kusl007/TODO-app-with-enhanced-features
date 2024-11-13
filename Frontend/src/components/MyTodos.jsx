import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const MyTodos = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [todoToUpdate, setTodoToUpdate] = useState(null);
  const [search, setSearch] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');
  const [createdDateFilter, setCreatedDateFilter] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchMyTodos = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/todos/myTodos', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTodos(data.tasks);
          setFilteredTodos(data.tasks); // Initially set filteredTodos to all todos
        } else {
          throw new Error('Failed to fetch your todos');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTodos();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    filterTodos(e.target.value, dueDateFilter, createdDateFilter);
  };

  // Handle Due Date filter change
  const handleDueDateChange = (e) => {
    setDueDateFilter(e.target.value);
    filterTodos(search, e.target.value, createdDateFilter);
  };

  // Handle Created Date filter change
  const handleCreatedDateChange = (e) => {
    setCreatedDateFilter(e.target.value);
    filterTodos(search, dueDateFilter, e.target.value);
  };

  // Filter todos based on search, Due Date, and Created Date
  const filterTodos = (searchTerm, dueDate, createdDate) => {
    let filtered = todos;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          todo.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Due Date filter (Single date filter)
    if (dueDate) {
      filtered = filtered.filter((todo) => {
        const todoDueDate = new Date(todo.dueDate).toLocaleDateString();
        return todoDueDate === new Date(dueDate).toLocaleDateString();
      });
    }

    // Created Date filter (Single date filter)
    if (createdDate) {
      filtered = filtered.filter((todo) => {
        const todoCreatedDate = new Date(todo.createdAt).toLocaleDateString();
        return todoCreatedDate === new Date(createdDate).toLocaleDateString();
      });
    }

    setFilteredTodos(filtered);
  };

  // Handle delete todo
  const deleteTodo = async (todoId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/todos/delete/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setTodos(prevTodos => prevTodos.filter(todo => todo._id !== todoId));
        alert('Todo deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete todo');
      }
    } catch (error) {
      alert('Failed to delete todo');
    }
  };

  // Open the update form with the selected todo's data
  const openUpdateModal = (todo) => {
    setTodoToUpdate(todo);
    reset({
      title: todo.title,
      description: todo.description,
      dueDate: new Date(todo.dueDate).toISOString().split('T')[0], // Format as yyyy-mm-dd
      priority: todo.priority,
      status: todo.status,
    });
    setIsUpdateModalOpen(true);
  };

  // Handle updating a todo
  const updateTodo = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("dueDate", data.dueDate);
    formData.append("priority", data.priority);
    formData.append("status", data.status);

    // File validation can go here (e.g., check file size or type)
    if (data.file && data.file[0]) {
      formData.append("file", data.file[0]);
    }

    try {
      const response = await fetch(`http://localhost:8000/api/todos/update/${todoToUpdate._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(prevTodos => prevTodos.map(todo => (todo._id === updatedTodo._id ? updatedTodo : todo)));
        alert('Todo updated successfully!');
        setIsUpdateModalOpen(false);
      } else {
        alert('Failed to update todo');
      }
    } catch (error) {
      alert('Failed to update todo');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by title or description..."
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Date Filters */}
      <div className="mb-4">
        <label>Due Date:</label>
        <input
          type="date"
          value={dueDateFilter}
          onChange={handleDueDateChange}
          className="p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label>Created Date:</label>
        <input
          type="date"
          value={createdDateFilter}
          onChange={handleCreatedDateChange}
          className="p-2 border rounded"
        />
      </div>

      {filteredTodos.length === 0 ? (
        <p>No todos available</p>
      ) : (
        <ul>
          {filteredTodos.map(todo => (
            <li key={todo._id} className="flex justify-between items-center p-4 border-b">
              <div>
                <h3 className="font-bold">{todo.title}</h3>
                <p>{todo.description}</p>
                <p>Due Date: {new Date(todo.dueDate).toLocaleDateString()}</p>
                <p>Priority: {todo.priority}</p>
                <p>Status: {todo.status}</p>
              </div>
              {(todo.owner === user._id || user.role === 'admin') && (
                <div>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="bg-red-500 text-white p-2 rounded mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => openUpdateModal(todo)}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Update
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="modal">
          <form onSubmit={handleSubmit(updateTodo)} className="p-4">
            <h2>Update Todo</h2>
            <label>Title</label>
            <input {...register('title')} required className="p-2 border rounded mb-2" />
            <label>Description</label>
            <textarea {...register('description')} required className="p-2 border rounded mb-2" />
            <label>Due Date</label>
            <input type="date" {...register('dueDate')} required className="p-2 border rounded mb-2" />
            <label>Priority</label>
            <input type="text" {...register('priority')} required className="p-2 border rounded mb-2" />
            <label>Status</label>
            <input type="text" {...register('status')} required className="p-2 border rounded mb-2" />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Update Todo
            </button>
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(false)}
              className="bg-gray-500 text-white p-2 rounded ml-2"
            >
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyTodos;
