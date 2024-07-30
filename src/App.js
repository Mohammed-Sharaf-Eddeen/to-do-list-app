import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import setAuthToken from './utils/setAuthToken';
import Navigation from './components/Navigation';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      navigate('/tasks');

      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.user.username);
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUsername('');
    navigate('/login');
  };

  return (
    <div className="App">
      <Navigation username={username} onLogout={handleLogout} />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/" element={<Navigate to="/login" />} />

      </Routes>
    </div>
  );
};

export default App;
