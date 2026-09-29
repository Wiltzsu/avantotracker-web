import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header.js';
import Footer from './Footer.js';
import { avantoAPI, AvantoResponse, HistoryFilters } from '../services/api';
import { getApiErrorMessage } from '../utils/apiErrors';
import './History.css';
import { getTemperatureColor, formatDuration, formatDate } from '../utils/formatters';

const emptyFilters = (): HistoryFilters => ({
  location: '',
  start_date: '',
  end_date: '',
  sauna: undefined,
});

const History: React.FC = () => {
  const [iceBaths, setIceBaths] = useState<AvantoResponse[]>([]);
  const [filters, setFilters] = useState<HistoryFilters>(emptyFilters());
  const [appliedFilters, setAppliedFilters] = useState<HistoryFilters>(emptyFilters());
  const [loading, setLoading] = useState<boolean>(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const perPage = 10;

  useEffect(() => {
    const fetchIceBaths = async () => {
      try {
        setLoading(true);
        const response = await avantoAPI.getAll(currentPage, perPage, appliedFilters);
        setIceBaths(response.data ?? []);
        setTotalPages(response.meta?.last_page ?? 1);
        setError(null);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Historian lataus epäonnistui.'));
        setIceBaths([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIceBaths();
  }, [currentPage, appliedFilters]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: name === 'sauna' ? (value === '' ? undefined : value === '1') : value,
    }));
  };

  const applyFilters = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1);
    setAppliedFilters(filters);
  };

  const resetFilters = () => {
    const cleared = emptyFilters();
    setFilters(cleared);
    setAppliedFilters(cleared);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await avantoAPI.exportCsv(appliedFilters);
    } catch (err) {
      setError(getApiErrorMessage(err, 'CSV-vienti epäonnistui.'));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="page-shell history-page">
      <Header />

      <section className="page-hero">
        <h1>Avantohistoria</h1>
        <p>Kaikki avantosi yhdessä paikassa</p>
      </section>

      <main className="page-main history-wrapper">

          <form className="history-filters" onSubmit={applyFilters}>
            <input
              type="text"
              name="location"
              value={filters.location ?? ''}
              onChange={handleFilterChange}
              placeholder="Hae sijaintia"
            />
            <input
              type="date"
              name="start_date"
              value={filters.start_date ?? ''}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              name="end_date"
              value={filters.end_date ?? ''}
              onChange={handleFilterChange}
            />
            <select name="sauna" value={filters.sauna === undefined ? '' : filters.sauna ? '1' : '0'} onChange={handleFilterChange}>
              <option value="">Kaikki saunat</option>
              <option value="1">Saunan kanssa</option>
              <option value="0">Ilman saunaa</option>
            </select>
            <button type="submit" className="filter-btn">Suodata</button>
            <button type="button" className="filter-btn secondary" onClick={resetFilters}>Tyhjennä</button>
            <button type="button" className="filter-btn secondary" onClick={handleExport} disabled={exporting}>
              {exporting ? 'Viedään...' : 'Vie CSV'}
            </button>
          </form>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Ladataan avantohistoriaa...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <h2>Virhe sivulla</h2>
              <p>{error}</p>
            </div>
          ) : (
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
                  <h3>Ei tuloksia</h3>
                  <p>Kokeile toista suodatinta tai lisää uusi avanto.</p>
                </div>
              ) : (
                iceBaths.map((iceBath) => (
                  <Link
                    key={iceBath.avanto_id}
                    to={`/avanto/${iceBath.avanto_id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="history-item">
                      <div className="item-main">
                        <div className="location-date">
                          <span className="location">{iceBath.location}</span>
                          <span className="date">{formatDate(iceBath.date)}</span>
                        </div>
                        <div className="duration">
                          {formatDuration(iceBath.duration_minutes, iceBath.duration_seconds)}
                        </div>
                        <div className="temperature">
                          {iceBath.water_temperature !== null && (
                            <span
                              className="temp-badge"
                              style={{ backgroundColor: getTemperatureColor(iceBath.water_temperature ?? 0) }}
                            >
                              {iceBath.water_temperature}°C
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}

              {totalPages > 1 && (
                <>
                  <div className="pagination-bar">
                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage <= 1}
                    >
                      Edellinen
                    </button>
                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      disabled={currentPage >= totalPages}
                    >
                      Seuraava
                    </button>
                  </div>

                  {totalPages <= 7 && (
                    <div className="page-numbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          className={`page-num ${page === currentPage ? 'active' : ''}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
      </main>

      <Footer />
    </div>
  );
};

export default History;
