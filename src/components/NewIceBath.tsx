import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.js';
import IceBathForm from './IceBathForm';
import AchievementUnlockModal from './AchievementUnlockModal';
import { avantoAPI, Achievement } from '../services/api';
import { emptyAvantoFormData } from '../utils/avantoForm';
import { mergeNewAchievements } from '../utils/mergeAchievements';
import './NewIceBath.css';

const NewIceBath: React.FC = () => {
  const navigate = useNavigate();
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[] | null>(null);

  const [nextPath, setNextPath] = useState('/dashboard');

  const finishFlow = (path = nextPath) => {
    setUnlockedAchievements(null);
    navigate(path);
  };

  return (
    <div className="page-shell form-page">
      <Header />
      <header className="page-head form-head">
        <h1>Uusi avanto</h1>
      </header>
      <main className="page-main form-main">
        <IceBathForm
          initialData={emptyAvantoFormData()}
        title=""
        subtitle=""
        submitLabel="Lisää avanto"
        submittingLabel="Lisätään…"
        cancelTo="/dashboard"
        onSubmit={async (payload, selfie) => {
          const created = await avantoAPI.create(payload);

          // The avanto is saved at this point. If only the selfie fails, don't throw:
          // the form would say "save failed" and a retry would create a duplicate.
          // Send the user to the saved entry instead, where the selfie can be re-added.
          let selfieResult = null;
          let path = '/dashboard';
          if (selfie) {
            try {
              selfieResult = await avantoAPI.uploadSelfie(created.avanto.avanto_id, selfie);
            } catch {
              path = `/avanto/${created.avanto.avanto_id}`;
            }
          }

          const newAchievements = mergeNewAchievements(
            created.newAchievements,
            selfieResult?.newAchievements ?? [],
          );

          if (newAchievements.length > 0) {
            setNextPath(path);
            setUnlockedAchievements(newAchievements);
            return;
          }

          finishFlow(path);
        }}
      />
      </main>
      {unlockedAchievements && (
        <AchievementUnlockModal achievements={unlockedAchievements} onClose={() => finishFlow()} />
      )}
    </div>
  );
};

export default NewIceBath;
