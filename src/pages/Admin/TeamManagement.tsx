
import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import InviteManagement from '@/components/Admin/InviteManagement';
import AdminUserManagement from '@/components/Admin/AdminUserManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TeamManagement = () => {
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
          </TabsList>
          
          <TabsContent value="invites" className="mt-6">
            <InviteManagement />
          </TabsContent>
          
          <TabsContent value="admins" className="mt-6">
            <AdminUserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TeamManagement;
