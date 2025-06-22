
import React, { useState, useEffect } from 'react';
import { Room } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import RoomCard from './RoomCard';

interface RoomsGridProps {
  rooms: Room[];
  checkInDate?: string;
  checkOutDate?: string;
}

interface RoomWithAvailability extends Room {
  isDateBasedAvailable: boolean;
}

const RoomsGrid = ({ rooms, checkInDate, checkOutDate }: RoomsGridProps) => {
  const [roomsWithAvailability, setRoomsWithAvailability] = useState<RoomWithAvailability[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (checkInDate && checkOutDate && rooms.length > 0) {
      console.log('Filtering rooms for date range:', checkInDate, 'to', checkOutDate);
      checkRoomAvailabilities();
    } else {
      // If no dates selected, show all rooms with default availability based on status
      const defaultRooms = rooms.map(room => ({
        ...room,
        isDateBasedAvailable: room.availability_status === 'available'
      }));
      console.log('No dates selected, showing all rooms with status-based availability');
      setRoomsWithAvailability(defaultRooms);
    }
  }, [rooms, checkInDate, checkOutDate]);

  const checkRoomAvailabilities = async () => {
    setLoading(true);
    try {
      const availabilityChecks = await Promise.all(
        rooms.map(async (room) => {
          if (room.availability_status !== 'available') {
            console.log(`Room ${room.id} is not available (status: ${room.availability_status})`);
            return { ...room, isDateBasedAvailable: false };
          }

          console.log(`Checking availability for room ${room.id} from ${checkInDate} to ${checkOutDate}`);
          const { data, error } = await supabase.rpc('is_room_available', {
            room_id_param: room.id,
            check_in_param: checkInDate,
            check_out_param: checkOutDate
          });

          if (error) {
            console.error('Error checking availability for room:', room.id, error);
            return { ...room, isDateBasedAvailable: false };
          }

          console.log(`Room ${room.id} availability result:`, data);
          return { ...room, isDateBasedAvailable: data || false };
        })
      );

      // Filter to only show available rooms when dates are selected
      const availableRooms = availabilityChecks.filter(room => room.isDateBasedAvailable);
      console.log('Filtered available rooms:', availableRooms.length, 'out of', rooms.length);
      setRoomsWithAvailability(availableRooms);
    } catch (error) {
      console.error('Error filtering room availabilities:', error);
      setRoomsWithAvailability([]);
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

  if (roomsWithAvailability.length === 0) {
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
      {roomsWithAvailability.map((room) => (
        <RoomCard 
          key={room.id} 
          room={room} 
          isDateBasedAvailable={room.isDateBasedAvailable}
          showAvailabilityTag={true}
        />
      ))}
    </div>
  );
};

export default RoomsGrid;
