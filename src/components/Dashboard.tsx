import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header.js';
import Footer from './Footer.js';
import { avantoAPI, DashboardData } from '../services/api';
import { getApiErrorMessage } from '../utils/apiErrors';
import {
  formatDaysSince,
  formatMoodDelta,
  formatSecondsAsDuration,
  formatTemperature,
} from '../utils/statsFormatters';
import { formatDate, formatDuration, getTemperatureColor } from '../utils/formatters';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await avantoAPI.dashboard();
        setDashboard(data);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Etusivun lataus epäonnistui.'));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const snapshot = dashboard?.monthly_snapshot;

  return (
    <>
      <div className="dashboard-header">
        <Header />
      </div>

      <div className="dashboard-container">
        <section className="dashboard-hero">
          <div className="hero-content">
            <h1>Tervetuloa takaisin! 👋</h1>
            <p>
              {dashboard
                ? `Viimeisin avanto ${formatDaysSince(dashboard.days_since_last_dip).toLowerCase()}.`
                : 'Hallinnoi avantokäyntejä, tarkastele trendejä ja tilastoja alla olevista toiminnoista.'}
            </p>
          </div>
        </section>

        <div className="dashboard-main">
          <section className="quick-actions-section">
            <h2>Pikatoiminnot</h2>
            <div className="action-cards">
              <Link to="/new" className="action-card primary">
                <div className="action-icon">+</div>
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

          {loading && <div className="dashboard-state">Ladataan etusivua...</div>}
          {error && <div className="dashboard-error">{error}</div>}

          {!loading && !error && dashboard && snapshot && (
            <>
              <section className="stats-section">
                <h2>Tämän kuun tilanne</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">🏊</div>
                    <div className="stat-content">
                      <div className="stat-label">Käynnit</div>
                      <div className="stat-value">{snapshot.visits}</div>
                      <div className="stat-trend flat">{snapshot.label}</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-content">
                      <div className="stat-label">Kylmäaika</div>
                      <div className="stat-value">
                        {formatSecondsAsDuration(snapshot.total_duration)}
                      </div>
                      <div className="stat-trend up">
                        Keskimäärin {formatSecondsAsDuration(snapshot.average_duration)}
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-content">
                      <div className="stat-label">Putki</div>
                      <div className="stat-value">{dashboard.current_streak_days} pv</div>
                      <div className="stat-trend flat">Paras {dashboard.best_streak_days} pv</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🌡️</div>
                    <div className="stat-content">
                      <div className="stat-label">Keskilämpö</div>
                      <div className="stat-value">
                        {formatTemperature(snapshot.average_water_temperature)}
                      </div>
                      <div className="stat-trend down">
                        Kylmin {formatTemperature(dashboard.highlights.coldest_water_temperature)}
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🧖</div>
                    <div className="stat-content">
                      <div className="stat-label">Saunakerrat</div>
                      <div className="stat-value">{snapshot.sauna_sessions}</div>
                      <div className="stat-trend flat">Tässä kuussa</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">😤</div>
                    <div className="stat-content">
                      <div className="stat-label">Kirosanat</div>
                      <div className="stat-value">{dashboard.highlights.total_swear_words}</div>
                      <div className="stat-trend flat">
                        Mieliala {formatMoodDelta(dashboard.highlights.average_mood_improvement)}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="activity-section">
                <h2>Viimeisimmät avannot</h2>
                {dashboard.recent_avantos.length === 0 ? (
                  <div className="dashboard-state">Ei merkintöjä vielä. Lisää ensimmäinen avanto.</div>
                ) : (
                  <div className="activity-list">
                    {dashboard.recent_avantos.map((avanto) => (
                      <Link
                        key={avanto.avanto_id}
                        to={`/avanto/${avanto.avanto_id}`}
                        className="activity-item activity-link"
                      >
                        <div className="activity-dot success" />
                        <div className="activity-content">
                          <div className="activity-message">
                            {avanto.location || 'Tuntematon paikka'} ·{' '}
                            {formatDuration(avanto.duration_minutes, avanto.duration_seconds)}
                            {avanto.water_temperature !== null && (
                              <span
                                className="activity-temp"
                                style={{ color: getTemperatureColor(avanto.water_temperature) }}
                              >
                                {' '}
                                · {avanto.water_temperature}°C
                              </span>
                            )}
                          </div>
                          <div className="activity-time">{formatDate(avanto.date)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;
