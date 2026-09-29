import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AvantoFormData, AvantoPayload, buildAvantoPayload } from '../utils/avantoForm';
import './NewIceBath.css';

interface IceBathFormProps {
  initialData: AvantoFormData;
  title: string;
  subtitle: string;
  submitLabel: string;
  submittingLabel: string;
  cancelTo: string;
  onSubmit: (payload: AvantoPayload, selfie?: File | null) => Promise<void>;
}

const IceBathForm: React.FC<IceBathFormProps> = ({
  initialData,
  title,
  subtitle,
  submitLabel,
  submittingLabel,
  cancelTo,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<AvantoFormData>(initialData);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(buildAvantoPayload(formData), selfieFile);
    } catch (err) {
      console.error('Avanto form submit failed:', err);
      setError('Tallennus epäonnistui. Yritä uudelleen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="avanto-form">
        <div className="form-section">
          <h3>Perustiedot</h3>

          <div className="form-group">
            <label htmlFor="date">📅 Päivämäärä</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">📍 Sijainti</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="esim. Seurasaari, Helsinki"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Vesi</h3>

          <div className="form-group">
            <label htmlFor="water_temperature">🌡️ Veden lämpötila (°C)</label>
            <input
              type="number"
              id="water_temperature"
              name="water_temperature"
              value={formData.water_temperature}
              onChange={handleChange}
              step="0.1"
              min="-50"
              max="50"
              placeholder="0.0"
            />
          </div>

          <div className="form-group">
            <label>⏱️ Kesto</label>
            <div className="input-row">
              <div className="input-with-label">
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
                <span className="input-suffix">min</span>
              </div>
              <div className="input-with-label">
                <input
                  type="number"
                  name="duration_seconds"
                  value={formData.duration_seconds}
                  onChange={handleChange}
                  min="0"
                  max="59"
                  placeholder="0"
                />
                <span className="input-suffix">sek</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Fiilis</h3>

          <div className="form-group">
            <label htmlFor="feeling_before">😰 Fiilis ennen (1–10)</label>
            <div className="rating-input">
              <input
                type="range"
                id="feeling_before"
                name="feeling_before"
                value={formData.feeling_before}
                onChange={handleChange}
                min="1"
                max="10"
                step="1"
              />
              <span className="rating-value">{formData.feeling_before || '5'}</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="feeling_after">😌 Fiilis jälkeen (1–10)</label>
            <div className="rating-input">
              <input
                type="range"
                id="feeling_after"
                name="feeling_after"
                value={formData.feeling_after}
                onChange={handleChange}
                min="1"
                max="10"
                step="1"
              />
              <span className="rating-value">{formData.feeling_after || '5'}</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="swear_words">💬 Kirosanat</label>
            <input
              type="number"
              id="swear_words"
              name="swear_words"
              value={formData.swear_words}
              onChange={handleChange}
              min="0"
              step="1"
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Muisto</h3>

          <div className="form-group">
            <label htmlFor="selfie">📸 Selfie (valinnainen)</label>
            <input
              type="file"
              id="selfie"
              name="selfie"
              accept="image/*"
              onChange={(event) => setSelfieFile(event.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Sauna</h3>

          <div className="form-group">
            <label htmlFor="sauna">🔥 Sauna</label>
            <select id="sauna" name="sauna" value={formData.sauna} onChange={handleChange}>
              <option value="">Valitse</option>
              <option value="1">Kyllä</option>
              <option value="0">Ei</option>
            </select>
          </div>

          {formData.sauna === '1' && (
            <div className="form-group">
              <label htmlFor="sauna_duration">⏰ Saunan kesto (minuutteja)</label>
              <input
                type="number"
                id="sauna_duration"
                name="sauna_duration"
                value={formData.sauna_duration}
                onChange={handleChange}
                min="0"
                step="1"
                placeholder="5"
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(cancelTo)}>
            Peruuta
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? submittingLabel : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IceBathForm;
