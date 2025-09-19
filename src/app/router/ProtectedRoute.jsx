import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthProvider';

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const loc = useLocation();

  console.log("ProtectedRoute - user:", user);
  console.log("ProtectedRoute - loading:", loading);

  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return <Outlet />;
}

export default ProtectedRoute;
