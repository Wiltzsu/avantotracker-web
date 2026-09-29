import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Records from '../components/Records';

const { recordsMock } = vi.hoisted(() => ({
  recordsMock: vi.fn(),
}));

vi.mock('../services/api', () => ({
  avantoAPI: {
    records: recordsMock,
  },
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { name: 'Test User' }, logout: vi.fn() }),
}));

describe('smoke flow pages', () => {
  beforeEach(() => {
    recordsMock.mockResolvedValue({
      coldest_dip: {
        avanto_id: 1,
        date: '2026-01-01',
        location: 'Bay',
        value: 0.5,
      },
      longest_dip: null,
      most_swear_words: null,
      best_mood_swing: null,
    });
  });

  it('renders personal records from the API', async () => {
    render(
      <MemoryRouter>
        <Records />
      </MemoryRouter>
    );

    expect(await screen.findByText('Kylmin uinti')).toBeInTheDocument();
    expect(screen.getByText('0.5°C')).toBeInTheDocument();
    await waitFor(() => expect(recordsMock).toHaveBeenCalledOnce());
  });
});
