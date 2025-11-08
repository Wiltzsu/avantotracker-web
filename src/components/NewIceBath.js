import React, { useState } from 'react';
import { avantoAPI } from '../services/api.ts';
import { useNavigate } from 'react-router-dom';

import Header from './Header.js';
import Footer from './Footer.js';
import './NewIceBath.css';

const NewIceBath = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    location: '',
    water_temperature: '',
    duration_minutes: '',
    duration_seconds: '',
    swear_words: '',
    feeling_before: '',
    feeling_after: '',
    selfie_path: '',
    sauna: '',
    sauna_duration: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        date: formData.date,
        location: formData.location || null,
        water_temperature: formData.water_temperature !== '' ? parseFloat(formData.water_temperature) : null,
        duration_minutes: formData.duration_minutes !== '' ? parseInt(formData.duration_minutes, 10) : null,
        duration_seconds: formData.duration_seconds !== '' ? parseInt(formData.duration_seconds, 10) : null,
        swear_words: formData.swear_words !== '' ? parseInt(formData.swear_words, 10) : null,
        feeling_before: formData.feeling_before !== '' ? parseInt(formData.feeling_before, 10) : null,
        feeling_after: formData.feeling_after !== '' ? parseInt(formData.feeling_after, 10) : null,
        selfie_path: formData.selfie_path || null,
        sauna: formData.sauna === '' ? null : formData.sauna === '1',
        sauna_duration: formData.sauna_duration !== '' ? parseInt(formData.sauna_duration, 10) : null,
      };

      await avantoAPI.create(payload);
      navigate('/dashboard');
    } catch (err) {
      console.error('Create avanto failed:', err?.response?.data || err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return(
    <div className="avanto-container">  
      <Header />
      
      <div className="form-wrapper">
        <div className="form-header">
          <h1>Uusi avanto</h1>
          <p>Täytä tiedot uudesta avantokäynnistä</p>
        </div>

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
            <h3>Sauna</h3>
            
            <div className="form-group">
              <label htmlFor="sauna">🔥 Sauna</label>
              <select
                id="sauna"
                name="sauna"
                value={formData.sauna}
                onChange={handleChange}
              >
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

          {/* <div className="form-section">
            <h3>Muuta</h3>
            
            <div className="form-group">
              <label htmlFor="selfie_path">📸 Selfie</label>
              <input
                type="text"
                id="selfie_path"
                name="selfie_path"
                value={formData.selfie_path}
                onChange={handleChange}
                placeholder="/uploads/selfie.jpg"
              />
            </div>
          </div> */}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Peruuta
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Lisätään...' : 'Lisää avanto'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default NewIceBath;