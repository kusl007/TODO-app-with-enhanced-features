import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // For navigation to login/signup pages

  // Retrieve the user from localStorage (parse it as a JSON object)
  const user = JSON.parse(localStorage.getItem('user'));

  // Check if the user is available
  if (!user) {
    return (
      <div className="text-center py-4 text-red-500">
        User not found. Please log in.
        {/* Login and Signup buttons */}
        <div className="mt-4">
          <button
            onClick={() => navigate('/login')} // Navigate to login page
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')} // Navigate to signup page
            className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  const id = localStorage.getItem('id'); // Assuming the user object has an 'id' field

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch notifications from backend API
        const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/notifications/user/${id}`);
        setNotifications(response.data.notifications);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch notifications");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [id]); // Make sure to use the correct dependency

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading notifications...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications found.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200">
              <p className="text-lg font-medium text-gray-800">{notification.activityType}</p>
              <p className="text-sm text-gray-600">{new Date(notification.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
