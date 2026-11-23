import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="login-page">
      <main className="login-panel">
        <p className="login-wordmark">AvantoTracker</p>
        <h1>Kirjaudu sisään</h1>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <label className="login-field">
            <span>Sähköposti</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>

          <label className="login-field">
            <span>Salasana</span>
            <div className="login-password">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="login-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-pressed={showPassword}
              >
                {showPassword ? 'Piilota' : 'Näytä'}
              </button>
            </div>
          </label>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Kirjaudutaan…' : 'Kirjaudu sisään'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
