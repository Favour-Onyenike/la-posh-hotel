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
  Bath, 
  AirVent, 
  Clock,
  Utensils
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Room classifications data
const roomCategories = [
  {
    type: "Room",
    name: "Opal",
    count: 2,
    image: "/lovable-uploads/1a1acbbc-64f6-44d1-8b5d-f0109e02f03e.png",
    description: "Comfortable rooms offering essential amenities with elegant designs.",
    price: 35000,
    roomNumbers: ["Opal 01", "Opal 02"],
    amenities: ["Free Wi-Fi", "TV", "Private Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "Queen",
    size: "24 sq.m",
    features: ["Daily Housekeeping", "Room Service Available", "In-room Safe"]
  },
  {
    type: "Room",
    name: "Topaz",
    count: 3,
    image: "/lovable-uploads/1ab4d322-ad33-47ce-b765-091d8b14f781.png",
    description: "Spacious rooms with enhanced comfort and modern furnishings.",
    price: 40000,
    roomNumbers: ["Topaz 01", "Topaz 02", "Topaz 03"],
    amenities: ["High-Speed Wi-Fi", "43\" TV", "Premium Coffee Maker", "Spacious Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "Queen",
    size: "28 sq.m",
    features: ["Daily Housekeeping", "24-hour Room Service", "In-room Safe", "Work Desk"]
  },
  {
    type: "Room",
    name: "Onyx",
    count: 5,
    image: "/lovable-uploads/bc6140b3-ddd4-4e67-a150-73a6930b623d.png",
    description: "Elegant rooms featuring premium amenities and sophisticated decor.",
    price: 45000,
    roomNumbers: ["Onyx 01", "Onyx 02", "Onyx 03", "Onyx 04", "Onyx 05"],
    amenities: ["High-Speed Wi-Fi", "50\" TV", "Nespresso Machine", "Luxury Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    size: "32 sq.m",
    features: ["Turn-down Service", "24-hour Room Service", "Electronic Safe", "Work Desk"]
  },
  {
    type: "Room",
    name: "Ivory",
    count: 6,
    image: "/lovable-uploads/247043c1-0231-4f7a-b19e-6f0273dcc58b.png",
    description: "Bright and airy rooms with luxurious touches and ample space.",
    price: 42000,
    roomNumbers: ["Ivory 01", "Ivory 02", "Ivory 03", "Ivory 04", "Ivory 05", "Ivory 06"],
    amenities: ["High-Speed Wi-Fi", "48\" TV", "Premium Coffee Maker", "Spacious Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King/Twin",
    size: "30 sq.m",
    features: ["Daily Housekeeping", "24-hour Room Service", "In-room Safe", "Ergonomic Work Area"]
  },
  {
    type: "Room",
    name: "Amber",
    count: 5,
    image: "/lovable-uploads/8625d04c-54ec-4d6c-83b7-3a1081dac086.png",
    description: "Warm and inviting executive rooms with premium bedding and stylish furnishings.",
    price: 48000,
    roomNumbers: ["Amber 01", "Amber 02", "Amber 03", "Amber 04", "Amber 05"],
    amenities: ["High-Speed Wi-Fi", "50\" TV", "Nespresso Machine", "Marble Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    size: "34 sq.m",
    features: ["Turn-down Service", "24-hour Room Service", "Digital Safe", "Work Desk", "Mini Gym Access"]
  },
  {
    type: "Room",
    name: "Emerald",
    count: 2,
    image: "/lovable-uploads/84758c2a-d279-4a63-ba5d-9df205cdec90.png",
    description: "Mini suite offering exceptional comfort and luxury amenities.",
    price: 50000,
    roomNumbers: ["Emerald 01", "Emerald 02"],
    amenities: ["High-Speed Wi-Fi", "55\" TV", "Nespresso Machine", "Luxury Bathroom with Rain Shower", "Air Conditioning", "Mini Refrigerator", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    size: "36 sq.m",
    features: ["Turn-down Service", "24-hour Room Service", "Electronic Safe", "Executive Work Desk", "Mini Gym Access"]
  },
  {
    type: "Room",
    name: "Beryl",
    count: 1,
    image: "/lovable-uploads/4768b213-3554-45db-b44b-86f04c720eae.png",
    description: "Exclusive single room with premium features and personalized service.",
    price: 55000,
    roomNumbers: ["Beryl 01"],
    amenities: ["High-Speed Wi-Fi", "55\" TV", "Nespresso Machine", "Luxury Bathroom with Soaking Tub", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    size: "40 sq.m",
    features: ["Personalized Turn-down Service", "Priority Room Service", "Electronic Safe", "Executive Work Area", "Free Breakfast"]
  }
];

const RoomCard = ({ category }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
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
      <CardHeader className="py-3">
        <CardTitle className="flex justify-between items-center">
          <span>{category.name}</span>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <DoorClosed size={16} />
          <span>{category.count} {category.count > 1 ? 'units' : 'unit'} ({category.roomNumbers.join(", ")})</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow py-2">
        <p className="text-gray-700 mb-3 line-clamp-2">{category.description}</p>
        
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Key Features</h4>
          <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{category.maxGuests} Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed size={16} />
              <span>{category.bedType}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>24h Check-in</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-3 pb-3">
        <div className="text-hotel-gold font-bold">
          ₦{category.price.toLocaleString()}<span className="text-sm font-normal text-gray-500">/night</span>
        </div>
        <Link to="/booking">
          <Button variant="hotel" size="sm">Book Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const Rooms = () => {
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
              <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">Our Rooms</h1>
              <p className="text-xl md:text-2xl text-white">
                Comfortable accommodations designed for your relaxation
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
                  At La Posh Signature Hotel & Suites, we offer a variety of luxurious rooms 
                  designed to provide comfort and elegance during your stay.
                </p>
                <p className="text-black text-lg leading-relaxed">
                  Each room is meticulously maintained and furnished with modern amenities 
                  to ensure a memorable experience.
                </p>
              </div>
              <div className="flex justify-center">
                <Link to="/suites">
                  <Button variant="outline" className="border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-white">
                    View Our Premium Suites
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Rooms Section */}
        <section className="section-padding bg-hotel-beige py-16">
          <div className="hotel-container">
            <div className="max-w-7xl mx-auto">
              <h2 className="hotel-title text-center mb-12">Our Luxurious Rooms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roomCategories.map((category, index) => (
                  <RoomCard key={index} category={category} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section className="section-padding bg-white py-16">
          <div className="hotel-container">
            <div className="max-w-7xl mx-auto">
              <h2 className="hotel-title text-center mb-8">Standard Room Amenities</h2>
              <p className="text-center mb-12 max-w-3xl mx-auto text-gray-700">
                Every room at La Posh Signature Hotel & Suites comes equipped with these standard amenities
                to ensure your comfort and convenience.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Wifi className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Wi-Fi Access</h3>
                      <p className="text-sm text-gray-600">Complimentary internet access throughout your stay</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <AirVent className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Air Conditioning</h3>
                      <p className="text-sm text-gray-600">Individually controlled climate system</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Tv className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">TV</h3>
                      <p className="text-sm text-gray-600">Flat-screen television with satellite channels</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Bath className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Luxury Bathroom</h3>
                      <p className="text-sm text-gray-600">Premium bath amenities and plush towels</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Utensils className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Free Breakfast</h3>
                      <p className="text-sm text-gray-600">Complimentary breakfast included with all rooms</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="flex items-start gap-4 p-6">
                    <Clock className="text-hotel-gold" />
                    <div>
                      <h3 className="font-medium mb-1">Room Service</h3>
                      <p className="text-sm text-gray-600">Available daily from 6:00 AM to 11:00 PM</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold mb-4">Executive & Premium Rooms</h3>
                <p className="text-gray-700 mb-6">
                  Our Amber and Emerald rooms include additional amenities:
                </p>
                <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
                  <Badge variant="outline" className="bg-gray-50 px-3 py-1">Mini Gym Access</Badge>
                  <Badge variant="outline" className="bg-gray-50 px-3 py-1">Mini Refrigerator (Emerald only)</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-white py-16">
          <div className="hotel-container">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="hotel-title mb-6">Ready to Experience Comfort?</h2>
              <p className="text-lg mb-8 text-gray-700 max-w-3xl mx-auto">
                Book your stay today and enjoy our comfortable accommodations, impeccable service, 
                and the perfect blend of comfort and elegance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/booking">
                  <Button 
                    variant="hotel" 
                    size="lg" 
                    className="font-medium"
                  >
                    Book Your Room Now
                  </Button>
                </Link>
                <Link to="/suites">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="font-medium border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-white"
                  >
                    Explore Our Suites
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Rooms;
