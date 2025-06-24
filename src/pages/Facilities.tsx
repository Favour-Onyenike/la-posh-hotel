import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader } from "@/components/ui/loader";
import { 
  Wifi, 
  Car, 
  Utensils, 
  Dumbbell, 
  Waves, 
  Wine,
  Shield, 
  Headphones 
} from "lucide-react";

const Facilities = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-hotel-gold" />
      </div>
    );
  }

  const facilities = [
    {
      icon: Wifi,
      title: "Free Wi-Fi",
      description: "High-speed internet access throughout the property"
    },
    {
      icon: Car,
      title: "Parking",
      description: "Complimentary valet parking for all guests"
    },
    {
      icon: Utensils,
      title: "Fine Dining",
      description: "Gourmet restaurant featuring international cuisine"
    },
    {
      icon: Dumbbell,
      title: "Fitness Center",
      description: "State-of-the-art gym equipment and personal training"
    },
    {
      icon: Waves,
      title: "Swimming Pool",
      description: "Outdoor pool with stunning city views"
    },
    {
      icon: Wine,
      title: "Exclusive Bar",
      description: "Premium cocktails and finest wines collection"
    },
    {
      icon: Shield,
      title: "24/7 Security",
      description: "Round-the-clock security and concierge services"
    },
    {
      icon: Headphones,
      title: "Room Service",
      description: "24-hour room service for your convenience"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/lovable-uploads/28419863-c4a4-4fb6-a14e-c864333d1966.png')"
          }}
        />
        <div className="relative text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Our Facilities</h1>
          <p className="text-xl max-w-2xl">
            Experience luxury with our world-class amenities and services
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-20 px-4">
        <div className="hotel-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Premium Amenities
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the exceptional facilities that make your stay unforgettable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility, index) => {
              const IconComponent = facility.icon;
              return (
                <div 
                  key={index}
                  className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300 bg-gray-50"
                >
                  <div className="mb-4 flex justify-center">
                    <IconComponent size={48} className="text-hotel-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {facility.title}
                  </h3>
                  <p className="text-gray-600">
                    {facility.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="hotel-container text-center">
          <h2 className="text-4xl font-bold mb-8">
            More Than Just Accommodation
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-300">
            At LA POSH Signature Suites, we believe in providing an experience that goes beyond expectations. 
            Every facility is designed with your comfort and luxury in mind.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-4 text-hotel-gold">Premium Location</h3>
              <p className="text-gray-300">
                Strategically located in the heart of the city with easy access to major attractions
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-4 text-hotel-gold">Exceptional Service</h3>
              <p className="text-gray-300">
                Our dedicated staff ensures every moment of your stay is perfectly crafted
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-4 text-hotel-gold">Luxury Standards</h3>
              <p className="text-gray-300">
                Every detail meets the highest standards of luxury and sophistication
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Facilities;
