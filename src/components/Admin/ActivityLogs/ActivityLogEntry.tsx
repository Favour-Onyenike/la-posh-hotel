
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Globe } from 'lucide-react';
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
    username: string | null;
    avatar_url: string | null;
  };
}

interface ActivityLogEntryProps {
  log: AdminActivityLog;
}

const ActivityLogEntry = ({ log }: ActivityLogEntryProps) => {
  const getActionBadgeColor = (action: string) => {
    if (action.includes('create') || action.includes('add')) return 'bg-green-100 text-green-800';
    if (action.includes('update') || action.includes('edit')) return 'bg-blue-100 text-blue-800';
    if (action.includes('delete') || action.includes('remove')) return 'bg-red-100 text-red-800';
    if (action.includes('login') || action.includes('auth')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getDisplayName = (log: AdminActivityLog) => {
    if (log.profiles?.username) {
      return log.profiles.username;
    }
    if (log.profiles?.full_name) {
      return log.profiles.full_name;
    }
    return log.profiles?.email || 'Unknown Admin';
  };

  const getInitials = (log: AdminActivityLog) => {
    const name = getDisplayName(log);
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="border rounded-lg p-4 space-y-2">
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
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={log.profiles?.avatar_url || undefined} />
                <AvatarFallback className="text-xs">
                  {getInitials(log)}
                </AvatarFallback>
              </Avatar>
              <span>
                {getDisplayName(log)}
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
  );
};

export default ActivityLogEntry;
