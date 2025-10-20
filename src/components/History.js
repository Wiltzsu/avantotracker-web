import { useState, useEffect } from 'react';
import Header from './Header.js';
import Footer from './Footer.js';
import { avantoAPI } from '../services/api.js';
import './History.css';

const History = () => {
  const [iceBaths, setIceBaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIceBaths = async () => {
      try {
        setLoading(true);
        const response = await avantoAPI.getAll();
        
        // Handle both dev and production response structures
        let iceBathsData;
        
        if (Array.isArray(response?.data?.data?.data)) {
          // Production structure: response.data.data.data = [...]
          iceBathsData = response.data.data.data;
        } else if (Array.isArray(response?.data?.data)) {
          // Dev structure: response.data.data = [...]
          iceBathsData = response.data.data;
        } else {
          iceBathsData = [];
        }
        
        setIceBaths(iceBathsData);
      } catch (err) {
        setError(err.message);
        setIceBaths([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIceBaths();
  }, []);

  const formatDuration = (minutes, seconds) => {
    if (seconds && seconds > 0) {
      return `${minutes} min ${seconds} s`;
    }
    return `${minutes} min`;
  }

  const getTemperatureColor = (temp) => {
    if (temp <= 2) return '#3b82f6'; // Blue for very cold
    if (temp <= 5) return '#06b6d4'; // Cyan for cold
    if (temp <= 8) return '#10b981'; // Green for cool
    return '#f59e0b'; // Orange for wamer
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="history-container">
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
        <div className="history-container">
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
      <div className="history-container">
        <div className="history-wrapper">
          <div className="history-header">
            <h1>Avantohistoria</h1>
            <p>Kaikki avantosi yhdessä paikassa</p>
          </div>

          <div className="history-list">
            <div className="history-header-row">
              <div className="item-main">
                <div className="location-date header-cell">Sijainti ja päivämäärä</div>
                <div className="temperature header-cell">Veden lämpötila</div>
                <div className="duration header-cell">Aika</div>
                <div className="feelings header-cell">Fiilis</div>
                <div className="sauna header-cell">Sauna</div>
              </div>
            </div>

            {iceBaths.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🧊</div>
                <h3>Ei vielä avantoja</h3>
                <p>Aloita ensimmäinen avanto-kokemuksesi!</p>
              </div>
            ) : (
              iceBaths.map((iceBath) => {
                const formattedDate = new Date(iceBath.date).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                });

                return (
                  <div key={iceBath.avanto_id} className="history-item">
                    <div className="item-main">
                      <div className="location-date">
                        <span className="location">{iceBath.location}</span>
                        <span className="date">{formattedDate}</span>
                      </div>
                      <div className="temperature">
                        <span 
                          className="temp-badge"
                          style={{ backgroundColor: getTemperatureColor(iceBath.water_temperature) }}
                        >
                          {iceBath.water_temperature}°C
                        </span>
                      </div>
                      <div className="duration">
                        {formatDuration(iceBath.duration_minutes, iceBath.duration_seconds)}
                      </div>
                      <div className="feelings">
                        {iceBath.feeling_before && iceBath.feeling_after ? (
                          <div>
                            <span className="feeling-before">Ennen: {iceBath.feeling_before}/10</span>
                            <span className="feeling-after">Jälkeen: {iceBath.feeling_after}/10</span>
                          </div>
                        ) : (
                          ''
                        )}
              
                      </div>
                      <div className="sauna">
                        {iceBath.sauna ? (
                          <span className="sauna-yes">
                            🧖‍♀️ {iceBath.sauna_duration}
                            {iceBath.sauna_duration ? (
                              ' min'
                            ) : (
                              ''
                            )}
                          </span>
                        ) : (
                          <span className="sauna-no">Ei saunaa</span>
                        )}
                      </div>
                    </div>
                    {iceBath.swear_words && (
                      <div className="swear-words">
                        @#$% "{iceBath.swear_words}"
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>

  );
};

export default History;