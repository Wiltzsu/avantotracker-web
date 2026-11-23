import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NewIceBath from './NewIceBath';
import EditIceBath from './EditIceBath';
import IceBathDetail from './IceBathDetail';
import History from './History';
import { localIsoDate } from '../utils/avantoForm';
import type { AvantoResponse } from '../services/api';

const api = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getById: vi.fn(),
  getAll: vi.fn(),
  stats: vi.fn(),
  uploadSelfie: vi.fn(),
  deleteSelfie: vi.fn(),
  exportCsv: vi.fn(),
}));

vi.mock('../services/api', () => ({ avantoAPI: api }));
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { name: 'Test User' }, logout: vi.fn() }),
}));

const avanto = (overrides: Partial<AvantoResponse> = {}): AvantoResponse => ({
  avanto_id: 7,
  user_id: 1,
  date: '2026-11-21',
  location: 'Seurasaari',
  water_temperature: 2.5,
  duration_minutes: 2,
  duration_seconds: 30,
  feeling_before: 5,
  feeling_after: 9,
  sauna: true,
  sauna_duration: 15,
  swear_words: 3,
  selfie_url: null,
  ...overrides,
});

const selfieAchievement = {
  id: 'selfie_star',
  title: 'Selfie-tähti',
  description: 'Ensimmäinen selfie',
  unlocked: true,
};

// Renders the page at `path` plus marker pages for where it may navigate to.
const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/new" element={<NewIceBath />} />
        <Route path="/avanto/:id" element={<IceBathDetail />} />
        <Route path="/avanto/:id/edit" element={<EditIceBath />} />
        <Route path="/history" element={<History />} />
        <Route path="/dashboard" element={<p>DASHBOARD PAGE</p>} />
      </Routes>
    </MemoryRouter>,
  );

const pickFile = (input: HTMLElement) => {
  const file = new File(['x'], 'selfie.png', { type: 'image/png' });
  fireEvent.change(input, { target: { files: [file] } });
  return file;
};

beforeEach(() => {
  Object.values(api).forEach((fn) => fn.mockReset());
  api.stats.mockResolvedValue({ location_breakdown: [{ location: 'Seurasaari', visits: 3 }] });
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});

