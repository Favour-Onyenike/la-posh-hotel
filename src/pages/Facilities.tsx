
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, Wifi, Car, Utensils, Dumbbell, TreePine, Zap } from "lucide-react";

const Facilities = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Helper function to get proper image paths for both production and development (GitHub Pages or local)
  const getImagePath = (imageName: string) => {
    // Check for deployment on GitHub Pages
    const isGitHubPages = window.location.pathname.startsWith("/la-posh-hotel");
    // Also check for Vite's production flag for Netlify/static hosting too
    const isProduction = import.meta.env.PROD;
    // Prefer GitHub Pages detection if possible, fallback to PROD for Netlify/etc.
    if (isGitHubPages || isProduction) {
      return `/la-posh-hotel/lovable-uploads/${imageName}`;
    }
    return `/lovable-uploads/${imageName}`;
  };

  // Updated facility items to use getImagePath for every image
  const facilityItems = [
    {
      title: "Restaurant",
      description: "Experience exquisite cuisine at our in-house restaurant offering a blend of local delicacies and international dishes prepared by our expert chefs.",
      imageSrc: getImagePath("5554f5f5-c5dc-46b2-b735-61e278864872.png"),
      icon: Utensils,
      highlights: ["Local & International Cuisine", "Expert Chefs", "Indoor & Outdoor Seating"]
    },
    {
      title: "Executive Rooms",
      description: "Spacious and elegantly furnished suites designed for ultimate comfort and relaxation with premium amenities.",
      imageSrc: getImagePath("1a1acbbc-64f6-44d1-8b5d-f0109e02f03e.png"),
      icon: Wifi,
      highlights: ["King-sized Beds", "Smart TVs", "High-speed WiFi"]
    },
    {
      title: "24/7 Power Supply",
      description: "Uninterrupted power supply through our integrated system of solar inverters, generators and dedicated transformer.",
      images: [
        getImagePath("4b378e2a-6b29-4ca9-840f-1194616c3122.png"),
        getImagePath("750be932-e523-4fd3-8d6e-06fa37dee2da.png"),
        getImagePath("cdc64932-b3d2-496e-b080-581c173c3a89.png")
      ],
      icon: Zap,
      highlights: ["Solar Powered", "Backup Generators", "Eco-friendly Solution"]
    },
    {
      title: "Fitness Center",
      description: "Stay fit during your stay with our well-equipped gym featuring cardio machines, free weights, and training equipment.",
      imageSrc: getImagePath("d9d5cdb1-1c16-4557-8c64-39e713537d74.png"),
      icon: Dumbbell,
      highlights: ["Cardio Equipment", "Free Weights", "Fresh Towels Available"]
    },
    {
      title: "Outdoor Recreation Area",
      description: "Enjoy our outdoor seating area with entertainment options including pool table and various games for leisure.",
      imageSrc: getImagePath("9423b162-188e-46ac-a0ac-33fbdf219e2c.png"),
      icon: TreePine,
      highlights: ["Pool Table", "Outdoor Seating", "Multiple Game Options"]
    }
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <div className="pt-20 pb-16">
        {/* Hero Section - Reduced height for mobile */}
        <section 
          className="py-16 md:py-32 lg:py-40 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: `url('${getImagePath('e9be561a-1ed6-476f-aab8-fd04aaef0620.png')}')` }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="hotel-container relative z-10">
            <div className="max-w-6xl mx-auto text-center animate-fade-in px-4">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-serif">Our Facilities</h1>
              <p className="text-lg md:text-xl text-white mb-6">
                Luxury amenities for an unforgettable stay
              </p>
              <div className="flex justify-center gap-1 mt-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-hotel-gold fill-hotel-gold" size={20} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Introduction - More compact for mobile */}
        <section className="bg-white py-12 md:py-20">
          <div className="hotel-container">
            <div className="max-w-4xl mx-auto text-center px-4">              
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-black">Premium Amenities</h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                At La Posh Signature Hotel & Suites, we pride ourselves on offering a comprehensive range of 
                premium facilities designed to enhance your stay.
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                Every amenity has been carefully crafted to exceed your expectations and create memorable experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Mobile-First Facilities Layout */}
        <section className="bg-gray-50 py-8 md:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="space-y-6 md:space-y-8">
              {facilityItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    {/* Mobile Layout - Optimized for touch and readability */}
                    <div className="md:hidden">
                      {/* Image or Carousel with better aspect ratio for mobile */}
                      <div className="relative h-48">
                        {item.images ? (
                          <Carousel className="w-full h-full">
                            <CarouselContent>
                              {item.images.map((image, imgIndex) => (
                                <CarouselItem key={imgIndex}>
                                  <img 
                                    src={image} 
                                    alt={`${item.title} ${imgIndex + 1}`} 
                                    className="w-full h-48 object-cover"
                                  />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                          </Carousel>
                        ) : (
                          <img 
                            src={item.imageSrc} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                          />
                        )}
                        {/* Icon overlay */}
                        <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full">
                          <IconComponent className="text-hotel-gold" size={20} />
                        </div>
                      </div>
                      
                      {/* Content with better spacing */}
                      <div className="p-6">
                        <h3 className="text-xl font-serif font-bold mb-3 text-black">{item.title}</h3>
                        <p className="text-gray-700 text-sm leading-relaxed mb-4">{item.description}</p>
                        
                        {/* Highlights for mobile */}
                        <div className="space-y-2">
                          {item.highlights.map((highlight, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600">
                              <div className="w-2 h-2 bg-hotel-gold rounded-full mr-3 flex-shrink-0"></div>
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout - Keep existing alternating design */}
                    <div className="hidden md:grid md:grid-cols-2">
                      {index % 2 === 0 ? (
                        <>
                          <div className="h-64 md:h-72">
                            {item.images ? (
                              <Carousel className="w-full h-full">
                                <CarouselContent>
                                  {item.images.map((image, imgIndex) => (
                                    <CarouselItem key={imgIndex}>
                                      <img 
                                        src={image} 
                                        alt={`${item.title} ${imgIndex + 1}`} 
                                        className="w-full h-64 md:h-72 object-cover"
                                      />
                                    </CarouselItem>
                                  ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-2" />
                                <CarouselNext className="right-2" />
                              </Carousel>
                            ) : (
                              <img 
                                src={item.imageSrc} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="p-8 flex flex-col justify-center">
                            <div className="flex items-center mb-4">
                              <IconComponent className="text-hotel-gold mr-3" size={24} />
                              <h3 className="text-2xl font-serif font-bold text-black">{item.title}</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">{item.description}</p>
                            <div className="space-y-2">
                              {item.highlights.map((highlight, idx) => (
                                <div key={idx} className="flex items-center text-gray-600">
                                  <div className="w-2 h-2 bg-hotel-gold rounded-full mr-3 flex-shrink-0"></div>
                                  <span>{highlight}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-8 flex flex-col justify-center">
                            <div className="flex items-center mb-4">
                              <IconComponent className="text-hotel-gold mr-3" size={24} />
                              <h3 className="text-2xl font-serif font-bold text-black">{item.title}</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">{item.description}</p>
                            <div className="space-y-2">
                              {item.highlights.map((highlight, idx) => (
                                <div key={idx} className="flex items-center text-gray-600">
                                  <div className="w-2 h-2 bg-hotel-gold rounded-full mr-3 flex-shrink-0"></div>
                                  <span>{highlight}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="h-64 md:h-72">
                            {item.images ? (
                              <Carousel className="w-full h-full">
                                <CarouselContent>
                                  {item.images.map((image, imgIndex) => (
                                    <CarouselItem key={imgIndex}>
                                      <img 
                                        src={image} 
                                        alt={`${item.title} ${imgIndex + 1}`} 
                                        className="w-full h-64 md:h-72 object-cover"
                                      />
                                    </CarouselItem>
                                  ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-2" />
                                <CarouselNext className="right-2" />
                              </Carousel>
                            ) : (
                              <img 
                                src={item.imageSrc} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section - More compact for mobile */}
        <section className="bg-hotel-beige py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 md:mb-6">Experience Luxury at La Posh</h2>
              <p className="text-base md:text-lg mb-6 md:mb-8 text-gray-700">
                Indulge in our world-class facilities and impeccable service. Book your stay today and 
                discover the epitome of luxury and comfort.
              </p>
              <Button variant="hotel" size="lg" className="font-medium px-8 py-3">
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
