
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RecentReviews from "@/components/RecentReviews";
import Events from "@/components/Events";
import CounterBar from "@/components/CounterBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Wifi, Car, Coffee, Dumbbell } from "lucide-react";

const Index = () => {
  // Helper function to get correct image path for GitHub Pages
  const getImagePath = (filename: string) => {
    const basePath = import.meta.env.MODE === 'production' ? '/la-posh-hotel' : '';
    return `${basePath}/lovable-uploads/${filename}`;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="hotel-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="flex items-center mb-6">
                <div className="h-0.5 bg-hotel-gold w-12 mr-4"></div>
                <h2 className="hotel-subtitle text-black">ABOUT US</h2>
              </div>
              <h3 className="hotel-title mb-6">Experience Unparalleled Luxury</h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                La Posh Signature Hotel & Suites stands as a beacon of sophistication in the heart of Lagos. 
                Our commitment to excellence ensures every guest experiences the pinnacle of comfort and service.
              </p>
              <p className="text-gray-600 mb-8">
                From our elegantly appointed rooms to our world-class amenities, every detail has been 
                carefully crafted to exceed your expectations and create unforgettable memories.
              </p>
              <Link to="/about">
                <Button variant="hotel" size="lg">
                  Learn More About Us
                </Button>
              </Link>
            </div>
            <div className="animate-fade-in-delay-1">
              <img 
                src={getImagePath('1a1acbbc-64f6-44d1-8b5d-f0109e02f03e.png')}
                alt="Luxury hotel lobby" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-hotel-beige">
        <div className="hotel-container">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="h-0.5 bg-hotel-gold w-12 mr-4"></div>
              <h2 className="hotel-subtitle text-black">AMENITIES</h2>
              <div className="h-0.5 bg-hotel-gold w-12 ml-4"></div>
            </div>
            <h3 className="hotel-title mb-6">Premium Facilities</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Wifi, title: "Free WiFi", desc: "High-speed internet throughout the property" },
              { icon: Car, title: "Valet Parking", desc: "Complimentary parking service for all guests" },
              { icon: Coffee, title: "Restaurant", desc: "Fine dining with international cuisine" },
              { icon: Dumbbell, title: "Fitness Center", desc: "State-of-the-art gym equipment" }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="mx-auto mb-4 text-hotel-gold" size={48} />
                <h4 className="text-xl font-semibold mb-2 text-hotel-navy">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Preview */}
      <section className="py-20 bg-white">
        <div className="hotel-container">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="h-0.5 bg-hotel-gold w-12 mr-4"></div>
              <h2 className="hotel-subtitle text-black">ACCOMMODATIONS</h2>
              <div className="h-0.5 bg-hotel-gold w-12 ml-4"></div>
            </div>
            <h3 className="hotel-title mb-6">Luxurious Rooms & Suites</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: getImagePath('1ab4d322-ad33-47ce-b765-091d8b14f781.png'),
                title: "Deluxe Room",
                desc: "Spacious rooms with modern amenities"
              },
              {
                image: getImagePath('442a4b2f-8a6f-4bd7-9c4d-a0a37dfb8260.png'),
                title: "Executive Suite",
                desc: "Premium suites with separate living area"
              },
              {
                image: getImagePath('8f6cc8d0-723a-47fc-a70b-5c04e60040c6.png'),
                title: "Presidential Suite",
                desc: "Ultimate luxury with panoramic city views"
              }
            ].map((room, index) => (
              <div 
                key={index} 
                className="group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <img 
                    src={room.image} 
                    alt={room.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h4 className="text-xl font-semibold mb-2 text-hotel-navy">{room.title}</h4>
                  <p className="text-gray-600">{room.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/rooms">
              <Button variant="hotel" size="lg">
                View All Rooms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Counter Bar */}
      <CounterBar />

      {/* Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="hotel-container">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="h-0.5 bg-hotel-gold w-12 mr-4"></div>
              <h2 className="hotel-subtitle text-black">TESTIMONIALS</h2>
              <div className="h-0.5 bg-hotel-gold w-12 ml-4"></div>
            </div>
            <h3 className="hotel-title mb-6">What Our Guests Say</h3>
          </div>
          <RecentReviews />
          <div className="text-center mt-12">
            <Link to="/add-review">
              <Button variant="outline" className="border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-white">
                Share Your Experience
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <Events />

      {/* Contact Section */}
      <section className="py-20 bg-hotel-navy">
        <div className="hotel-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center mb-6">
                <div className="h-0.5 bg-hotel-gold w-12 mr-4"></div>
                <h2 className="hotel-subtitle">CONTACT US</h2>
              </div>
              <h3 className="hotel-title mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="text-hotel-gold mr-4" size={20} />
                  <span>123 Victoria Island, Lagos, Nigeria</span>
                </div>
                <div className="flex items-center">
                  <Phone className="text-hotel-gold mr-4" size={20} />
                  <span>+234 123 456 7890</span>
                </div>
                <div className="flex items-center">
                  <Mail className="text-hotel-gold mr-4" size={20} />
                  <span>info@laposhhotel.com</span>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/contact">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-hotel-navy">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="animate-fade-in-delay-1">
              <img 
                src={getImagePath('cee30f59-ce42-4cfa-ba4e-405a7c5339d1.png')}
                alt="Hotel contact" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
