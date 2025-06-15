
import React from "react";

interface SuitesHeroProps {
  getImagePath: (imageName: string) => string;
}

const SuitesHero = ({ getImagePath }: SuitesHeroProps) => {
  return (
    <section
      className="py-20 md:py-28 lg:py-40 bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url('${getImagePath('e9be561a-1ed6-476f-aab8-fd04aaef0620.png')}')` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="hotel-container relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">Our Suites</h1>
          <p className="text-xl md:text-2xl text-white">
            Experience extraordinary luxury in our exclusive suites
          </p>
        </div>
      </div>
    </section>
  );
};

export default SuitesHero;
