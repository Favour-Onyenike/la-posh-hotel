
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Gallery = () => {
  // All uploaded images for the gallery
  const galleryImages = [
    "/lovable-uploads/1a1acbbc-64f6-44d1-8b5d-f0109e02f03e.png",
    "/lovable-uploads/2041bcf9-cce4-478f-95c0-b002a66664b5.png",
    "/lovable-uploads/5554f5f5-c5dc-46b2-b735-61e278864872.png",
    "/lovable-uploads/9423b162-188e-46ac-a0ac-33fbdf219e2c.png",
    "/lovable-uploads/253c3040-a0de-47cd-b074-06c86921d8e7.png",
    "/lovable-uploads/d9d5cdb1-1c16-4557-8c64-39e713537d74.png",
    "/lovable-uploads/e9be561a-1ed6-476f-aab8-fd04aaef0620.png",
    "/lovable-uploads/b0b33b9b-6fb9-4d30-836e-20c55bc93064.png",
    "/lovable-uploads/bbd7d628-218e-45e5-a2f6-5dd221ccc495.png",
    "/lovable-uploads/bc6140b3-ddd4-4e67-a150-73a6930b623d.png",
    "/lovable-uploads/cee30f59-ce42-4cfa-ba4e-405a7c5339d1.png",
    "/lovable-uploads/8160dfdf-2bee-40e2-b129-c74aaea6a773.png"
  ];

  // Featured images for the carousel
  const featuredImages = galleryImages.slice(0, 5);

  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
        {/* Hero Section with Background Image - matching About page */}
        <section 
          className="py-24 md:py-32 lg:py-40 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: "url('/lovable-uploads/e9be561a-1ed6-476f-aab8-fd04aaef0620.png')" }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="hotel-container relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">Our Gallery</h1>
              <p className="text-xl md:text-2xl text-white">
                Experience the beauty of La Posh through our lens
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
        
        {/* Featured Carousel */}
        <section className="bg-white py-20">
          <div className="hotel-container max-w-6xl mx-auto">
            <div className="flex items-center mb-8">
              <div className="h-0.5 bg-hotel-gold w-12 mr-4"></div>
              <h2 className="hotel-subtitle text-black text-3xl uppercase font-bold">FEATURED SPACES</h2>
              <div className="h-0.5 bg-hotel-gold w-12 ml-4"></div>
            </div>
            
            <div className="mb-12">
              <Carousel className="w-full">
                <CarouselContent>
                  {featuredImages.map((image, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 aspect-[4/3]">
                          <img 
                            src={image} 
                            alt={`Featured image ${index + 1}`} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-1" />
                <CarouselNext className="right-1" />
              </Carousel>
            </div>
          </div>
        </section>
        
        {/* Main Gallery Grid */}
        <section className="bg-gray-50 py-16">
          <div className="hotel-container max-w-6xl mx-auto">
            <div className="flex items-center mb-12">
              <div className="h-0.5 bg-hotel-gold w-12 mr-4"></div>
              <h2 className="hotel-subtitle text-black text-3xl uppercase font-bold">PHOTO GALLERY</h2>
              <div className="h-0.5 bg-hotel-gold w-12 ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <div 
                  key={index}
                  className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group h-64"
                >
                  <img 
                    src={image} 
                    alt={`Gallery image ${index + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-hotel-beige py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="hotel-title mb-6">Experience La Posh in Person</h2>
            <p className="text-lg mb-8 text-gray-700 max-w-2xl mx-auto">
              These images only offer a glimpse of the luxury and comfort that awaits you at La Posh Signature Hotel & Suites. Book your stay today to experience it firsthand.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Gallery;
