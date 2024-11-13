import React, { useState } from 'react';
import AllTodos from './AllTodos';
import MyTodos from './MyTodos';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [view, setView] = useState('my'); // Default to My Todos

  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className='flex justify-between'>

      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <Link to='/create'>
      <h2 className="text-2xl font-bold mb-4">Create Todo</h2>
      </Link>
        </div>

      {/* Buttons to toggle between views */}
      <div className="mb-4">
        <button
          onClick={() => handleViewChange('my')}
          className={`mr-4 px-4 py-2 rounded-md ${view === 'my' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          My Todos
        </button>
        <button
          onClick={() => handleViewChange('all')}
          className={`px-4 py-2 rounded-md ${view === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All Todos
        </button>
      </div>

      {/* Conditionally render AllTodos or MyTodos based on state */}
      {view === 'my' ? <MyTodos /> : <AllTodos />}
    </div>
  );
};

export default Dashboard;
