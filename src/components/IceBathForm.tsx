import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { avantoAPI } from '../services/api';
import { AvantoFormData, AvantoPayload, buildAvantoPayload } from '../utils/avantoForm';
import {
  DURATION_PRESETS,
  FEELING_VALUES,
  SAUNA_DURATION_PRESETS,
  SWEAR_PRESETS,
  TEMPERATURE_PRESETS,
  durationPresetKey,
  isPresetValue,
  matchesDurationPreset,
} from '../utils/formOptions';
import OptionButtons from './OptionButtons';
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

const CUSTOM = '__custom__';
const todayIso = () => new Date().toISOString().split('T')[0];

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
  const [savedLocations, setSavedLocations] = useState<string[]>([]);
  const [customLocation, setCustomLocation] = useState(false);
  const [customTemperature, setCustomTemperature] = useState(
    () => initialData.water_temperature !== '' && !TEMPERATURE_PRESETS.includes(initialData.water_temperature),
  );
  const [customDuration, setCustomDuration] = useState(
    () =>
      !DURATION_PRESETS.some((preset) =>
        matchesDurationPreset(initialData.duration_minutes, initialData.duration_seconds, preset),
      ) &&
      (initialData.duration_minutes !== '' || initialData.duration_seconds !== ''),
  );
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const loadLocations = async () => {
      try {
        const stats = await avantoAPI.stats('all');
        if (cancelled) {
          return;
        }

        const locations = stats.location_breakdown
          .map((item) => item.location.trim())
          .filter(Boolean);

        setSavedLocations(locations);

        if (
          initialData.location &&
          !locations.includes(initialData.location.trim())
        ) {
          setCustomLocation(true);
        }
      } catch {
        if (initialData.location) {
          setCustomLocation(true);
        }
      }
    };

    loadLocations();

    return () => {
      cancelled = true;
    };
  }, [initialData.location]);

  const locationOptions = useMemo(
    () => [
      ...savedLocations.map((location) => ({ label: location, value: location })),
      { label: 'Muu', value: CUSTOM },
    ],
    [savedLocations],
  );

  const selectedLocationValue = customLocation ? CUSTOM : formData.location;

  const selectedDurationValue = useMemo(() => {
    const match = DURATION_PRESETS.find((preset) =>
      matchesDurationPreset(formData.duration_minutes, formData.duration_seconds, preset),
    );
    return match ? durationPresetKey(match.minutes, match.seconds) : customDuration ? CUSTOM : '';
  }, [formData.duration_minutes, formData.duration_seconds, customDuration]);

  const durationOptions = useMemo(
    () => [
      ...DURATION_PRESETS.map((preset) => ({
        label: preset.label,
        value: durationPresetKey(preset.minutes, preset.seconds),
      })),
      { label: 'Muu', value: CUSTOM },
    ],
    [],
  );

  const temperatureOptions = useMemo(
    () => [
      ...TEMPERATURE_PRESETS.map((value) => ({ label: `${value}°`, value })),
      { label: 'Muu', value: CUSTOM },
    ],
    [],
  );

  const selectedTemperatureValue = customTemperature ? CUSTOM : formData.water_temperature;

  const setField = (name: keyof AvantoFormData, value: string) => {
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setField('date', event.target.value);
  };

  const handleLocationSelect = (value: string) => {
    if (value === CUSTOM) {
      setCustomLocation(true);
      return;
    }

    setCustomLocation(false);
    setField('location', value);
  };

  const handleTemperatureSelect = (value: string) => {
    if (value === CUSTOM) {
      setCustomTemperature(true);
      return;
    }

    setCustomTemperature(false);
    setField('water_temperature', value);
  };

  const handleDurationSelect = (value: string) => {
    if (value === CUSTOM) {
      setCustomDuration(true);
      return;
    }

    const preset = DURATION_PRESETS.find(
      (item) => durationPresetKey(item.minutes, item.seconds) === value,
    );

    if (!preset) {
      return;
    }

    setCustomDuration(false);
    setFormData((current) => ({
      ...current,
      duration_minutes: preset.minutes,
      duration_seconds: preset.seconds,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
    <>
      {title && (
        <div className="form-header">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="avanto-form">
        <div className="form-section">
          <h3>Perustiedot</h3>

          <div className="form-group">
            <label htmlFor="date">Päivämäärä</label>
            <div className="inline-field-row">
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleDateChange}
                required
              />
              <button
                type="button"
                className={`option-btn ${formData.date === todayIso() ? 'active' : ''}`}
                onClick={() => setField('date', todayIso())}
              >
                Tänään
              </button>
            </div>
          </div>

          <div className="form-group">
            <span className="field-label">Sijainti</span>
            {locationOptions.length > 1 ? (
              <OptionButtons
                options={locationOptions}
                value={selectedLocationValue}
                onChange={handleLocationSelect}
              />
            ) : null}
            {(customLocation || locationOptions.length <= 1) && (
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={(event) => setField('location', event.target.value)}
                placeholder="esim. Seurasaari"
              />
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Vesi</h3>

          <div className="form-group">
            <span className="field-label">Lämpötila</span>
            <OptionButtons
              options={temperatureOptions}
              value={selectedTemperatureValue}
              onChange={handleTemperatureSelect}
            />
            {customTemperature && (
              <div className="input-with-label">
                <input
                  type="number"
                  id="water_temperature"
                  name="water_temperature"
                  value={formData.water_temperature}
                  onChange={(event) => setField('water_temperature', event.target.value)}
                  step="0.1"
                  min="-50"
                  max="50"
                  placeholder="°C"
                />
                <span className="input-suffix">°C</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <span className="field-label">Kesto</span>
            <OptionButtons
              options={durationOptions}
              value={selectedDurationValue}
              onChange={handleDurationSelect}
            />
            {customDuration && (
              <div className="input-row">
                <div className="input-with-label">
                  <input
                    type="number"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={(event) => setField('duration_minutes', event.target.value)}
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
                    onChange={(event) => setField('duration_seconds', event.target.value)}
                    min="0"
                    max="59"
                    placeholder="0"
                  />
                  <span className="input-suffix">sek</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Fiilis</h3>

          <div className="form-group">
            <span className="field-label">Ennen</span>
            <OptionButtons
              compact
              options={FEELING_VALUES.map((value) => ({ label: value, value }))}
              value={formData.feeling_before}
              onChange={(value) => setField('feeling_before', value)}
            />
          </div>

          <div className="form-group">
            <span className="field-label">Jälkeen</span>
            <OptionButtons
              compact
              options={FEELING_VALUES.map((value) => ({ label: value, value }))}
              value={formData.feeling_after}
              onChange={(value) => setField('feeling_after', value)}
            />
          </div>

          <div className="form-group">
            <span className="field-label">Kirosanat</span>
            <OptionButtons
              options={[
                ...SWEAR_PRESETS.map((value) => ({ label: value, value })),
                ...(isPresetValue(formData.swear_words, SWEAR_PRESETS) || formData.swear_words === ''
                  ? []
                  : [{ label: formData.swear_words, value: formData.swear_words }]),
              ]}
              value={formData.swear_words}
              onChange={(value) => setField('swear_words', value)}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Sauna</h3>

          <div className="form-group">
            <span className="field-label">Saunottiinko?</span>
            <OptionButtons
              options={[
                { label: 'Kyllä', value: '1' },
                { label: 'Ei', value: '0' },
              ]}
              value={formData.sauna}
              onChange={(value) => {
                setField('sauna', value);
                if (value !== '1') {
                  setField('sauna_duration', '');
                }
              }}
            />
          </div>

          {formData.sauna === '1' && (
            <div className="form-group">
              <span className="field-label">Saunan kesto</span>
              <OptionButtons
                options={[
                  ...SAUNA_DURATION_PRESETS.map((value) => ({
                    label: `${value} min`,
                    value,
                  })),
                  ...(isPresetValue(formData.sauna_duration, SAUNA_DURATION_PRESETS) ||
                  formData.sauna_duration === ''
                    ? []
                    : [{ label: `${formData.sauna_duration} min`, value: formData.sauna_duration }]),
                ]}
                value={formData.sauna_duration}
                onChange={(value) => setField('sauna_duration', value)}
              />
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Muisto</h3>

          <div className="form-group">
            <label className="selfie-upload" htmlFor="selfie">
              {selfieFile ? selfieFile.name : 'Lisää selfie (valinnainen)'}
            </label>
            <input
              type="file"
              id="selfie"
              name="selfie"
              accept="image/*"
              onChange={(event) => setSelfieFile(event.target.files?.[0] ?? null)}
            />
          </div>
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
    </>
  );
};

export default IceBathForm;
