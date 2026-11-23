import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { avantoAPI, DashboardData } from '../services/api';
import { getApiErrorMessage } from '../utils/apiErrors';
import {
  formatDaysSince,
  formatMoodDelta,
  formatSecondsAsDuration,
  formatTemperature,
} from '../utils/statsFormatters';
import { formatDate, formatDuration } from '../utils/formatters';
import './Dashboard.css';

const lastDipHeadline = (days: number | null): string => {
  if (days === null) {
    return 'Ei vielä yhtään avantoa';
  }
  if (days === 0) {
    return 'Avannossa tänään';
  }
  return `Viimeisin avanto ${formatDaysSince(days).toLowerCase()}`;
};

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        setDashboard(await avantoAPI.dashboard());
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

      <header className="page-head dashboard-head">
        <div>
          <h1>{dashboard ? lastDipHeadline(dashboard.days_since_last_dip) : 'Etusivu'}</h1>
          {dashboard?.last_dip_date && (
            <p className="num">{formatDate(dashboard.last_dip_date)}</p>
          )}
        </div>
        <Link to="/new" className="btn-primary">
          Lisää avanto
        </Link>
      </header>

      <main className="page-main">
        {loading && <p className="state-banner">Ladataan…</p>}
        {error && <p className="error-banner">{error}</p>}

        {!loading && !error && dashboard && snapshot && (
          <>
            <section className="month-section">
              <h2 className="section-title">{snapshot.label}</h2>

              <div className="month-layout">
                <div className="month-lead">
                  <span className="month-lead-value num">{snapshot.visits}</span>
                  <span className="month-lead-label">käyntiä</span>
                </div>

                <dl className="figure-list">
                  <div>
                    <dt>Kylmäaika</dt>
                    <dd className="num">{formatSecondsAsDuration(snapshot.total_duration)}</dd>
                    <dd className="figure-note">keskim. {formatSecondsAsDuration(snapshot.average_duration)}</dd>
                  </div>
                  <div>
                    <dt>Putki</dt>
                    <dd className="num">{dashboard.current_streak_days} pv</dd>
                    <dd className="figure-note">paras {dashboard.best_streak_days} pv</dd>
                  </div>
                  <div>
                    <dt>Veden keskilämpö</dt>
                    <dd className="num">{formatTemperature(snapshot.average_water_temperature)}</dd>
                    <dd className="figure-note">
                      kylmin {formatTemperature(dashboard.highlights.coldest_water_temperature)}
                    </dd>
                  </div>
                  <div>
                    <dt>Saunakerrat</dt>
                    <dd className="num">{snapshot.sauna_sessions}</dd>
                  </div>
                  <div>
                    <dt>Kirosanat</dt>
                    <dd className="num">{dashboard.highlights.total_swear_words}</dd>
                    <dd className="figure-note">
                      fiilis {formatMoodDelta(dashboard.highlights.average_mood_improvement)}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <section className="recent-section">
              <div className="recent-head">
                <h2 className="section-title">Viimeisimmät</h2>
                <Link to="/history">Koko historia</Link>
              </div>

              {dashboard.recent_avantos.length === 0 ? (
                <p className="state-banner">Ei merkintöjä vielä.</p>
              ) : (
                <ul className="recent-list">
                  {dashboard.recent_avantos.map((avanto) => (
                    <li key={avanto.avanto_id}>
                      <Link to={`/avanto/${avanto.avanto_id}`} className="recent-row">
                        <span className="recent-date num">{formatDate(avanto.date)}</span>
                        <span className="recent-place">{avanto.location || 'Tuntematon paikka'}</span>
                        <span className="recent-duration num">
                          {formatDuration(avanto.duration_minutes, avanto.duration_seconds)}
                        </span>
                        <span className="recent-temp num">
                          {avanto.water_temperature !== null ? `${avanto.water_temperature}°C` : '–'}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
