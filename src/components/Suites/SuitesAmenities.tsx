
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wifi, 
  Tv, 
  Bath, 
  AirVent, 
  Refrigerator,
  Utensils,
  Dumbbell,
  Sofa
} from "lucide-react";

const SuitesAmenities = () => {
  const amenities = [
    {
      icon: Wifi,
      title: "Ultra-Fast Wi-Fi",
      description: "Premium high-speed internet for all your devices"
    },
    {
      icon: AirVent,
      title: "Climate Control",
      description: "Personalized temperature settings"
    },
    {
      icon: Tv,
      title: "Large TVs",
      description: "60\"+ screens with streaming services"
    },
    {
      icon: Bath,
      title: "Premium Bathrooms",
      description: "Jacuzzi tubs and rainfall showers"
    },
    {
      icon: Refrigerator,
      title: "Refrigerator",
      description: "Full-sized with premium beverages and snacks"
    },
    {
      icon: Sofa,
      title: "Sitting Area",
      description: "Separate living space to relax and entertain"
    },
    {
      icon: Dumbbell,
      title: "Mini Gym Access",
      description: "Complimentary access to our premium fitness center"
    },
    {
      icon: Utensils,
      title: "Free Breakfast",
      description: "Complimentary gourmet breakfast included"
    }
  ];

  return (
    <section className="section-padding bg-white py-16">
      <div className="hotel-container">
        <div className="max-w-7xl mx-auto">
          <h2 className="hotel-title text-center mb-8">Premium Suite Amenities</h2>
          <p className="text-center mb-12 max-w-3xl mx-auto text-gray-700">
            All our suites feature these exclusive amenities designed to provide the ultimate luxury experience during your stay.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur">
                <CardContent className="flex items-start gap-4 p-6">
                  <amenity.icon className="text-hotel-gold" />
                  <div>
                    <h3 className="font-medium mb-1">{amenity.title}</h3>
                    <p className="text-sm text-gray-600">{amenity.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuitesAmenities;
