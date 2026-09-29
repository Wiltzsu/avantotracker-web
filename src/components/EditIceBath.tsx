import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header.js';
import Footer from './Footer.js';
import IceBathForm from './IceBathForm';
import { avantoAPI } from '../services/api';
import { avantoToFormData, emptyAvantoFormData } from '../utils/avantoForm';
import iceLake from '../ice-lake.jpg';
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
      <div className="page-shell form-page">
        <Header />
        <main className="page-main">
          <div className="state-banner">Ladataan avantoa...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !id) {
    return (
      <div className="page-shell form-page">
        <Header />
        <main className="page-main">
          <div className="error-banner">{error ?? 'Avantoa ei löytynyt'}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-shell form-page">
      <Header />
      <section
        className="page-hero"
        style={{ ['--hero-image' as string]: `url(${iceLake})` }}
      >
        <h1>Muokkaa avantoa</h1>
        <p>Päivitä avantokäynnin tiedot.</p>
      </section>
      <main className="page-main">
        <IceBathForm
          key={id}
          initialData={initialData}
          title=""
          subtitle=""
          submitLabel="Tallenna muutokset"
          submittingLabel="Tallennetaan..."
          cancelTo={`/avanto/${id}`}
          onSubmit={async (payload, selfie) => {
            await avantoAPI.update(id, payload);
            if (selfie) {
              await avantoAPI.uploadSelfie(id, selfie);
            }
            navigate(`/avanto/${id}`);
          }}
        />
      </main>
      <Footer />
    </div>
  );
};

export default EditIceBath;
