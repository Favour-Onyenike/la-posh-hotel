
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

const TodayActivity = ({ 
  checkInsToday, 
  checkOutsToday, 
  pendingBookings, 
  confirmedBookings 
}: TodayActivityProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Today's Activity</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
            <ArrowRightLeft size={18} className="text-blue-700" />
          </div>
          <div>
            <p className="text-sm font-medium">Check-ins Today</p>
            <p className="text-2xl font-bold">{checkInsToday}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
            <CheckSquare size={18} className="text-green-700" />
          </div>
          <div>
            <p className="text-sm font-medium">Check-outs Today</p>
            <p className="text-2xl font-bold">{checkOutsToday}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
            <Users size={18} className="text-amber-700" />
          </div>
          <div>
            <p className="text-sm font-medium">Pending Bookings</p>
            <p className="text-2xl font-bold">{pendingBookings}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
            <Star size={18} className="text-purple-700" />
          </div>
          <div>
            <p className="text-sm font-medium">Confirmed Bookings</p>
            <p className="text-2xl font-bold">{confirmedBookings}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default TodayActivity;
