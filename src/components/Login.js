import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer.js';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null); // Add debug state
  
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDebugInfo(null); // Clear previous debug info
    
    console.log('📱 Submitting login form');
    
    const result = await login(formData);
    
    console.log('📱 Login result:', result);
    
    if (result.success) {
      console.log('✅ Login successful, redirecting to dashboard');
      navigate('/dashboard');
    } else {
      console.log('❌ Login failed:', result);
      // Store debug info for display
      setDebugInfo({
        error: result.error,
        statusCode: result.statusCode,
        timestamp: new Date().toISOString(),
        fullError: result.fullError
      });
    }
  };

  return (
    <>
      <div className="login-container">      
        <div className="login-layout">
          {/* Left side - Login form */}
          <div className="login-section">
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

                {/* Debug info display - shows detailed error on mobile */}
                {debugInfo && (
                  <div style={{
                    background: '#1e293b',
                    border: '1px solid #ef4444',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#e5e7eb',
                    overflow: 'auto',
                    maxHeight: '200px'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ef4444' }}>
                      🐛 Debug Info (Mobile):
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Status:</strong> {debugInfo.statusCode || 'N/A'}
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Time:</strong> {new Date(debugInfo.timestamp).toLocaleTimeString()}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Error:</strong> {debugInfo.error}
                    </div>
                    {debugInfo.fullError && (
                      <details style={{ marginTop: '8px' }}>
                        <summary style={{ cursor: 'pointer', color: '#60a5fa' }}>
                          Full Error Details
                        </summary>
                        <pre style={{ 
                          margin: '8px 0 0 0', 
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all'
                        }}>
                          {JSON.stringify(debugInfo.fullError, null, 2)}
                        </pre>
                      </details>
                    )}
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

                {/* <div className="login-footer">
                  <p>
                    Ei käyttäjää?{' '}
                    <Link to="/register" className="register-link">
                      Rekisteröidy
                    </Link>
                  </p>
                </div> */}
              </form>
            </div>
          </div>

          {/* Right side - Feature cards */}
          <div className="features-section">
            <div className="features-header">
            <h2>Pidä kirjaa avantouinneistasi</h2>
            <p>Seuraa edistymistäsi ja paranna kylmään veteen sopeutumistasi</p>
            </div>

            <div className="feature-highlights">
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <div className="feature-content">
                  <h3>Harjoitusten seuranta</h3>
                  <p>Kirjaa avantouintikertasi yksityiskohtaisilla tiedoilla</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🌡️</div>
                <div className="feature-content">
                  <h3>Lämpötilalokit</h3>
                  <p>Seuraa veden lämpötilaa ja omaa kylmään sopeutumistasi</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⏱️</div>
                <div className="feature-content">
                  <h3>Keston seuranta</h3>
                  <p>Pidä kirjaa siitä, kuinka kauan viivyt kylmässä vedessä</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🧘‍♂️</div>
                <div className="feature-content">
                  <h3>Mielialan seuranta</h3>
                  <p>Seuraa, miten avantouinti vaikuttaa mielialaasi ja hyvinvointiisi</p>
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