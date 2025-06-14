
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Shield } from 'lucide-react';
import { useActivityLogs } from './ActivityLogs/useActivityLogs';
import ActivityLogsList from './ActivityLogs/ActivityLogsList';

const AdminActivityLogs = () => {
  const { logs, isLoading, hasPermission } = useActivityLogs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Denied
          </CardTitle>
          <CardDescription>
            You don't have permission to view admin activity logs.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin Activity Logs
        </CardTitle>
        <CardDescription>
          Recent admin activities and system events ({logs.length} entries)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityLogsList logs={logs} />
      </CardContent>
    </Card>
  );
};

export default AdminActivityLogs;
