
import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import InviteManagement from '@/components/Admin/InviteManagement';
import AdminUserManagement from '@/components/Admin/AdminUserManagement';
import RevenuePermissionManager from '@/components/Admin/RevenuePermissionManager';
import TeamPermissionManager from '@/components/Admin/TeamPermissionManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeamPermissions } from '@/hooks/useTeamPermissions';
import { Loader2 } from 'lucide-react';

const TeamManagement = () => {
  const { hasTeamPermission, permissionLoading, isPrimaryAdmin } = useTeamPermissions();

  if (permissionLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  // Check if user has team permission or is primary admin
  if (!hasTeamPermission && !isPrimaryAdmin) {
    return (
      <AdminLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access team management.</p>
            <p className="text-sm text-gray-500">
              Contact a primary admin to request access to this section.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">
            Manage team members and admin access
          </p>
        </div>
        
        <Tabs defaultValue="invites" className="w-full">
          <TabsList>
            <TabsTrigger value="invites">Invite Management</TabsTrigger>
            <TabsTrigger value="admins">Admin Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Permissions</TabsTrigger>
            {isPrimaryAdmin && (
              <TabsTrigger value="team">Team Permissions</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="invites" className="mt-6">
            <InviteManagement />
          </TabsContent>
          
          <TabsContent value="admins" className="mt-6">
            <AdminUserManagement />
          </TabsContent>
          
          <TabsContent value="revenue" className="mt-6">
            <RevenuePermissionManager />
          </TabsContent>
          
          {isPrimaryAdmin && (
            <TabsContent value="team" className="mt-6">
              <TeamPermissionManager />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TeamManagement;
