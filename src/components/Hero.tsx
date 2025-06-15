
import { Star, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  // Helper function to get correct image path for GitHub Pages
  const getImagePath = (filename: string) => {
    const basePath = import.meta.env.MODE === 'production' ? '/la-posh-hotel' : '';
    return `${basePath}/lovable-uploads/${filename}`;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('${getImagePath('bbd7d628-218e-45e5-a2f6-5dd221ccc495.png')}')` 
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
          Welcome to{" "}
          <span className="text-hotel-gold block mt-2">La Posh</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-in-delay-1">
          Experience luxury redefined at Lagos' most prestigious hotel
        </p>
        
        {/* Star Rating */}
        <div className="flex justify-center gap-2 mb-8 animate-fade-in-delay-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="text-hotel-gold fill-hotel-gold" size={24} />
          ))}
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-3">
          <Link to="/booking">
            <Button 
              size="lg" 
              className="bg-hotel-gold hover:bg-hotel-gold/90 text-white px-8 py-4 text-lg font-semibold w-full sm:w-auto"
            >
              Book Your Stay
            </Button>
          </Link>
          <Link to="/rooms">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-hotel-navy px-8 py-4 text-lg font-semibold w-full sm:w-auto"
            >
              Explore Rooms
            </Button>
          </Link>
        </div>
        
        {/* Quick Info */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm animate-fade-in-delay-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>Victoria Island, Lagos</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Open 24/7</span>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
