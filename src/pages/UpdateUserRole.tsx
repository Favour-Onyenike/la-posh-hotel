
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const UpdateUserRole = () => {
  const { user, refreshProfile, profile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Redirect if already admin
  useEffect(() => {
    if (user && isAdmin) {
      toast({
        title: "Already Admin",
        description: "You already have admin access. Redirecting to dashboard...",
      });
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 1500);
    }
  }, [user, isAdmin, toast]);

  const updateToAdmin = async () => {
    if (!user) return;
    
    console.log('Updating user role to admin for:', user.id);
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating role:', error);
        throw error;
      }

      console.log('Role updated successfully, refreshing profile...');
      // Refresh the profile in the auth context
      await refreshProfile();

      toast({
        title: "Success",
        description: "Your role has been updated to admin. You now have admin access!",
      });
      
      // Redirect to admin dashboard after successful update
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 1500);
    } catch (error: any) {
      console.error('Full error updating role:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return <div>Please log in first</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Update User Role</CardTitle>
          <CardDescription>
            Update your role to admin to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600 space-y-2">
              <p>Current user: {user.email}</p>
              <p>Current role: {profile?.role || 'No role'}</p>
              <p>Admin access: {isAdmin ? 'Yes' : 'No'}</p>
            </div>
            {!isAdmin && (
              <Button 
                onClick={updateToAdmin} 
                className="w-full" 
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update to Admin"}
              </Button>
            )}
            {isAdmin && (
              <div className="text-center">
                <p className="text-green-600 font-medium mb-2">✓ You already have admin access!</p>
                <Button 
                  onClick={() => window.location.href = '/admin/dashboard'}
                  className="w-full"
                >
                  Go to Admin Dashboard
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateUserRole;
