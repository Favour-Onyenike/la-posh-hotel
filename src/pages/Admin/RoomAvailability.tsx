
import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import RoomAvailabilityManager from '@/components/Admin/RoomAvailabilityManager';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useRoomAvailability } from '@/hooks/useRoomAvailability';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Star } from 'lucide-react';

const RoomAvailability = () => {
  const {
    totalRooms,
    totalSuites,
    availableRooms,
    rooms,
    loading,
    setRooms,
    setAvailableRooms
  } = useDashboardData();

  const { toggleRoomAvailability } = useRoomAvailability(
    rooms,
    setRooms,
    setAvailableRooms
  );

  return (
    <AdminLayout>
      <div className="space-y-6 mt-4 lg:mt-0">
        <div className="mt-2">
          <h2 className="text-3xl font-bold tracking-tight">Room & Suite Availability</h2>
          <p className="text-muted-foreground">Manage the availability status of all rooms and suites.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <BedDouble className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRooms}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Suites</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSuites}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Badge variant="outline" className="text-green-600 border-green-200">Available</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableRooms}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reserved</CardTitle>
              <Badge variant="outline" className="text-red-600 border-red-200">Reserved</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{(totalRooms + totalSuites) - availableRooms}</div>
            </CardContent>
          </Card>
        </div>

        {/* Room Availability Management */}
        <RoomAvailabilityManager
          rooms={rooms}
          loading={loading}
          onToggleAvailability={toggleRoomAvailability}
        />

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
            <CardDescription>
              Use the toggle switches to quickly change room availability status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• <span className="font-medium text-green-600">Available</span> - Room is ready for new bookings</p>
              <p>• <span className="font-medium text-red-600">Reserved</span> - Room is currently occupied or under maintenance</p>
              <p>• Changes take effect immediately and will be reflected in the booking system</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default RoomAvailability;
