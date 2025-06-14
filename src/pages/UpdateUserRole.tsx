
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const UpdateUserRole = () => {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateToAdmin = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

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
            <p className="text-sm text-gray-600">
              Current user: {user.email}
            </p>
            <Button 
              onClick={updateToAdmin} 
              className="w-full" 
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update to Admin"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateUserRole;
