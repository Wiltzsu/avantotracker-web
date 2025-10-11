import React from 'react';
import { Link } from "react-router-dom";

import Header from './Header.js';
import Footer from './Footer.js';
import './Dashboard.css';

const Dashboard = () => {
  // Mock data - replace with real data from your API
  const stats = {
    totalAvannot: 47,
    thisWeek: 3,
    avgTemperature: -2.1,
    avgDuration: 4.5,
    totalSwearWords: 127,
    favoriteLocation: "Seurasaari"
  };

  const recentActivity = [
    { type: 'success', message: 'Uusi avanto lisätty Seurasaari', time: '2 tuntia sitten' },
    { type: 'info', message: 'Viikon tilastot päivittyivät', time: 'eilen 19:45' },
    { type: 'warning', message: 'Muistutus: Huominen aamu-uinti', time: 'huomenna 08:00' }
  ];

  return (
    <>
      <div className="dashboard-header">
        <Header />
      </div>

      <div className="dashboard-container">
        {/* Hero Section */}
        <section className="dashboard-hero">
          <div className="hero-content">
            <h1>Tervetuloa takaisin! 👋</h1>
            <p>Hallinnoi avantoja, tarkastele trendejä ja aloita nopeasti alla olevista toiminnoista.</p>
          </div>
        </section>

        <div className="dashboard-main">
          {/* Quick Actions */}
          <section className="quick-actions-section">
            <h2>Pikatoiminnot</h2>
            <div className="action-cards">
              <Link to="/new" className="action-card primary">
                <div className="action-icon">➕</div>
                <div className="action-content">
                  <h3>Uusi avanto</h3>
                  <p>Luo uusi merkintä</p>
                </div>
                <div className="action-arrow">→</div>
              </Link>

              <Link to="/stats" className="action-card secondary">
                <div className="action-icon">📊</div>
                <div className="action-content">
                  <h3>Tilastot</h3>
                  <p>Katso trendit</p>
                </div>
                <div className="action-arrow">→</div>
              </Link>

              <Link to="/history" className="action-card secondary">
                <div className="action-icon">🕒</div>
                <div className="action-content">
                  <h3>Historia</h3>
                  <p>Viimeisimmät tapahtumat</p>
                </div>
                <div className="action-arrow">→</div>
              </Link>
            </div>
          </section>

          {/* Stats Grid 
          <section className="stats-section">
            <h2>Keskeiset tilastot</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏊</div>
                <div className="stat-content">
                  <div className="stat-label">Tämän viikon avannot</div>
                  <div className="stat-value">{stats.thisWeek}</div>
                  <div className="stat-trend up">+2 viikosta</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🌡️</div>
                <div className="stat-content">
                  <div className="stat-label">Keskimääräinen lämpötila</div>
                  <div className="stat-value">{stats.avgTemperature}°C</div>
                  <div className="stat-trend down">-0.3°C</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <div className="stat-label">Keskimääräinen kesto</div>
                  <div className="stat-value">{stats.avgDuration} min</div>
                  <div className="stat-trend up">+12%</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-content">
                  <div className="stat-label">Kirosanat yhteensä</div>
                  <div className="stat-value">{stats.totalSwearWords}</div>
                  <div className="stat-trend flat">0%</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📍</div>
                <div className="stat-content">
                  <div className="stat-label">Suosituin paikka</div>
                  <div className="stat-value">{stats.favoriteLocation}</div>
                  <div className="stat-trend flat">Suosikki</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <div className="stat-label">Kokonaisavannot</div>
                  <div className="stat-value">{stats.totalAvannot}</div>
                  <div className="stat-trend up">+8%</div>
                </div>
              </div>
            </div>
          </section>*/}

          {/* Recent Activity 
          <section className="activity-section">
            <h2>Viimeisimmät tapahtumat</h2>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-dot ${activity.type}`} />
                  <div className="activity-content">
                    <div className="activity-message">{activity.message}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>*/}

          {/* Quick Tips 
          <section className="tips-section">
            <h2>Vinkkejä</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">❄️</div>
                <h4>Talvi on täällä!</h4>
                <p>Muista lämpimät vaatteet ja kuumaa juomaa avannon jälkeen.</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">📱</div>
                <h4>Ota selfie</h4>
                <p>Tallenna muistot jokaisesta avannosta kuvilla.</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🔥</div>
                <h4>Sauna on paras</h4>
                <p>Lämmittele saunassa ennen ja jälkeen avannon.</p>
              </div>
            </div>
          </section>*/}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;