
import React from 'react';

const BookingHero = () => {
  return (
    <section 
      className="py-32 md:py-40 lg:py-48 bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: "url('/lovable-uploads/a81671e7-269b-44f3-acfe-e0bf98da4d45.png')" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="hotel-container relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">Book Your Stay</h1>
          <p className="text-xl md:text-2xl text-white">
            Choose from our selection of rooms and suites
          </p>
        </div>
      </div>
    </section>
  );
};

export default BookingHero;
