
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRightLeft,
  CheckSquare,
  Users,
  Star
} from "lucide-react";

type TodayActivityProps = {
  checkInsToday: number;
  checkOutsToday: number;
  pendingBookings: number;
  confirmedBookings: number;
};

const ActivityItem = ({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  color: string;
}) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const TodayActivity = ({ 
  checkInsToday, 
  checkOutsToday, 
  pendingBookings, 
  confirmedBookings 
}: TodayActivityProps) => (
  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle className="text-xl text-gray-700">Today's Activity</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <ActivityItem
          icon={<ArrowRightLeft size={20} className="text-blue-700" />}
          label="Check-ins Today"
          value={checkInsToday}
          color="bg-blue-100"
        />
        
        <ActivityItem
          icon={<CheckSquare size={20} className="text-green-700" />}
          label="Check-outs Today"
          value={checkOutsToday}
          color="bg-green-100"
        />
        
        <ActivityItem
          icon={<Users size={20} className="text-amber-700" />}
          label="Pending Bookings"
          value={pendingBookings}
          color="bg-amber-100"
        />
        
        <ActivityItem
          icon={<Star size={20} className="text-purple-700" />}
          label="Confirmed Bookings"
          value={confirmedBookings}
          color="bg-purple-100"
        />
      </div>
    </CardContent>
  </Card>
);

export default TodayActivity;
