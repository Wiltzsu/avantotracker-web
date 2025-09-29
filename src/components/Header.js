import React from 'react';
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
        <h1>AvantoTracker</h1>
      </div>
      <div className="user-menu">
        <span className="welcome-text">Welcome, {user?.name}!</span>
        <button onClick={handleLogout} className="logout-button">
          <span>🚪</span>
          Logout
        </button>
      </div>
    </div>
  </header>
  );
};

export default Header;