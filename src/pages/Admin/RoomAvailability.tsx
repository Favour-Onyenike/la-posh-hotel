
import React, { useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import RoomAvailabilityManager from '@/components/Admin/RoomAvailabilityManager';
import RoomTimelineDialog from '@/components/Admin/RoomTimelineDialog';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useRoomAvailability } from '@/hooks/useRoomAvailability';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Star } from 'lucide-react';
import { Room } from '@/types/supabase';

const RoomAvailability = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isTimelineDialogOpen, setIsTimelineDialogOpen] = useState(false);
  
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

  const handleRoomToggle = (roomId: string, currentStatus: string) => {
    // If changing from available to taken, show timeline dialog
    if (currentStatus === 'available') {
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        setSelectedRoom(room);
        setIsTimelineDialogOpen(true);
      }
    } else {
      // If changing from taken to available, just toggle normally
      toggleRoomAvailability(roomId, currentStatus);
    }
  };

  const handleTimelineConfirm = (roomId: string, takenFrom?: string, takenUntil?: string) => {
    // Update the room with timeline and set status to taken
    toggleRoomAvailability(roomId, 'available', takenFrom, takenUntil);
    setIsTimelineDialogOpen(false);
    setSelectedRoom(null);
  };

  const handleTimelineCancel = () => {
    setIsTimelineDialogOpen(false);
    setSelectedRoom(null);
  };

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
          onToggleAvailability={handleRoomToggle}
        />

        {/* Timeline Dialog */}
        <RoomTimelineDialog
          room={selectedRoom}
          isOpen={isTimelineDialogOpen}
          onClose={handleTimelineCancel}
          onConfirm={handleTimelineConfirm}
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
              <p>• When marking a room as taken, you can set a timeline for automatic availability restoration</p>
              <p>• Changes take effect immediately and will be reflected in the booking system</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default RoomAvailability;
