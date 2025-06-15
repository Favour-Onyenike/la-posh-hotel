
import React from 'react';

interface RoomsHeroProps {
  getImagePath: (imageName: string) => string;
}

const RoomsHero = ({ getImagePath }: RoomsHeroProps) => {
  return (
    <section
      className="py-20 md:py-28 bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url('${getImagePath('e9be561a-1ed6-476f-aab8-fd04aaef0620.png')}')` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="hotel-container relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">Our Rooms</h1>
          <p className="text-xl md:text-2xl text-white">
            Comfortable accommodations designed for your relaxation
          </p>
        </div>
      </div>
    </section>
  );
};

export default RoomsHero;
