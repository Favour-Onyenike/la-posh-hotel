
import React from 'react';
import { Room } from '@/types/supabase';
import RoomCard from '@/components/RoomCard';
import { CalendarDays } from 'lucide-react';

interface RoomsListProps {
  filteredRooms: Room[];
  loading: boolean;
  onBookRoom: (room: Room) => Promise<void>;
}

const RoomsList = ({ filteredRooms, loading, onBookRoom }: RoomsListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading rooms...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredRooms.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-500">
            <CalendarDays className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium mb-2">No rooms available</h3>
            <p>Try adjusting your filters or dates</p>
          </div>
        </div>
      ) : (
        filteredRooms.map((room) => (
          <RoomCard
            key={room.id}
            id={room.id}
            name={room.name}
            description={room.description}
            price={room.price_per_night}
            capacity={room.capacity}
            imageUrl={room.image_url || ''}
            features={room.features || []}
            onBookNow={() => onBookRoom(room)}
          />
        ))
      )}
    </div>
  );
};

export default RoomsList;
