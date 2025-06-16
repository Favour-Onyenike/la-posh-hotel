
import React from 'react';
import { Room } from '@/types/supabase';
import RoomCard from './RoomCard';

interface RoomsGridProps {
  rooms: Room[];
}

const RoomsGrid = ({ rooms }: RoomsGridProps) => {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No rooms available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
};

export default RoomsGrid;
