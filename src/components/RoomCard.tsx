
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoomCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  imageUrl: string;
  features: string[];
  className?: string;
  onBookNow?: (roomId: string) => void;
}

const RoomCard = ({ 
  id, 
  name, 
  description, 
  price, 
  capacity, 
  imageUrl, 
  features, 
  className,
  onBookNow 
}: RoomCardProps) => {
  // Helper function to get proper image paths for GitHub Pages deployment
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

  // Process image URL to use getImagePath if it's a local upload
  const processImageUrl = (imageUrl: string) => {
    // If it's a lovable-uploads image, extract filename and use getImagePath
    if (imageUrl.includes('lovable-uploads/')) {
      const fileName = imageUrl.split('lovable-uploads/').pop();
      return fileName ? getImagePath(fileName) : imageUrl;
    }
    
    // If it's already a full URL (external or processed), use as is
    return imageUrl;
  };

  const handleBooking = () => {
    if (onBookNow) {
      onBookNow(id);
    }
  };

  return (
    <div className={cn("group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300", className)}>
      <div className="relative overflow-hidden">
        <img
          src={processImageUrl(imageUrl)}
          alt={name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
      </div>
      
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold mb-2 text-hotel-navy">{name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-hotel-gold">₦{price.toLocaleString()}</span>
          <span className="text-sm text-gray-500">per night</span>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Capacity: {capacity} guests</p>
          <div className="flex flex-wrap gap-2">
            {features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-hotel-beige text-hotel-navy text-xs rounded-full"
              >
                {feature}
              </span>
            ))}
            {features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{features.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <Button 
          variant="hotel" 
          className="w-full"
          onClick={handleBooking}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default RoomCard;
