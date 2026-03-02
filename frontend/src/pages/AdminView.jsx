export default function AdminView({ data }) {
  return (
    <main className="container stack">
      <h2>Admin básico</h2>
      <section className="card stack">
        <h3>Usuarios ({data.users.length})</h3>
        {data.users.map((u) => (
          <p key={u.id}>{u.full_name} · {u.role} · {u.location}</p>
        ))}
      </section>
      <section className="card stack">
        <h3>Técnicos ({data.technicians.length})</h3>
        {data.technicians.map((u) => (
          <p key={u.id}>{u.full_name} · {u.service_category} · {u.is_available ? 'Disponible' : 'Ocupado'}</p>
        ))}
      </section>
    </main>
  );
}
