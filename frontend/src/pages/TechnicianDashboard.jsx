import { useState } from 'react';
import { categories } from '../constants/categories';

export default function TechnicianDashboard({ profile, onSave }) {
  const [form, setForm] = useState({
    full_name: profile.full_name || '',
    location: profile.location || '',
    service_category: profile.service_category || categories[0],
    description: profile.description || '',
    price_range: profile.price_range || '',
    whatsapp_number: profile.whatsapp_number || '',
    is_available: profile.is_available ?? true,
  });

  return (
    <main className="container stack">
      <h2>Panel técnico</h2>
      <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Nombre" />
      <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ciudad" />
      <select value={form.service_category} onChange={(e) => setForm({ ...form, service_category: e.target.value })}>
        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción corta" />
      <input value={form.price_range} onChange={(e) => setForm({ ...form, price_range: e.target.value })} placeholder="Rango de precio" />
      <input value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} placeholder="WhatsApp ej. 5215551234567" />
      <button onClick={() => setForm({ ...form, is_available: !form.is_available })}>
        {form.is_available ? 'Disponible' : 'Ocupado'}
      </button>
      <button onClick={() => onSave(form)}>Guardar cambios</button>
    </main>
  );
}
