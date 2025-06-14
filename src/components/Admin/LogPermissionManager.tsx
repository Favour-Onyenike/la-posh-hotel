
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserCheck, UserX, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  hasLogPermission: boolean;
}

const LogPermissionManager = () => {
  const { user, isPrimaryAdmin } = useAuth();
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingPermissions, setUpdatingPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (isPrimaryAdmin) {
      loadAdmins();
    }
  }, [isPrimaryAdmin]);

  const loadAdmins = async () => {
    try {
      // Fetch all admin users and their log permissions
      const { data: adminData, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          role,
          admin_permissions!admin_id (
            permission_type
          )
        `)
        .eq('role', 'admin');

      if (error) {
        console.error('Error loading admins:', error);
        toast({
          title: "Error Loading Admins",
          description: "Could not load admin users.",
          variant: "destructive"
        });
        return;
      }

      // Transform the data to include permission status
      const adminsWithPermissions = (adminData || []).map(admin => ({
        ...admin,
        hasLogPermission: admin.admin_permissions?.some(
          (p: any) => p.permission_type === 'view_logs'
        ) || false
      }));

      setAdmins(adminsWithPermissions);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLogPermission = async (adminId: string, currentPermission: boolean) => {
    if (!user) return;

    setUpdatingPermissions(prev => [...prev, adminId]);

    try {
      const functionName = currentPermission ? 'revoke_log_permission' : 'grant_log_permission';
      
      const { data, error } = await supabase.rpc(functionName, {
        target_admin_id: adminId,
        granted_by_admin_id: user.id
      });

      if (error) {
        console.error(`Error ${currentPermission ? 'revoking' : 'granting'} permission:`, error);
        toast({
          title: "Permission Update Failed",
          description: `Could not ${currentPermission ? 'revoke' : 'grant'} log viewing permission.`,
          variant: "destructive"
        });
        return;
      }

      if (data) {
        // Update local state
        setAdmins(prev => prev.map(admin => 
          admin.id === adminId 
            ? { ...admin, hasLogPermission: !currentPermission }
            : admin
        ));

        toast({
          title: "Permission Updated",
          description: `Log viewing permission ${currentPermission ? 'revoked from' : 'granted to'} admin.`,
        });
      } else {
        toast({
          title: "Permission Update Failed",
          description: "You don't have permission to modify admin permissions.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setUpdatingPermissions(prev => prev.filter(id => id !== adminId));
    }
  };

  if (!isPrimaryAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Denied
          </CardTitle>
          <CardDescription>
            Only primary admins can manage log viewing permissions.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Log Permission Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Log Permission Manager
        </CardTitle>
        <CardDescription>
          Manage which admins can view activity logs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {admins.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No admin users found.</p>
          ) : (
            admins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">
                      {admin.full_name || admin.email}
                    </h3>
                    <Badge variant="outline">
                      {admin.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={admin.hasLogPermission ? "default" : "secondary"}
                    className="mr-2"
                  >
                    {admin.hasLogPermission ? "Can View Logs" : "No Log Access"}
                  </Badge>
                  
                  <Button
                    variant={admin.hasLogPermission ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleLogPermission(admin.id, admin.hasLogPermission)}
                    disabled={updatingPermissions.includes(admin.id)}
                  >
                    {updatingPermissions.includes(admin.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : admin.hasLogPermission ? (
                      <UserX className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                    <span className="ml-1">
                      {admin.hasLogPermission ? "Revoke" : "Grant"}
                    </span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LogPermissionManager;
