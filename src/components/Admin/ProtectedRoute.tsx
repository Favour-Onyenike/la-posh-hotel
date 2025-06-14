
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAdmin, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to admin login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated but not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="text-blue-600 hover:text-blue-800"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and is admin
  return <>{children}</>;
};

export default ProtectedRoute;
