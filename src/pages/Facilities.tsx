
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star } from "lucide-react";

const Facilities = () => {
  // Updated facility items with more detailed descriptions
  const facilityItems = [
    {
      title: "Fine Dining Restaurant",
      description: "Experience exquisite cuisine at our in-house restaurant offering a blend of local delicacies and international dishes prepared by our expert chefs. Our restaurant features an elegant ambiance with both indoor and outdoor seating options, a carefully curated wine list, and seasonal menus that showcase the freshest local ingredients. Whether you're enjoying a romantic dinner or hosting a business lunch, our attentive staff ensures an unforgettable dining experience.",
      imageSrc: "/lovable-uploads/1ab4d322-ad33-47ce-b765-091d8b14f781.png"
    },
    {
      title: "Executive Suites",
      description: "Spacious and elegantly furnished suites designed for ultimate comfort and relaxation. Each suite features a separate living area, premium king-sized beds with luxury linens, a work desk with ergonomic chair, high-definition smart TVs, custom bathroom amenities, and complimentary high-speed WiFi. The thoughtful design incorporates both modern convenience and classic elegance, with soundproofed walls ensuring a peaceful atmosphere throughout your stay.",
      imageSrc: "/lovable-uploads/1a1acbbc-64f6-44d1-8b5d-f0109e02f03e.png"
    },
    {
      title: "24/7 Power Supply",
      description: "Uninterrupted power supply through our integrated system of solar inverters, state-of-the-art generators and a dedicated transformer. Our eco-friendly power solution ensures that all hotel facilities operate seamlessly, with automatic switching between power sources that is virtually undetectable to guests. This reliable infrastructure powers everything from climate control systems to electronic door locks, providing peace of mind regardless of external power conditions.",
      imageSrc: "/lovable-uploads/253c3040-a0de-47cd-b074-06c86921d8e7.png"
    },
    {
      title: "Modern Fitness Center",
      description: "Stay fit during your stay with our fully-equipped gym featuring cardio machines, weight training equipment, and personal training options. The fitness center includes the latest Technogym equipment, dedicated areas for stretching and functional training, complimentary towel service, purified water station, and personal TV screens on each cardio machine. Professional trainers are available by appointment for customized workout programs and fitness assessments.",
      imageSrc: "/lovable-uploads/bbd7d628-218e-45e5-a2f6-5dd221ccc495.png"
    },
    {
      title: "Outdoor Recreation Area",
      description: "Enjoy our outdoor seating area with various entertainment options including a professional pool table and other games for your leisure. The beautifully landscaped space features comfortable lounge furniture, ambient lighting for evening relaxation, a covered gazebo area for shade during hot days, and multiple activity zones including table tennis and lawn chess. It's the perfect setting for casual gatherings or simply unwinding with a book from our reading collection.",
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

        {/* Grid Layout for Facilities */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {facilityItems.map((item, index) => (
                <React.Fragment key={index}>
                  {/* For even items: image on left, text on right */}
                  {index % 2 === 0 ? (
                    <>
                      <div className="bg-white overflow-hidden shadow-md h-64 md:h-72">
                        <AspectRatio ratio={4/3} className="h-full">
                          <img 
                            src={item.imageSrc} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>
                      </div>
                      <div className="bg-white p-6 flex flex-col justify-center shadow-md">
                        <div className="border-l-4 border-hotel-gold pl-4">
                          <h3 className="text-xl font-serif font-bold mb-3">{item.title}</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* For odd items: text on left, image on right */}
                      <div className="bg-white p-6 flex flex-col justify-center shadow-md">
                        <div className="border-l-4 border-hotel-gold pl-4">
                          <h3 className="text-xl font-serif font-bold mb-3">{item.title}</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                      <div className="bg-white overflow-hidden shadow-md h-64 md:h-72">
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
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-hotel-beige py-20">
          <div className="container mx-auto px-4">
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
