
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: number;
  className?: string;
};

const StatCard = ({ title, value, description, icon, trend, className }: StatCardProps) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="h-8 w-8 rounded-lg bg-primary/10 p-1 text-primary">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-xs font-medium">
          <TrendingUp 
            size={14} 
            className={trend >= 0 ? "text-emerald-500" : "text-rose-500"} 
          />
          <span className={trend >= 0 ? "text-emerald-500" : "text-rose-500"}>
            {trend >= 0 ? `+${trend}%` : `${trend}%`}
          </span>
          <span className="text-muted-foreground">from last month</span>
        </div>
      )}
    </CardContent>
  </Card>
);

export default StatCard;
