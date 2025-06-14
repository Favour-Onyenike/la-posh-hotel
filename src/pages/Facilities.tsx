
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star } from "lucide-react";

const Facilities = () => {
  // Updated facility items with images matching the appropriate facilities
  const facilityItems = [
    {
      title: "Restaurant",
      description: "Experience exquisite cuisine at our in-house restaurant offering a blend of local delicacies and international dishes prepared by our expert chefs. Our restaurant features an elegant ambiance with both indoor and outdoor seating options, a carefully curated wine list, and seasonal menus that showcase the freshest local ingredients. Whether you're enjoying a romantic dinner or hosting a business lunch, our attentive staff ensures an unforgettable dining experience.",
      imageSrc: "/lovable-uploads/5554f5f5-c5dc-46b2-b735-61e278864872.png"
    },
    {
      title: "Executive Rooms",
      description: "Spacious and elegantly furnished suites designed for ultimate comfort and relaxation. Each suite features a separate living area, premium king-sized beds with luxury linens, a work desk with ergonomic chair, high-definition smart TVs, custom bathroom amenities, and complimentary high-speed WiFi. The thoughtful design incorporates both modern convenience and classic elegance, with soundproofed walls ensuring a peaceful atmosphere throughout your stay.",
      imageSrc: "/lovable-uploads/1a1acbbc-64f6-44d1-8b5d-f0109e02f03e.png"
    },
    {
      title: "24/7 Power Supply",
      description: "Uninterrupted power supply through our integrated system of solar inverters, state-of-the-art generators and a dedicated transformer. Our eco-friendly power solution ensures that all hotel facilities operate seamlessly, with automatic switching between power sources that is virtually undetectable to guests. This reliable infrastructure powers everything from climate control systems to electronic door locks, providing peace of mind regardless of external power conditions.",
      imageSrc: "/lovable-uploads/2041bcf9-cce4-478f-95c0-b002a66664b5.png"
    },
    {
      title: "Fitness Center",
      description: "Stay fit during your stay with our well-equipped gym featuring standard cardio machines, free weights, and basic training equipment. The fitness center includes treadmills, stationary bikes, and weight machines to help you maintain your workout routine while traveling. Fresh towels are available, along with a water cooler for your convenience. The space is clean, functional, and available to all hotel guests.",
      imageSrc: "/lovable-uploads/d9d5cdb1-1c16-4557-8c64-39e713537d74.png"
    },
    {
      title: "Outdoor Recreation Area",
      description: "Enjoy our outdoor seating area with various entertainment options including a professional pool table and other games for your leisure. The beautifully landscaped space features comfortable lounge furniture, ambient lighting for evening relaxation, a covered gazebo area for shade during hot days, and multiple activity zones including table tennis and lawn chess. It's the perfect setting for casual gatherings or simply unwinding with a book from our reading collection.",
      imageSrc: "/lovable-uploads/9423b162-188e-46ac-a0ac-33fbdf219e2c.png"
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
            <div className="max-w-6xl mx-auto text-center animate-fade-in">
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
            <div className="max-w-6xl mx-auto">              
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

        {/* Facilities Layout */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="space-y-8 md:space-y-12">
              {facilityItems.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {/* Mobile Layout - Always image first, then content */}
                  <div className="md:hidden">
                    <div className="h-48">
                      <AspectRatio ratio={4/3} className="h-full">
                        <img 
                          src={item.imageSrc} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                    <div className="p-6">
                      <div className="border-l-4 border-hotel-gold pl-4">
                        <h3 className="text-xl font-serif font-bold mb-3">{item.title}</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout - Alternating */}
                  <div className="hidden md:grid md:grid-cols-2">
                    {index % 2 === 0 ? (
                      <>
                        {/* Even items: image on left, text on right */}
                        <div className="h-64 md:h-72">
                          <AspectRatio ratio={4/3} className="h-full">
                            <img 
                              src={item.imageSrc} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                            />
                          </AspectRatio>
                        </div>
                        <div className="p-6 flex flex-col justify-center">
                          <div className="border-l-4 border-hotel-gold pl-4">
                            <h3 className="text-xl font-serif font-bold mb-3">{item.title}</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Odd items: text on left, image on right */}
                        <div className="p-6 flex flex-col justify-center">
                          <div className="border-l-4 border-hotel-gold pl-4">
                            <h3 className="text-xl font-serif font-bold mb-3">{item.title}</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                        <div className="h-64 md:h-72">
                          <AspectRatio ratio={4/3} className="h-full">
                            <img 
                              src={item.imageSrc} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                            />
                          </AspectRatio>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-hotel-beige py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="hotel-title mb-6">Experience Luxury at La Posh</h2>
              <p className="text-lg mb-8 text-gray-700 max-w-3xl mx-auto">
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
