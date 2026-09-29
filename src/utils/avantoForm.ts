import { AvantoResponse } from '../services/api';

export interface AvantoFormData {
  date: string;
  location: string;
  water_temperature: string;
  duration_minutes: string;
  duration_seconds: string;
  swear_words: string;
  feeling_before: string;
  feeling_after: string;
  sauna: string;
  sauna_duration: string;
}

export interface AvantoPayload {
  date: string;
  location: string | null;
  water_temperature: number | null;
  duration_minutes: number | null;
  duration_seconds: number | null;
  swear_words: number | null;
  feeling_before: number | null;
  feeling_after: number | null;
  sauna: boolean | null;
  sauna_duration: number | null;
}

export const emptyAvantoFormData = (): AvantoFormData => ({
  date: new Date().toISOString().split('T')[0],
  location: '',
  water_temperature: '',
  duration_minutes: '',
  duration_seconds: '',
  swear_words: '',
  feeling_before: '',
  feeling_after: '',
  sauna: '',
  sauna_duration: '',
});

export const avantoToFormData = (avanto: AvantoResponse): AvantoFormData => ({
  date: avanto.date.slice(0, 10),
  location: avanto.location ?? '',
  water_temperature: avanto.water_temperature?.toString() ?? '',
  duration_minutes: avanto.duration_minutes?.toString() ?? '',
  duration_seconds: avanto.duration_seconds?.toString() ?? '',
  swear_words: avanto.swear_words?.toString() ?? '',
  feeling_before: avanto.feeling_before?.toString() ?? '',
  feeling_after: avanto.feeling_after?.toString() ?? '',
  sauna: avanto.sauna === true ? '1' : avanto.sauna === false ? '0' : '',
  sauna_duration: avanto.sauna_duration?.toString() ?? '',
});

export const buildAvantoPayload = (formData: AvantoFormData): AvantoPayload => ({
  date: formData.date,
  location: formData.location || null,
  water_temperature: formData.water_temperature !== '' ? parseFloat(formData.water_temperature) : null,
  duration_minutes: formData.duration_minutes !== '' ? parseInt(formData.duration_minutes, 10) : null,
  duration_seconds: formData.duration_seconds !== '' ? parseInt(formData.duration_seconds, 10) : null,
  swear_words: formData.swear_words !== '' ? parseInt(formData.swear_words, 10) : null,
  feeling_before: formData.feeling_before !== '' ? parseInt(formData.feeling_before, 10) : null,
  feeling_after: formData.feeling_after !== '' ? parseInt(formData.feeling_after, 10) : null,
  sauna: formData.sauna === '' ? null : formData.sauna === '1',
  sauna_duration: formData.sauna_duration !== '' ? parseInt(formData.sauna_duration, 10) : null,
});
