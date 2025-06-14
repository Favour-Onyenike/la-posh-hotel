
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from '@/components/ui/switch';
import { Room } from '@/types/supabase';

type RoomAvailabilityManagerProps = {
  rooms: Room[];
  loading: boolean;
  onToggleAvailability: (roomId: string, currentStatus: string) => void;
};

const RoomAvailabilityManager = ({ 
  rooms, 
  loading, 
  onToggleAvailability 
}: RoomAvailabilityManagerProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Room & Suite Availability</CardTitle>
      <p className="text-sm text-muted-foreground">Manage room and suite availability status</p>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-4">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p>No rooms or suites found</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div key={room.id} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">{room.name}</p>
                  <p className="text-xs text-muted-foreground">{room.room_type === 'suite' ? 'Suite' : 'Room'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${room.availability_status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                    {room.availability_status === 'available' ? 'Available' : 'Reserved'}
                  </span>
                  <Switch 
                    checked={room.availability_status === 'available'}
                    onCheckedChange={() => onToggleAvailability(room.id, room.availability_status)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export default RoomAvailabilityManager;
