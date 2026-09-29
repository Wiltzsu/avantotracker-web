import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header.js';
import Footer from './Footer.js';
import IceBathForm from './IceBathForm';
import { avantoAPI } from '../services/api';
import { avantoToFormData, emptyAvantoFormData } from '../utils/avantoForm';
import './NewIceBath.css';

const EditIceBath: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(emptyAvantoFormData());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvanto = async () => {
      if (!id) {
        setError('Avanto ID puuttuu');
        setLoading(false);
        return;
      }

      try {
        const avanto = await avantoAPI.getById(id);
        setInitialData(avantoToFormData(avanto));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Avantoa ei voitu ladata';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvanto();
  }, [id]);

  if (loading) {
    return (
      <div className="avanto-container">
        <Header />
        <div className="form-wrapper">
          <p>Ladataan avantoa...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !id) {
    return (
      <div className="avanto-container">
        <Header />
        <div className="form-wrapper">
          <div className="form-error">{error ?? 'Avantoa ei löytynyt'}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="avanto-container">
      <Header />
      <IceBathForm
        key={id}
        initialData={initialData}
        title="Muokkaa avantoa"
        subtitle="Päivitä avantokäynnin tiedot"
        submitLabel="Tallenna muutokset"
        submittingLabel="Tallennetaan..."
        cancelTo={`/avanto/${id}`}
        onSubmit={async (payload) => {
          await avantoAPI.update(id, payload);
          navigate(`/avanto/${id}`);
        }}
      />
      <Footer />
    </div>
  );
};

export default EditIceBath;
