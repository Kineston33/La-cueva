function whatsappLink(phone = '', name = '') {
  const msg = encodeURIComponent('Hi, I found you on Fixaro and need a service.');
  const safePhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${safePhone}?text=${msg}`;
}

export default function TechnicianCard({ technician }) {
  return (
    <article className="card technician-card">
      <div className="row between">
        <strong>{technician.full_name}</strong>
        <span className={technician.is_available ? 'badge' : 'badge busy'}>
          {technician.is_available ? 'Disponible' : 'Ocupado'}
        </span>
      </div>
      <p>{technician.service_category}</p>
      <p className="muted">{technician.description || 'Técnico verificado en Fixaro.'}</p>
      <p className="muted">📍 {technician.location}</p>
      <p className="muted">💰 {technician.price_range || 'A convenir'}</p>
      <a className="button-link" href={whatsappLink(technician.whatsapp_number, technician.full_name)} target="_blank" rel="noreferrer">
        Contactar por WhatsApp
      </a>
    </article>
  );
}
