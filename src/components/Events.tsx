
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

  if (isLoading) {
    return (
      <section className="section-padding bg-white">
        <div className="hotel-container">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-white">
      <div className="hotel-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="hotel-title text-black mb-4">Upcoming Events</h2>
          <p className="text-black">
            Join us for exciting events and experiences at La-Posh Signature Hotel & Suites
          </p>
        </div>

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
      </div>
    </section>
  );
};

export default Events;
