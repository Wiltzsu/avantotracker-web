import React, { useState, useEffect } from 'react';
import Header from './Header.js';
import Footer from './Footer.js';
import { avantoAPI, AvantoStats } from '../services/api';
import './Stats.css';

const Stats: React.FC = () => {
  // Create state to hold stats (starts as null)
  const [stats, setStats] = useState<AvantoStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Call the API - gets back clean data
        const data = await avantoAPI.stats();

        // Store it in state
        setStats(data);
      } catch (err) {
        // Handle errors
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        setStats(null);
      }
    }

    fetchStats(); // Run once when component mounts
  }, []); // Empty array = only run once

  // Dummy data for now
  // const dummyStats = {
  //   total_visits: 47,
  //   total_duration: 6466,
  //   avg_temperature: -2.1,
  //   coldest_swim: -5.8,
  //   longest_swim: 8.5,
  //   this_month: 12,
  //   this_week: 3,
  //   total_sauna_sessions: 38
  // };

  return (
    <>
      <div className="stats-header">
        <Header />
      </div>

      <div className="stats-page-container">
        {/* Hero Section */}
        <section className="stats-hero">
          <div className="stats-hero-content">
            <h1>📊 Tilastot</h1>
          </div>
        </section>

        <div className="stats-main">
          {/* Primary Stats - Big Cards */}
          <section className="primary-stats-section">
            <div className="primary-stats-grid">
              <div className="primary-stat-card highlight">
                <div className="primary-stat-icon">🏊</div>
                <div className="primary-stat-content">
                  <div className="primary-stat-label">Käynnit yhteensä</div>
                    {stats ? (
                      <>
                        <div className="primary-stat-value">{stats.total_visits}</div>
                        <div className="primary-stat-subtitle">Mahtavaa työtä!</div>
                      </>
                    ) : (
                      <>
                        <div className="primary-stat-value">:/</div>
                        <div className="primary-stat-subitlte">Sinulla ei ole vielä käyntejä</div>
                      </>
                    )}
                </div>
              </div>

              <div className="primary-stat-card">
                <div className="primary-stat-icon">⏱️</div>
                <div className="primary-stat-content">
                  <div className="primary-stat-label">Avannossa vietetty aika</div>
                    {stats ? (
                      <>
                        <div className="primary-stat-value">{Math.floor(stats.total_duration / 60)} min</div>
                        <div className="primary-stat-subtitle">{stats.total_duration} sekuntia</div>
                      </>
                    ) : (
                      <>
                        <div className="primary-stat-value">0 min</div>
                      </>
                    )}
                </div>
              </div>
            </div>
          </section>

          {/* Detailed Stats Grid */}
          {/* <section className="detailed-stats-section">
            <h2>Yksityiskohtaiset tilastot</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🌡️</div>
                <div className="stat-label">Keskimääräinen lämpötila</div>
                <div className="stat-value">{dummyStats.avg_temperature}°C</div>
                <div className="stat-trend down">Kylmää!</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">❄️</div>
                <div className="stat-label">Kylmin uinti</div>
                <div className="stat-value">{dummyStats.coldest_swim}°C</div>
                <div className="stat-trend">Ennätys</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏰</div>
                <div className="stat-label">Pisin uinti</div>
                <div className="stat-value">{dummyStats.longest_swim} min</div>
                <div className="stat-trend up">Vahva suoritus</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-label">Tämä kuukausi</div>
                <div className="stat-value">{dummyStats.this_month}</div>
                <div className="stat-trend up">+3 edellisestä</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📆</div>
                <div className="stat-label">Tämä viikko</div>
                <div className="stat-value">{dummyStats.this_week}</div>
                <div className="stat-trend up">Hyvää tahtia</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-label">Sauna-istunnot</div>
                <div className="stat-value">{dummyStats.total_sauna_sessions}</div>
                <div className="stat-trend">Loistavaa!</div>
              </div>
            </div>
          </section> */}

          {/* Achievement Cards */}
          {/* <section className="achievements-section">
            <h2>Saavutukset 🏆</h2>
            <div className="achievements-grid">
              <div className="achievement-card unlocked">
                <div className="achievement-icon">🥶</div>
                <h3>Jääkuningas</h3>
                <p>Ui 50 kertaa</p>
                <div className="achievement-badge">Avattu</div>
              </div>

              <div className="achievement-card unlocked">
                <div className="achievement-icon">⏱️</div>
                <h3>Kestävyysjuoksija</h3>
                <p>Ui yli 5 minuuttia</p>
                <div className="achievement-badge">Avattu</div>
              </div>

              <div className="achievement-card locked">
                <div className="achievement-icon">❄️</div>
                <h3>Arktinen sankari</h3>
                <p>Ui 100 kertaa</p>
                <div className="achievement-badge">Lukittu</div>
              </div>

              <div className="achievement-card locked">
                <div className="achievement-icon">🎯</div>
                <h3>Viikon voittaja</h3>
                <p>Ui 7 päivää putkeen</p>
                <div className="achievement-badge">Lukittu</div>
              </div>
            </div>
          </section> */}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Stats;