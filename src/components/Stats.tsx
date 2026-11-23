import React, { useEffect, useState } from 'react';
import Header from './Header.js';
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

      <header className="page-head stats-head">
        <h1>Tilastot</h1>
        <div className="range-switch" role="group" aria-label="Aikaväli">
          {STATS_RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={range === option.value ? 'active' : ''}
              aria-pressed={range === option.value}
              onClick={() => setRange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <main className="page-main">
        {loading && <p className="state-banner">Ladataan…</p>}
        {error && <p className="error-banner">{error}</p>}

        {!loading && !error && stats && (
          <>
            <section className="stats-overview">
              <div className="stats-lead">
                <span className="stats-lead-value num">{stats.total_visits}</span>
                <span className="stats-lead-label">käyntiä</span>
                <span className="stats-lead-note">
                  {stats.this_week_visits} tällä viikolla, {stats.this_month_visits} tässä kuussa
                </span>
              </div>

              <dl className="figure-list stats-figures">
                <div>
                  <dt>Avannossa yhteensä</dt>
                  <dd className="num">{formatSecondsAsDuration(stats.total_duration)}</dd>
                  <dd className="figure-note">keskim. {formatSecondsAsDuration(stats.average_duration)}</dd>
                </div>
                <div>
                  <dt>Putki</dt>
                  <dd className="num">{stats.current_streak_days} pv</dd>
                  <dd className="figure-note">paras {stats.best_streak_days} pv</dd>
                </div>
                <div>
                  <dt>Veden keskilämpö</dt>
                  <dd className="num">{formatTemperature(stats.average_water_temperature)}</dd>
                </div>
                <div>
                  <dt>Kylmin uinti</dt>
                  <dd className="num">{formatTemperature(stats.coldest_water_temperature)}</dd>
                  <dd className="figure-note">henksut pihalle</dd>
                </div>
                <div>
                  <dt>Pisin uinti</dt>
                  <dd className="num">{formatSecondsAsDuration(stats.longest_duration)}</dd>
                </div>
                <div>
                  <dt>Fiilis ennen → jälkeen</dt>
                  <dd className="num">{formatMoodDelta(stats.average_mood_improvement)}</dd>
                </div>
                <div>
                  <dt>Saunakerrat</dt>
                  <dd className="num">{stats.total_sauna_sessions}</dd>
                  <dd className="figure-note">{stats.total_sauna_duration} min yhteensä</dd>
                </div>
                <div>
                  <dt>Kirosanat</dt>
                  <dd className="num">{stats.total_swear_words}</dd>
                </div>
              </dl>
            </section>

            {stats.mood_timeline.length > 0 && (
              <section className="stats-section">
                <h2 className="section-title">Fiilis ajan yli</h2>
                <MoodChart timeline={stats.mood_timeline} />
              </section>
            )}

            {stats.visits_by_month.length > 0 && (
              <section className="stats-section">
                <h2 className="section-title">Käynnit kuukausittain</h2>
                <div className="bar-chart">
                  {stats.visits_by_month.map((item) => (
                    <div key={item.month} className="bar-chart-item">
                      <span className="bar-chart-value num">{item.count}</span>
                      <div
                        className="bar-chart-bar"
                        style={{ height: `${monthPeak ? (item.count / monthPeak) * 100 : 0}%` }}
                        title={`${item.count} käyntiä`}
                      />
                      <span className="bar-chart-label">{formatMonthLabel(item.month)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="stats-section stats-split">
              {stats.location_breakdown.length > 0 && (
                <div>
                  <h2 className="section-title">Paikat</h2>
                  <ul className="breakdown-list">
                    {stats.location_breakdown.map((item) => (
                      <li key={item.location}>
                        <span>{item.location}</span>
                        <span className="num">{item.visits}</span>
                        <div className="breakdown-bar-wrap">
                          <div
                            className="breakdown-bar"
                            style={{
                              width: `${locationPeak ? (item.visits / locationPeak) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h2 className="section-title">Sauna</h2>
                <dl className="sauna-list">
                  <div>
                    <dt>Saunan kanssa</dt>
                    <dd className="num">{stats.sauna_breakdown.with_sauna}</dd>
                  </div>
                  <div>
                    <dt>Ilman saunaa</dt>
                    <dd className="num">{stats.sauna_breakdown.without_sauna}</dd>
                  </div>
                </dl>
                {saunaTotal > 0 && (
                  <p className="sauna-ratio">
                    {Math.round((stats.sauna_breakdown.with_sauna / saunaTotal) * 100)} % käynneistä saunan kanssa
                  </p>
                )}
              </div>
            </section>

            <section className="stats-section">
              <h2 className="section-title">
                Saavutukset{' '}
                <span className="section-count num">
                  {stats.achievements.filter((achievement) => achievement.unlocked).length}/
                  {stats.achievements.length}
                </span>
              </h2>
              <ul className="achievement-list">
                {stats.achievements.map((achievement) => (
                  <li
                    key={achievement.id}
                    className={achievement.unlocked ? 'unlocked' : 'locked'}
                  >
                    <span className="achievement-status" aria-hidden="true">
                      {achievement.unlocked ? (
                        <svg viewBox="0 0 16 16" width="16" height="16">
                          <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.75" />
                        </svg>
                      ) : null}
                    </span>
                    <div>
                      <strong>{achievement.title}</strong>
                      <p>{achievement.description}</p>
                    </div>
                    <span className="visually-hidden">{achievement.unlocked ? 'Avattu' : 'Lukittu'}</span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Stats;
