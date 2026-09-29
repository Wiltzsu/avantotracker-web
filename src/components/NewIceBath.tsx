import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.js';
import Footer from './Footer.js';
import IceBathForm from './IceBathForm';
import { avantoAPI } from '../services/api.ts';
import { emptyAvantoFormData } from '../utils/avantoForm';
import './NewIceBath.css';

const NewIceBath: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="avanto-container">
      <Header />
      <IceBathForm
        initialData={emptyAvantoFormData()}
        title="Uusi avanto"
        subtitle="Täytä tiedot uudesta avantokäynnistä"
        submitLabel="Lisää avanto"
        submittingLabel="Lisätään..."
        cancelTo="/dashboard"
        onSubmit={async (payload, selfie) => {
          const avanto = await avantoAPI.create(payload);
          if (selfie) {
            await avantoAPI.uploadSelfie(avanto.avanto_id, selfie);
          }
          navigate('/dashboard');
        }}
      />
      <Footer />
    </div>
  );
};

export default NewIceBath;
