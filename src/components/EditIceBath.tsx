import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header.js';
import IceBathForm from './IceBathForm';
import { avantoAPI } from '../services/api';
import { getApiErrorMessage } from '../utils/apiErrors';
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
        setError('Avantoa ei löytynyt.');
        setLoading(false);
        return;
      }

      try {
        const avanto = await avantoAPI.getById(id);
        setInitialData(avantoToFormData(avanto));
      } catch (err) {
        setError(getApiErrorMessage(err, 'Avannon lataus epäonnistui.'));
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
          <p className="state-banner">Ladataan…</p>
        </main>
      </div>
    );
  }

  if (error || !id) {
    return (
      <div className="page-shell form-page">
        <Header />
        <main className="page-main">
          <p className="error-banner">{error ?? 'Avantoa ei löytynyt.'}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell form-page">
      <Header />
      <header className="page-head form-head">
        <h1>Muokkaa avantoa</h1>
      </header>
      <main className="page-main form-main">
        <IceBathForm
          key={id}
          initialData={initialData}
          title=""
          subtitle=""
          submitLabel="Tallenna muutokset"
          submittingLabel="Tallennetaan…"
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
    </div>
  );
};

export default EditIceBath;
