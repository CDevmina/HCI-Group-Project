import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

const PrivateRoute = ({ element }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default PrivateRoute;