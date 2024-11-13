import React, { useState, useEffect } from 'react';

const AllTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')); // Assuming user data is stored in localStorage

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/todos', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Send the token for authentication
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTodos(data);
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

  // Handle delete todo
  const deleteTodo = async (todoId, ownerId) => {
    try {
        console.log("i am in delete route frontend",todoId)
      const response = await fetch(`http://localhost:8000/api/todos/delete/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setTodos(todos.filter(todo => todo._id !== todoId));
        alert('Todo deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete todo');
      }
    } catch (error) {
      alert('Failed to delete todo');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      {todos.length === 0 ? (
        <p>No todos available</p>
      ) : (
        <ul>
          {todos.map(todo => (
            <li key={todo._id} className="flex justify-between items-center p-4 border-b">
              <div>
                <h3 className="font-bold">{todo.title}</h3>
                <p>{todo.description}</p>
                <p>Status: {todo.status}</p>
              </div>
              {(todo.owner === user.id || user.role === 'admin') && (
                <button
                  onClick={() => deleteTodo(todo._id, todo.owner)}
                  className="text-red-500"
                  title="Delete Todo"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllTodos;
