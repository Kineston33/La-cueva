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
      <a className="primary" href={whatsappUrl} target="_blank" rel="noreferrer">Contactar por WhatsApp</a>
    </article>
  );
};

export default TechnicianCard;
