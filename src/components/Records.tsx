import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header.js';
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

      <header className="page-head records-head">
        <h1>Ennätykset</h1>
      </header>

      <main className="page-main records-main">
        {loading && <p className="state-banner">Ladataan…</p>}
        {error && <p className="error-banner">{error}</p>}

        {!loading && !error && records && (
          <ul className="record-list">
            <RecordRow
              title="Kylmin uinti"
              value={formatTemperature(records.coldest_dip?.value ?? null)}
              record={records.coldest_dip}
            />
            <RecordRow
              title="Pisin uinti"
              value={records.longest_dip ? formatSecondsAsDuration(records.longest_dip.value) : '–'}
              record={records.longest_dip}
            />
            <RecordRow
              title="Eniten kirosanoja"
              value={records.most_swear_words ? String(records.most_swear_words.value) : '–'}
              record={records.most_swear_words}
            />
            <RecordRow
              title="Paras fiilispiikki"
              value={
                records.best_mood_swing
                  ? `+${records.best_mood_swing.value} (${records.best_mood_swing.feeling_before}→${records.best_mood_swing.feeling_after})`
                  : '–'
              }
              record={records.best_mood_swing}
            />
          </ul>
        )}
      </main>
    </div>
  );
};

interface RecordRowProps {
  title: string;
  value: string;
  record: PersonalRecords[keyof PersonalRecords];
}

const RecordRow: React.FC<RecordRowProps> = ({ title, value, record }) => (
  <li className="record-row">
    <h2>{title}</h2>
    <span className="record-value num">{value}</span>
    {record ? (
      <Link to={`/avanto/${record.avanto_id}`} className="record-meta">
        {record.location || 'Tuntematon paikka'}, <span className="num">{formatDate(record.date)}</span>
      </Link>
    ) : (
      <span className="record-meta">Ei dataa vielä</span>
    )}
  </li>
);

export default Records;
