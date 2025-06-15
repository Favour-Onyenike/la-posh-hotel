
import React from "react";

const CounterBar = () => {
  // Helper function to get correct image path for GitHub Pages
  const getImagePath = (filename: string) => {
    const basePath = import.meta.env.MODE === 'production' ? '/la-posh-hotel' : '';
    return `${basePath}/lovable-uploads/${filename}`;
  };

  const stats = [
    { number: "500+", label: "Happy Guests", icon: "😊" },
    { number: "50+", label: "Luxury Rooms", icon: "🏨" },
    { number: "5", label: "Star Rating", icon: "⭐" },
    { number: "24/7", label: "Room Service", icon: "🛎️" }
  ];

  return (
    <section 
      className="py-20 bg-cover bg-center bg-fixed relative"
      style={{ 
        backgroundImage: `url('${getImagePath('b0b33b9b-6fb9-4d30-836e-20c55bc93064.png')}')` 
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="hotel-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center text-white animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-4xl mb-4">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-bold text-hotel-gold mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CounterBar;
