import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const emptyProfile = {
  category: 'General technician',
  description: '',
  price_range: '',
  whatsapp: '',
  availability: 'available'
};

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(emptyProfile);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.role !== 'technician') return;
    api('/users/technician/profile').then((res) => {
      if (res.profile) setProfile({ ...emptyProfile, ...res.profile });
    });
  }, [user?.id, user?.role]);

  const save = async (e) => {
    e.preventDefault();
    const res = await api('/users/technician/profile', { method: 'PUT', body: JSON.stringify(profile) });
    setProfile((prev) => ({ ...prev, ...res.profile }));
    setMessage('Perfil actualizado correctamente.');
  };

  return (
    <form className="stack" onSubmit={save}>
      <h1>Dashboard técnico</h1>
      <select value={profile.category} onChange={(e) => setProfile((prev) => ({ ...prev, category: e.target.value }))}>
        <option>Electrician</option>
        <option>Plumber</option>
        <option>Appliance repair</option>
        <option>Phone repair</option>
        <option>Painter</option>
        <option>General technician</option>
      </select>
      <textarea placeholder="Descripción" value={profile.description} onChange={(e) => setProfile((prev) => ({ ...prev, description: e.target.value }))} />
      <input placeholder="Rango de precios (ej: $20-$50)" value={profile.price_range} onChange={(e) => setProfile((prev) => ({ ...prev, price_range: e.target.value }))} />
      <input placeholder="WhatsApp (ej: 573001112233)" value={profile.whatsapp} onChange={(e) => setProfile((prev) => ({ ...prev, whatsapp: e.target.value }))} />
      <select value={profile.availability} onChange={(e) => setProfile((prev) => ({ ...prev, availability: e.target.value }))}>
        <option value="available">Available</option>
        <option value="busy">Busy</option>
      </select>
      {message && <p className="success">{message}</p>}
      <button className="primary" type="submit">Guardar cambios</button>
    </form>
  );
};

export default TechnicianDashboard;
