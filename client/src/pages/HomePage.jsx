import { useEffect, useState } from 'react';
import { api } from '../api/client';
import TechnicianCard from '../components/TechnicianCard';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [filters, setFilters] = useState({ category: '', city: '' });

  useEffect(() => {
    api('/market/categories').then((res) => setCategories(res.categories));
  }, []);

  useEffect(() => {
    if (user?.role !== 'customer') return;
    const query = new URLSearchParams(filters).toString();
    api(`/market/technicians?${query}`).then((data) => setTechnicians(data.technicians));
  }, [filters, user?.role]);

  if (!user) return <p>Inicia sesión para usar Fixaro.</p>;

  return (
    <div className="stack">
      <h1>{user.role === 'customer' ? 'Encuentra técnicos cerca de ti' : 'Panel de Fixaro'}</h1>

      {user.role === 'customer' && (
        <>
          <input
            placeholder="Buscar por ciudad"
            value={filters.city}
            onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
          />
          <div className="grid">
            <button
              className={!filters.category ? 'active-filter' : ''}
              onClick={() => setFilters((prev) => ({ ...prev, category: '' }))}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={filters.category === category ? 'active-filter' : ''}
                onClick={() => setFilters((prev) => ({ ...prev, category }))}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="stack">
            {technicians.length > 0 ? (
              technicians.map((tech) => <TechnicianCard key={tech.id} technician={tech} />)
            ) : (
              <p>No encontramos técnicos con esos filtros.</p>
            )}
          </div>
        </>
      )}

      {user.role === 'technician' && <p>Usa la sección Dashboard para actualizar tu perfil y estado.</p>}
      {user.role === 'admin' && <p>Usa la sección Admin para revisar usuarios y técnicos.</p>}
    </div>
  );
};

export default HomePage;
