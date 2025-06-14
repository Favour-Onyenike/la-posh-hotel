
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Shield, User, Calendar, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AdminActivityLog {
  id: string;
  admin_id: string;
  action: string;
  details: any;
  target_resource: string | null;
  target_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  profiles: {
    email: string;
    full_name: string | null;
  };
}

const AdminActivityLogs = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermissionAndLoadLogs();
  }, [user, profile]);

  const checkPermissionAndLoadLogs = async () => {
    if (!user || !profile) return;

    try {
      // Check if user has permission to view logs
      const { data: permissionData, error: permissionError } = await supabase
        .rpc('has_admin_permission', {
          user_id: user.id,
          permission: 'view_logs'
        });

      if (permissionError) {
        console.error('Permission check error:', permissionError);
        toast({
          title: "Permission Check Failed",
          description: "Could not verify your permissions.",
          variant: "destructive"
        });
        return;
      }

      if (!permissionData) {
        setHasPermission(false);
        setIsLoading(false);
        return;
      }

      setHasPermission(true);

      // Load activity logs
      const { data: logsData, error: logsError } = await supabase
        .from('admin_activity_logs')
        .select(`
          *,
          profiles!admin_id (
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (logsError) {
        console.error('Logs fetch error:', logsError);
        toast({
          title: "Error Loading Logs",
          description: "Could not load activity logs.",
          variant: "destructive"
        });
        return;
      }

      // Type cast the data to match our interface
      const typedLogs = (logsData || []).map(log => ({
        ...log,
        ip_address: log.ip_address as string | null
      })) as AdminActivityLog[];

      setLogs(typedLogs);
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

  const getActionBadgeColor = (action: string) => {
    if (action.includes('create') || action.includes('add')) return 'bg-green-100 text-green-800';
    if (action.includes('update') || action.includes('edit')) return 'bg-blue-100 text-blue-800';
    if (action.includes('delete') || action.includes('remove')) return 'bg-red-100 text-red-800';
    if (action.includes('login') || action.includes('auth')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

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
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {logs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No activity logs found.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getActionBadgeColor(log.action)}>
                          {log.action}
                        </Badge>
                        {log.target_resource && (
                          <Badge variant="outline">
                            {log.target_resource}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>
                            {log.profiles?.full_name || log.profiles?.email || 'Unknown Admin'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                        
                        {log.ip_address && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <span>{log.ip_address}</span>
                          </div>
                        )}
                      </div>
                      
                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="mt-2">
                          <details className="text-sm">
                            <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                              View Details
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AdminActivityLogs;
