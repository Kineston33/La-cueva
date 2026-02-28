import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api/client';

const TechnicianPublicPage = () => {
  const { nombre } = useParams();
  const [technician, setTechnician] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/market/technicians/${nombre}`)
      .then((res) => setTechnician(res.technician))
      .catch((err) => setError(err.message));
  }, [nombre]);

  if (error) {
    return (
      <div className="stack">
        <p className="error">{error}</p>
        <Link className="ghost" to="/">Volver al inicio</Link>
      </div>
    );
  }

  if (!technician) return <p>Cargando técnico...</p>;

  const whatsappUrl = `https://wa.me/${technician.whatsapp || ''}?text=${encodeURIComponent(
    'Hi, I found you on Fixaro and need a service.'
  )}`;

  return (
    <article className="card stack">
      <h1>{technician.name}</h1>
      <p className="badge">{technician.category}</p>
      <p>{technician.description || 'Técnico listo para ayudarte.'}</p>
      <p><strong>Ubicación:</strong> {technician.city}</p>
      <p><strong>Rango de precios:</strong> {technician.priceRange || 'A convenir'}</p>
      <p><strong>Disponibilidad:</strong> {technician.availability === 'available' ? 'Disponible' : 'Ocupado'}</p>
      <a className="primary" href={whatsappUrl} target="_blank" rel="noreferrer">Contactar por WhatsApp</a>
      <Link className="ghost" to="/">Volver</Link>
    </article>
  );
};

export default TechnicianPublicPage;
