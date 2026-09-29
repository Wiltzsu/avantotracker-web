import React, { useEffect, useState } from 'react';
import Header from './Header.js';
import Footer from './Footer.js';
import { avantoAPI, AvantoStats, StatsRange } from '../services/api';
import { getApiErrorMessage } from '../utils/apiErrors';
import {
  formatMonthLabel,
  formatMoodDelta,
  formatSecondsAsDuration,
  formatTemperature,
  maxCount,
  STATS_RANGE_OPTIONS,
} from '../utils/statsFormatters';
import MoodChart from './MoodChart';
import { getAchievementIcon } from '../utils/achievementIcons';
import './Stats.css';

const Stats: React.FC = () => {
  const [stats, setStats] = useState<AvantoStats | null>(null);
  const [range, setRange] = useState<StatsRange>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await avantoAPI.stats(range);
        setStats(data);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Tilastojen lataus epäonnistui.'));
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [range]);

  const monthPeak = stats ? maxCount(stats.visits_by_month) : 0;
  const locationPeak = stats ? maxCount(stats.location_breakdown) : 0;
  const saunaTotal = stats
    ? stats.sauna_breakdown.with_sauna + stats.sauna_breakdown.without_sauna
    : 0;

  return (
    <div className="page-shell stats-page">
      <Header />

      <section className="page-hero">
        <h1>Tilastot</h1>
        <p>Seuraa avantokäyntejä, lämpötiloja, putkia ja saavutuksia.</p>
      </section>

      <main className="page-main">
          <section className="stats-range-section">
            <div className="stats-range-pills">
              {STATS_RANGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`stats-range-pill ${range === option.value ? 'active' : ''}`}
                  onClick={() => setRange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          {loading && <div className="state-banner">Ladataan tilastoja...</div>}
          {error && <div className="error-banner">{error}</div>}

          {!loading && !error && stats && (
            <>
              <section className="primary-stats-section">
                <div className="primary-stats-grid">
                  <div className="primary-stat-card highlight">
                    <div className="primary-stat-icon">🏊</div>
                    <div className="primary-stat-content">
                      <div className="primary-stat-label">Käynnit</div>
                      <div className="primary-stat-value">{stats.total_visits}</div>
                      <div className="primary-stat-subtitle">
                        {stats.this_week_visits} tällä viikolla · {stats.this_month_visits} tässä kuussa
                      </div>
                    </div>
                  </div>

                  <div className="primary-stat-card">
                    <div className="primary-stat-icon">⏱️</div>
                    <div className="primary-stat-content">
                      <div className="primary-stat-label">Avannossa yhteensä</div>
                      <div className="primary-stat-value">
                        {formatSecondsAsDuration(stats.total_duration)}
                      </div>
                      <div className="primary-stat-subtitle">
                        Keskimäärin {formatSecondsAsDuration(stats.average_duration)}
                      </div>
                    </div>
                  </div>

                  <div className="primary-stat-card">
                    <div className="primary-stat-icon">🔥</div>
                    <div className="primary-stat-content">
                      <div className="primary-stat-label">Putki</div>
                      <div className="primary-stat-value">{stats.current_streak_days} pv</div>
                      <div className="primary-stat-subtitle">Paras putki {stats.best_streak_days} pv</div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="detailed-stats-section">
                <h2 className="section-title">Yksityiskohtaiset tilastot</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">🌡️</div>
                    <div className="stat-label">Keskilämpötila</div>
                    <div className="stat-value">{formatTemperature(stats.average_water_temperature)}</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">❄️</div>
                    <div className="stat-label">Kylmin uinti</div>
                    <div className="stat-value">{formatTemperature(stats.coldest_water_temperature)}</div>
                    <div className="stat-trend down">Henksut pihalle</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">⏰</div>
                    <div className="stat-label">Pisin uinti</div>
                    <div className="stat-value">{formatSecondsAsDuration(stats.longest_duration)}</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">😤</div>
                    <div className="stat-label">Kirosanat</div>
                    <div className="stat-value">{stats.total_swear_words}</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🧖</div>
                    <div className="stat-label">Saunakerrat</div>
                    <div className="stat-value">{stats.total_sauna_sessions}</div>
                    <div className="stat-trend">{stats.total_sauna_duration} min yhteensä</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🧘</div>
                    <div className="stat-label">Mielialamuutos</div>
                    <div className="stat-value">{formatMoodDelta(stats.average_mood_improvement)}</div>
                    <div className="stat-trend up">Ennen vs jälkeen</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">📍</div>
                    <div className="stat-label">Suosittu paikka</div>
                    <div className="stat-value stat-value-text">
                      {stats.favorite_location ?? '–'}
                    </div>
                  </div>
                </div>
              </section>

              {stats.mood_timeline.length > 0 && (
                <section className="chart-section">
                  <h2 className="section-title">Fiilis ajan yli</h2>
                  <MoodChart timeline={stats.mood_timeline} />
                </section>
              )}

              {stats.visits_by_month.length > 0 && (
                <section className="chart-section">
                  <h2 className="section-title">Käynnit kuukausittain</h2>
                  <div className="bar-chart">
                    {stats.visits_by_month.map((item) => (
                      <div key={item.month} className="bar-chart-item">
                        <div
                          className="bar-chart-bar"
                          style={{ height: `${monthPeak ? (item.count / monthPeak) * 100 : 0}%` }}
                          title={`${item.count} käyntiä`}
                        />
                        <span className="bar-chart-label">{formatMonthLabel(item.month)}</span>
                        <span className="bar-chart-value">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="split-section">
                {stats.location_breakdown.length > 0 && (
                  <div className="split-card">
                    <h2 className="section-title">Paikat</h2>
                    <ul className="breakdown-list">
                      {stats.location_breakdown.map((item) => (
                        <li key={item.location}>
                          <span>{item.location}</span>
                          <div className="breakdown-bar-wrap">
                            <div
                              className="breakdown-bar"
                              style={{
                                width: `${locationPeak ? (item.visits / locationPeak) * 100 : 0}%`,
                              }}
                            />
                          </div>
                          <strong>{item.visits}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="split-card">
                  <h2 className="section-title">Sauna vs ei saunaa</h2>
                  <div className="sauna-split">
                    <div className="sauna-split-row">
                      <span>Saunan kanssa</span>
                      <strong>{stats.sauna_breakdown.with_sauna}</strong>
                    </div>
                    <div className="sauna-split-row">
                      <span>Ilman saunaa</span>
                      <strong>{stats.sauna_breakdown.without_sauna}</strong>
                    </div>
                    {saunaTotal > 0 && (
                      <div className="sauna-ratio">
                        {Math.round((stats.sauna_breakdown.with_sauna / saunaTotal) * 100)}% saunan kanssa
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="achievements-section">
                <h2 className="section-title">
                  Saavutukset (
                  {stats.achievements.filter((achievement) => achievement.unlocked).length}/
                  {stats.achievements.length})
                </h2>
                <div className="achievements-grid">
                  {stats.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                    >
                      <div className="achievement-icon">{getAchievementIcon(achievement.id)}</div>
                      <h3>{achievement.title}</h3>
                      <p>{achievement.description}</p>
                      <div className="achievement-badge">
                        {achievement.unlocked ? 'Avattu' : 'Lukittu'}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
      </main>

      <Footer />
    </div>
  );
};

export default Stats;
