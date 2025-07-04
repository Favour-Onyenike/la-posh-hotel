
import React from "react";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  id: string;
  title: string;
  description: string | null;
  eventDate: string;
  imageUrl: string | null;
}

const EventCard = ({ title, description, eventDate, imageUrl }: EventCardProps) => {
  // Helper function to get the correct image path for production
  const getImagePath = (imageName: string) => {
    const isProduction = import.meta.env.PROD;
    return isProduction ? `/la-posh-hotel/lovable-uploads/${imageName}` : `/lovable-uploads/${imageName}`;
  };

  const eventDateTime = new Date(eventDate);
  const formattedDate = format(eventDateTime, "MMM dd, yyyy");
  const formattedTime = format(eventDateTime, "h:mm a");

  // Process image URL if it's a lovable-uploads path
  const processedImageUrl = imageUrl && imageUrl.includes('lovable-uploads/') 
    ? getImagePath(imageUrl.split('lovable-uploads/')[1])
    : imageUrl || "/placeholder.svg";

  return (
    <div className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 max-w-sm mx-auto">
      <div className="relative overflow-hidden">
        <img
          src={processedImageUrl}
          alt={title}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
      </div>
      
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold mb-3 text-hotel-navy line-clamp-2">{title}</h3>
        
        <div className="flex flex-col gap-3 mb-4 text-hotel-gold">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span className="text-sm font-medium">{formattedTime}</span>
          </div>
        </div>
        
        {description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{description}</p>
        )}
      </div>
    </div>
  );
};

export default EventCard;
