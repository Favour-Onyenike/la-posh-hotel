
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from "lucide-react";

const ProtectedRoute: React.FC = () => {
  const { user, profile, isAdmin, isLoading } = useAuth();
  
  console.log('ProtectedRoute - User:', user?.email);
  console.log('ProtectedRoute - Profile:', profile);
  console.log('ProtectedRoute - Is admin:', isAdmin, 'Role:', profile?.role);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user isn't logged in or isn't an admin, redirect to admin login
  if (!user || !profile) {
    console.log('ProtectedRoute - No user or profile, redirecting to login');
    return <Navigate to="/admin/auth" replace />;
  }
  
  if (profile.role !== 'admin') {
    console.log('ProtectedRoute - User is not admin, redirecting to login');
    return <Navigate to="/admin/auth" replace />;
  }

  // Render children routes
  console.log('ProtectedRoute - User is authorized, rendering outlet');
  return <Outlet />;
};

export default ProtectedRoute;
