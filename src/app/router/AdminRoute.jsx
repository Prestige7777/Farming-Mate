// src/app/router/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthProvider';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // If not logged in, or not an admin, redirect.
  if (!user || user.role !== 'admin') {
    // To prevent alert on initial load before user is available
    if (user) {
      alert('관리자만 접근할 수 있습니다.');
    }
    return <Navigate to="/login" replace />;
  }

  // If logged in as an admin, render the child route content.
  return <Outlet />;
}

export default AdminRoute;
