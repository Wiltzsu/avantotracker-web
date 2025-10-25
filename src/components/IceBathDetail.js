import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import Header from './Header.js';
import Footer from './Footer.js';
import { avantoAPI } from '../services/api.js';
import './IceBathDetail.css';
import { getTemperatureColor, formatDuration, formatDate } from '../utils/formatters.js';

const IceBathDetail = () => {
  const { id } = useParams();
  const [iceBath, setIceBath] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Load single ice bath
    const fetchIceBath = async () => {
      try {
        setLoading(true); // Show spinner while fetching data
        const response = await avantoAPI.getById(id);

        setIceBath(response.data);

        console.log(response);

      } catch (err) {
        setError(err.message);
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
                <h3>{iceBath.data.location}</h3>
                <p>{formatDate(iceBath.data.date)}</p>
              </div>
  
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Veden lämpötila</span>
                  <div className="temperature">
                    <span 
                      className="temp-badge"
                      style={{ backgroundColor: getTemperatureColor(iceBath.data.water_temperature) }}
                    >
                      {iceBath.data.water_temperature}°C
                    </span>
                  </div>
                </div>
  
                <div className="stat-card">
                  <span className="stat-label">Kesto</span>
                  <span className="stat-value">
                    {formatDuration(iceBath.data.duration_minutes, iceBath.data.duration_seconds)}
                  </span>
                </div>
  
                <div className="stat-card">
                  <span className="stat-label">Sauna</span>
                  <span className="stat-value">
                    {iceBath.data.sauna ? 'Kyllä' : 'Ei'}
                  </span>
                </div>
              </div>
  
              {(iceBath.data.feeling_before || iceBath.data.feeling_after) && (
                <div className="feelings-section">
                  <h4>Fiilis</h4>
                  {iceBath.data.feeling_before && (
                    <div className="feeling-item">
                      <strong>Ennen:</strong> {iceBath.data.feeling_before}
                    </div>
                  )}
                  {iceBath.data.feeling_after && (
                    <div className="feeling-item">
                      <strong>Jälkeen:</strong> {iceBath.data.feeling_after}
                    </div>
                  )}
                </div>
              )}
  
              <div className="sauna-info">
                <h4>Sauna</h4>
                <p className={iceBath.data.sauna ? 'sauna-yes' : 'sauna-no'}>
                  {iceBath.data.sauna ? 'Kyllä' : 'Ei'}
                </p>
                {iceBath.data.sauna_duration && (
                  <p>Kesto: {iceBath.data.sauna_duration} min</p>
                )}
              </div>
  
              {iceBath.data.swear_words && (
                <div className="swear-words">
                  <h4>Kirosanat</h4>
                  <p>"{iceBath.data.swear_words}"</p>
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