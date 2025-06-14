
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bed, Users, DoorClosed } from 'lucide-react';
import { Room } from '@/types/supabase';

interface RoomCardProps {
  room: Room;
  isAvailable: boolean;
  onBook: (room: Room) => void;
}

const RoomCard = ({ room, isAvailable, onBook }: RoomCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={room.image_url || '/placeholder.svg'} 
          alt={`${room.name} ${room.room_type}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-0 right-0 bg-hotel-gold text-white px-3 py-1 m-2 rounded-md text-sm font-medium">
          {room.room_type}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white font-bold text-xl">{room.name}</p>
          <p className="text-white/90 text-sm">₦{Number(room.price_per_night).toLocaleString()}/night</p>
        </div>
      </div>
      
      <CardHeader className="py-3">
        <CardTitle className="flex justify-between items-center">
          <span>{room.room_number}</span>
          <Badge 
            variant={isAvailable ? "outline" : "destructive"} 
            className={isAvailable ? "bg-green-50 text-green-800 border-green-800" : ""}>
            {isAvailable ? "Available" : "Booked"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow py-2">
        <p className="text-gray-700 mb-3 line-clamp-2">{room.description}</p>
        
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Key Features</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{room.capacity} Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <DoorClosed size={16} />
              <span>{room.room_number}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center border-t pt-3 pb-3">
        <div className="text-hotel-gold font-bold">
          ₦{Number(room.price_per_night).toLocaleString()}<span className="text-sm font-normal text-gray-500">/night</span>
        </div>
        <Button 
          variant="hotel" 
          size="sm" 
          disabled={!isAvailable}
          onClick={() => onBook(room)}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
