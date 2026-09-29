import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from './Footer.js';
import './Login.css';

const Login = () => {
  // State to store form input values (email and password)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // State to control password visibility (show/hide password)
  const [showPassword, setShowPassword] = useState(false);
  
  // Get authentication functions and state from AuthContext
  const { login, loading, error } = useAuth();

  // Get navigation function from React Router
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard';

  // Handle input field changes when user types
  const handleChange = (e) => {
    setFormData({
      ...formData,                      // Keep existing form data
      [e.target.name]: e.target.value   // Update the specific field that changed
    });
  };

  // Handle form submission when user signs in
  const handleSubmit = async (e) => {
    e.preventDefault();                   // Prevent page refresh
    const result = await login(formData); // Call login function with form data (AuthContext.js)
    if (result.success) {                 
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <>
      <div className="login-container">      
        <div className="login-content">
          {/* Centered Login Card */}
          <div className="login-card">
            <div className="login-header">
              <div className="logo">
                <span className="logo-icon">🧊</span>
                <h1>AvantoTracker</h1>
              </div>
              <h2>Tervetuloa</h2>
              <p>Kirjaudu sisään</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Sähköposti</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Syötä sähköposti"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Salasana</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Syötä salasana"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Kirjaudutaan...
                  </>
                ) : (
                  <>
                    <span className="button-icon">🏊‍♂️</span>
                    Kirjaudu sisään
                  </>
                )}
              </button>
            </form>

            <div className="register-footer">
              <p>
                Ei käyttäjää?{' '}
                <Link to="/register" className="register-link">
                  Luo tili
                </Link>
              </p>
            </div>

            {/* Quick feature list below login - optional */}
            {/* Feature cards below login */}
            <div className="features-preview">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <div className="feature-text">
                  <h4>Harjoitusten seuranta</h4>
                  <p>Kirjaa avantouintikertasi yksityiskohtaisilla tiedoilla</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🌡️</div>
                <div className="feature-text">
                  <h4>Lämpötilalokit</h4>
                  <p>Seuraa veden lämpötilaa ja sopeutumistasi</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⏱️</div>
                <div className="feature-text">
                  <h4>Keston seuranta</h4>
                  <p>Pidä kirjaa ajasta kylmässä vedessä</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🧘‍♂️</div>
                <div className="feature-text">
                  <h4>Mielialan seuranta</h4>
                  <p>Seuraa miten avantouinti vaikuttaa mielialaasi ja hyvinvointiisi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;