import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-blue-600 shadow-md">
      <h1 className="text-2xl text-white font-bold">Todo App</h1>
      <div className="flex space-x-6">
        <Link 
          to="/" 
          className=" text-lg hover:text-gray-600 transition-colors duration-200 bg-[#dadada] p-2 rounded-lg text-yellow-900"
        >
          Home
        </Link>
        <Link 
          to="/create" 
          className=" text-lg hover:text-gray-600 transition-colors duration-200 bg-[#dadada] p-2 rounded-lg text-yellow-900"
          
        >
          Create Todo
        </Link>
        <Link 
          to="/dashboard" 
          className=" text-lg hover:text-gray-600 transition-colors duration-200 bg-[#dadada] p-2 rounded-lg text-yellow-900"
          
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
