
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAdmin, isLoading, profile } = useAuth();
  
  console.log('ProtectedRoute - user:', user?.email);
  console.log('ProtectedRoute - profile:', profile);
  console.log('ProtectedRoute - isAdmin:', isAdmin);
  console.log('ProtectedRoute - isLoading:', isLoading);
  
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
    console.log('No user found, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated but not admin, show access denied
  if (!isAdmin) {
    console.log('User is not admin, showing access denied');
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mb-4">
            Current role: {profile?.role || 'No role'} (Expected: admin or primary_admin)
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="text-blue-600 hover:text-blue-800 mr-4"
          >
            Return to Home
          </button>
          <button
            onClick={() => window.location.href = '/update-user-role'}
            className="text-green-600 hover:text-green-800"
          >
            Update Role
          </button>
        </div>
      </div>
    );
  }

  console.log('User is admin, allowing access');
  // User is authenticated and is admin
  return <>{children}</>;
};

export default ProtectedRoute;
