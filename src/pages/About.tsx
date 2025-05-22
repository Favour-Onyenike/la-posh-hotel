
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Star, StarHalf, Sparkles } from "lucide-react";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
        {/* Hero Section with Background Image */}
        <section 
          className="py-24 md:py-32 lg:py-40 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: "url('/lovable-uploads/e9be561a-1ed6-476f-aab8-fd04aaef0620.png')" }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="hotel-container relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">About La Posh</h1>
              <p className="text-xl md:text-2xl text-white">
                Where luxury meets elegance and sophistication
              </p>
              <div className="flex justify-center gap-2 mt-8">
                <Star className="text-hotel-gold" size={24} />
                <Star className="text-hotel-gold" size={24} />
                <Star className="text-hotel-gold" size={24} />
                <Star className="text-hotel-gold" size={24} />
                <StarHalf className="text-hotel-gold" size={24} />
              </div>
            </div>
          </div>
        </section>

        {/* About Us Content */}
        <section className="section-padding bg-white py-20">
          <div className="hotel-container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-8">
                <div className="h-0.5 bg-hotel-gold w-12 mr-4"></div>
                <h2 className="hotel-subtitle text-black text-3xl uppercase font-bold">ABOUT US</h2>
                <div className="h-0.5 bg-hotel-gold w-12 ml-4"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="prose prose-lg max-w-none">
                  <p className="mb-6 text-black text-lg leading-relaxed">
                    Welcome to La Posh Signature Hotel & Suites, where luxury meets elegance and
                    sophistication. Located in the heart of the Abraka Town, our hotel offers an
                    unparalleled hospitality experience, blending modern amenities with timeless
                    charm.
                  </p>
                  <p className="mb-6 text-black text-lg leading-relaxed">
                    Our story began with a passion for creating unforgettable experiences, and a
                    commitment to excellence in every detail. From our lavish rooms and suites, to
                    our world-class dining and entertainment options, every aspect of our hotel is
                    designed to exceed your expectations.
                  </p>
                </div>
                <div className="rounded-lg overflow-hidden shadow-xl border-2 border-hotel-gold/20 hover:shadow-2xl transition-all duration-300 hover-scale h-[300px]">
                  <img 
                    src="/lovable-uploads/253c3040-a0de-47cd-b074-06c86921d8e7.png" 
                    alt="Hotel Luxury Experience" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="bg-hotel-beige p-8 rounded-lg shadow-md border-l-4 border-hotel-gold mb-12">
                <p className="text-black text-lg italic">
                  "Whether you're a discerning business traveler, a romantic couple, or a family
                  on vacation, we invite you to experience the La Posh difference. Let us pamper
                  you with our signature blend of luxury, comfort, and genuine hospitality."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section Side by Side */}
        <section className="section-padding bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="hotel-container">
            <div className="text-center mb-16">
              <Sparkles className="text-hotel-gold mx-auto mb-4" size={32} />
              <h2 className="hotel-title text-black mb-4">Our Philosophy</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Guided by our commitment to excellence and guest satisfaction
              </p>
              <div className="h-1 w-24 bg-hotel-gold mx-auto mt-6"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Vision Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-hotel-gold/20 hover:shadow-xl transition-all duration-300">
                <div className="h-2 bg-hotel-gold w-full"></div>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="h-0.5 bg-hotel-gold w-8 mr-4"></div>
                    <h3 className="hotel-subtitle text-black uppercase font-bold flex items-center">
                      <Star className="text-hotel-gold mr-2" size={20} />
                      OUR VISION
                    </h3>
                    <div className="h-0.5 bg-hotel-gold w-8 ml-4"></div>
                  </div>
                  
                  <div className="prose prose-lg max-w-none">
                    <p className="mb-6 text-black text-lg leading-relaxed">
                      At La Posh Signature Hotel & Suites, our vision is to become the premier luxury
                      destination in the hospitality industry, renowned for our exceptional service,
                      opulent amenities, and unparalleled guest experiences.
                    </p>
                    <p className="mb-6 text-black text-lg leading-relaxed">
                      We strive to create a haven of elegance and sophistication, where every guest
                      feels valued, pampered, and inspired.
                    </p>
                    <p className="mb-4 text-black font-medium">Our vision is built on the pillars of:</p>
                    <ul className="list-none pl-0 mb-6 text-black space-y-3">
                      {[
                        "Uncompromising quality and attention to detail",
                        "Personalized service and genuine hospitality",
                        "Innovative amenities and cutting-edge technology",
                        "Sustainable practices and social responsibility",
                        "Continuous improvement and excellence"
                      ].map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="h-2 w-2 bg-hotel-gold rounded-full mr-3"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Mission Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-hotel-gold/20 hover:shadow-xl transition-all duration-300">
                <div className="h-2 bg-hotel-gold w-full"></div>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="h-0.5 bg-hotel-gold w-8 mr-4"></div>
                    <h3 className="hotel-subtitle text-black uppercase font-bold flex items-center">
                      <Star className="text-hotel-gold mr-2" size={20} />
                      OUR MISSION
                    </h3>
                    <div className="h-0.5 bg-hotel-gold w-8 ml-4"></div>
                  </div>
                  
                  <div className="prose prose-lg max-w-none">
                    <p className="mb-6 text-black text-lg leading-relaxed">
                      At La Posh Signature Hotel & Suites, our mission is to provide exceptional
                      hospitality experiences that exceed our guests' expectations, while fostering a
                      culture of excellence, innovation, and sustainability.
                    </p>
                    <p className="mb-4 text-black font-medium">We are committed to:</p>
                    <ul className="list-none pl-0 mb-6 text-black space-y-3">
                      {[
                        "Delivering personalized, intuitive, and genuine service that makes every guest feel valued and cared for.",
                        "Creating a luxurious, comfortable, and inspiring environment that enhances our guests' well-being and productivity.",
                        "Offering innovative amenities, services, and experiences that surprise and delight our guests.",
                        "Building strong relationships with our guests, partners, and community, based on trust, respect, and mutual benefit.",
                        "Embracing sustainable practices and social responsibility, to minimize our impact on the environment."
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="h-2 w-2 bg-hotel-gold rounded-full mr-3 mt-2"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
