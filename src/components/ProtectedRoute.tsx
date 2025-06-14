
import React from 'react';
import { Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
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
  return <>{children}</>;
};

export { ProtectedRoute };
export default ProtectedRoute;
