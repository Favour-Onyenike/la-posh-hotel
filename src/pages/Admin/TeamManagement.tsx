
import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import InviteManagement from '@/components/Admin/InviteManagement';

const TeamManagement = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">
            Manage team members and generate invite links for new admin users
          </p>
        </div>
        <InviteManagement />
      </div>
    </AdminLayout>
  );
};

export default TeamManagement;
