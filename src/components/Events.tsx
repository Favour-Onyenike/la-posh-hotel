
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EventCard from "./EventCard";

const Events = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="section-padding bg-white">
      <div className="hotel-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="hotel-title text-black mb-4">Upcoming Events</h2>
          <p className="text-black">
            Join us for exciting events and experiences at La-Posh Signature Hotel & Suites
          </p>
        </div>

        {isLoading ? (
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No upcoming events at the moment</p>
            <p className="text-gray-400">Check back soon for exciting new events and experiences!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
