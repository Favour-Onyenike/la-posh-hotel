
import React from "react";
import { Star } from "lucide-react";
import { Review } from "@/types/supabase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  // Helper function to get the correct image path
  const getImagePath = (imageName: string) => {
    return `/lovable-uploads/${imageName}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Process image URL if it's a lovable-uploads path
  const processedImageUrl = review.image_url && review.image_url.includes('lovable-uploads/') 
    ? getImagePath(review.image_url.split('lovable-uploads/')[1])
    : review.image_url;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md h-full">
      <div className="flex text-hotel-gold mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={16} 
            className={star <= review.rating ? "fill-hotel-gold" : "text-gray-300"}
          />
        ))}
      </div>
      
      <p className="text-black mb-6 line-clamp-4">
        "{review.content}"
      </p>
      
      <div className="flex items-center">
        <Avatar className="w-12 h-12 mr-4">
          {processedImageUrl ? (
            <AvatarImage 
              src={processedImageUrl} 
              alt={`${review.reviewer_name}'s photo`}
            />
          ) : null}
          <AvatarFallback className="bg-hotel-gold text-white font-semibold">
            {getInitials(review.reviewer_name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-black">{review.reviewer_name}</h4>
          <p className="text-black text-sm">
            {new Date(review.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
