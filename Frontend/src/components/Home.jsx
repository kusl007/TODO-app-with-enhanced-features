import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Get user info from localStorage
  const id = localStorage.getItem("id"); // Get user info from localStorage
  console.log(localStorage.getItem("id"))
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl p-6 bg-white rounded-lg shadow-lg w-full">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          Welcome to Todo App
        </h1>

        {user ? (
          <p className="text-center text-xl mb-6">
            Hello, <span className="font-semibold">{user.username}</span>! Let's manage your tasks.
          </p>
        ) : (
          <p className="text-center text-xl mb-6">
            You are not logged in. Please{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              log in
            </Link>{" "}
            or{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              register
            </Link>{" "}
            to get started. 
          </p>
        )}

        <div className="flex flex-col items-center space-y-4">
          <Link
            to="/create"
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow"
          >
            Create Todo
          </Link>

          {user && (
            <Link
              to={`/notifications/${id}`}
              className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md shadow"
            >
              Notifications
            </Link>
          )}

          <Link
            to="/dashboard"
            className="text-white bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-md shadow"
          >
            View Todos
          </Link>

          <div className="flex space-x-4 mt-6">
            {!user && (
              <>
                <Link
                  to="/register"
                  className="text-white bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-md shadow"
                >
                  Register
                </Link>

                <Link
                  to="/login"
                  className="text-white bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded-md shadow"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
