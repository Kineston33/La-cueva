import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const CustomerProfile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    city: user?.city || '',
    photo_url: user?.photo_url || ''
  });
  const [message, setMessage] = useState('');

  const saveProfile = async (e) => {
    e.preventDefault();
    const res = await api('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(form)
    });
    setUser(res.user);
    setMessage('Perfil actualizado correctamente.');
  };

  return (
    <form className="stack" onSubmit={saveProfile}>
      <h1>Mi perfil</h1>
      <input
        required
        placeholder="Nombre"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        required
        placeholder="Ciudad"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
      />
      <input
        placeholder="URL de foto (opcional)"
        value={form.photo_url}
        onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
      />
      {message && <p className="success">{message}</p>}
      <button className="primary" type="submit">Guardar perfil</button>
    </form>
  );
};

export default CustomerProfile;
