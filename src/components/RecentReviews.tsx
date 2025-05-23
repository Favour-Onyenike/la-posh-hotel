
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Review } from "@/types/supabase";
import ReviewCard from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fetchRecentReviews = async (): Promise<Review[]> => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews");
  }

  return data || [];
};

const RecentReviews: React.FC = () => {
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ["recentReviews"],
    queryFn: fetchRecentReviews,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-8 rounded-lg shadow-md animate-pulse h-64">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-6"></div>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mt-2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !reviews || reviews.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-gray-600 mb-6">No reviews available yet. Be the first to share your experience!</p>
        <Link to="/add-review">
          <Button variant="hotel">Write a Review</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default RecentReviews;
