import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const AuthPage = ({ mode = 'login' }) => {
  const isSignup = mode === 'signup';
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'customer',
    name: '',
    city: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const path = isSignup ? '/auth/signup' : '/auth/login';
      const payload = isSignup
        ? form
        : {
            email: form.email,
            password: form.password
          };
      const data = await api(path, { method: 'POST', body: JSON.stringify(payload) });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="stack">
      <h1>{isSignup ? 'Crear cuenta' : 'Ingresar a Fixaro'}</h1>
      <form className="stack" onSubmit={onSubmit}>
        {isSignup && <input placeholder="Nombre" required onChange={(e) => setForm({ ...form, name: e.target.value })} />}
        {isSignup && <input placeholder="Ciudad" required onChange={(e) => setForm({ ...form, city: e.target.value })} />}
        {isSignup && (
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="customer">Cliente</option>
            <option value="technician">Técnico</option>
          </select>
        )}
        <input type="email" placeholder="Email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" required onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="error">{error}</p>}
        <button className="primary" type="submit">{isSignup ? 'Registrarme' : 'Entrar'}</button>
      </form>
      <p>
        {isSignup ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
        <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Inicia sesión' : 'Regístrate'}</Link>
      </p>
    </div>
  );
};

export default AuthPage;
