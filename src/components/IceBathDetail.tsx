import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import { avantoAPI, Achievement, AvantoResponse } from '../services/api';
import AchievementUnlockModal from './AchievementUnlockModal';
import { getApiErrorMessage } from '../utils/apiErrors';
import { formatDuration, formatDate } from '../utils/formatters';
import './IceBathDetail.css';

const IceBathDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [iceBath, setIceBath] = useState<AvantoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  // Load errors replace the page; action errors show above the data and keep it visible.
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadingSelfie, setUploadingSelfie] = useState(false);
  const [unlocked, setUnlocked] = useState<Achievement[] | null>(null);

  useEffect(() => {
    const fetchIceBath = async () => {
      if (!id) {
        setLoadError('Avantoa ei löytynyt.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setIceBath(await avantoAPI.getById(id));
      } catch (err) {
        setLoadError(getApiErrorMessage(err, 'Avannon lataus epäonnistui.'));
        setIceBath(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIceBath();
  }, [id]);

  const handleSelfieUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!id || !file) {
      return;
    }

    setUploadingSelfie(true);
    setActionError(null);
    try {
      // uploadSelfie returns { avanto, newAchievements }, not the avanto itself
      const result = await avantoAPI.uploadSelfie(id, file);
      setIceBath(result.avanto);
      if (result.newAchievements.length > 0) {
        setUnlocked(result.newAchievements);
      }
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Selfien lataus epäonnistui.'));
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
    setActionError(null);
    try {
      setIceBath(await avantoAPI.deleteSelfie(id));
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Selfien poisto epäonnistui.'));
    } finally {
      setUploadingSelfie(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Poistetaanko tämä avanto?')) {
      return;
    }

    setDeleting(true);
    setActionError(null);
    try {
      await avantoAPI.delete(id);
      navigate('/history');
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Poisto epäonnistui.'));
      setDeleting(false);
    }
  };

  if (loading || loadError || !iceBath) {
    return (
      <div className="page-shell detail-page">
        <Header />
        <main className="page-main detail-main">
          {loading ? (
            <p className="state-banner">Ladataan…</p>
          ) : (
            <p className="error-banner">{loadError ?? 'Avantoa ei löytynyt.'}</p>
          )}
          <Link to="/history">Takaisin historiaan</Link>
        </main>
      </div>
    );
  }

  const hasFeelings = iceBath.feeling_before !== null || iceBath.feeling_after !== null;

  return (
    <div className="page-shell detail-page">
      <Header />

      <header className="page-head detail-head">
        <Link to="/history" className="detail-back">Historia</Link>
        <div className="detail-title-row">
          <div>
            <h1>{iceBath.location || 'Tuntematon paikka'}</h1>
            <p className="num">{formatDate(iceBath.date)}</p>
          </div>
          <div className="detail-actions">
            <Link to={`/avanto/${id}/edit`} className="btn-primary">
              Muokkaa
            </Link>
            <button type="button" className="btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Poistetaan…' : 'Poista'}
            </button>
          </div>
        </div>
      </header>

      <main className="page-main detail-main">
        {actionError && (
          <p className="error-banner" role="alert">
            {actionError}
          </p>
        )}

        <dl className="figure-list detail-figures">
          <div>
            <dt>Vesi</dt>
            <dd className="num">
              {iceBath.water_temperature !== null ? `${iceBath.water_temperature}°C` : '–'}
            </dd>
          </div>
          <div>
            <dt>Kesto</dt>
            <dd className="num">{formatDuration(iceBath.duration_minutes, iceBath.duration_seconds)}</dd>
          </div>
          {hasFeelings && (
            <div>
              <dt>Fiilis ennen → jälkeen</dt>
              <dd className="num">
                {iceBath.feeling_before ?? '–'} → {iceBath.feeling_after ?? '–'}
              </dd>
            </div>
          )}
          <div>
            <dt>Sauna</dt>
            <dd className="num">
              {iceBath.sauna
                ? iceBath.sauna_duration
                  ? `${iceBath.sauna_duration} min`
                  : 'Kyllä'
                : 'Ei'}
            </dd>
          </div>
          {iceBath.swear_words !== null && (
            <div>
              <dt>Kirosanat</dt>
              <dd className="num">{iceBath.swear_words}</dd>
            </div>
          )}
        </dl>

        <section className="selfie-section">
          <h2 className="section-title">Selfie</h2>
          {iceBath.selfie_url ? (
            <figure className="selfie-preview">
              <img
                src={iceBath.selfie_url}
                alt={`Selfie, ${iceBath.location || 'avanto'} ${formatDate(iceBath.date)}`}
              />
            </figure>
          ) : (
            <p className="selfie-empty">Ei selfietä.</p>
          )}
          <div className="selfie-actions">
            <label className={`btn-secondary selfie-upload ${uploadingSelfie ? 'is-disabled' : ''}`}>
              {uploadingSelfie ? 'Ladataan…' : iceBath.selfie_url ? 'Vaihda selfie' : 'Lisää selfie'}
              <input type="file" accept="image/*" onChange={handleSelfieUpload} disabled={uploadingSelfie} />
            </label>
            {iceBath.selfie_url && (
              <button
                type="button"
                className="selfie-remove"
                onClick={handleSelfieDelete}
                disabled={uploadingSelfie}
              >
                Poista selfie
              </button>
            )}
          </div>
        </section>
      </main>

      {unlocked && (
        <AchievementUnlockModal achievements={unlocked} onClose={() => setUnlocked(null)} />
      )}
    </div>
  );
};

export default IceBathDetail;
