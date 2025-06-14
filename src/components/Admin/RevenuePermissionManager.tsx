
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRevenuePermissions } from '@/hooks/useRevenuePermissions';
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
import { DollarSign, Shield, User, Check, X } from 'lucide-react';
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

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  role: 'admin' | 'primary_admin';
  created_at: string;
  last_login: string;
}

const RevenuePermissionManager = () => {
  const { user, profile } = useAuth();
  const { grantRevenueMutation, revokeRevenueMutation } = useRevenuePermissions();
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [actionType, setActionType] = useState<'grant' | 'revoke'>('grant');

  // Only show this component to primary admins
  if (profile?.role !== 'primary_admin') {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Access denied. Only primary admins can manage revenue permissions.</p>
      </div>
    );
  }

  const { data: adminUsers, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_users');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as AdminUser[];
    },
  });

  // Check which admins have revenue permission
  const { data: revenuePermissions } = useQuery({
    queryKey: ['revenuePermissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('admin_id')
        .eq('permission_type', 'view_revenue');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data?.map(p => p.admin_id) || [];
    },
  });

  const handlePermissionAction = () => {
    if (selectedAdmin) {
      if (actionType === 'grant') {
        grantRevenueMutation.mutate(selectedAdmin.id);
      } else {
        revokeRevenueMutation.mutate(selectedAdmin.id);
      }
    }
    setSelectedAdmin(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Revenue Permission Management</h2>
        <p className="text-gray-600 mt-2">
          Manage which admins can view revenue data on the dashboard
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Revenue Access</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminUsers?.map((admin) => {
              const hasPermission = admin.role === 'primary_admin' || revenuePermissions?.includes(admin.id);
              
              return (
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
                    <Badge variant={hasPermission ? 'default' : 'secondary'}>
                      {hasPermission ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Granted
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3 mr-1" />
                          Denied
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {admin.role === 'primary_admin' && (
                      <Badge variant="outline">All Permissions</Badge>
                    )}
                    {admin.role === 'admin' && admin.id !== user?.id && (
                      <div className="flex gap-2">
                        {!hasPermission ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  setSelectedAdmin(admin);
                                  setActionType('grant');
                                }}
                              >
                                <DollarSign className="w-4 h-4 mr-2" />
                                Grant Access
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Grant Revenue Access</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to grant revenue viewing access to{' '}
                                  <strong>{admin.email}</strong>? This will allow them to:
                                  <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>View total revenue on the admin dashboard</li>
                                    <li>See revenue data in charts and reports</li>
                                  </ul>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handlePermissionAction}
                                  disabled={grantRevenueMutation.isPending}
                                >
                                  {grantRevenueMutation.isPending ? 'Granting...' : 'Grant Access'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedAdmin(admin);
                                  setActionType('revoke');
                                }}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Revoke Access
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Revoke Revenue Access</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to revoke revenue viewing access from{' '}
                                  <strong>{admin.email}</strong>? They will no longer be able to:
                                  <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>View total revenue on the admin dashboard</li>
                                    <li>See revenue data in charts and reports</li>
                                  </ul>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handlePermissionAction}
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={revokeRevenueMutation.isPending}
                                >
                                  {revokeRevenueMutation.isPending ? 'Revoking...' : 'Revoke Access'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    )}
                    {admin.id === user?.id && (
                      <Badge variant="outline">You</Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
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

export default RevenuePermissionManager;
