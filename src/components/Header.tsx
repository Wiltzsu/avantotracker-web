import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const navItems = [
  { to: '/dashboard', label: 'Koti', end: true },
  { to: '/new', label: 'Uusi' },
  { to: '/history', label: 'Historia' },
  { to: '/stats', label: 'Tilastot' },
  { to: '/records', label: 'Ennätykset' },
];

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/dashboard" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path
                d="M16 3L4 27h24L16 3z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="rgba(56,189,248,0.15)"
              />
              <path d="M10 22h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="brand-text">AvantoTracker</span>
        </Link>

        <nav className="app-nav" aria-label="Päänavigaatio">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <span className="user-chip">{user?.name?.split(' ')[0] ?? 'Käyttäjä'}</span>
          <button type="button" onClick={() => logout()} className="logout-button">
            Ulos
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
