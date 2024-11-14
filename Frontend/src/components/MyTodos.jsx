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
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending
  const user = JSON.parse(localStorage.getItem('user'));
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchMyTodos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/todos/myTodos`, {
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
    filterTodos(e.target.value, dueDateFilter, createdDateFilter, sortOrder);
  };

  // Handle Due Date filter change
  const handleDueDateChange = (e) => {
    setDueDateFilter(e.target.value);
    filterTodos(search, e.target.value, createdDateFilter, sortOrder);
  };

  // Handle Created Date filter change
  const handleCreatedDateChange = (e) => {
    setCreatedDateFilter(e.target.value);
    filterTodos(search, dueDateFilter, e.target.value, sortOrder);
  };

  // Handle Sort by Due Date
  const handleSortByDueDate = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    filterTodos(search, dueDateFilter, createdDateFilter, newSortOrder);
  };

  // Filter todos based on search, Due Date, and Created Date
  const filterTodos = (searchTerm, dueDate, createdDate, order) => {
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

    // Sort by due date
    if (order) {
      filtered = filtered.sort((a, b) => {
        const dueDateA = new Date(a.dueDate);
        const dueDateB = new Date(b.dueDate);
        return order === 'asc' ? dueDateA - dueDateB : dueDateB - dueDateA;
      });
    }

    setFilteredTodos(filtered);
  };

  // Handle delete todo
  const deleteTodo = async (todoId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/todos/delete/${todoId}`, {
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
      const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/todos/update/${todoToUpdate._id}`, {
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

      {/* Sort by Due Date Button */}
      <button
        onClick={handleSortByDueDate}
        className="bg-green-500 text-white p-2 rounded mb-4"
      >
        Sort by Due Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </button>

      {filteredTodos.length === 0 ? (
        <p>No todos available</p>
      ) : (
        <ul>
          {filteredTodos.map(todo => (
            <li key={todo._id} className="flex justify-between items-center p-4 border-b">
              <div>
                <h3 className="font-bold">{todo.title}</h3>
                <img src={todo.file} alt="TODO" className='w-24 h-24 rounded-full m-4' />

                <p>{todo.description}</p>
                <p>Due Date: {new Date(todo.dueDate).toLocaleDateString()}</p>
                <p>created At: {new Date(todo.createdAt).toLocaleDateString()}</p>
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

      {/* Update Todo Modal */}
      {isUpdateModalOpen && (
  <div className="modal-overlay flex justify-center items-center fixed inset-0 bg-gray-500 bg-opacity-50">
    <div className="modal flex flex-col p-6 bg-white rounded-t-lg w-full max-w-lg">
      <h2 className="font-bold text-xl mb-4">Update Todo</h2>
      <form onSubmit={handleSubmit(updateTodo)}>
        <label className="block mb-1 font-medium text-gray-700">Title</label>
        <input
          type="text"
          placeholder="Title"
          {...register("title")}
          className="p-2 border rounded mb-4 w-full"
        />

        <label className="block mb-1 font-medium text-gray-700">Description</label>
        <textarea
          placeholder="Description"
          {...register("description")}
          className="p-2 border rounded mb-4 w-full"
        />

        <label className="block mb-1 font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          {...register("dueDate")}
          className="p-2 border rounded mb-4 w-full"
        />

        <label className="block mb-1 font-medium text-gray-700">Priority</label>
        <select {...register("priority")} className="p-2 border rounded mb-4 w-full">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <label className="block mb-1 font-medium text-gray-700">Status</label>
        <select {...register("status")} className="p-2 border rounded mb-4 w-full">
          <option value="complete">Complete</option>
          <option value="incomplete">Incomplete</option>
        </select>

        <label className="block mb-1 font-medium text-gray-700">File Upload</label>
        <input type="file" {...register("file")} className="mb-4" />

        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Update</button>
          <button
            type="button"
            onClick={() => setIsUpdateModalOpen(false)}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default MyTodos;
