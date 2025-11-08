import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import Header from './Header.js';
import Footer from './Footer.js';
import { avantoAPI, AvantoResponse } from '../services/api';
import './IceBathDetail.css';
import { getTemperatureColor, formatDuration, formatDate } from '../utils/formatters';

const IceBathDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [iceBath, setIceBath] = useState<AvantoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Load single ice bath
    const fetchIceBath = async () => {
      if (!id) {
        setError('Ice bath ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Show spinner while fetching data
        const response = await avantoAPI.getById(id);

        setIceBath(response);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        setIceBath(null); // Set null if no ice bath is found
      } finally {
        setLoading(false); // Hide loading spinner
      }
    }

    fetchIceBath();
  }, [id]); // Re-run whenever id changes
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="icebath-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Ladataan avantohistoriaa...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="icebath-container">
          <div className="error-message">
            <h2>Virhe sivulla</h2>
            <p>{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="icebath-container">
        <div className="avanto-detail-card">
          <h2>Avantotiedot</h2>
          {iceBath && (
            <div className="avanto-info">
              <div className="info-section">
                <h3>{iceBath.location}</h3>
                <p>{formatDate(iceBath.date)}</p>
              </div>
  
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Veden lämpötila</span>
                  <div className="temperature">
                    <span 
                      className="temp-badge"
                      style={{ backgroundColor: getTemperatureColor(iceBath.water_temperature) }}
                    >
                      {iceBath.water_temperature}°C
                    </span>
                  </div>
                </div>
  
                <div className="stat-card">
                  <span className="stat-label">Kesto</span>
                  <span className="stat-value">
                    {formatDuration(iceBath.duration_minutes, iceBath.duration_seconds)}
                  </span>
                </div>
  
                <div className="stat-card">
                  <span className="stat-label">Sauna</span>
                  <span className="stat-value">
                    {iceBath.sauna ? 'Kyllä' : 'Ei'}
                  </span>
                </div>
              </div>
  
              {(iceBath.feeling_before || iceBath.feeling_after) && (
                <div className="feelings-section">
                  <h4>Fiilis</h4>
                  {iceBath.feeling_before && (
                    <div className="feeling-item">
                      <strong>Ennen:</strong> {iceBath.feeling_before}
                    </div>
                  )}
                  {iceBath.feeling_after && (
                    <div className="feeling-item">
                      <strong>Jälkeen:</strong> {iceBath.feeling_after}
                    </div>
                  )}
                </div>
              )}
  
              <div className="sauna-info">
                <h4>Sauna</h4>
                <p className={iceBath.sauna ? 'sauna-yes' : 'sauna-no'}>
                  {iceBath.sauna ? 'Kyllä' : 'Ei'}
                </p>
                {iceBath.sauna_duration && (
                  <p>Kesto: {iceBath.sauna_duration} min</p>
                )}
              </div>
  
              {iceBath.swear_words && (
                <div className="swear-words">
                  <h4>Kirosanat</h4>
                  <p>"{iceBath.swear_words}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default IceBathDetail;