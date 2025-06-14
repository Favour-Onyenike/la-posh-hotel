
import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import AdminActivityLogs from '@/components/Admin/AdminActivityLogs';
import LogPermissionManager from '@/components/Admin/LogPermissionManager';

const ActivityLogs = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600 mt-2">
            Monitor admin activities and system events for security and audit purposes
          </p>
        </div>
        
        <LogPermissionManager />
        <AdminActivityLogs />
      </div>
    </AdminLayout>
  );
};

export default ActivityLogs;
