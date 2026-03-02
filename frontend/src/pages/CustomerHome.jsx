import { useEffect, useState } from 'react';
import { categories } from '../constants/categories';
import { api } from '../services/api';
import CategoryGrid from '../components/CategoryGrid';
import TechnicianCard from '../components/TechnicianCard';

export default function CustomerHome({ profile }) {
  const [location, setLocation] = useState(profile.location || '');
  const [category, setCategory] = useState('');
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    api.getTechnicians({ category, location }).then(setTechnicians).catch(() => setTechnicians([]));
  }, [category, location]);

  return (
    <main className="container stack">
      <header className="row between">
        <div>
          <h2>Hola, {profile.full_name}</h2>
          <small className="muted">Encuentra ayuda rápida cerca de ti</small>
        </div>
      </header>
      <input
        placeholder="Buscar por ciudad"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <CategoryGrid categories={categories} selected={category} onSelect={setCategory} />
      <section className="stack">
        {technicians.map((tech) => <TechnicianCard key={tech.id} technician={tech} />)}
        {!technicians.length && <p className="muted">No hay técnicos para ese filtro.</p>}
      </section>
    </main>
  );
}
