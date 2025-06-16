
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Users, 
  Award, 
  DoorClosed, 
  Bed
} from "lucide-react";
import { Room } from "@/types/supabase";

interface SuiteCardProps {
  suite: Room;
}

const SuiteCard = ({ suite }: SuiteCardProps) => {
  const navigate = useNavigate();
  
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

  // Helper function to determine if an image URL needs path transformation
  const getProcessedImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return '/placeholder.svg';
    
    // If it's a Supabase storage URL or external URL, use as-is
    if (imageUrl.includes('supabase') || imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // If it's a local lovable-uploads path, apply getImagePath transformation
    if (imageUrl.includes('lovable-uploads/')) {
      const imageName = imageUrl.split('lovable-uploads/')[1];
      return getImagePath(imageName);
    }
    // For any other case, try to extract filename and apply transformation
    const imageName = imageUrl.split('/').pop() || imageUrl;
    return getImagePath(imageName);
  };
  
  const handleBookNow = () => {
    navigate('/booking', { state: { roomType: `${suite.name} ${suite.room_number}`, roomPrice: suite.price_per_night } });
  };
  
  // Capitalize the suite name for display
  const displayName = `${suite.name.charAt(0).toUpperCase() + suite.name.slice(1)} ${suite.room_number}`;
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={getProcessedImageUrl(suite.image_url)} 
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-0 right-0 bg-hotel-gold text-white px-2 py-1 m-2 rounded-md text-xs font-medium">
          Suite
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-white font-bold text-lg">{displayName}</p>
          <p className="text-white/90 text-xs">₦{suite.price_per_night.toLocaleString()}/night</p>
        </div>
      </div>
      <CardHeader className="py-2 px-4">
        <CardTitle className="text-lg">{displayName}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs">
          <DoorClosed size={14} />
          <span>Capacity: {suite.capacity} guests</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow py-2 px-4">
        <p className="text-gray-700 mb-3 line-clamp-2 text-sm">{suite.description}</p>
        
        <div>
          <h4 className="text-xs font-medium mb-2 text-gray-700">Key Features</h4>
          <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>{suite.capacity} Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed size={12} />
              <span>Premium Bed</span>
            </div>
            <div className="flex items-center gap-1">
              <Award size={12} />
              <span>Premium</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 border-t pt-3 pb-3 px-4">
        <div className="text-hotel-gold font-bold text-center">
          ₦{suite.price_per_night.toLocaleString()}<span className="text-xs font-normal text-gray-500">/night</span>
        </div>
        <Button variant="hotel" size="sm" onClick={handleBookNow} className="w-full text-xs">Book Now</Button>
      </CardFooter>
    </Card>
  );
};

export default SuiteCard;
