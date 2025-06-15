
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import EventCard from "@/components/EventCard";
import { format } from "date-fns";

type Event = Database["public"]["Tables"]["events"]["Row"];

const fetchEvents = async (): Promise<Event[]> => {
  console.log("Fetching events...");
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })
    .limit(6);

  if (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }

  console.log("Events fetched:", data);
  return data || [];
};

const Events: React.FC = () => {
  // Helper function to get the correct image path for production
  const getImagePath = (imageName: string) => {
    const isProduction = import.meta.env.PROD;
    return isProduction ? `/la-posh-hotel/lovable-uploads/${imageName}` : `/lovable-uploads/${imageName}`;
  };

  const { data: events, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Default events for when database is empty or unavailable
  const defaultEvents = [
    {
      id: "1",
      title: "Wine Tasting Evening",
      description: "Join us for an exclusive wine tasting experience featuring premium selections from around the world.",
      event_date: "2024-07-15T19:00:00",
      image_url: getImagePath("bbd7d628-218e-45e5-a2f6-5dd221ccc495.png")
    },
    {
      id: "2", 
      title: "Cultural Heritage Festival",
      description: "Celebrate local culture with traditional performances, authentic cuisine, and artistic exhibitions.",
      event_date: "2024-07-20T18:30:00",
      image_url: getImagePath("e9be561a-1ed6-476f-aab8-fd04aaef0620.png")
    },
    {
      id: "3",
      title: "Sunset Jazz Performance",
      description: "Enjoy smooth jazz melodies as the sun sets over our beautiful terrace.",
      event_date: "2024-07-25T18:00:00", 
      image_url: getImagePath("2041bcf9-cce4-478f-95c0-b002a66664b5.png")
    }
  ];

  if (isLoading) {
    return (
      <section className="section-padding bg-hotel-beige">
        <div className="hotel-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="hotel-title text-black mb-4">Upcoming Events</h2>
            <p className="text-black">
              Discover exciting events and experiences at La-posh Signature Suites
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Use database events if available, otherwise show default events
  const eventsToShow = events && events.length > 0 ? events : defaultEvents;

  if (error && (!events || events.length === 0)) {
    console.error("Events error:", error);
  }

  return (
    <section className="section-padding bg-hotel-beige">
      <div className="hotel-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="hotel-title text-black mb-4">Upcoming Events</h2>
          <p className="text-black">
            Discover exciting events and experiences at La-posh Signature Suites
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsToShow.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              description={event.description}
              eventDate={event.event_date}
              imageUrl={event.image_url}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
