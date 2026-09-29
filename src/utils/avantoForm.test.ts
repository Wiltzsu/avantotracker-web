import { describe, expect, it } from 'vitest';
import {
  avantoToFormData,
  buildAvantoPayload,
  emptyAvantoFormData,
} from './avantoForm';
import type { AvantoResponse } from '../services/api';

describe('avantoForm helpers', () => {
  it('builds an empty form with today as the default date', () => {
    const form = emptyAvantoFormData();
    expect(form.date).toBe(new Date().toISOString().split('T')[0]);
    expect(form.location).toBe('');
  });

  it('maps API avanto data into form fields', () => {
    const avanto: AvantoResponse = {
      avanto_id: 1,
      user_id: 2,
      date: '2026-01-15T00:00:00.000000Z',
      location: 'Helsinki',
      water_temperature: 2.5,
      feeling_before: 3,
      feeling_after: 8,
      sauna: true,
      sauna_duration: 10,
      swear_words: 1,
      duration_minutes: 2,
      duration_seconds: 30,
    };

    expect(avantoToFormData(avanto)).toEqual({
      date: '2026-01-15',
      location: 'Helsinki',
      water_temperature: '2.5',
      duration_minutes: '2',
      duration_seconds: '30',
      swear_words: '1',
      feeling_before: '3',
      feeling_after: '8',
      sauna: '1',
      sauna_duration: '10',
    });
  });

  it('builds API payload with nulls for empty optional fields', () => {
    const payload = buildAvantoPayload({
      ...emptyAvantoFormData(),
      date: '2026-02-01',
      location: 'Espoo',
      water_temperature: '1.5',
      duration_minutes: '1',
      duration_seconds: '15',
      swear_words: '',
      feeling_before: '4',
      feeling_after: '7',
      sauna: '0',
      sauna_duration: '',
    });

    expect(payload).toEqual({
      date: '2026-02-01',
      location: 'Espoo',
      water_temperature: 1.5,
      duration_minutes: 1,
      duration_seconds: 15,
      swear_words: null,
      feeling_before: 4,
      feeling_after: 7,
      sauna: false,
      sauna_duration: null,
    });
  });
});
