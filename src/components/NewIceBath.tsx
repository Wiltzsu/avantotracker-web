import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.js';
import Footer from './Footer.js';
import IceBathForm from './IceBathForm';
import { avantoAPI } from '../services/api.ts';
import { emptyAvantoFormData } from '../utils/avantoForm';
import iceLake from '../ice-lake.jpg';
import './NewIceBath.css';

const NewIceBath: React.FC = () => {
  const navigate = useNavigate();

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
          const avanto = await avantoAPI.create(payload);
          if (selfie) {
            await avantoAPI.uploadSelfie(avanto.avanto_id, selfie);
          }
          navigate('/dashboard');
        }}
      />
      </main>
      <Footer />
    </div>
  );
};

export default NewIceBath;
