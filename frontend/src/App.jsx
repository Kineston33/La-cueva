import { useEffect, useState } from 'react';
import AuthForm from './components/AuthForm';
import CustomerHome from './pages/CustomerHome';
import TechnicianDashboard from './pages/TechnicianDashboard';
import AdminView from './pages/AdminView';
import { api } from './services/api';

export default function App() {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem('fixaro-auth');
    return raw ? JSON.parse(raw) : { token: '', profile: null };
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState({ users: [], technicians: [] });

  useEffect(() => {
    localStorage.setItem('fixaro-auth', JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    if (auth.profile?.role === 'admin' && auth.token) {
      api.getAdminUsers(auth.token).then(setAdminData).catch(() => {});
    }
  }, [auth]);

  const handleLogin = async (body) => {
    try {
      setLoading(true);
      setError('');
      const data = await api.login(body);
      setAuth({ token: data.session.access_token, profile: data.profile });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (body) => {
    try {
      setLoading(true);
      setError('');
      const data = await api.signup(body);
      if (!data.session?.access_token) {
        setError('Cuenta creada. Revisa tu email para confirmar antes de iniciar sesión.');
        return;
      }
      setAuth({ token: data.session.access_token, profile: data.profile });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (payload) => {
    try {
      setError('');
      const profile = await api.updateMe(auth.token, payload);
      setAuth({ ...auth, profile });
    } catch (e) {
      setError(e.message);
    }
  };

  if (!auth.profile) {
    return <div className="container"><AuthForm onLogin={handleLogin} onSignup={handleSignup} loading={loading} error={error} /></div>;
  }

  return (
    <>
      <nav className="nav row between">
        <strong>Fixaro</strong>
        <button className="link" onClick={() => setAuth({ token: '', profile: null })}>Salir</button>
      </nav>
      {error && <p className="error container">{error}</p>}
      {auth.profile.role === 'customer' && <CustomerHome profile={auth.profile} />}
      {auth.profile.role === 'technician' && <TechnicianDashboard profile={auth.profile} onSave={handleSaveProfile} />}
      {auth.profile.role === 'admin' && <AdminView data={adminData} />}
    </>
  );
}
