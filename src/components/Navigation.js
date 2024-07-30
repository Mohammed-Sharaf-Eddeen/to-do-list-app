import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


const Navigation = ({ username, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  return (
    <nav className={username ? "navbarLoggedIn" : "navbarLoggedOut"}>
      <div className="container">
        <span className="title">TO DO LIST</span>
        {username && (
          <div className="user-controls">
            <span className="username">{username}</span>
            <FontAwesomeIcon icon={faSignOutAlt} onClick={handleLogout} className="logout-icon" />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
