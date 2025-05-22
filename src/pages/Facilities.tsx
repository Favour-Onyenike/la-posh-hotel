
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Wifi, Utensils, Conciergebell, Shower, Hotel, Car, Clock, Map, Coffee } from "lucide-react";

const Facilities = () => {
  // Facility items with icons and descriptions
  const facilityItems = [
    {
      title: "High-Speed WiFi",
      description: "Complimentary high-speed internet access throughout the hotel premises for seamless connectivity.",
      icon: Wifi,
      imageSrc: "/lovable-uploads/bc6140b3-ddd4-4e67-a150-73a6930b623d.png"
    },
    {
      title: "Fine Dining",
      description: "Experience exquisite cuisine at our in-house restaurant offering local and international dishes.",
      icon: Utensils,
      imageSrc: "/lovable-uploads/1ab4d322-ad33-47ce-b765-091d8b14f781.png"
    },
    {
      title: "Concierge Service",
      description: "Our attentive concierge team is available 24/7 to assist with all your needs and requests.",
      icon: Conciergebell,
      imageSrc: "/lovable-uploads/8160dfdf-2bee-40e2-b129-c74aaea6a773.png"
    },
    {
      title: "Luxury Spa",
      description: "Rejuvenate your body and mind at our state-of-the-art spa offering a range of treatments.",
      icon: Shower,
      imageSrc: "/lovable-uploads/cee30f59-ce42-4cfa-ba4e-405a7c5339d1.png"
    },
    {
      title: "Executive Suites",
      description: "Spacious and elegantly furnished suites designed for ultimate comfort and relaxation.",
      icon: Hotel,
      imageSrc: "/lovable-uploads/1a1acbbc-64f6-44d1-8b5d-f0109e02f03e.png"
    },
    {
      title: "Airport Transfer",
      description: "Convenient airport shuttle service for hassle-free transportation to and from the airport.",
      icon: Car,
      imageSrc: "/lovable-uploads/b0b33b9b-6fb9-4d30-836e-20c55bc93064.png"
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
            </div>
          </div>
        </section>

        {/* Facilities Introduction */}
        <section className="section-padding bg-white py-20">
          <div className="hotel-container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-8">
                <div className="h-0.5 bg-hotel-gold w-12 mr-4"></div>
                <h2 className="hotel-subtitle text-black text-3xl uppercase font-bold">WORLD-CLASS AMENITIES</h2>
                <div className="h-0.5 bg-hotel-gold w-12 ml-4"></div>
              </div>
              
              <div className="prose prose-lg max-w-none text-center mb-12">
                <p className="mb-6 text-black text-lg leading-relaxed">
                  At La Posh Signature Hotel & Suites, we pride ourselves on offering a comprehensive range of 
                  premium facilities designed to enhance your stay and provide the utmost comfort and convenience.
                </p>
                <p className="mb-6 text-black text-lg leading-relaxed">
                  From high-speed WiFi throughout the premises to our exquisite dining options, 
                  every amenity has been carefully crafted to exceed your expectations and create memorable experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Grid */}
        <section className="section-padding bg-gray-50 py-20">
          <div className="hotel-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facilityItems.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-hotel-gold/10 hover:shadow-xl transition-all duration-300 hover:border-hotel-gold/30 group"
                >
                  <div className="h-[200px] overflow-hidden">
                    <AspectRatio ratio={16/9}>
                      <img 
                        src={item.imageSrc} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </AspectRatio>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 bg-hotel-gold rounded-full flex items-center justify-center mr-3">
                        <item.icon className="text-white" size={20} />
                      </div>
                      <h3 className="hotel-subtitle text-xl font-bold">{item.title}</h3>
                    </div>
                    <p className="text-gray-700 mb-4">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="section-padding bg-white py-20">
          <div className="hotel-container">
            <div className="max-w-4xl mx-auto mb-12">
              <div className="flex items-center mb-8 justify-center">
                <div className="h-0.5 bg-hotel-gold w-12 mr-4"></div>
                <h2 className="hotel-subtitle text-black text-3xl uppercase font-bold">ADDITIONAL SERVICES</h2>
                <div className="h-0.5 bg-hotel-gold w-12 ml-4"></div>
              </div>
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
