import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AllTodos from './components/AllTodos';
import MyTodos from './components/MyTodos';
import CreateTodo from './components/CreateTodo';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>  
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateTodo />} />
          <Route 
            path="/todos" 
            element={user ? <TodoList /> : <Login setUser={setUser} />} 
          />
          <Route path="/" element={<Login setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
