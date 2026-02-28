import { Navigate, Route, Routes, Link } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import TechnicianDashboard from './pages/TechnicianDashboard';
import AdminPage from './pages/AdminPage';
import CustomerProfile from './pages/CustomerProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {user && (
        <nav className="tabs">
          <Link to="/">Inicio</Link>
          {user.role === 'customer' && <Link to="/profile">Mi perfil</Link>}
          {user.role === 'technician' && <Link to="/dashboard">Dashboard</Link>}
          {user.role === 'admin' && <Link to="/admin">Admin</Link>}
        </nav>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={['customer']}>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['technician']}>
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
