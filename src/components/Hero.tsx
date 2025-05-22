
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Calendar, MapPin } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative h-screen w-full">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-white text-center px-4">
        <div className="max-w-4xl animate-fade-in">
          <h1 className="hotel-title mb-4 text-4xl md:text-5xl lg:text-6xl tracking-tight">
            Experience Luxury & Comfort
          </h1>
          <p className="hotel-subtitle mb-8 opacity-90 max-w-2xl mx-auto">
            Discover a blend of exquisite amenities and personalized service at Luxe Haven
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/rooms" className="hotel-button">
              Explore Rooms
            </Link>
            <Link
              to="/book"
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-sans font-medium transition-all duration-300 hover:bg-white hover:text-hotel-navy"
            >
              Book Now
            </Link>
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
            <button className="text-hotel-gold font-medium hover:text-hotel-navy transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
