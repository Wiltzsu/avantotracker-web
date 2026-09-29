import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { avantoAPI, DashboardData } from '../services/api';
import { getApiErrorMessage } from '../utils/apiErrors';
import {
  formatDaysSince,
  formatMoodDelta,
  formatSecondsAsDuration,
  formatTemperature,
} from '../utils/statsFormatters';
import { formatDate, formatDuration, getTemperatureColor } from '../utils/formatters';
import iceLake from '../ice-lake.jpg';
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
    <div className="page-shell dashboard-page">
      <Header />

      <section
        className="page-hero dashboard-hero"
        style={{ ['--hero-image' as string]: `url(${iceLake})` }}
      >
        <h1>Tervetuloa takaisin</h1>
        <p>
          {dashboard
            ? `Viimeisin avanto ${formatDaysSince(dashboard.days_since_last_dip).toLowerCase()}.`
            : 'Seuraa avantojasi, putkia ja henkilökohtaisia ennätyksiä.'}
        </p>
      </section>

      <main className="page-main">
        <section className="quick-actions-section">
          <h2 className="section-title">Pikatoiminnot</h2>
          <div className="action-cards">
            <Link to="/new" className="action-card primary">
              <div className="action-icon">+</div>
              <div className="action-content">
                <h3>Uusi avanto</h3>
                <p>Kirjaa uinti ja fiilikset</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>
            <Link to="/stats" className="action-card">
              <div className="action-icon">↗</div>
              <div className="action-content">
                <h3>Tilastot</h3>
                <p>Trendit ja saavutukset</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>
            <Link to="/history" className="action-card">
              <div className="action-icon">☰</div>
              <div className="action-content">
                <h3>Historia</h3>
                <p>Selaa ja suodata</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>
            <Link to="/records" className="action-card">
              <div className="action-icon">★</div>
              <div className="action-content">
                <h3>Ennätykset</h3>
                <p>Henkilökohtaiset huiput</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>
          </div>
        </section>

        {loading && <div className="state-banner">Ladataan etusivua...</div>}
        {error && <div className="error-banner">{error}</div>}

        {!loading && !error && dashboard && snapshot && (
          <>
            <section className="stats-section">
              <h2 className="section-title">Tämän kuun tilanne</h2>
              <div className="stats-grid">
                <div className="stat-card glass-card">
                  <span className="stat-label">Käynnit</span>
                  <div className="stat-value">{snapshot.visits}</div>
                  <span className="stat-meta">{snapshot.label}</span>
                </div>
                <div className="stat-card glass-card">
                  <span className="stat-label">Kylmäaika</span>
                  <div className="stat-value">{formatSecondsAsDuration(snapshot.total_duration)}</div>
                  <span className="stat-meta">
                    Keskim. {formatSecondsAsDuration(snapshot.average_duration)}
                  </span>
                </div>
                <div className="stat-card glass-card">
                  <span className="stat-label">Putki</span>
                  <div className="stat-value">{dashboard.current_streak_days} pv</div>
                  <span className="stat-meta">Paras {dashboard.best_streak_days} pv</span>
                </div>
                <div className="stat-card glass-card">
                  <span className="stat-label">Keskilämpö</span>
                  <div className="stat-value">{formatTemperature(snapshot.average_water_temperature)}</div>
                  <span className="stat-meta">
                    Kylmin {formatTemperature(dashboard.highlights.coldest_water_temperature)}
                  </span>
                </div>
                <div className="stat-card glass-card">
                  <span className="stat-label">Saunakerrat</span>
                  <div className="stat-value">{snapshot.sauna_sessions}</div>
                  <span className="stat-meta">Tässä kuussa</span>
                </div>
                <div className="stat-card glass-card">
                  <span className="stat-label">Kirosanat</span>
                  <div className="stat-value">{dashboard.highlights.total_swear_words}</div>
                  <span className="stat-meta">
                    Fiilis {formatMoodDelta(dashboard.highlights.average_mood_improvement)}
                  </span>
                </div>
              </div>
            </section>

            <section className="activity-section">
              <h2 className="section-title">Viimeisimmät avannot</h2>
              {dashboard.recent_avantos.length === 0 ? (
                <div className="state-banner">Ei merkintöjä vielä. Lisää ensimmäinen avanto.</div>
              ) : (
                <div className="activity-list glass-card">
                  {dashboard.recent_avantos.map((avanto) => (
                    <Link
                      key={avanto.avanto_id}
                      to={`/avanto/${avanto.avanto_id}`}
                      className="activity-item activity-link"
                    >
                      <div className="activity-dot" />
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
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
