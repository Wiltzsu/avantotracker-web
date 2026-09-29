import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header.js';
import Footer from './Footer.js';
import { avantoAPI, PersonalRecords } from '../services/api';
import { getApiErrorMessage } from '../utils/apiErrors';
import { formatDate } from '../utils/formatters';
import { formatSecondsAsDuration, formatTemperature } from '../utils/statsFormatters';
import './Records.css';

const Records: React.FC = () => {
  const [records, setRecords] = useState<PersonalRecords | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        setRecords(await avantoAPI.records());
      } catch (err) {
        setError(getApiErrorMessage(err, 'Ennätysten lataus epäonnistui.'));
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="page-shell records-page">
      <Header />

      <section className="page-hero">
        <h1>Ennätykset</h1>
        <p>Henkilökohtaiset huiput kylmästä vedestä, kestosta ja fiiliksestä.</p>
      </section>

      <main className="page-main">
        {loading && <div className="state-banner">Ladataan ennätyksiä...</div>}
        {error && <div className="error-banner">{error}</div>}

        {!loading && !error && records && (
          <div className="records-grid">
            <RecordCard
              icon="❄️"
              title="Kylmin uinti"
              value={formatTemperature(records.coldest_dip?.value ?? null)}
              record={records.coldest_dip}
            />
            <RecordCard
              icon="⏱️"
              title="Pisin uinti"
              value={records.longest_dip ? formatSecondsAsDuration(records.longest_dip.value) : '–'}
              record={records.longest_dip}
            />
            <RecordCard
              icon="😤"
              title="Eniten kirosanoja"
              value={records.most_swear_words ? String(records.most_swear_words.value) : '–'}
              record={records.most_swear_words}
            />
            <RecordCard
              icon="🧘"
              title="Paras fiilipiikki"
              value={
                records.best_mood_swing
                  ? `+${records.best_mood_swing.value} (${records.best_mood_swing.feeling_before}→${records.best_mood_swing.feeling_after})`
                  : '–'
              }
              record={records.best_mood_swing}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

interface RecordCardProps {
  icon: string;
  title: string;
  value: string;
  record: PersonalRecords[keyof PersonalRecords];
}

const RecordCard: React.FC<RecordCardProps> = ({ icon, title, value, record }) => (
  <div className="record-card glass-card">
    <div className="record-icon">{icon}</div>
    <h2>{title}</h2>
    <div className="record-value">{value}</div>
    {record ? (
      <div className="record-meta">
        <span>{record.location || 'Tuntematon paikka'}</span>
        <span>{formatDate(record.date)}</span>
        <Link to={`/avanto/${record.avanto_id}`}>Avaa merkintä</Link>
      </div>
    ) : (
      <div className="record-meta">Ei dataa vielä</div>
    )}
  </div>
);

export default Records;
