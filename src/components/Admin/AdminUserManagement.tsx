
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Shield, User } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  role: 'admin' | 'primary_admin';
  created_at: string;
  last_login: string;
}

const AdminUserManagement = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  // Only show this component to primary admins
  if (profile?.role !== 'primary_admin') {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Access denied. Only primary admins can manage admin users.</p>
      </div>
    );
  }

  const { data: adminUsers, isLoading, error } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      console.log('Fetching admin users...');
      const { data, error } = await supabase.rpc('get_admin_users');
      
      if (error) {
        console.error('Error fetching admin users:', error);
        throw new Error(error.message);
      }
      
      console.log('Admin users fetched:', data);
      return data as AdminUser[];
    },
  });

  const revokeAdminMutation = useMutation({
    mutationFn: async (targetAdminId: string) => {
      console.log('Revoking admin status for:', targetAdminId);
      const { data, error } = await supabase.rpc('revoke_admin_status', {
        target_admin_id: targetAdminId,
        revoked_by_admin_id: user?.id
      });

      if (error) {
        console.error('Error revoking admin status:', error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Failed to revoke admin status');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({
        title: "Admin status revoked",
        description: `${selectedAdmin?.email} has been removed from admin access.`,
      });
      setSelectedAdmin(null);
    },
    onError: (error: any) => {
      console.error('Revoke admin mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to revoke admin status",
        variant: "destructive",
      });
    },
  });

  const handleRevokeAdmin = () => {
    if (selectedAdmin) {
      revokeAdminMutation.mutate(selectedAdmin.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Error loading admin users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin User Management</h2>
        <p className="text-gray-600 mt-2">
          Manage admin accounts and their access to the system
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminUsers?.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{admin.full_name || admin.email}</div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
                    {admin.username && (
                      <div className="text-sm text-gray-400">@{admin.username}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={admin.role === 'primary_admin' ? 'default' : 'secondary'}>
                    {admin.role === 'primary_admin' ? (
                      <>
                        <Shield className="w-3 h-3 mr-1" />
                        Primary Admin
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 mr-1" />
                        Admin
                      </>
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(admin.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(admin.last_login).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {admin.role === 'admin' && admin.id !== user?.id && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setSelectedAdmin(admin)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Admin
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Admin Access</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove admin access for{' '}
                            <strong>{admin.email}</strong>? This will:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>Change their role to regular user</li>
                              <li>Remove all admin permissions</li>
                              <li>Prevent access to admin areas</li>
                            </ul>
                            This action cannot be easily undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleRevokeAdmin}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={revokeAdminMutation.isPending}
                          >
                            {revokeAdminMutation.isPending ? 'Removing...' : 'Remove Admin'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {admin.role === 'primary_admin' && (
                    <Badge variant="outline">Protected</Badge>
                  )}
                  {admin.id === user?.id && (
                    <Badge variant="outline">You</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {adminUsers?.length === 0 && (
          <div className="text-center p-8">
            <p className="text-gray-600">No admin users found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;
