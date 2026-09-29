import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from './Header.js';
import Footer from './Footer.js';
import { avantoAPI, AvantoResponse } from '../services/api';
import './IceBathDetail.css';
import { getTemperatureColor, formatDuration, formatDate } from '../utils/formatters';

const IceBathDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [iceBath, setIceBath] = useState<AvantoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadingSelfie, setUploadingSelfie] = useState(false);
  
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

  const handleSelfieUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!id || !file) {
      return;
    }

    setUploadingSelfie(true);
    try {
      const updated = await avantoAPI.uploadSelfie(id, file);
      setIceBath(updated);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Selfien lataus epäonnistui';
      setError(errorMessage);
    } finally {
      setUploadingSelfie(false);
      event.target.value = '';
    }
  };

  const handleSelfieDelete = async () => {
    if (!id || !window.confirm('Poistetaanko selfie?')) {
      return;
    }

    setUploadingSelfie(true);
    try {
      const updated = await avantoAPI.deleteSelfie(id);
      setIceBath(updated);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Selfien poisto epäonnistui';
      setError(errorMessage);
    } finally {
      setUploadingSelfie(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Poistetaanko tämä avanto?')) {
      return;
    }

    setDeleting(true);
    try {
      await avantoAPI.delete(id);
      navigate('/history');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Poisto epäonnistui';
      setError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="page-shell detail-page">
        <Header />
        <main className="page-main">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Ladataan avantoa...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell detail-page">
        <Header />
        <main className="page-main">
          <div className="error-message">
            <h2>Virhe sivulla</h2>
            <p>{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-shell detail-page">
      <Header />
      <main className="page-main avanto-detail-card">
          <div className="detail-header">
            <h2>Avantotiedot</h2>
            {id && (
              <div className="detail-actions">
                <Link to="/history" className="btn-secondary detail-btn">
                  Takaisin
                </Link>
                <Link to={`/avanto/${id}/edit`} className="btn-primary detail-btn">
                  Muokkaa
                </Link>
                <button
                  type="button"
                  className="btn-danger detail-btn"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Poistetaan...' : 'Poista'}
                </button>
              </div>
            )}
          </div>
          {iceBath && (
            <div className="avanto-info">
              <div className="info-section">
                <h3>{iceBath.location}</h3>
                <p>{formatDate(iceBath.date)}</p>
              </div>

              <div className="selfie-section">
                <h4>Selfie</h4>
                {iceBath.selfie_url ? (
                  <div className="selfie-preview">
                    <img src={iceBath.selfie_url} alt="Avanto selfie" />
                    <button type="button" className="btn-secondary detail-btn" onClick={handleSelfieDelete} disabled={uploadingSelfie}>
                      Poista selfie
                    </button>
                  </div>
                ) : (
                  <p>Ei selfietä vielä.</p>
                )}
                <label className="selfie-upload">
                  {uploadingSelfie ? 'Ladataan...' : 'Lataa selfie'}
                  <input type="file" accept="image/*" onChange={handleSelfieUpload} disabled={uploadingSelfie} />
                </label>
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
      </main>
      <Footer />
    </div>
  );
}

export default IceBathDetail;