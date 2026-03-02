import { useState } from 'react';

const initialForm = {
  email: '',
  password: '',
  role: 'customer',
  fullName: '',
  location: '',
};

export default function AuthForm({ onLogin, onSignup, loading, error }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState(initialForm);

  const submit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      await onSignup(form);
      return;
    }
    await onLogin({ email: form.email, password: form.password });
  };

  return (
    <section className="card">
      <h1>Fixaro</h1>
      <p className="muted">Servicios locales en minutos.</p>
      <form onSubmit={submit} className="stack">
        {isSignup && (
          <>
            <input placeholder="Nombre" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            <input placeholder="Ciudad" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="customer">Cliente</option>
              <option value="technician">Técnico</option>
            </select>
          </>
        )}
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button disabled={loading} type="submit">{loading ? 'Cargando...' : isSignup ? 'Crear cuenta' : 'Entrar'}</button>
      </form>
      {error && <small className="error">{error}</small>}
      <button className="link" onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'Ya tengo cuenta' : 'No tengo cuenta'}
      </button>
    </section>
  );
}
