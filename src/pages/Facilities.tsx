
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Wifi, 
  Car, 
  Utensils, 
  Dumbbell, 
  Waves, 
  Shield, 
  Clock, 
  Headphones,
  Coffee,
  Briefcase,
  Users,
  Baby
} from "lucide-react";

const Facilities = () => {
  const facilities = [
    {
      icon: Wifi,
      title: "Free Wi-Fi",
      description: "High-speed internet access throughout the hotel"
    },
    {
      icon: Car,
      title: "Parking",
      description: "Complimentary parking for all guests"
    },
    {
      icon: Utensils,
      title: "Restaurant",
      description: "Fine dining with local and international cuisine"
    },
    {
      icon: Dumbbell,
      title: "Fitness Center",
      description: "Modern gym equipment available 24/7"
    },
    {
      icon: Waves,
      title: "Swimming Pool",
      description: "Outdoor pool with poolside service"
    },
    {
      icon: Shield,
      title: "Security",
      description: "24/7 security and surveillance"
    },
    {
      icon: Clock,
      title: "Room Service",
      description: "24-hour room service available"
    },
    {
      icon: Headphones,
      title: "Concierge",
      description: "Personal concierge services"
    },
    {
      icon: Coffee,
      title: "Café & Bar",
      description: "Relaxing café and cocktail bar"
    },
    {
      icon: Briefcase,
      title: "Business Center",
      description: "Full-service business facilities"
    },
    {
      icon: Users,
      title: "Event Halls",
      description: "Spacious venues for meetings and events"
    },
    {
      icon: Baby,
      title: "Family Friendly",
      description: "Children's play area and family services"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Facilities</h1>
          <p className="text-xl md:text-2xl">Luxury amenities for an unforgettable stay</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Premium Amenities</h2>
        <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
          At La Posh Signature Hotel & Suites, we pride ourselves on offering a comprehensive range of 
          premium facilities designed to enhance your stay. Every amenity has been carefully crafted to 
          exceed your expectations and create memorable experiences.
        </p>
      </section>

      {/* Facilities Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {facilities.map((facility, index) => {
              const IconComponent = facility.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{facility.title}</h3>
                  <p className="text-gray-600">{facility.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Experience Luxury</h2>
          <p className="text-gray-600 text-lg mb-6">
            Our facilities are designed to provide you with the ultimate comfort and convenience during your stay.
          </p>
          <a 
            href="/booking" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Book Your Stay
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Facilities;
