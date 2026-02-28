import { Link } from 'react-router-dom';

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const TechnicianCard = ({ technician }) => {
  const whatsappUrl = `https://wa.me/${technician.whatsapp || ''}?text=${encodeURIComponent(
    'Hi, I found you on Fixaro and need a service.'
  )}`;

  return (
    <article className="card">
      <h3>{technician.name}</h3>
      <p className="badge">{technician.category}</p>
      <p>{technician.description || 'Técnico listo para ayudarte.'}</p>
      <p><strong>Ciudad:</strong> {technician.city}</p>
      <p><strong>Precio:</strong> {technician.priceRange || 'A convenir'}</p>
      <p><strong>Estado:</strong> {technician.availability === 'available' ? 'Disponible' : 'Ocupado'}</p>
      <div className="card-actions">
        <Link className="ghost" to={`/technician/${toSlug(technician.name)}`}>Ver perfil</Link>
        <a className="primary" href={whatsappUrl} target="_blank" rel="noreferrer">Contactar</a>
      </div>
    </article>
  );
};

export default TechnicianCard;
