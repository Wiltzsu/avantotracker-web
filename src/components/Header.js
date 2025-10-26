import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import './Header.css'

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="dashboard-header">
    <div className="header-content">
      <div className="logo">
        <span className="logo-icon">🧊</span>
        <Link to="/dashboard">
          <h1>AvantoTrackerr</h1>
        </Link>
      </div>
      <span className="welcome-text">Tervetuloa, {user?.name}!</span>
      <div className="user-menu">
        <button onClick={handleLogout} className="logout-button">
          Kirjaudu ulos
        </button>
      </div>
    </div>
  </header>
  );
};

export default Header;