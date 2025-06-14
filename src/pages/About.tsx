
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Users, Award, Clock } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About La Posh</h1>
          <p className="text-xl md:text-2xl">Where luxury meets elegance and sophistication</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">About La Posh</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Welcome to La Posh Signature Hotel & Suites, where luxury meets elegance and sophistication. 
              Located in the heart of the Abraka Town, our hotel offers an unparalleled hospitality experience, 
              blending modern amenities with timeless charm.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our story began with a passion for creating unforgettable experiences, and a commitment to 
              excellence in every detail. From our lavish rooms and suites, to our world-class dining and 
              entertainment options, every aspect of our hotel is designed to exceed your expectations.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you're a discerning business traveler, a romantic couple, or a family on vacation, 
              we invite you to experience the La Posh difference. Let us pamper you with our signature 
              blend of luxury, comfort, and genuine hospitality.
            </p>
          </div>
          <div className="relative">
            <img 
              src="/lovable-uploads/8160dfdf-2bee-40e2-b129-c74aaea6a773.png" 
              alt="La Posh Hotel Exterior" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Sets Us Apart</h2>
            <p className="text-gray-600 text-lg">Discover the unique elements that define the La Posh experience</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Prime Location</h3>
              <p className="text-gray-600">Strategically located in the heart of Abraka Town for easy access to key attractions</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Exceptional Service</h3>
              <p className="text-gray-600">Our dedicated team provides personalized service to ensure your comfort</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Award Winning</h3>
              <p className="text-gray-600">Recognized for excellence in hospitality and guest satisfaction</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">24/7 Service</h3>
              <p className="text-gray-600">Round-the-clock service to attend to all your needs at any time</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
