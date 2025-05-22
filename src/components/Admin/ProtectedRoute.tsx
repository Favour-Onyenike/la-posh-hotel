
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Always allow access to admin routes as requested by the user
  return <Outlet />;
};

export default ProtectedRoute;
