
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTeamPermissions } from '@/hooks/useTeamPermissions';
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
import { Shield, User, Eye, EyeOff } from 'lucide-react';
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

const TeamPermissionManager = () => {
  const { user, profile } = useAuth();
  const { grantTeamMutation, revokeTeamMutation } = useTeamPermissions();
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [actionType, setActionType] = useState<'grant' | 'revoke'>('grant');

  // Only show this component to primary admins
  if (profile?.role !== 'primary_admin') {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Access denied. Only primary admins can manage team permissions.</p>
      </div>
    );
  }

  const { data: adminUsers, isLoading, error } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      console.log('Fetching admin users for team permissions...');
      const { data, error } = await supabase.rpc('get_admin_users');
      
      if (error) {
        console.error('Error fetching admin users:', error);
        throw new Error(error.message);
      }
      
      return data as AdminUser[];
    },
  });

  // Fetch team permissions for each admin
  const { data: teamPermissions } = useQuery({
    queryKey: ['teamPermissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('admin_id')
        .eq('permission_type', 'view_team');
      
      if (error) throw new Error(error.message);
      
      return data?.map(p => p.admin_id) || [];
    },
  });

  const handlePermissionAction = () => {
    if (selectedAdmin && actionType === 'grant') {
      grantTeamMutation.mutate(selectedAdmin.id);
    } else if (selectedAdmin && actionType === 'revoke') {
      revokeTeamMutation.mutate(selectedAdmin.id);
    }
    setSelectedAdmin(null);
  };

  const hasTeamPermission = (adminId: string) => {
    return teamPermissions?.includes(adminId) || false;
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
        <h2 className="text-2xl font-bold text-gray-900">Team Management Permissions</h2>
        <p className="text-gray-600 mt-2">
          Control which admins can access the team management section
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Team Access</TableHead>
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
                  {admin.role === 'primary_admin' ? (
                    <Badge variant="default">
                      <Eye className="w-3 h-3 mr-1" />
                      Full Access
                    </Badge>
                  ) : hasTeamPermission(admin.id) ? (
                    <Badge variant="default">
                      <Eye className="w-3 h-3 mr-1" />
                      Granted
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <EyeOff className="w-3 h-3 mr-1" />
                      No Access
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {admin.role === 'admin' && admin.id !== user?.id && (
                    <div className="flex gap-2">
                      {!hasTeamPermission(admin.id) ? (
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
                              <Eye className="w-4 h-4 mr-2" />
                              Grant Access
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Grant Team Management Access</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to grant team management access to{' '}
                                <strong>{admin.email}</strong>? This will allow them to:
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                  <li>View and manage admin invitations</li>
                                  <li>See admin user list</li>
                                  <li>Manage revenue permissions (if they have access)</li>
                                </ul>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handlePermissionAction}
                                disabled={grantTeamMutation.isPending}
                              >
                                {grantTeamMutation.isPending ? 'Granting...' : 'Grant Access'}
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
                              <EyeOff className="w-4 h-4 mr-2" />
                              Revoke Access
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke Team Management Access</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to revoke team management access from{' '}
                                <strong>{admin.email}</strong>? They will no longer be able to:
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                  <li>View or manage admin invitations</li>
                                  <li>See the admin user list</li>
                                  <li>Access the team management section</li>
                                </ul>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handlePermissionAction}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={revokeTeamMutation.isPending}
                              >
                                {revokeTeamMutation.isPending ? 'Revoking...' : 'Revoke Access'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
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

export default TeamPermissionManager;
