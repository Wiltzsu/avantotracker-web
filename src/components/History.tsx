import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header.js';
import { avantoAPI, AvantoResponse, HistoryFilters } from '../services/api';
import { getApiErrorMessage } from '../utils/apiErrors';
import './History.css';
import { formatDuration, formatDate } from '../utils/formatters';

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

      <header className="page-head history-head">
        <h1>Historia</h1>
      </header>

      <main className="page-main history-main">
        <form className="history-filters" onSubmit={applyFilters}>
          <label className="filter-field filter-location">
            <span>Paikka</span>
            <input
              type="text"
              name="location"
              value={filters.location ?? ''}
              onChange={handleFilterChange}
            />
          </label>
          <label className="filter-field">
            <span>Alkaen</span>
            <input
              type="date"
              name="start_date"
              value={filters.start_date ?? ''}
              onChange={handleFilterChange}
            />
          </label>
          <label className="filter-field">
            <span>Asti</span>
            <input
              type="date"
              name="end_date"
              value={filters.end_date ?? ''}
              onChange={handleFilterChange}
            />
          </label>
          <label className="filter-field">
            <span>Sauna</span>
            <select
              name="sauna"
              value={filters.sauna === undefined ? '' : filters.sauna ? '1' : '0'}
              onChange={handleFilterChange}
            >
              <option value="">Kaikki</option>
              <option value="1">Saunan kanssa</option>
              <option value="0">Ilman saunaa</option>
            </select>
          </label>
          <div className="filter-actions">
            <button type="submit" className="btn-primary">Suodata</button>
            <button type="button" className="btn-secondary" onClick={resetFilters}>Tyhjennä</button>
            <button type="button" className="filter-export" onClick={handleExport} disabled={exporting}>
              {exporting ? 'Viedään…' : 'Vie CSV'}
            </button>
          </div>
        </form>

        {loading ? (
          <p className="state-banner">Ladataan…</p>
        ) : error ? (
          <p className="error-banner">{error}</p>
        ) : iceBaths.length === 0 ? (
          <p className="state-banner">Ei tuloksia näillä suodattimilla.</p>
        ) : (
          <>
            <table className="history-table">
              <thead>
                <tr>
                  <th scope="col">Päivä</th>
                  <th scope="col">Paikka</th>
                  <th scope="col" className="col-right">Kesto</th>
                  <th scope="col" className="col-right">Vesi</th>
                </tr>
              </thead>
              <tbody>
                {iceBaths.map((iceBath) => (
                  <tr key={iceBath.avanto_id}>
                    <td className="num col-date">{formatDate(iceBath.date)}</td>
                    <td>
                      <Link to={`/avanto/${iceBath.avanto_id}`}>{iceBath.location || 'Tuntematon paikka'}</Link>
                    </td>
                    <td className="num col-right">
                      {formatDuration(iceBath.duration_minutes, iceBath.duration_seconds)}
                    </td>
                    <td className="num col-right">
                      {iceBath.water_temperature !== null ? `${iceBath.water_temperature}°C` : '–'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <nav className="pagination" aria-label="Sivutus">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage <= 1}
                >
                  Edellinen
                </button>
                {totalPages <= 7 ? (
                  <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`page-num num ${page === currentPage ? 'active' : ''}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="page-info num">
                    {currentPage} / {totalPages}
                  </span>
                )}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Seuraava
                </button>
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default History;
