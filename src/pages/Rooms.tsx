
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoomsHero from "@/components/Rooms/RoomsHero";
import RoomsIntroduction from "@/components/Rooms/RoomsIntroduction";
import RoomsAmenities from "@/components/Rooms/RoomsAmenities";
import RoomsCTA from "@/components/Rooms/RoomsCTA";
import RoomsLoading from "@/components/Rooms/RoomsLoading";
import RoomsGrid from "@/components/Rooms/RoomsGrid";
import { useRooms } from "@/hooks/useRooms";
import { getImagePath } from "@/utils/imageUtils";

const Rooms = () => {
  const { rooms, loading } = useRooms();
  
  if (loading) {
    return <RoomsLoading />;
  }
  
  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
        <RoomsHero getImagePath={getImagePath} />
        <RoomsIntroduction />

        {/* Rooms Section */}
        <section className="section-padding bg-hotel-beige py-16">
          <div className="hotel-container">
            <div className="max-w-7xl mx-auto">
              <h2 className="hotel-title text-center mb-12">Our Luxurious Rooms</h2>
              <RoomsGrid rooms={rooms} />
            </div>
          </div>
        </section>

        <RoomsAmenities />
        <RoomsCTA />
      </div>
      <Footer />
    </>
  );
};

export default Rooms;
