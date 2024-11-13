import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const MyTodos = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [todoToUpdate, setTodoToUpdate] = useState(null);
  const [search, setSearch] = useState(''); // State for search input
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
    filterTodos(e.target.value);
  };

  // Filter todos based on the search term
  const filterTodos = (searchTerm) => {
    if (searchTerm === '') {
      setFilteredTodos(todos); // If search is empty, show all todos
    } else {
      setFilteredTodos(
        todos.filter(
          (todo) =>
            todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            todo.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
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
                    className="text-red-500 mr-4"
                    title="Delete Todo"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => openUpdateModal(todo)}
                    className="text-blue-500"
                    title="Update Todo"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-4">Update Todo</h3>
            <form onSubmit={handleSubmit(updateTodo)}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  {...register("title", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  {...register("description", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Due Date</label>
                <input
                  type="date"
                  {...register("dueDate", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Priority</label>
                <select
                  {...register("priority", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Status</label>
                <select
                  {...register("status", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="incomplete">Incomplete</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">File Upload</label>
                <input
                  type="file"
                  {...register("file")}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                  Save
                </button>
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
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
