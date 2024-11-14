import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';



const AllTodos = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [todoToUpdate, setTodoToUpdate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');
  const [createdDateFilter, setCreatedDateFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('ascending');
  const user = JSON.parse(localStorage.getItem('user'));
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/todos`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTodos(data);
          setFilteredTodos(data);
        } else {
          throw new Error('Failed to fetch todos');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterTodos(query, dueDateFilter, createdDateFilter, sortOrder);
  };

  const filterTodos = (query, dueDate, createdDate, sortOrder) => {
    let filtered = todos;

    if (query) {
      filtered = filtered.filter((todo) =>
        todo.title.toLowerCase().includes(query) ||
        todo.description.toLowerCase().includes(query)
      );
    }

    if (dueDate) {
      filtered = filtered.filter((todo) => new Date(todo.dueDate).toLocaleDateString() === new Date(dueDate).toLocaleDateString());
    }

    if (createdDate) {
      filtered = filtered.filter((todo) => new Date(todo.createdAt).toLocaleDateString() === new Date(createdDate).toLocaleDateString());
    }

    if (sortOrder === 'ascending') {
      filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortOrder === 'descending') {
      filtered.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    }

    setFilteredTodos(filtered);
  };

  const deleteTodo = async (todoId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/todos/delete/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setTodos(todos.filter(todo => todo._id !== todoId));
        setFilteredTodos(filteredTodos.filter(todo => todo._id !== todoId));
        alert('Todo deleted successfully!');
      } else {
        alert('Failed to delete todo');
      }
    } catch (error) {
      alert('Failed to delete todo');
    }
  };

  const openUpdateModal = (todo) => {
    setTodoToUpdate(todo);
    reset({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      priority: todo.priority,
      status: todo.status,
    });
    setIsUpdateModalOpen(true);
  };

  const updateTodo = async (data) => {
    console.log("i am in update todo")
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('dueDate', data.dueDate);
    formData.append('priority', data.priority);
    formData.append('status', data.status);
    if (data.file[0]) formData.append('file', data.file[0]);
    console.log("i am file ",data.file[0])

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
        setTodos(todos.map(todo => (todo._id === updatedTodo._id ? updatedTodo : todo)));
        setFilteredTodos(filteredTodos.map(todo => (todo._id === updatedTodo._id ? updatedTodo : todo)));
        alert('Todo updated successfully!');
        setIsUpdateModalOpen(false);
      } else {
        alert('Failed to update todo');
      }
    } catch (error) {
      alert('Failed to update todo');
    }
  };

  const handleDueDateChange = (e) => {
    setDueDateFilter(e.target.value);
    filterTodos(searchQuery, e.target.value, createdDateFilter, sortOrder);
  };

  const handleCreatedDateChange = (e) => {
    setCreatedDateFilter(e.target.value);
    filterTodos(searchQuery, dueDateFilter, e.target.value, sortOrder);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    filterTodos(searchQuery, dueDateFilter, createdDateFilter, e.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      {/* Search bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by title or description"
        className="p-2 border rounded mb-4 w-full"
      />

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <div>
          <label>Due Date</label>
          <input
            type="date"
            value={dueDateFilter}
            onChange={handleDueDateChange}
            className="p-2 border rounded"
          />
        </div>
        <div>
          <label>Created Date</label>
          <input
            type="date"
            value={createdDateFilter}
            onChange={handleCreatedDateChange}
            className="p-2 border rounded"
          />
        </div>
        
        <div  >
          <label>Sort by Due Date</label>
          <select value={sortOrder} onChange={handleSortOrderChange} className="p-2 border rounded">
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
      </div>

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
              {(todo.owner === user.id || user.role === 'admin') && (
                <div>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="bg-red-500 text-white p-2 rounded mr-2"

                    title="Delete Todo"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => openUpdateModal(todo)}
                    className="bg-blue-500 text-white p-2 rounded"

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

export default AllTodos;
