import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand-wrap" aria-label="Fixaro home">
          <div className="logo-mark">FX</div>
          <div>
            <p className="brand">FIXARO</p>
            <p className="brand-sub">beta</p>
          </div>
        </Link>
        {user ? (
          <button
            className="ghost"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Salir
          </button>
        ) : (
          <Link to="/login" className="ghost">Ingresar</Link>
        )}
      </header>
      <section>{children}</section>
    </main>
  );
};

export default Layout;
