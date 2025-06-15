
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Award, 
  DoorClosed, 
  Wifi, 
  Tv, 
  Bath, 
  AirVent, 
  Clock,
  Utensils
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types/supabase";

const RoomCard = ({ room }: { room: Room }) => {
  const navigate = useNavigate();
  
  const handleBookNow = () => {
    navigate('/booking', { state: { roomType: `${room.name} ${room.room_number}`, roomPrice: room.price_per_night } });
  };
  
  // Capitalize the room name for display
  const displayName = `${room.name.charAt(0).toUpperCase() + room.name.slice(1)} ${room.room_number}`;
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={room.image_url || '/placeholder.svg'} 
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
  const navigate = useNavigate();
  
  // Helper function to get proper image paths for GitHub Pages deployment
  const getImagePath = (imageName: string) => {
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/la-posh-hotel-app' : '';
    return `${basePath}/lovable-uploads/${imageName}`;
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
  
  const handleBookNow = () => {
    navigate('/booking');
  };
  
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-24 md:pt-28 lg:pt-32 pb-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Loading rooms...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
        {/* Hero Section */}
        <section
          className="py-20 md:py-28 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: `url('${getImagePath('e9be561a-1ed6-476f-aab8-fd04aaef0620.png')}')` }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="hotel-container relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">Our Rooms</h1>
              <p className="text-xl md:text-2xl text-white">
                Comfortable accommodations designed for your relaxation
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="section-padding bg-white py-16">
          <div className="hotel-container">
            <div className="max-w-6xl mx-auto">
              <div className="prose prose-lg max-w-none text-center mb-12">
                <p className="mb-6 text-black text-lg leading-relaxed">
                  At La Posh Signature Hotel & Suites, we offer a variety of luxurious rooms 
                  designed to provide comfort and elegance during your stay.
                </p>
                <p className="text-black text-lg leading-relaxed">
                  Each room is meticulously maintained and furnished with modern amenities 
                  to ensure a memorable experience.
                </p>
              </div>
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  className="border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-white"
                  onClick={() => navigate('/suites')}
                >
                  View Our Premium Suites
                </Button>
              </div>
            </div>
          </div>
        </section>

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

        {/* Amenities Section */}
        <section className="section-padding bg-white py-16">
          <div className="hotel-container">
            <div className="max-w-7xl mx-auto">
              <h2 className="hotel-title text-center mb-8">Standard Room Amenities</h2>
              <p className="text-center mb-12 max-w-3xl mx-auto text-gray-700">
                Every room at La Posh Signature Hotel & Suites comes equipped with these standard amenities
                to ensure your comfort and convenience.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Wifi className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Wi-Fi Access</h3>
                      <p className="text-sm text-gray-600">Complimentary internet access throughout your stay</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <AirVent className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Air Conditioning</h3>
                      <p className="text-sm text-gray-600">Individually controlled climate system</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Tv className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">TV</h3>
                      <p className="text-sm text-gray-600">Flat-screen television with satellite channels</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Bath className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Luxury Bathroom</h3>
                      <p className="text-sm text-gray-600">Premium bath amenities and plush towels</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Utensils className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Free Breakfast</h3>
                      <p className="text-sm text-gray-600">Complimentary breakfast included with all rooms</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Clock className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Room Service</h3>
                      <p className="text-sm text-gray-600">Available daily from 6:00 AM to 11:00 PM</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold mb-4">Executive & Premium Rooms</h3>
                <p className="text-gray-700 mb-6">
                  Our Amber and Emerald rooms include additional amenities:
                </p>
                <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
                  <Badge variant="outline" className="bg-gray-50 px-3 py-1">Mini Gym Access</Badge>
                  <Badge variant="outline" className="bg-gray-50 px-3 py-1">Mini Refrigerator (Emerald only)</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-white py-16">
          <div className="hotel-container">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="hotel-title mb-6">Ready to Experience Comfort?</h2>
              <p className="text-lg mb-8 text-gray-700 max-w-3xl mx-auto">
                Book your stay today and enjoy our comfortable accommodations, impeccable service, 
                and the perfect blend of comfort and elegance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="hotel" 
                  size="lg" 
                  className="font-medium"
                  onClick={handleBookNow}
                >
                  Book Your Room Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="font-medium border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-white"
                  onClick={() => navigate('/suites')}
                >
                  Explore Our Suites
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Rooms;
