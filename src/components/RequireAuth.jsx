import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const authed = sessionStorage.getItem('adminAuth') === '1';
  const location = useLocation();

  if (!authed) {
    // envia para a tela de login e guarda onde o usuário queria ir
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}