import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AchievementUnlockModal from './AchievementUnlockModal';

describe('AchievementUnlockModal', () => {
  it('renders achievements and calls onClose', () => {
    const onClose = vi.fn();

    render(
      <AchievementUnlockModal
        achievements={[
          {
            id: 'first_dip',
            title: 'Ensimmäinen askel',
            description: 'Ensimmäinen avantosi on kirjattu',
            unlocked: true,
          },
        ]}
        onClose={onClose}
      />,
    );

    expect(screen.getByText('Ensimmäinen askel')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Jee!' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
