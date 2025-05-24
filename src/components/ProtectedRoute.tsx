import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext'; // Ajusta la ruta

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando sesión...</div>; // O un spinner
  }

  if (!user) {
    // Redirige a la página de inicio de sesión si no está autenticado
    return <Navigate to="/" />; // O a tu página de login, ej: /login
  }

  // Si está autenticado, renderiza el contenido de la ruta protegida
  return <Outlet />;
};

export default ProtectedRoute;
