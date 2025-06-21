
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
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (checkInDate && checkOutDate && rooms.length > 0) {
      console.log('Filtering rooms for date range:', checkInDate, 'to', checkOutDate);
      filterAvailableRooms();
    } else {
      // If no dates selected, show all rooms with 'available' status
      const defaultAvailableRooms = rooms.filter(room => room.availability_status === 'available');
      console.log('No dates selected, showing all available rooms:', defaultAvailableRooms.length);
      setAvailableRooms(defaultAvailableRooms);
    }
  }, [rooms, checkInDate, checkOutDate]);

  const filterAvailableRooms = async () => {
    setLoading(true);
    try {
      const availabilityChecks = await Promise.all(
        rooms.map(async (room) => {
          if (room.availability_status !== 'available') {
            console.log(`Room ${room.id} is not available (status: ${room.availability_status})`);
            return { room, isAvailable: false };
          }

          console.log(`Checking availability for room ${room.id} from ${checkInDate} to ${checkOutDate}`);
          const { data, error } = await supabase.rpc('is_room_available', {
            room_id_param: room.id,
            check_in_param: checkInDate,
            check_out_param: checkOutDate
          });

          if (error) {
            console.error('Error checking availability for room:', room.id, error);
            return { room, isAvailable: false };
          }

          console.log(`Room ${room.id} availability result:`, data);
          return { room, isAvailable: data || false };
        })
      );

      // Filter to only include available rooms
      const filteredRooms = availabilityChecks
        .filter(({ isAvailable }) => isAvailable)
        .map(({ room }) => room);

      console.log('Filtered available rooms:', filteredRooms.length, 'out of', rooms.length);
      setAvailableRooms(filteredRooms);
    } catch (error) {
      console.error('Error filtering room availabilities:', error);
      setAvailableRooms([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Checking room availability...</p>
      </div>
    );
  }

  if (availableRooms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          {checkInDate && checkOutDate 
            ? 'No rooms are available for the selected dates.' 
            : 'No rooms available at the moment.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {availableRooms.map((room) => (
        <RoomCard 
          key={room.id} 
          room={room} 
          isDateBasedAvailable={true}
          showAvailabilityTag={false}
        />
      ))}
    </div>
  );
};

export default RoomsGrid;
