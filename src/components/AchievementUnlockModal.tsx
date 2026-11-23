import React, { useEffect, useRef } from 'react';
import { Achievement } from '../services/api';
import './AchievementUnlockModal.css';

interface AchievementUnlockModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
  achievements,
  onClose,
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus the close button on open and allow Escape to close (dialog basics)
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

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
        className="achievement-unlock-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievement-unlock-title"
      >
        <h2 id="achievement-unlock-title">
          {achievements.length === 1 ? 'Uusi saavutus' : `${achievements.length} uutta saavutusta`}
        </h2>

        <ul className="achievement-unlock-list">
          {achievements.map((achievement) => (
            <li key={achievement.id}>
              <strong>{achievement.title}</strong>
              <p>{achievement.description}</p>
            </li>
          ))}
        </ul>

        <button
          ref={closeRef}
          type="button"
          className="btn-primary achievement-unlock-close"
          onClick={onClose}
        >
          Jee!
        </button>
      </div>
    </div>
  );
};

export default AchievementUnlockModal;
