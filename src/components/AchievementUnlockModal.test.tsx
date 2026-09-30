import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AchievementUnlockModal from './AchievementUnlockModal';

describe('AchievementUnlockModal', () => {
  it('renders achievements and calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <AchievementUnlockModal
        achievements={[
          {
            id: 'first_dip',
            title: 'Ensimmäinen askel',
            description: 'Ensimmäinen avanto kirjattu',
            unlocked: true,
          },
        ]}
        onClose={onClose}
      />,
    );

    expect(screen.getByText('Ensimmäinen askel')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Jee!' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
