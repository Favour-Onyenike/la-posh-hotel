
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: number;
  className?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  actionText?: string;
  onAction?: () => void;
};

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className, 
  color = 'blue',
  actionText,
  onAction
}: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    orange: 'bg-orange-500 text-white',
    red: 'bg-red-500 text-white',
    purple: 'bg-purple-500 text-white'
  };

  return (
    <Card className={`${colorClasses[color]} border-0 shadow-lg ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            {icon}
          </div>
          <div>
            <CardTitle className="text-sm font-medium opacity-90">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{value}</div>
        {description && <p className="text-xs opacity-80 mb-3">{description}</p>}
        {actionText && onAction && (
          <button 
            onClick={onAction}
            className="text-xs opacity-80 hover:opacity-100 underline transition-opacity"
          >
            {actionText}
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
