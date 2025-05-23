
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const reviewSchema = z.object({
  reviewerName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  content: z.string().min(10, { message: "Review must be at least 10 characters." }),
  rating: z.number().min(1).max(5),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const ReviewForm: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      reviewerName: "",
      content: "",
      rating: 5,
    },
  });

  const handleStarClick = (newRating: number) => {
    setRating(newRating);
    form.setValue("rating", newRating);
  };

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("reviews").insert({
        reviewer_name: data.reviewerName,
        content: data.content,
        rating: data.rating,
      });
      
      if (error) throw error;
      
      toast({
        title: "Review submitted successfully!",
        description: "Thank you for sharing your feedback.",
      });
      
      form.reset();
      setRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Failed to submit review",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h3 className="text-2xl font-serif font-semibold text-hotel-navy mb-6">Share Your Experience</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="reviewerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          size={24}
                          className={`${
                            star <= rating
                              ? "text-hotel-gold fill-hotel-gold"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please share your experience with us..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            variant="hotel" 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ReviewForm;
