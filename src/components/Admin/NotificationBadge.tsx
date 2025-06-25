
import React from 'react';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  show: boolean;
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ show, className }) => {
  if (!show) return null;

  return (
    <div className={cn(
      "absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse",
      className
    )} />
  );
};

export default NotificationBadge;
