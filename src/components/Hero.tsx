
import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const navigate = useNavigate();
  
  const handleExploreRooms = () => {
    navigate('/rooms');
  };
  
  const handleBookNow = () => {
    navigate('/booking');
  };

  const handleAddReview = () => {
    navigate('/add-review');
  };
  
  return (
    <div className="relative h-[95vh] md:h-screen w-full">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/lovable-uploads/8f6cc8d0-723a-47fc-a70b-5c04e60040c6.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-4">
        <div className="max-w-4xl animate-fade-in ml-8 md:ml-16 lg:ml-24 text-left">
          <h1 className="hotel-title mb-4 text-5xl md:text-6xl lg:text-7xl tracking-tight text-white">
            Welcome to La-posh Signature Suites
          </h1>
          <p className="hotel-subtitle mb-8 opacity-90 text-xl md:text-2xl text-white">
            we are focused on providing clients with the highest level of comfort and excellent at affordable rates
          </p>
          <div className="flex flex-wrap justify-start gap-4">
            <Button
              variant="hotel" 
              size="lg"
              onClick={handleExploreRooms}
            >
              Explore Rooms
            </Button>
            <Button
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-sans font-medium transition-all duration-300 hover:bg-white hover:text-hotel-navy"
              onClick={handleBookNow}
            >
              Book Now
            </Button>
            <Button
              variant="hotel"
              size="lg"
              onClick={handleAddReview}
            >
              Share Review
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Banner */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-5xl">
        <div className="mx-4 md:mx-6 bg-white rounded-lg shadow-xl grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          <div className="p-6 flex items-center border-b md:border-b-0 md:border-r border-gray-200">
            <Calendar className="text-hotel-gold mr-4" size={24} />
            <div>
              <h3 className="font-semibold text-hotel-navy">Check-in / Check-out</h3>
              <p className="text-gray-600 text-sm">Select your dates</p>
            </div>
          </div>
          <div className="p-6 flex items-center border-b md:border-b-0 md:border-r border-gray-200">
            <MapPin className="text-hotel-gold mr-4" size={24} />
            <div>
              <h3 className="font-semibold text-hotel-navy">Destination</h3>
              <p className="text-gray-600 text-sm">Luxe Haven Hotel</p>
            </div>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-hotel-navy">Special Offers</h3>
              <p className="text-gray-600 text-sm">View current promotions</p>
            </div>
            <button className="text-hotel-gold font-medium hover:text-hotel-navy transition-colors"
              onClick={handleBookNow}>
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
