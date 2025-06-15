
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types/supabase";
import RoomsHero from "@/components/Rooms/RoomsHero";
import RoomsIntroduction from "@/components/Rooms/RoomsIntroduction";
import RoomsAmenities from "@/components/Rooms/RoomsAmenities";
import RoomsCTA from "@/components/Rooms/RoomsCTA";
import RoomsLoading from "@/components/Rooms/RoomsLoading";

const RoomCard = ({ room }: { room: Room }) => {
  const navigate = useNavigate();
  
  // Helper function to get proper image paths for GitHub Pages deployment
  const getImagePath = (imageName: string) => {
    // Check for deployment on GitHub Pages
    const isGitHubPages = window.location.pathname.startsWith("/la-posh-hotel");
    // Also check for Vite's production flag for Netlify/static hosting too
    const isProduction = import.meta.env.PROD;
    // Prefer GitHub Pages detection if possible, fallback to PROD for Netlify/etc.
    if (isGitHubPages || isProduction) {
      return `/la-posh-hotel/lovable-uploads/${imageName}`;
    }
    return `/lovable-uploads/${imageName}`;
  };
  
  const handleBookNow = () => {
    navigate('/booking', { state: { roomType: `${room.name} ${room.room_number}`, roomPrice: room.price_per_night } });
  };
  
  // Capitalize the room name for display
  const displayName = `${room.name.charAt(0).toUpperCase() + room.name.slice(1)} ${room.room_number}`;
  
  // Process image URL to use getImagePath if it's a local upload
  const processImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return '/placeholder.svg';
    
    // If it's a lovable-uploads image, extract filename and use getImagePath
    if (imageUrl.includes('lovable-uploads/')) {
      const fileName = imageUrl.split('lovable-uploads/').pop();
      return fileName ? getImagePath(fileName) : '/placeholder.svg';
    }
    
    // If it's already a full URL (external or processed), use as is
    return imageUrl;
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={processImageUrl(room.image_url)} 
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-0 right-0 bg-hotel-gold text-white px-3 py-1 m-2 rounded-md text-sm font-medium">
          Room
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white font-bold text-xl">{displayName}</p>
          <p className="text-white/90 text-sm">₦{room.price_per_night.toLocaleString()}/night</p>
        </div>
      </div>
      <CardHeader className="py-3">
        <CardTitle className="flex justify-between items-center">
          <span>{displayName}</span>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <DoorClosed size={16} />
          <span>Capacity: {room.capacity} guests</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow py-2">
        <p className="text-gray-700 mb-3 line-clamp-2">{room.description}</p>
        
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Key Features</h4>
          <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{room.capacity} Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed size={16} />
              <span>Premium Bed</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>24h Check-in</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-3 pb-3">
        <div className="text-hotel-gold font-bold">
          ₦{room.price_per_night.toLocaleString()}<span className="text-sm font-normal text-gray-500">/night</span>
        </div>
        <Button variant="hotel" size="sm" onClick={handleBookNow}>Book Now</Button>
      </CardFooter>
    </Card>
  );
};

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Helper function to get proper image paths for GitHub Pages deployment
  const getImagePath = (imageName: string) => {
    // Check for deployment on GitHub Pages
    const isGitHubPages = window.location.pathname.startsWith("/la-posh-hotel");
    // Also check for Vite's production flag for Netlify/static hosting too
    const isProduction = import.meta.env.PROD;
    // Prefer GitHub Pages detection if possible, fallback to PROD for Netlify/etc.
    if (isGitHubPages || isProduction) {
      return `/la-posh-hotel/lovable-uploads/${imageName}`;
    }
    return `/lovable-uploads/${imageName}`;
  };
  
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_type', 'room')
        .order('name', { ascending: true })
        .order('room_number', { ascending: true });

      if (error) {
        console.error('Error fetching rooms:', error);
        return;
      }

      // Ensure all rooms have proper typing for availability_status
      const roomsWithProperTypes = (data || []).map(room => ({
        ...room,
        availability_status: room.availability_status as Room['availability_status']
      }));

      setRooms(roomsWithProperTypes as Room[]);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <RoomsLoading />;
  }
  
  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
        <RoomsHero getImagePath={getImagePath} />
        <RoomsIntroduction />

        {/* Rooms Section */}
        <section className="section-padding bg-hotel-beige py-16">
          <div className="hotel-container">
            <div className="max-w-7xl mx-auto">
              <h2 className="hotel-title text-center mb-12">Our Luxurious Rooms</h2>
              {rooms.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No rooms available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <RoomsAmenities />
        <RoomsCTA />
      </div>
      <Footer />
    </>
  );
};

export default Rooms;