describe('new avanto', () => {
  it('creates an entry from the form and goes to the dashboard', async () => {
    api.create.mockResolvedValue({ avanto: avanto({ avanto_id: 41 }), newAchievements: [] });
    renderAt('/new');

    fireEvent.click(await screen.findByRole('button', { name: 'Seurasaari' }));
    fireEvent.click(screen.getByRole('button', { name: '2 min' }));
    fireEvent.click(screen.getByRole('button', { name: 'Kyllä' }));
    fireEvent.click(await screen.findByRole('button', { name: '20 min' }));
    fireEvent.click(screen.getByRole('button', { name: 'Lisää avanto' }));

    expect(await screen.findByText('DASHBOARD PAGE')).toBeInTheDocument();
    expect(api.create).toHaveBeenCalledOnce();
    expect(api.create.mock.calls[0][0]).toEqual({
      date: localIsoDate(),
      location: 'Seurasaari',
      water_temperature: 0,
      duration_minutes: 2,
      duration_seconds: 0,
      swear_words: 0,
      feeling_before: 4,
      feeling_after: 8,
      sauna: true,
      sauna_duration: 20,
    });
    expect(api.uploadSelfie).not.toHaveBeenCalled();
  });

  it('accepts a custom location typed in', async () => {
    api.create.mockResolvedValue({ avanto: avanto(), newAchievements: [] });
    renderAt('/new');

    await screen.findByRole('button', { name: 'Seurasaari' });
    // First "Muu" is the location group's (temperature and duration have their own)
    fireEvent.click(screen.getAllByRole('button', { name: 'Muu' })[0]);
    fireEvent.change(screen.getByPlaceholderText('Paikan nimi'), { target: { value: 'Uusi ranta' } });
    fireEvent.click(screen.getByRole('button', { name: 'Lisää avanto' }));

    await waitFor(() => expect(api.create).toHaveBeenCalledOnce());
    expect(api.create.mock.calls[0][0].location).toBe('Uusi ranta');
  });

  it('shows unlocked achievements before leaving', async () => {
    api.create.mockResolvedValue({
      avanto: avanto(),
      newAchievements: [{ id: 'first_dip', title: 'Ensimmäinen askel', description: 'x', unlocked: true }],
    });
    renderAt('/new');

    fireEvent.click(screen.getByRole('button', { name: 'Lisää avanto' }));
    expect(await screen.findByText('Ensimmäinen askel')).toBeInTheDocument();
    expect(screen.queryByText('DASHBOARD PAGE')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Jee!' }));
    expect(await screen.findByText('DASHBOARD PAGE')).toBeInTheDocument();
  });

  it('uploads the selfie after creating', async () => {
    api.create.mockResolvedValue({ avanto: avanto({ avanto_id: 41 }), newAchievements: [] });
    api.uploadSelfie.mockResolvedValue({ avanto: avanto({ avanto_id: 41 }), newAchievements: [] });
    renderAt('/new');

    const file = pickFile(screen.getByLabelText(/Lisää selfie/));
    fireEvent.click(screen.getByRole('button', { name: 'Lisää avanto' }));

    expect(await screen.findByText('DASHBOARD PAGE')).toBeInTheDocument();
    expect(api.uploadSelfie).toHaveBeenCalledWith(41, file);
  });

  it('does not report a failed save (and invite a duplicate) when only the selfie fails', async () => {
    api.create.mockResolvedValue({ avanto: avanto({ avanto_id: 41 }), newAchievements: [] });
    api.uploadSelfie.mockRejectedValue(new Error('413'));
    api.getById.mockResolvedValue(avanto({ avanto_id: 41 }));
    renderAt('/new');

    pickFile(screen.getByLabelText(/Lisää selfie/));
    fireEvent.click(screen.getByRole('button', { name: 'Lisää avanto' }));

    // Lands on the saved entry instead of showing "Tallennus epäonnistui"
    expect(await screen.findByRole('heading', { name: 'Seurasaari' })).toBeInTheDocument();
    expect(api.getById).toHaveBeenCalledWith('41');
    expect(api.create).toHaveBeenCalledOnce();
  });

  it('shows an error and stays on the form when create fails', async () => {
    api.create.mockRejectedValue(new Error('500'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    renderAt('/new');

    fireEvent.click(screen.getByRole('button', { name: 'Lisää avanto' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Tallennus epäonnistui');
    expect(screen.getByRole('button', { name: 'Lisää avanto' })).toBeEnabled();
  });
});

describe('edit avanto', () => {
  it('pre-fills the form and saves changes', async () => {
    api.getById.mockResolvedValue(avanto());
    api.update.mockResolvedValue(avanto());
    renderAt('/avanto/7/edit');

    // Pre-filled values are selected
    expect(await screen.findByRole('button', { name: 'Seurasaari', pressed: true })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Kyllä', pressed: true })).toBeInTheDocument();

    // Turning sauna off clears the sauna duration
    fireEvent.click(screen.getByRole('button', { name: 'Ei' }));
    fireEvent.click(screen.getByRole('button', { name: 'Tallenna muutokset' }));

    await waitFor(() => expect(api.update).toHaveBeenCalledOnce());
    expect(api.update).toHaveBeenCalledWith(
      '7',
      expect.objectContaining({
        location: 'Seurasaari',
        water_temperature: 2.5,
        duration_minutes: 2,
        duration_seconds: 30,
        sauna: false,
        sauna_duration: null,
        swear_words: 3,
      }),
    );
    expect(await screen.findByRole('heading', { name: 'Seurasaari' })).toBeInTheDocument();
  });

  it('shows a Finnish error when the entry cannot be loaded', async () => {
    api.getById.mockRejectedValue({});
    renderAt('/avanto/7/edit');
    expect(await screen.findByText('Avannon lataus epäonnistui.')).toBeInTheDocument();
  });
});

describe('avanto detail', () => {
  it('shows the entry, with a dash for a missing temperature and zero swear words', async () => {
    api.getById.mockResolvedValue(avanto({ water_temperature: null, swear_words: 0 }));
    renderAt('/avanto/7');

    expect(await screen.findByRole('heading', { name: 'Seurasaari' })).toBeInTheDocument();
    expect(screen.queryByText(/null/)).not.toBeInTheDocument();
    const swear = screen.getByText('Kirosanat').closest('div')!;
    expect(swear).toHaveTextContent('0');
    expect(screen.getByText('15 min')).toBeInTheDocument();
  });

  it('keeps the page intact after a selfie upload and shows new achievements', async () => {
    api.getById.mockResolvedValue(avanto());
    api.uploadSelfie.mockResolvedValue({
      avanto: avanto({ selfie_url: 'http://localhost/selfie.png' }),
      newAchievements: [selfieAchievement],
    });
    renderAt('/avanto/7');

    pickFile(await screen.findByLabelText(/Lisää selfie/));

    expect(await screen.findByText('Selfie-tähti')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Seurasaari' })).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'http://localhost/selfie.png');
  });

  it('keeps the data visible when a selfie upload fails', async () => {
    api.getById.mockResolvedValue(avanto());
    api.uploadSelfie.mockRejectedValue({});
    renderAt('/avanto/7');

    pickFile(await screen.findByLabelText(/Lisää selfie/));

    expect(await screen.findByRole('alert')).toHaveTextContent('Selfien lataus epäonnistui.');
    expect(screen.getByRole('heading', { name: 'Seurasaari' })).toBeInTheDocument();
  });

  it('removes a selfie after confirming', async () => {
    api.getById.mockResolvedValue(avanto({ selfie_url: 'http://localhost/selfie.png' }));
    api.deleteSelfie.mockResolvedValue(avanto({ selfie_url: null }));
    renderAt('/avanto/7');

    fireEvent.click(await screen.findByRole('button', { name: 'Poista selfie' }));

    expect(await screen.findByText('Ei selfietä.')).toBeInTheDocument();
    expect(api.deleteSelfie).toHaveBeenCalledWith('7');
  });

  it('deletes the entry after confirming and goes to history', async () => {
    api.getById.mockResolvedValue(avanto());
    api.delete.mockResolvedValue(undefined);
    api.getAll.mockResolvedValue({ data: [], meta: { last_page: 1 } });
    renderAt('/avanto/7');

    fireEvent.click(await screen.findByRole('button', { name: 'Poista' }));

    expect(await screen.findByRole('heading', { name: 'Historia' })).toBeInTheDocument();
    expect(api.delete).toHaveBeenCalledWith('7');
  });

  it('does nothing when delete is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    api.getById.mockResolvedValue(avanto());
    renderAt('/avanto/7');

    fireEvent.click(await screen.findByRole('button', { name: 'Poista' }));
    expect(api.delete).not.toHaveBeenCalled();
  });

  it('shows an error and keeps the page when delete fails', async () => {
    api.getById.mockResolvedValue(avanto());
    api.delete.mockRejectedValue({});
    renderAt('/avanto/7');

    fireEvent.click(await screen.findByRole('button', { name: 'Poista' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Poisto epäonnistui.');
    expect(screen.getByRole('button', { name: 'Poista' })).toBeEnabled();
  });
});

describe('history', () => {
  it('lists entries, applies filters and resets them', async () => {
    api.getAll.mockResolvedValue({ data: [avanto()], meta: { last_page: 1 } });
    renderAt('/history');

    expect(await screen.findByRole('link', { name: 'Seurasaari' })).toHaveAttribute('href', '/avanto/7');

    fireEvent.change(screen.getByLabelText('Paikka'), { target: { value: 'Seura' } });
    fireEvent.change(screen.getByLabelText('Sauna'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Suodata' }));

    await waitFor(() =>
      expect(api.getAll).toHaveBeenLastCalledWith(1, 10, expect.objectContaining({ location: 'Seura', sauna: true })),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Tyhjennä' }));
    await waitFor(() =>
      expect(api.getAll).toHaveBeenLastCalledWith(1, 10, expect.objectContaining({ location: '', sauna: undefined })),
    );
  });

  it('pages through results', async () => {
    api.getAll.mockResolvedValue({ data: [avanto()], meta: { last_page: 3 } });
    renderAt('/history');

    fireEvent.click(await screen.findByRole('button', { name: 'Seuraava' }));
    await waitFor(() => expect(api.getAll).toHaveBeenLastCalledWith(2, 10, expect.anything()));
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');
  });
});
