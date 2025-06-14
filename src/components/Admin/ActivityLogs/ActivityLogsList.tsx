
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ActivityLogEntry from './ActivityLogEntry';

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

interface ActivityLogsListProps {
  logs: AdminActivityLog[];
}

const ActivityLogsList = ({ logs }: ActivityLogsListProps) => {
  return (
    <ScrollArea className="h-96">
      <div className="space-y-4">
        {logs.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No activity logs found.</p>
        ) : (
          logs.map((log) => (
            <ActivityLogEntry key={log.id} log={log} />
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default ActivityLogsList;
