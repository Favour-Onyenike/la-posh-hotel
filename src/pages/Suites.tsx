
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
  Refrigerator, 
  Clock,
  Utensils,
  Dumbbell,
  Sofa
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types/supabase";

const SuiteCard = ({ suite }: { suite: Room }) => {
  const navigate = useNavigate();
  
  const handleBookNow = () => {
    navigate('/booking', { state: { roomType: suite.name, roomPrice: suite.price_per_night } });
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={suite.image_url || '/placeholder.svg'} 
          alt={suite.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-0 right-0 bg-hotel-gold text-white px-3 py-1 m-2 rounded-md text-sm font-medium">
          Suite
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white font-bold text-xl">{suite.name}</p>
          <p className="text-white/90 text-sm">₦{suite.price_per_night.toLocaleString()}/night</p>
        </div>
      </div>
      <CardHeader className="py-3">
        <CardTitle className="flex justify-between items-center">
          <span>{suite.name}</span>
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

const Suites = () => {
  const [suites, setSuites] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchSuites();
  }, []);

  const fetchSuites = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_type', 'suite')
        .order('price_per_night', { ascending: true });

      if (error) {
        console.error('Error fetching suites:', error);
        return;
      }

      // Ensure all suites have proper typing for availability_status
      const suitesWithProperTypes = (data || []).map(suite => ({
        ...suite,
        availability_status: suite.availability_status as Room['availability_status']
      }));

      setSuites(suitesWithProperTypes as Room[]);
    } catch (error) {
      console.error('Error fetching suites:', error);
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
            <p className="text-gray-600">Loading suites...</p>
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
          className="py-20 md:py-28 lg:py-40 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: "url('/lovable-uploads/e9be561a-1ed6-476f-aab8-fd04aaef0620.png')" }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="hotel-container relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">Our Suites</h1>
              <p className="text-xl md:text-2xl text-white">
                Experience extraordinary luxury in our exclusive suites
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
                  Our suites offer the ultimate in luxury and comfort, featuring separate living areas,
                  premium amenities, and personalized service to make your stay truly memorable.
                </p>
                <p className="text-black text-lg leading-relaxed">
                  Each suite is meticulously designed to provide a sophisticated atmosphere
                  where you can unwind in style and elegance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Suites Section */}
        <section className="section-padding bg-hotel-beige py-16">
          <div className="hotel-container">
            <div className="max-w-7xl mx-auto">
              <h2 className="hotel-title text-center mb-12">Premium Suites</h2>
              {suites.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No suites available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suites.map((suite) => (
                    <SuiteCard key={suite.id} suite={suite} />
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
              <h2 className="hotel-title text-center mb-8">Premium Suite Amenities</h2>
              <p className="text-center mb-12 max-w-3xl mx-auto text-gray-700">
                All our suites feature these exclusive amenities designed to provide the ultimate luxury experience during your stay.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Wifi className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Ultra-Fast Wi-Fi</h3>
                      <p className="text-sm text-gray-600">Premium high-speed internet for all your devices</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <AirVent className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Climate Control</h3>
                      <p className="text-sm text-gray-600">Personalized temperature settings</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Tv className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Large TVs</h3>
                      <p className="text-sm text-gray-600">60"+ screens with streaming services</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Bath className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Premium Bathrooms</h3>
                      <p className="text-sm text-gray-600">Jacuzzi tubs and rainfall showers</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Refrigerator className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Refrigerator</h3>
                      <p className="text-sm text-gray-600">Full-sized with premium beverages and snacks</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Sofa className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Sitting Area</h3>
                      <p className="text-sm text-gray-600">Separate living space to relax and entertain</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Dumbbell className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Mini Gym Access</h3>
                      <p className="text-sm text-gray-600">Complimentary access to our premium fitness center</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Utensils className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Free Breakfast</h3>
                      <p className="text-sm text-gray-600">Complimentary gourmet breakfast included</p>
                    </div>
                  </CardContent>
                </Card>
                
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-white py-16">
          <div className="hotel-container">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="hotel-title mb-6">Experience Unparalleled Luxury</h2>
              <p className="text-lg mb-8 text-gray-700 max-w-3xl mx-auto">
                Book your suite today and indulge in the finest accommodations La Posh Signature Hotel has to offer.
                Enjoy spacious living areas, premium amenities, and personalized service.
              </p>
              <Button 
                variant="hotel" 
                size="lg" 
                className="font-medium"
                onClick={handleBookNow}
              >
                Book Your Suite Now
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Suites;
