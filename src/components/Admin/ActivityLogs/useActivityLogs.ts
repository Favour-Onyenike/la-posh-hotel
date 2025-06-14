
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
    username: string | null;
    avatar_url: string | null;
  };
}

export const useActivityLogs = () => {
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

      // Load activity logs with avatar information
      const { data: logsData, error: logsError } = await supabase
        .from('admin_activity_logs')
        .select(`
          *,
          profiles!admin_id (
            email,
            full_name,
            username,
            avatar_url
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

  return {
    logs,
    isLoading,
    hasPermission,
    refetch: checkPermissionAndLoadLogs
  };
};
