
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Bed, 
  Users, 
  Award, 
  DoorClosed, 
  Wifi, 
  Tv, 
  Coffee, 
  Bath, 
  AirVent, 
  Refrigerator, 
  Clock,
  Utensils
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Suite classifications data
const suiteCategories = [
  {
    type: "Suite",
    name: "Diamond",
    count: 2,
    image: "/lovable-uploads/7d3b8634-80e9-4dc1-ba22-be8f76121c97.png",
    description: "Luxurious suites with separate living areas and premium amenities.",
    price: 85000,
    roomNumbers: ["Diamond 01", "Diamond 02"],
    amenities: ["Ultra-Fast Wi-Fi", "65\" Smart TV", "Full Kitchenette", "Luxury Bathroom with Jacuzzi", "Smart Climate Control", "Premium Mini Bar", "Dining Area"],
    maxGuests: 4,
    bedType: "King",
    size: "70 sq.m",
    features: ["Dedicated Butler Service", "Private Dining Options", "Electronic Safe", "Executive Work Area", "Separate Living Room", "Complimentary Breakfast", "Evening Turndown Service"]
  },
  {
    type: "Suite",
    name: "Sapphire",
    count: 2,
    image: "/lovable-uploads/bbd7d628-218e-45e5-a2f6-5dd221ccc495.png",
    description: "Elegant suites featuring sophisticated design and premium services.",
    price: 80000,
    roomNumbers: ["Sapphire 01", "Sapphire 02"],
    amenities: ["Ultra-Fast Wi-Fi", "60\" Smart TV", "Kitchenette", "Luxury Bathroom with Walk-in Shower", "Smart Climate Control", "Premium Mini Bar"],
    maxGuests: 3,
    bedType: "King",
    size: "65 sq.m",
    features: ["Butler Service on Request", "In-Suite Dining", "Electronic Safe", "Work Area", "Separate Living Room", "Complimentary Breakfast"]
  },
  {
    type: "Suite",
    name: "Emerald",
    count: 1,
    image: "/lovable-uploads/c5b0e6f8-b1da-4fc2-ae09-35e930422a81.png",
    description: "Mini suite offering luxurious comfort in a compact yet elegant space.",
    price: 65000,
    roomNumbers: ["Emerald 01"],
    amenities: ["High-Speed Wi-Fi", "55\" Smart TV", "Coffee and Tea Bar", "Luxury Bathroom", "Climate Control", "Mini Bar"],
    maxGuests: 2,
    bedType: "King",
    size: "45 sq.m",
    features: ["24-hour Room Service", "Electronic Safe", "Work Desk", "Seating Area", "Complimentary Breakfast"]
  },
  {
    type: "Suite",
    name: "Gold",
    count: 2,
    image: "/lovable-uploads/8625d04c-54ec-4d6c-83b7-3a1081dac086.png",
    description: "Premium suites with opulent furnishings and expansive living areas.",
    price: 75000,
    roomNumbers: ["Gold 01", "Gold 02"],
    amenities: ["Ultra-Fast Wi-Fi", "60\" Smart TV", "Kitchenette", "Marble Bathroom with Dual Sinks", "Smart Climate Control", "Premium Mini Bar", "Dining Area"],
    maxGuests: 3,
    bedType: "King",
    size: "60 sq.m",
    features: ["Butler Service on Request", "In-Suite Dining", "Electronic Safe", "Work Area", "Separate Living Room", "Complimentary Breakfast"]
  },
  {
    type: "Suite",
    name: "Pearl",
    count: 1,
    image: "/lovable-uploads/28419863-c4a4-4fb6-a14e-c864333d1966.png",
    description: "Exclusive suite offering the ultimate in luxury and personalized service.",
    price: 90000,
    roomNumbers: ["Pearl 01"],
    amenities: ["Ultra-Fast Wi-Fi", "75\" Smart TV", "Full Kitchenette", "Luxury Bathroom with Jacuzzi and Steam Shower", "Smart Climate Control", "Premium Stocked Bar", "Dining Area"],
    maxGuests: 4,
    bedType: "Emperor King",
    size: "85 sq.m",
    features: ["Dedicated 24/7 Butler Service", "Private Chef Available", "Electronic Safe", "Executive Office Area", "Separate Living Room", "Complimentary Breakfast and Evening Canapés", "Airport Transfer"]
  },
  {
    type: "Suite",
    name: "Ruby",
    count: 3,
    image: "/lovable-uploads/cee30f59-ce42-4cfa-ba4e-405a7c5339d1.png",
    description: "Double bed suites perfect for couples or families, with deluxe amenities.",
    price: 70000,
    roomNumbers: ["Ruby 01", "Ruby 02", "Ruby 03"],
    amenities: ["High-Speed Wi-Fi", "55\" Smart TV", "Kitchenette", "Luxury Bathroom", "Climate Control", "Mini Bar"],
    maxGuests: 4,
    bedType: "Two Queen Beds",
    size: "55 sq.m",
    features: ["24-hour Room Service", "Electronic Safe", "Work Desk", "Seating Area", "Complimentary Breakfast"]
  }
];

