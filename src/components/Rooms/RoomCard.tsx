
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Bed, 
  Users, 
  DoorClosed, 
  Clock
} from "lucide-react";
import { Room } from "@/types/supabase";
import { getImagePath, processImageUrl } from "@/utils/imageUtils";

interface RoomCardProps {
  room: Room;
  isDateBasedAvailable?: boolean;
  showAvailabilityTag?: boolean;
}

const RoomCard = ({ room, isDateBasedAvailable = true, showAvailabilityTag = true }: RoomCardProps) => {
  const navigate = useNavigate();
  
  const handleBookNow = () => {
    navigate('/booking', { state: { roomType: `${room.name} ${room.room_number}`, roomPrice: room.price_per_night } });
  };
  
  // Capitalize the room name for display
  const displayName = `${room.name.charAt(0).toUpperCase() + room.name.slice(1)} ${room.room_number}`;
  
  // Determine the actual availability to show
  const isActuallyAvailable = room.availability_status === 'available' && isDateBasedAvailable;
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={processImageUrl(room.image_url)} 
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-0 right-0 bg-hotel-gold text-white px-2 py-1 m-2 rounded-md text-xs font-medium">
          Room
        </div>
        {showAvailabilityTag && (
          <div className={`absolute top-0 left-0 px-2 py-1 m-2 rounded-md text-xs font-medium ${
            isActuallyAvailable 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {isActuallyAvailable ? 'Available' : 'Not Available'}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-white font-bold text-lg">{displayName}</p>
          <p className="text-white/90 text-xs">₦{room.price_per_night.toLocaleString()}/night</p>
        </div>
      </div>
      <CardHeader className="py-2 px-4">
        <CardTitle className="text-lg">{displayName}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs">
          <DoorClosed size={14} />
          <span>Capacity: {room.capacity} guests</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow py-2 px-4">
        <p className="text-gray-700 mb-3 line-clamp-2 text-sm">{room.description}</p>
        
        <div>
          <h4 className="text-xs font-medium mb-2 text-gray-700">Key Features</h4>
          <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>{room.capacity} Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed size={12} />
              <span>Premium Bed</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>24h Check-in</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 border-t pt-3 pb-3 px-4">
        <div className="text-hotel-gold font-bold text-center">
          ₦{room.price_per_night.toLocaleString()}<span className="text-xs font-normal text-gray-500">/night</span>
        </div>
        <Button 
          variant="hotel" 
          size="sm" 
          onClick={handleBookNow} 
          className="w-full text-xs"
          disabled={!isActuallyAvailable}
        >
          {isActuallyAvailable ? 'Book Now' : 'Not Available'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
