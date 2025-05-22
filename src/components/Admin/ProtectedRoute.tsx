
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from "lucide-react";

const ProtectedRoute: React.FC = () => {
  const { user, isAdmin, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user isn't logged in or isn't an admin, redirect to admin login
  if (!user || !isAdmin) {
    return <Navigate to="/admin/auth" replace />;
  }

  // Render children routes
  return <Outlet />;
};

export default ProtectedRoute;
