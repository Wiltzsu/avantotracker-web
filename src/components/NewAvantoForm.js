import React, { useState } from 'react';
import { avantoAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

import Header from './Header.js';
import Footer from './Footer.js';
import './NewAvantoForm.css';

const NewAvantoForm = () => {
  // State to store form input values
  const [formData, setFormData] = useState({
    date: '',
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

  // Handle input field changes (when user types)
  const handleChange = (e) => {
    setFormData({
      ...formData,                    // Keep existing form data
      [e.target.name]: e.target.value // Update the specific field that changed
    })
  }

  const navigate = useNavigate();

  // Handle form submission (when user clicks add)
  const handleSubmit = async (e) => {
    e.preventDefault();                   // Prevent page refresh
    
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
        sauna: formData.sauna === '' ? null : formData.sauna === '1', // boolean or change to Number(...) if you prefer 1/0
        sauna_duration: formData.sauna_duration !== '' ? parseInt(formData.sauna_duration, 10) : null,
      };

      await avantoAPI.create(payload);
      navigate('/dashboard');
    } catch (err) {
      console.error('Create avanto failed:', err?.response?.data || err);
    }
  }

  return(
    <div className="avanto-container">  
      <Header></Header>

      <form onSubmit={handleSubmit} className="avanto-form">

        <div className="form-group">
          <label htmlFor="date">Päivämäärä</label>
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
          <label htmlFor="location">Sijainti</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder=""
          />
        </div>

        <div className="form-group">
          <label htmlFor="water_temperature">Veden lämpötila (°C)</label>
          <input
            type="number"
            id="water_temperature"
            name="water_temperature"
            value={formData.water_temperature}
            onChange={handleChange}
            step="0.1"
            min="-50"
            max="50"
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label>Kesto</label>
          <div className="input-row">
            <input
              type="number"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
              min="0"
              placeholder="Minuuttia"
            />
            <input
              type="number"
              name="duration_seconds"
              value={formData.duration_seconds}
              onChange={handleChange}
              min="0"
              max="59"
              placeholder="Sekuntia"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="swear_words">Kirosanat</label>
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

        <div className="form-group">
          <label htmlFor="feeling_before">Fiilis ennen (1–10)</label>
          <input
            type="number"
            id="feeling_before"
            name="feeling_before"
            value={formData.feeling_before}
            onChange={handleChange}
            min="1"
            max="10"
            step="1"
            placeholder="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="feeling_after">Fiilis jälkeen (1–10)</label>
          <input
            type="number"
            id="feeling_after"
            name="feeling_after"
            value={formData.feeling_after}
            onChange={handleChange}
            min="1"
            max="10"
            step="1"
            placeholder="10"
          />
        </div>

        <div className="form-group">
          <label htmlFor="selfie_path">Selfie</label>
          <input
            type="text"
            id="selfie_path"
            name="selfie_path"
            value={formData.selfie_path}
            onChange={handleChange}
            placeholder="/uploads/selfie.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="sauna">Sauna</label>
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

        <div className="form-group">
          <label htmlFor="sauna_duration">Saunan kesto (minuutteja)</label>
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

        <button type="submit" className="action-button primary">
          Lisää avanto
        </button>
      </form>

      <Footer></Footer>

    </div>
  );
};

export default NewAvantoForm;