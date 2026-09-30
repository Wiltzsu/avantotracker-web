import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.js';
import Footer from './Footer.js';
import IceBathForm from './IceBathForm';
import AchievementUnlockModal from './AchievementUnlockModal';
import { avantoAPI, Achievement } from '../services/api.ts';
import { emptyAvantoFormData } from '../utils/avantoForm';
import { mergeNewAchievements } from '../utils/mergeAchievements';
import iceLake from '../ice-lake.jpg';
import './NewIceBath.css';

const NewIceBath: React.FC = () => {
  const navigate = useNavigate();
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[] | null>(null);

  const finishFlow = () => {
    setUnlockedAchievements(null);
    navigate('/dashboard');
  };

  return (
    <div className="page-shell form-page">
      <Header />
      <section
        className="page-hero"
        style={{ ['--hero-image' as string]: `url(${iceLake})` }}
      >
        <h1>Uusi avanto</h1>
        <p>Kirjaa uinti, lämpö ja fiilikset.</p>
      </section>
      <main className="page-main">
      <IceBathForm
        initialData={emptyAvantoFormData()}
        title=""
        subtitle=""
        submitLabel="Lisää avanto"
        submittingLabel="Lisätään..."
        cancelTo="/dashboard"
        onSubmit={async (payload, selfie) => {
          const created = await avantoAPI.create(payload);
          const selfieResult = selfie
            ? await avantoAPI.uploadSelfie(created.avanto.avanto_id, selfie)
            : null;

          const newAchievements = mergeNewAchievements(
            created.newAchievements,
            selfieResult?.newAchievements ?? [],
          );

          if (newAchievements.length > 0) {
            setUnlockedAchievements(newAchievements);
            return;
          }

          finishFlow();
        }}
      />
      </main>
      <Footer />
      {unlockedAchievements && (
        <AchievementUnlockModal achievements={unlockedAchievements} onClose={finishFlow} />
      )}
    </div>
  );
};

export default NewIceBath;
