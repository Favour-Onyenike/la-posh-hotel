
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
  Utensils,
  Calendar as CalendarIcon,
  Filter,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, addDays, isWithinInterval, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

// Room data
const rooms = [
  {
    id: "opal-01",
    type: "Room",
    name: "Opal",
    roomNumber: "Opal 01",
    image: "/lovable-uploads/1a1acbbc-64f6-44d1-8b5d-f0109e02f03e.png",
    description: "Comfortable rooms offering essential amenities with elegant designs.",
    price: 35000,
    amenities: ["Free Wi-Fi", "TV", "Private Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "Queen",
    bookingStatus: [
      { date: "2025-05-20", status: "booked" },
      { date: "2025-05-21", status: "booked" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "opal-02",
    type: "Room",
    name: "Opal",
    roomNumber: "Opal 02",
    image: "/lovable-uploads/1a1acbbc-64f6-44d1-8b5d-f0109e02f03e.png",
    description: "Comfortable rooms offering essential amenities with elegant designs.",
    price: 35000,
    amenities: ["Free Wi-Fi", "TV", "Private Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "Queen",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "topaz-01",
    type: "Room",
    name: "Topaz",
    roomNumber: "Topaz 01",
    image: "/lovable-uploads/1ab4d322-ad33-47ce-b765-091d8b14f781.png",
    description: "Spacious rooms with enhanced comfort and modern furnishings.",
    price: 40000,
    amenities: ["High-Speed Wi-Fi", "43\" TV", "Premium Coffee Maker", "Spacious Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "Queen",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "topaz-02",
    type: "Room",
    name: "Topaz",
    roomNumber: "Topaz 02",
    image: "/lovable-uploads/1ab4d322-ad33-47ce-b765-091d8b14f781.png",
    description: "Spacious rooms with enhanced comfort and modern furnishings.",
    price: 40000,
    amenities: ["High-Speed Wi-Fi", "43\" TV", "Premium Coffee Maker", "Spacious Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "Queen",
    bookingStatus: [
      { date: "2025-05-20", status: "booked" },
      { date: "2025-05-21", status: "booked" },
      { date: "2025-05-22", status: "booked" }
    ]
  },
  {
    id: "topaz-03",
    type: "Room",
    name: "Topaz",
    roomNumber: "Topaz 03",
    image: "/lovable-uploads/1ab4d322-ad33-47ce-b765-091d8b14f781.png",
    description: "Spacious rooms with enhanced comfort and modern furnishings.",
    price: 40000,
    amenities: ["High-Speed Wi-Fi", "43\" TV", "Premium Coffee Maker", "Spacious Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "Queen",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "onyx-01",
    type: "Room",
    name: "Onyx",
    roomNumber: "Onyx 01",
    image: "/lovable-uploads/bc6140b3-ddd4-4e67-a150-73a6930b623d.png",
    description: "Elegant rooms featuring premium amenities and sophisticated decor.",
    price: 45000,
    amenities: ["High-Speed Wi-Fi", "50\" TV", "Nespresso Machine", "Luxury Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "onyx-02",
    type: "Room",
    name: "Onyx",
    roomNumber: "Onyx 02",
    image: "/lovable-uploads/bc6140b3-ddd4-4e67-a150-73a6930b623d.png",
    description: "Elegant rooms featuring premium amenities and sophisticated decor.",
    price: 45000,
    amenities: ["High-Speed Wi-Fi", "50\" TV", "Nespresso Machine", "Luxury Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "onyx-03",
    type: "Room",
    name: "Onyx",
    roomNumber: "Onyx 03",
    image: "/lovable-uploads/bc6140b3-ddd4-4e67-a150-73a6930b623d.png",
    description: "Elegant rooms featuring premium amenities and sophisticated decor.",
    price: 45000,
    amenities: ["High-Speed Wi-Fi", "50\" TV", "Nespresso Machine", "Luxury Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "onyx-04",
    type: "Room",
    name: "Onyx",
    roomNumber: "Onyx 04",
    image: "/lovable-uploads/bc6140b3-ddd4-4e67-a150-73a6930b623d.png",
    description: "Elegant rooms featuring premium amenities and sophisticated decor.",
    price: 45000,
    amenities: ["High-Speed Wi-Fi", "50\" TV", "Nespresso Machine", "Luxury Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "onyx-05",
    type: "Room",
    name: "Onyx",
    roomNumber: "Onyx 05",
    image: "/lovable-uploads/bc6140b3-ddd4-4e67-a150-73a6930b623d.png",
    description: "Elegant rooms featuring premium amenities and sophisticated decor.",
    price: 45000,
    amenities: ["High-Speed Wi-Fi", "50\" TV", "Nespresso Machine", "Luxury Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  // Adding more room types to match the 38 count mentioned
  {
    id: "ivory-01",
    type: "Room",
    name: "Ivory",
    roomNumber: "Ivory 01",
    image: "/lovable-uploads/247043c1-0231-4f7a-b19e-6f0273dcc58b.png",
    description: "Bright and airy rooms with luxurious touches and ample space.",
    price: 42000,
    amenities: ["High-Speed Wi-Fi", "48\" TV", "Premium Coffee Maker", "Spacious Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King/Twin",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "ivory-02",
    type: "Room",
    name: "Ivory",
    roomNumber: "Ivory 02",
    image: "/lovable-uploads/247043c1-0231-4f7a-b19e-6f0273dcc58b.png",
    description: "Bright and airy rooms with luxurious touches and ample space.",
    price: 42000,
    amenities: ["High-Speed Wi-Fi", "48\" TV", "Premium Coffee Maker", "Spacious Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King/Twin",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "ivory-03",
    type: "Room",
    name: "Ivory",
    roomNumber: "Ivory 03",
    image: "/lovable-uploads/247043c1-0231-4f7a-b19e-6f0273dcc58b.png",
    description: "Bright and airy rooms with luxurious touches and ample space.",
    price: 42000,
    amenities: ["High-Speed Wi-Fi", "48\" TV", "Premium Coffee Maker", "Spacious Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King/Twin",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "ivory-04",
    type: "Room",
    name: "Ivory",
    roomNumber: "Ivory 04",
    image: "/lovable-uploads/247043c1-0231-4f7a-b19e-6f0273dcc58b.png",
    description: "Bright and airy rooms with luxurious touches and ample space.",
    price: 42000,
    amenities: ["High-Speed Wi-Fi", "48\" TV", "Premium Coffee Maker", "Spacious Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King/Twin",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "ivory-05",
    type: "Room",
    name: "Ivory",
    roomNumber: "Ivory 05",
    image: "/lovable-uploads/247043c1-0231-4f7a-b19e-6f0273dcc58b.png",
    description: "Bright and airy rooms with luxurious touches and ample space.",
    price: 42000,
    amenities: ["High-Speed Wi-Fi", "48\" TV", "Premium Coffee Maker", "Spacious Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King/Twin",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "ivory-06",
    type: "Room",
    name: "Ivory",
    roomNumber: "Ivory 06",
    image: "/lovable-uploads/247043c1-0231-4f7a-b19e-6f0273dcc58b.png",
    description: "Bright and airy rooms with luxurious touches and ample space.",
    price: 42000,
    amenities: ["High-Speed Wi-Fi", "48\" TV", "Premium Coffee Maker", "Spacious Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King/Twin",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "amber-01",
    type: "Room",
    name: "Amber",
    roomNumber: "Amber 01",
    image: "/lovable-uploads/8625d04c-54ec-4d6c-83b7-3a1081dac086.png",
    description: "Warm and inviting executive rooms with premium bedding and stylish furnishings.",
    price: 48000,
    amenities: ["High-Speed Wi-Fi", "50\" TV", "Nespresso Machine", "Marble Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "amber-02",
    type: "Room",
    name: "Amber",
    roomNumber: "Amber 02",
    image: "/lovable-uploads/8625d04c-54ec-4d6c-83b7-3a1081dac086.png",
    description: "Warm and inviting executive rooms with premium bedding and stylish furnishings.",
    price: 48000,
    amenities: ["High-Speed Wi-Fi", "50\" TV", "Nespresso Machine", "Marble Bathroom", "Air Conditioning", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  }
];

// Suites data
const suites = [
  {
    id: "diamond-01",
    type: "Suite",
    name: "Diamond",
    roomNumber: "Diamond 01",
    image: "/lovable-uploads/7d3b8634-80e9-4dc1-ba22-be8f76121c97.png",
    description: "Luxurious suites with separate living areas and premium amenities.",
    price: 85000,
    amenities: ["Ultra-Fast Wi-Fi", "65\" TV", "Full Kitchenette", "Luxury Bathroom with Jacuzzi", "Smart Climate Control", "Premium Mini Bar", "Dining Area", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "diamond-02",
    type: "Suite",
    name: "Diamond",
    roomNumber: "Diamond 02",
    image: "/lovable-uploads/7d3b8634-80e9-4dc1-ba22-be8f76121c97.png",
    description: "Luxurious suites with separate living areas and premium amenities.",
    price: 85000,
    amenities: ["Ultra-Fast Wi-Fi", "65\" TV", "Full Kitchenette", "Luxury Bathroom with Jacuzzi", "Smart Climate Control", "Premium Mini Bar", "Dining Area", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "sapphire-01",
    type: "Suite",
    name: "Sapphire",
    roomNumber: "Sapphire 01",
    image: "/lovable-uploads/bbd7d628-218e-45e5-a2f6-5dd221ccc495.png",
    description: "Elegant suites featuring sophisticated design and premium services.",
    price: 80000,
    amenities: ["Ultra-Fast Wi-Fi", "60\" TV", "Kitchenette", "Luxury Bathroom with Walk-in Shower", "Smart Climate Control", "Premium Mini Bar", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "sapphire-02",
    type: "Suite",
    name: "Sapphire",
    roomNumber: "Sapphire 02",
    image: "/lovable-uploads/bbd7d628-218e-45e5-a2f6-5dd221ccc495.png",
    description: "Elegant suites featuring sophisticated design and premium services.",
    price: 80000,
    amenities: ["Ultra-Fast Wi-Fi", "60\" TV", "Kitchenette", "Luxury Bathroom with Walk-in Shower", "Smart Climate Control", "Premium Mini Bar", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "emerald-01",
    type: "Suite",
    name: "Emerald",
    roomNumber: "Emerald 01",
    image: "/lovable-uploads/c5b0e6f8-b1da-4fc2-ae09-35e930422a81.png",
    description: "Mini suite offering luxurious comfort in a compact yet elegant space.",
    price: 65000,
    amenities: ["High-Speed Wi-Fi", "55\" TV", "Luxury Bathroom", "Climate Control", "Mini Bar", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "gold-01",
    type: "Suite",
    name: "Gold",
    roomNumber: "Gold 01",
    image: "/lovable-uploads/8625d04c-54ec-4d6c-83b7-3a1081dac086.png",
    description: "Premium suites with opulent furnishings and expansive living areas.",
    price: 75000,
    amenities: ["Ultra-Fast Wi-Fi", "60\" TV", "Kitchenette", "Marble Bathroom with Dual Sinks", "Smart Climate Control", "Premium Mini Bar", "Dining Area", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "gold-02",
    type: "Suite",
    name: "Gold",
    roomNumber: "Gold 02",
    image: "/lovable-uploads/8625d04c-54ec-4d6c-83b7-3a1081dac086.png",
    description: "Premium suites with opulent furnishings and expansive living areas.",
    price: 75000,
    amenities: ["Ultra-Fast Wi-Fi", "60\" TV", "Kitchenette", "Marble Bathroom with Dual Sinks", "Smart Climate Control", "Premium Mini Bar", "Dining Area", "Free Breakfast"],
    maxGuests: 2,
    bedType: "King",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "pearl-01",
    type: "Suite",
    name: "Pearl",
    roomNumber: "Pearl 01",
    image: "/lovable-uploads/28419863-c4a4-4fb6-a14e-c864333d1966.png",
    description: "Exclusive suite offering the ultimate in luxury and personalized service.",
    price: 90000,
    amenities: ["Ultra-Fast Wi-Fi", "75\" TV", "Full Kitchenette", "Luxury Bathroom with Jacuzzi and Steam Shower", "Smart Climate Control", "Premium Stocked Bar", "Dining Area", "Free Breakfast"],
    maxGuests: 2,
    bedType: "Emperor King",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "ruby-01",
    type: "Suite",
    name: "Ruby",
    roomNumber: "Ruby 01",
    image: "/lovable-uploads/cee30f59-ce42-4cfa-ba4e-405a7c5339d1.png",
    description: "Double bed suites perfect for couples, with deluxe amenities.",
    price: 70000,
    amenities: ["High-Speed Wi-Fi", "55\" TV", "Kitchenette", "Luxury Bathroom", "Climate Control", "Mini Bar", "Free Breakfast"],
    maxGuests: 2,
    bedType: "Two Queen Beds",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "ruby-02",
    type: "Suite",
    name: "Ruby",
    roomNumber: "Ruby 02",
    image: "/lovable-uploads/cee30f59-ce42-4cfa-ba4e-405a7c5339d1.png",
    description: "Double bed suites perfect for couples, with deluxe amenities.",
    price: 70000,
    amenities: ["High-Speed Wi-Fi", "55\" TV", "Kitchenette", "Luxury Bathroom", "Climate Control", "Mini Bar", "Free Breakfast"],
    maxGuests: 2,
    bedType: "Two Queen Beds",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  },
  {
    id: "ruby-03",
    type: "Suite",
    name: "Ruby",
    roomNumber: "Ruby 03",
    image: "/lovable-uploads/cee30f59-ce42-4cfa-ba4e-405a7c5339d1.png",
    description: "Double bed suites perfect for couples, with deluxe amenities.",
    price: 70000,
    amenities: ["High-Speed Wi-Fi", "55\" TV", "Kitchenette", "Luxury Bathroom", "Climate Control", "Mini Bar", "Free Breakfast"],
    maxGuests: 2,
    bedType: "Two Queen Beds",
    bookingStatus: [
      { date: "2025-05-20", status: "available" },
      { date: "2025-05-21", status: "available" },
      { date: "2025-05-22", status: "available" }
    ]
  }
];

// Combine rooms and suites
const allAccommodations = [...rooms, ...suites];

// Room card component
const RoomCard = ({ accommodation, checkInDate, checkOutDate }) => {
  const isAvailable = () => {
    if (!checkInDate || !checkOutDate) return true;
    
    // For the demo, we'll use a simple check
    // A real implementation would check all dates between checkIn and checkOut
    const randomAvailability = Math.random() > 0.3; // 70% chance of being available
    return randomAvailability;
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={accommodation.image} 
          alt={`${accommodation.name} ${accommodation.type}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-0 right-0 bg-hotel-gold text-white px-3 py-1 m-2 rounded-md text-sm font-medium">
          {accommodation.type}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white font-bold text-xl">{accommodation.name}</p>
          <p className="text-white/90 text-sm">₦{accommodation.price.toLocaleString()}/night</p>
        </div>
      </div>
      <CardHeader className="py-3">
        <CardTitle className="flex justify-between items-center">
          <span>{accommodation.roomNumber}</span>
          <Badge 
            variant={isAvailable() ? "outline" : "destructive"} 
            className={isAvailable() ? "bg-green-50 text-green-800 border-green-800" : ""}>
            {isAvailable() ? "Available" : "Booked"}
          </Badge>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <DoorClosed size={16} />
          <span>{accommodation.roomNumber}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow py-2">
        <p className="text-gray-700 mb-3 line-clamp-2">{accommodation.description}</p>
        
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Key Features</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{accommodation.maxGuests} Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed size={16} />
              <span>{accommodation.bedType}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-3 pb-3">
        <div className="text-hotel-gold font-bold">
          ₦{accommodation.price.toLocaleString()}<span className="text-sm font-normal text-gray-500">/night</span>
        </div>
        <Button 
          variant="hotel" 
          size="sm" 
          disabled={!isAvailable()}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

const Booking = () => {
  const [searchParams, setSearchParams] = useState({
    checkIn: null,
    checkOut: null,
    accommodationType: "",
    guests: 1,
    priceRange: [0, 100000]
  });
  
  const [filteredAccommodations, setFilteredAccommodations] = useState(allAccommodations);
  const today = new Date();

  // Filter accommodations based on search parameters
  const filterAccommodations = () => {
    let filtered = allAccommodations;
    
    // Filter by accommodation type
    if (searchParams.accommodationType) {
      filtered = filtered.filter(acc => acc.type.toLowerCase() === searchParams.accommodationType.toLowerCase());
    }
    
    // Filter by number of guests
    if (searchParams.guests > 0) {
      filtered = filtered.filter(acc => acc.maxGuests >= searchParams.guests);
    }
    
    // Filter by price range
    filtered = filtered.filter(acc => 
      acc.price >= searchParams.priceRange[0] && 
      acc.price <= searchParams.priceRange[1]
    );
    
    setFilteredAccommodations(filtered);
  };
  
  // Apply filters when search parameters change
  useEffect(() => {
    filterAccommodations();
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
        {/* Hero Section */}
        <section
          className="py-16 md:py-20 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: "url('/lovable-uploads/e9be561a-1ed6-476f-aab8-fd04aaef0620.png')" }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="hotel-container relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">Book Your Stay</h1>
              <p className="text-xl md:text-2xl text-white">
                Reserve your perfect room or suite for an unforgettable experience
              </p>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="bg-white py-8 shadow-md">
          <div className="hotel-container">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Check-in Date */}
                <div>
                  <label htmlFor="check-in" className="block text-sm font-medium mb-1">Check-in Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-gray-300"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchParams.checkIn ? (
                          format(searchParams.checkIn, "PPP")
                        ) : (
                          <span>Select check-in date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50 pointer-events-auto">
                      <Calendar
                        mode="single"
                        selected={searchParams.checkIn}
                        onSelect={(date) => 
                          setSearchParams({...searchParams, checkIn: date})
                        }
                        disabled={(date) => date < today}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Check-out Date */}
                <div>
                  <label htmlFor="check-out" className="block text-sm font-medium mb-1">Check-out Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-gray-300"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchParams.checkOut ? (
                          format(searchParams.checkOut, "PPP")
                        ) : (
                          <span>Select check-out date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50 pointer-events-auto">
                      <Calendar
                        mode="single"
                        selected={searchParams.checkOut}
                        onSelect={(date) => 
                          setSearchParams({...searchParams, checkOut: date})
                        }
                        disabled={(date) => 
                          date < today || 
                          (searchParams.checkIn && date <= searchParams.checkIn)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Accommodation Type */}
                <div>
                  <label htmlFor="accommodation-type" className="block text-sm font-medium mb-1">Accommodation Type</label>
                  <Select 
                    value={searchParams.accommodationType} 
                    onValueChange={(value) => 
                      setSearchParams({...searchParams, accommodationType: value})
                    }
                  >
                    <SelectTrigger className="w-full border-gray-300">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Room">Room</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Number of Guests */}
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium mb-1">Guests</label>
                  <Select 
                    value={searchParams.guests.toString()} 
                    onValueChange={(value) => 
                      setSearchParams({...searchParams, guests: parseInt(value)})
                    }
                  >
                    <SelectTrigger className="w-full border-gray-300">
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button
                  variant="hotel"
                  size="lg"
                  className="px-8"
                  onClick={filterAccommodations}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search Availability
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="section-padding bg-hotel-beige py-16">
          <div className="hotel-container">
            <div className="max-w-7xl mx-auto">
              <h2 className="hotel-title text-center mb-8">Available Accommodations</h2>
              
              {/* Results count and applied filters */}
              <div className="flex flex-wrap items-center justify-between mb-8">
                <p className="text-gray-700 font-medium">
                  Showing {filteredAccommodations.length} accommodations
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                  {searchParams.accommodationType && (
                    <Badge variant="outline" className="bg-gray-50">
                      Type: {searchParams.accommodationType}
                    </Badge>
                  )}
                  {searchParams.checkIn && searchParams.checkOut && (
                    <Badge variant="outline" className="bg-gray-50">
                      {format(searchParams.checkIn, "MMM d")} - {format(searchParams.checkOut, "MMM d, yyyy")}
                    </Badge>
                  )}
                  {searchParams.guests > 1 && (
                    <Badge variant="outline" className="bg-gray-50">
                      {searchParams.guests} Guests
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Results grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAccommodations.map((accommodation) => (
                  <RoomCard 
                    key={accommodation.id} 
                    accommodation={accommodation}
                    checkInDate={searchParams.checkIn}
                    checkOutDate={searchParams.checkOut}
                  />
                ))}
              </div>
              
              {filteredAccommodations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-700 mb-4">No accommodations found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-white"
                    onClick={() => setSearchParams({
                      checkIn: null,
                      checkOut: null,
                      accommodationType: "",
                      guests: 1,
                      priceRange: [0, 100000]
                    })}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Booking Information Section */}
        <section className="section-padding bg-white py-16">
          <div className="hotel-container">
            <div className="max-w-4xl mx-auto">
              <h2 className="hotel-title text-center mb-8">Booking Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Check-in / Check-out</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <Clock className="text-hotel-gold mr-2 mt-1" size={18} />
                      <span>Check-in time: 2:00 PM</span>
                    </li>
                    <li className="flex items-start">
                      <Clock className="text-hotel-gold mr-2 mt-1" size={18} />
                      <span>Check-out time: 12:00 PM</span>
                    </li>
                    <li className="flex items-start">
                      <Clock className="text-hotel-gold mr-2 mt-1" size={18} />
                      <span>Early check-in and late check-out available upon request (additional fees may apply)</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Policies</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <Clock className="text-hotel-gold mr-2 mt-1" size={18} />
                      <span>24-hour cancellation policy</span>
                    </li>
                    <li className="flex items-start">
                      <Users className="text-hotel-gold mr-2 mt-1" size={18} />
                      <span>Maximum of 2 guests per room/suite</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="text-hotel-gold mr-2 mt-1" size={18} />
                      <span>All rates include complimentary breakfast</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Booking;
