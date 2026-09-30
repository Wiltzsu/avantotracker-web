import React from 'react';
import { Achievement } from '../services/api';
import { getAchievementIcon } from '../utils/achievementIcons';
import './AchievementUnlockModal.css';

interface AchievementUnlockModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
  achievements,
  onClose,
}) => {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="achievement-unlock-overlay"
      role="presentation"
      onClick={handleBackdropClick}
    >
      <div
        className="achievement-unlock-modal glass-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievement-unlock-title"
      >
        <p className="achievement-unlock-kicker">Saavutus avattu</p>
        <h2 id="achievement-unlock-title">
          {achievements.length === 1 ? 'Hyvä!' : `${achievements.length} uutta saavutusta`}
        </h2>

        <ul className="achievement-unlock-list">
          {achievements.map((achievement) => (
            <li key={achievement.id}>
              <span className="achievement-unlock-icon" aria-hidden="true">
                {getAchievementIcon(achievement.id)}
              </span>
              <div>
                <strong>{achievement.title}</strong>
                <p>{achievement.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <button type="button" className="btn-primary achievement-unlock-close" onClick={onClose}>
          Jee!
        </button>
      </div>
    </div>
  );
};

export default AchievementUnlockModal;
