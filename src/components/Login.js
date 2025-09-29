import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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

  // Handle input field changes (when user types)
  const handleChange = (e) => {
    setFormData({
      ...formData,                      // Keep existing form data
      [e.target.name]: e.target.value   // Update the specific field that changed
    });
  };

  // Handle form submission (when user clicks "Sign In")
  const handleSubmit = async (e) => {
    e.preventDefault();                   // Prevent page refresh
    const result = await login(formData); // Call login function with form data
    if (result.success) {                 // If login successful
      navigate('/dashboard');             // Redirect to dashboard page
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="ice-pattern"></div>
      </div>
      
      <div className="login-layout">
        {/* Left side - Login form */}
        <div className="login-section">
          <div className="login-card">
            <div className="login-header">
              <div className="logo">
                <span className="logo-icon">🧊</span>
                <h1>AvantoTracker</h1>
              </div>
              <h2>Welcome Back</h2>
              <p>Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
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
                    Signing in...
                  </>
                ) : (
                  <>
                    <span className="button-icon">🏊‍♂️</span>
                    Sign In
                  </>
                )}
              </button>

              <div className="login-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="register-link">
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Feature cards */}
        <div className="features-section">
          <div className="features-header">
            <h2>Track Your Ice Swimming Journey</h2>
            <p>Monitor your progress and improve your cold water adaptation</p>
          </div>

          <div className="feature-highlights">
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div className="feature-content">
                <h3>Track Sessions</h3>
                <p>Log your ice swimming sessions with detailed metrics</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🌡️</div>
              <div className="feature-content">
                <h3>Temperature Logs</h3>
                <p>Monitor water temperature and track your cold adaptation</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⏱️</div>
              <div className="feature-content">
                <h3>Duration Tracking</h3>
                <p>Keep track of how long you stay in the cold water</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🧘‍♂️</div>
              <div className="feature-content">
                <h3>Mood Tracking</h3>
                <p>Monitor how ice swimming affects your mood and wellbeing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
