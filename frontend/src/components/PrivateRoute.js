import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = ['user', 'service_provider', 'admin'] }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.user_type)) {
    return <div className="container">Access Denied. You don't have permission to view this page.</div>;
  }

  return children;
};

export default PrivateRoute;
