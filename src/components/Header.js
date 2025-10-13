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
        <a href="/dashboard">
        <h1>AvantoTracker</h1>
        </a>
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