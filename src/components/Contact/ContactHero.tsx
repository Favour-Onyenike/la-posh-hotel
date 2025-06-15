
import React from "react";
import { Star } from "lucide-react";

interface ContactHeroProps {
  getImagePath: (imageName: string) => string;
}

const ContactHero = ({ getImagePath }: ContactHeroProps) => {
  return (
    <section 
      className="py-24 md:py-32 lg:py-40 bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url('${getImagePath('e9be561a-1ed6-476f-aab8-fd04aaef0620.png')}')` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="hotel-container relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">Contact Us</h1>
          <p className="text-xl md:text-2xl text-white">
            We'd love to hear from you
          </p>
          <div className="flex justify-center gap-2 mt-8">
            <Star className="text-hotel-gold" size={24} />
            <Star className="text-hotel-gold" size={24} />
            <Star className="text-hotel-gold" size={24} />
            <Star className="text-hotel-gold" size={24} />
            <Star className="text-hotel-gold" size={24} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
