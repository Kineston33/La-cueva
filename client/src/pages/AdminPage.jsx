import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    api('/admin/users').then((res) => setUsers(res.users));
    api('/admin/technicians').then((res) => setTechnicians(res.technicians));
  }, [user?.id]);

  if (user?.role !== 'admin') return <p>Solo para admin.</p>;

  return (
    <div className="stack">
      <h1>Admin básico</h1>
      <section>
        <h2>Usuarios</h2>
        {users.map((u) => (
          <p key={u.id}>{u.name} — {u.role} — {u.email}</p>
        ))}
      </section>
      <section>
        <h2>Técnicos</h2>
        {technicians.map((t) => (
          <p key={t.id}>{t.name} — {t.category} — {t.city}</p>
        ))}
      </section>
    </div>
  );
};

export default AdminPage;
