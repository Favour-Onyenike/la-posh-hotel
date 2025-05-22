
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Utensils, Hotel, Clock, Map, Coffee, Star, Power, Dumbbell, Gamepad } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Facilities = () => {
  // Updated facility items with removed spa, airport transfer, concierge service, and high-speed WiFi
  const facilityItems = [
    {
      title: "Fine Dining Restaurant",
      description: "Experience exquisite cuisine at our in-house restaurant offering a blend of local delicacies and international dishes prepared by our expert chefs.",
      icon: Utensils,
      imageSrc: "/lovable-uploads/1ab4d322-ad33-47ce-b765-091d8b14f781.png"
    },
    {
      title: "Executive Suites",
      description: "Spacious and elegantly furnished suites designed for ultimate comfort and relaxation.",
      icon: Hotel,
      imageSrc: "/lovable-uploads/1a1acbbc-64f6-44d1-8b5d-f0109e02f03e.png"
    },
    {
      title: "24/7 Power Supply",
      description: "Uninterrupted power supply through our integrated system of solar inverters, state-of-the-art generators and a dedicated transformer.",
      icon: Power,
      imageSrc: "/lovable-uploads/253c3040-a0de-47cd-b074-06c86921d8e7.png"
    },
    {
      title: "Modern Fitness Center",
      description: "Stay fit during your stay with our fully-equipped gym featuring cardio machines, weight training equipment, and personal training options.",
      icon: Dumbbell,
      imageSrc: "/lovable-uploads/bbd7d628-218e-45e5-a2f6-5dd221ccc495.png"
    },
    {
      title: "Outdoor Recreation Area",
      description: "Enjoy our outdoor seating area with various entertainment options including a professional pool table and other games for your leisure.",
      icon: Gamepad,
      imageSrc: "/lovable-uploads/253c3040-a0de-47cd-b074-06c86921d8e7.png"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
        {/* Hero Section */}
        <section 
          className="py-24 md:py-32 lg:py-40 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: "url('/lovable-uploads/e9be561a-1ed6-476f-aab8-fd04aaef0620.png')" }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="hotel-container relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">Our Facilities</h1>
              <p className="text-xl md:text-2xl text-white">
                Luxury amenities for an unforgettable stay
              </p>
              <div className="flex justify-center gap-2 mt-8">
                <Star className="text-hotel-gold" size={24} />
                <Star className="text-hotel-gold" size={24} />
                <Star className="text-hotel-gold" size={24} />
                <Star className="text-hotel-gold" size={24} />
                <Star className="text-hotel-gold" size={24} />
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Introduction */}
        <section className="section-padding bg-white py-20">
          <div className="hotel-container">
            <div className="max-w-4xl mx-auto">              
              <div className="prose prose-lg max-w-none text-center mb-12">
                <p className="mb-6 text-black text-lg leading-relaxed">
                  At La Posh Signature Hotel & Suites, we pride ourselves on offering a comprehensive range of 
                  premium facilities designed to enhance your stay and provide the utmost comfort and convenience.
                </p>
                <p className="mb-6 text-black text-lg leading-relaxed">
                  From our exquisite dining options to our modern fitness center, 
                  every amenity has been carefully crafted to exceed your expectations and create memorable experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities List - Changed from cards to a different format */}
        <section className="section-padding bg-gray-50 py-20">
          <div className="hotel-container">
            {facilityItems.map((item, index) => (
              <div 
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center mb-16 last:mb-0`}
              >
                <div className="w-full md:w-1/2">
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <AspectRatio ratio={16/9}>
                      <img 
                        src={item.imageSrc} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-hotel-gold rounded-full flex items-center justify-center mr-4">
                      <item.icon className="text-white" size={24} />
                    </div>
                    <h3 className="hotel-subtitle text-2xl font-bold">{item.title}</h3>
                  </div>
                  <p className="text-gray-700 text-lg mb-6">{item.description}</p>
                  <Separator className="my-4 bg-hotel-gold/20" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="section-padding bg-white py-20">
          <div className="hotel-container">
            <div className="text-center mb-16">
              <Star className="text-hotel-gold mx-auto mb-4" size={32} />
              <h2 className="hotel-title text-black mb-4">ADDITIONAL SERVICES</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Enhancing your experience with premium offerings
              </p>
              <div className="h-1 w-24 bg-hotel-gold mx-auto mt-6"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 24/7 Service */}
              <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-hotel-gold text-center">
                <Clock size={40} className="text-hotel-gold mx-auto mb-4" />
                <h3 className="hotel-subtitle text-xl font-bold mb-4">24/7 Room Service</h3>
                <p className="text-gray-700">
                  Our dedicated staff is available around the clock to cater to your needs, ensuring a 
                  comfortable and hassle-free stay, day or night.
                </p>
              </div>
              
              {/* Business Center */}
              <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-hotel-gold text-center">
                <Coffee size={40} className="text-hotel-gold mx-auto mb-4" />
                <h3 className="hotel-subtitle text-xl font-bold mb-4">Business Lounge</h3>
                <p className="text-gray-700">
                  A fully-equipped business center with modern facilities for meetings, conferences, and 
                  events, catering to all your professional needs.
                </p>
              </div>
              
              {/* Local Tours */}
              <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-hotel-gold text-center">
                <Map size={40} className="text-hotel-gold mx-auto mb-4" />
                <h3 className="hotel-subtitle text-xl font-bold mb-4">Local Tours</h3>
                <p className="text-gray-700">
                  Explore the beauty and culture of Abraka with our curated local tours, providing an authentic 
                  experience of the region's attractions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-hotel-beige py-20">
          <div className="hotel-container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="hotel-title mb-6">Experience Luxury at La Posh</h2>
              <p className="text-lg mb-8 text-gray-700 max-w-2xl mx-auto">
                Indulge in our world-class facilities and impeccable service. Book your stay today and 
                discover the epitome of luxury and comfort at La Posh Signature Hotel & Suites.
              </p>
              <Button variant="hotel" size="lg" className="font-medium">
                Book Your Stay Now
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Facilities;
