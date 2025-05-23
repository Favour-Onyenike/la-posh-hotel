
import React from "react";
import { Star } from "lucide-react";
import { Review } from "@/types/supabase";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
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
        <div
          className="w-12 h-12 rounded-full bg-cover bg-center mr-4"
          style={{
            backgroundImage: `url(https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer_name)}&background=random)`,
          }}
        />
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
