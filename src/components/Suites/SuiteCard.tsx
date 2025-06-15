
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
  Users, 
  Award, 
  DoorClosed, 
  Bed
} from "lucide-react";
import { Room } from "@/types/supabase";

interface SuiteCardProps {
  suite: Room;
}

const SuiteCard = ({ suite }: SuiteCardProps) => {
  const navigate = useNavigate();
  
  const handleBookNow = () => {
    navigate('/booking', { state: { roomType: `${suite.name} ${suite.room_number}`, roomPrice: suite.price_per_night } });
  };
  
  // Capitalize the suite name for display
  const displayName = `${suite.name.charAt(0).toUpperCase() + suite.name.slice(1)} ${suite.room_number}`;
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={suite.image_url || '/placeholder.svg'} 
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-0 right-0 bg-hotel-gold text-white px-3 py-1 m-2 rounded-md text-sm font-medium">
          Suite
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white font-bold text-xl">{displayName}</p>
          <p className="text-white/90 text-sm">₦{suite.price_per_night.toLocaleString()}/night</p>
        </div>
      </div>
      <CardHeader className="py-3">
        <CardTitle className="flex justify-between items-center">
          <span>{displayName}</span>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <DoorClosed size={16} />
          <span>Capacity: {suite.capacity} guests</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow py-2">
        <p className="text-gray-700 mb-3 line-clamp-2">{suite.description}</p>
        
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Key Features</h4>
          <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{suite.capacity} Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed size={16} />
              <span>Premium Bed</span>
            </div>
            <div className="flex items-center gap-1">
              <Award size={16} />
              <span>Premium</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-3 pb-3">
        <div className="text-hotel-gold font-bold">
          ₦{suite.price_per_night.toLocaleString()}<span className="text-sm font-normal text-gray-500">/night</span>
        </div>
        <Button variant="hotel" size="sm" onClick={handleBookNow}>Book Now</Button>
      </CardFooter>
    </Card>
  );
};

export default SuiteCard;
