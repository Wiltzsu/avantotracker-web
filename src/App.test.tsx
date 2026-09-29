import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const { meMock } = vi.hoisted(() => ({
  meMock: vi.fn(),
}));

vi.mock('./services/api', () => ({
  authAPI: {
    me: meMock,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
  setAuthErrorHandler: vi.fn(),
  avantoAPI: {},
  default: {},
}));

describe('App', () => {
  beforeEach(() => {
    meMock.mockRejectedValue(new Error('No session'));
  });

  it('shows login for unauthenticated users', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Tervetuloa' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Kirjaudu sisään/i })).toBeInTheDocument();
  });
});
