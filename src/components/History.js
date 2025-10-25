import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Header from './Header.js';
import Footer from './Footer.js';
import { avantoAPI } from '../services/api.js';
import './History.css';
import { getTemperatureColor, formatDuration, formatDate } from '../utils/formatters.js';

const History = () => {
  const [iceBaths, setIceBaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 10;

  useEffect(() => {
    // Load ice bath history for current page
    const fetchIceBaths = async () => {
      try {
        setLoading(true); // Show loading spinner
        const response = await avantoAPI.getAll(currentPage, perPage);

        setIceBaths(response.data.data ?? []);
        setTotalPages(response.data.meta?.last_page ?? 1);
        setTotal(response.data.meta?.total ?? 0);

      } catch (err) {
        setError(err.message);
        setIceBaths([]); // Reset to empty array on error
      } finally {
        setLoading(false); // Hide loading spinner
      }
    };

    fetchIceBaths();
  }, [currentPage]); // Re-fetch when page changes

  const goToPage = (page) => {
    setCurrentPage(page);
  }

  const goPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
                <div className="duration header-cell">Aika</div>
                <div className="temperature header-cell">Veden lämpötila</div>
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
                const formattedDate = formatDate(iceBath.date);

                return (
                  <Link key={iceBath.avanto_id} to={`/avanto/${iceBath.avanto_id}`} style={{ textDecoration: 'none' }}>  
                    <div key={iceBath.avanto_id} className="history-item">
                      <div className="item-main">
                        <div className="location-date">
                          <span className="location">{iceBath.location}</span>
                          <span className="date">{formattedDate}</span>
                        </div>
                        <div className="duration">
                          {formatDuration(iceBath.duration_minutes, iceBath.duration_seconds)}
                        </div>
                        <div className="temperature">
                          <span 
                            className="temp-badge"
                            style={{ backgroundColor: getTemperatureColor(iceBath.water_temperature) }}
                          >
                            {iceBath.water_temperature}°C
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="pagination-bar">
                <button
                  className="page-btn"
                  onClick={goPrev}
                  disabled={currentPage <= 1}
                >
                  Edellinen
                </button>
                <button
                  className="page-btn"
                  onClick={goNext}
                  disabled={currentPage >= totalPages}
                >
                  Seuraava
                </button>
              </div>
            )}

          {/* Page numbers for small page counts */}
          {totalPages <= 7 && totalPages > 1 && (
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-num ${page === currentPage ? 'active' : ''}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>

  );
};

export default History;