const SuiteCard = ({ category }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={category.image} 
          alt={`${category.name} ${category.type}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-0 right-0 bg-hotel-gold text-white px-3 py-1 m-2 rounded-md text-sm font-medium">
          {category.type}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white font-bold text-xl">{category.name}</p>
          <p className="text-white/90 text-sm">₦{category.price.toLocaleString()}/night</p>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{category.name}</span>
          <Badge variant="hotel" className="bg-hotel-gold/10 text-hotel-gold border-hotel-gold">
            {category.size}
          </Badge>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <DoorClosed size={16} />
          <span>{category.count} {category.count > 1 ? 'units' : 'unit'} ({category.roomNumbers.join(", ")})</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-700 mb-4">{category.description}</p>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-gray-700">Key Features</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>Up to {category.maxGuests} Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed size={16} />
              <span>{category.bedType}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>24h Check-in</span>
            </div>
            <div className="flex items-center gap-1">
              <Award size={16} />
              <span>Premium</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {category.amenities.slice(0, 6).map((amenity, index) => (
              <Badge key={index} variant="outline" className="bg-gray-50">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="text-hotel-gold font-bold">
          ₦{category.price.toLocaleString()}<span className="text-sm font-normal text-gray-500">/night</span>
        </div>
        <Button variant="hotel" onClick={() => window.scrollTo(0, 0)}>Book Now</Button>
      </CardFooter>
    </Card>
  );
};

const Suites = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
        {/* Hero Section */}
        <section
          className="py-20 md:py-28 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: "url('/lovable-uploads/e9be561a-1ed6-476f-aab8-fd04aaef0620.png')" }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="hotel-container relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">Our Premium Suites</h1>
              <p className="text-xl md:text-2xl text-white">
                Experience extraordinary luxury in our exclusive suites
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="section-padding bg-white py-16">
          <div className="hotel-container">
            <div className="max-w-6xl mx-auto">
              <div className="prose prose-lg max-w-none text-center mb-12">
                <p className="mb-6 text-black text-lg leading-relaxed">
                  Our suites offer the ultimate in luxury and comfort, featuring separate living areas,
                  premium amenities, and personalized service to make your stay truly memorable.
                </p>
                <p className="text-black text-lg leading-relaxed">
                  Each suite is meticulously designed to provide a sophisticated atmosphere
                  where you can unwind in style and elegance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Suites Section */}
        <section className="section-padding bg-hotel-beige py-16">
          <div className="hotel-container">
            <div className="max-w-7xl mx-auto">
              <h2 className="hotel-title text-center mb-12">Available Suites</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {suiteCategories.map((category, index) => (
                  <SuiteCard key={index} category={category} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section className="section-padding bg-white py-16">
          <div className="hotel-container">
            <div className="max-w-7xl mx-auto">
              <h2 className="hotel-title text-center mb-8">Premium Suite Amenities</h2>
              <p className="text-center mb-12 max-w-3xl mx-auto text-gray-700">
                Our suites feature exclusive amenities designed to provide the ultimate luxury experience during your stay.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Wifi className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Ultra-Fast Wi-Fi</h3>
                      <p className="text-sm text-gray-600">Premium high-speed internet for all your devices</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Tv className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Large Smart TVs</h3>
                      <p className="text-sm text-gray-600">60"+ screens with streaming services</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <AirVent className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Smart Climate Control</h3>
                      <p className="text-sm text-gray-600">Personalized temperature settings</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Bath className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Premium Bathrooms</h3>
                      <p className="text-sm text-gray-600">Jacuzzi tubs and rainfall showers</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Coffee className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Gourmet Coffee & Tea</h3>
                      <p className="text-sm text-gray-600">Premium brewing equipment and selections</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Refrigerator className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Stocked Mini Bar</h3>
                      <p className="text-sm text-gray-600">Premium beverages and snacks</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Award className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Butler Service</h3>
                      <p className="text-sm text-gray-600">Personalized attention to your needs</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Utensils className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">In-Suite Dining</h3>
                      <p className="text-sm text-gray-600">Exclusive menu options delivered to your suite</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-white py-16">
          <div className="hotel-container">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="hotel-title mb-6">Experience Unparalleled Luxury</h2>
              <p className="text-lg mb-8 text-gray-700 max-w-3xl mx-auto">
                Book your suite today and indulge in the finest accommodations La Posh Signature Hotel has to offer.
                Enjoy spacious living areas, premium amenities, and personalized service.
              </p>
              <Button 
                variant="hotel" 
                size="lg" 
                className="font-medium"
                onClick={() => window.scrollTo(0, 0)}
              >
                Book Your Suite Now
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Suites;
