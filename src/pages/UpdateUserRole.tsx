
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

  console.log('UpdateUserRole - Current state:', {
    user: user?.email,
    profile: profile,
    isAdmin: isAdmin,
    profileRole: profile?.role
  });

  // Redirect if already admin
  useEffect(() => {
    if (user && isAdmin) {
      console.log('User is already admin, redirecting...');
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
    if (!user) {
      console.log('No user found');
      return;
    }
    
    console.log('Starting role update for user:', user.id);
    setIsUpdating(true);
    
    try {
      // First, let's check current profile
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Current profile before update:', currentProfile);
      
      if (fetchError) {
        console.error('Error fetching current profile:', fetchError);
        throw fetchError;
      }

      // Now update the role
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id)
        .select()
        .single();

      console.log('Update result:', { data: updateData, error: updateError });

      if (updateError) {
        console.error('Error updating role:', updateError);
        throw updateError;
      }

      console.log('Role updated successfully, refreshing profile...');
      
      // Wait a moment for the database to settle
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh the profile in the auth context
      await refreshProfile();
      
      // Wait another moment for the context to update
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: "Success",
        description: "Your role has been updated to admin. Redirecting...",
      });
      
      // Force a page reload to ensure fresh data
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 1000);
      
    } catch (error: any) {
      console.error('Error in updateToAdmin:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to update role',
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p>Please log in first</p>
          </CardContent>
        </Card>
      </div>
    );
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
            <div className="text-sm text-gray-600 space-y-2 bg-gray-100 p-3 rounded">
              <p><strong>User:</strong> {user.email}</p>
              <p><strong>Profile ID:</strong> {profile?.id || 'Loading...'}</p>
              <p><strong>Current role:</strong> {profile?.role || 'Loading...'}</p>
              <p><strong>Admin access:</strong> {isAdmin ? 'Yes' : 'No'}</p>
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
            
            <div className="text-center">
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateUserRole;
