
import React, { useState, useEffect } from 'react';
import { Room } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import RoomCard from './RoomCard';

interface RoomsGridProps {
  rooms: Room[];
  checkInDate?: string;
  checkOutDate?: string;
}

const RoomsGrid = ({ rooms, checkInDate, checkOutDate }: RoomsGridProps) => {
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (checkInDate && checkOutDate && rooms.length > 0) {
      console.log('Checking availability for date range:', checkInDate, 'to', checkOutDate);
      checkRoomAvailabilities();
    } else {
      // If no dates selected, assume all rooms with 'available' status are available
      const defaultAvailability: Record<string, boolean> = {};
      rooms.forEach(room => {
        defaultAvailability[room.id] = room.availability_status === 'available';
      });
      console.log('No dates selected, using default availability:', defaultAvailability);
      setAvailabilityMap(defaultAvailability);
    }
  }, [rooms, checkInDate, checkOutDate]);

  const checkRoomAvailabilities = async () => {
    setLoading(true);
    try {
      const availabilityChecks = await Promise.all(
        rooms.map(async (room) => {
          if (room.availability_status !== 'available') {
            console.log(`Room ${room.id} is not available (status: ${room.availability_status})`);
            return { roomId: room.id, isAvailable: false };
          }

          console.log(`Checking availability for room ${room.id} from ${checkInDate} to ${checkOutDate}`);
          const { data, error } = await supabase.rpc('is_room_available', {
            room_id_param: room.id,
            check_in_param: checkInDate,
            check_out_param: checkOutDate
          });

          if (error) {
            console.error('Error checking availability for room:', room.id, error);
            return { roomId: room.id, isAvailable: false };
          }

          console.log(`Room ${room.id} availability result:`, data);
          return { roomId: room.id, isAvailable: data || false };
        })
      );

      const newAvailabilityMap: Record<string, boolean> = {};
      availabilityChecks.forEach(({ roomId, isAvailable }) => {
        newAvailabilityMap[roomId] = isAvailable;
      });

      console.log('Final availability map:', newAvailabilityMap);
      setAvailabilityMap(newAvailabilityMap);
    } catch (error) {
      console.error('Error checking room availabilities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No rooms available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => {
        const isDateBasedAvailable = availabilityMap[room.id] ?? true;
        const showAvailabilityTag = !!checkInDate && !!checkOutDate;
        
        console.log(`Rendering room ${room.id}:`, {
          isDateBasedAvailable,
          showAvailabilityTag,
          roomStatus: room.availability_status
        });
        
        return (
          <RoomCard 
            key={room.id} 
            room={room} 
            isDateBasedAvailable={isDateBasedAvailable}
            showAvailabilityTag={showAvailabilityTag}
          />
        );
      })}
      {loading && (
        <div className="col-span-full text-center py-4">
          <p className="text-gray-600">Checking availability...</p>
        </div>
      )}
    </div>
  );
};

export default RoomsGrid;
