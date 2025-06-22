
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from '@/components/ui/switch';
import { Room } from '@/types/supabase';
import { format } from 'date-fns';

type RoomAvailabilityManagerProps = {
  rooms: Room[];
  loading: boolean;
  onToggleAvailability: (roomId: string, currentStatus: string) => void;
};

const RoomAvailabilityManager = ({ 
  rooms, 
  loading, 
  onToggleAvailability 
}: RoomAvailabilityManagerProps) => {
  
  const formatTimelineInfo = (room: Room) => {
    if (room.availability_status !== 'taken' || (!room.taken_from && !room.taken_until)) {
      return null;
    }
    
    if (room.taken_from && room.taken_until) {
      return `Taken from ${format(new Date(room.taken_from), 'MMM dd, yyyy')} to ${format(new Date(room.taken_until), 'MMM dd, yyyy')}`;
    } else if (room.taken_from) {
      return `Taken from ${format(new Date(room.taken_from), 'MMM dd, yyyy')} onwards`;
    } else if (room.taken_until) {
      return `Taken until ${format(new Date(room.taken_until), 'MMM dd, yyyy')}`;
    }
    
    return 'Permanently taken';
  };

  return (
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
              {rooms.map((room) => {
                const timelineInfo = formatTimelineInfo(room);
                
                return (
                  <div key={room.id} className="flex flex-col p-3 border rounded-md space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{room.name} {room.room_number}</p>
                        <p className="text-xs text-muted-foreground">{room.room_type === 'suite' ? 'Suite' : 'Room'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${room.availability_status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                          {room.availability_status === 'available' ? 'Available' : 'Taken'}
                        </span>
                        <Switch 
                          checked={room.availability_status === 'available'}
                          onCheckedChange={() => onToggleAvailability(room.id, room.availability_status)}
                        />
                      </div>
                    </div>
                    {timelineInfo && (
                      <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                        {timelineInfo}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomAvailabilityManager;
