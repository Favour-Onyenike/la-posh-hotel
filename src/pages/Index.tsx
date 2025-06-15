
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import CounterBar from "@/components/CounterBar";
import RecentReviews from "@/components/RecentReviews";
import Events from "@/components/Events";
import { Star, Utensils, Wifi, Car, Clock, Glasses, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Feature = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="bg-hotel-beige p-4 rounded-full mb-4">
        <Icon className="text-hotel-gold" size={24} />
      </div>
      <h3 className="font-serif text-xl font-semibold mb-2 text-black">{title}</h3>
      <p className="text-black">{description}</p>
    </div>
  );
};

const RoomPreview = ({ image, title, price, description, currency = "₦" }) => {
  return (
    <div className="group">
      <div className="relative overflow-hidden mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
      </div>
      <h3 className="font-serif text-xl font-semibold mb-2 text-black">{title}</h3>
      <p className="text-hotel-gold font-medium mb-2">{currency}{price.toLocaleString()} per night</p>
      <p className="text-black mb-4">{description}</p>
      <Button variant="hotel" size="default">
        Book Now
      </Button>
    </div>
  );
};

const Index = () => {
  const handleNavClick = () => {
    window.scrollTo(0, 0);
  };

  // Helper function to get the correct image path for production
  const getImagePath = (imageName: string) => {
    const isProduction = import.meta.env.PROD;
    return isProduction ? `/la-posh-hotel/lovable-uploads/${imageName}` : `/lovable-uploads/${imageName}`;
  };

  return (
    <>
      <Navbar />
      <Hero />

      {/* About Section - Updated to center align on mobile */}
      <section className="section-padding bg-white py-20 mt-24">
        <div className="hotel-container">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="h-0.5 bg-hotel-gold w-12 mr-4"></div>
              <h2 className="hotel-subtitle text-black text-3xl uppercase font-bold">OUR STORY</h2>
              <div className="h-0.5 bg-hotel-gold w-12 ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="prose prose-lg max-w-none text-center md:text-left">
                <p className="mb-6 text-black text-lg leading-relaxed">
                  Welcome to La Posh Signature Hotel & Suites, where luxury meets elegance and
                  sophistication. Located in the heart of the Abraka Town, our hotel offers an
                  unparalleled hospitality experience, blending modern amenities with timeless
                  charm.
                </p>
                <p className="mb-6 text-black text-lg leading-relaxed">
                  Our story began with a passion for creating unforgettable experiences, and a
                  commitment to excellence in every detail. From our lavish rooms and suites, to
                  our world-class dining and entertainment options, every aspect of our hotel is
                  designed to exceed your expectations.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl border-2 border-hotel-gold/20 hover:shadow-2xl transition-all duration-300 hover-scale h-[300px]">
                <img 
                  src={getImagePath("442a4b2f-8a6f-4bd7-9c4d-a0a37dfb8260.png")} 
                  alt="Hotel Exterior" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="bg-hotel-beige p-8 rounded-lg shadow-md border-l-4 border-hotel-gold mb-8">
              <p className="text-black text-lg italic text-center">
                "Whether you're a discerning business traveler, a romantic couple, or a family
                on vacation, we invite you to experience the La Posh difference. Let us pamper
                you with our signature blend of luxury, comfort, and genuine hospitality."
              </p>
            </div>

            <div className="flex justify-center">
              <Link to="/about" onClick={handleNavClick}>
                <Button variant="hotel" size="lg">
                  Discover Our Full Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Counter Bar */}
      <CounterBar />

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="hotel-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="hotel-title text-black mb-4">Experience Premium Amenities</h2>
            <p className="text-black">
              Indulge in the finest features and services designed for your comfort and convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature
              icon={Star}
              title="5-Star Accommodations"
              description="Luxurious rooms and suites featuring premium amenities and elegant decor"
            />
            <Feature
              icon={Clock}
              title="24-Hour Room Service"
              description="Enjoy delicious meals and refreshments delivered to your room at any hour"
            />
            <Feature
              icon={Wifi}
              title="Complimentary Wi-Fi"
              description="High-speed internet connectivity throughout the hotel premises"
            />
            <Feature
              icon={Utensils}
              title="Restaurant"
              description="Savor exquisite cuisine prepared by our  chefs in an elegant setting"
            />
            <Feature
              icon={Glasses}
              title="Exclusive Bar"
              description="Unwind with premium drinks and cocktails in our  lounge bar"
            />
            <Feature
              icon={Car}
              title="Secure Parking"
              description="secure parking facilities for all our guests"
            />
          </div>
        </div>
      </section>

      {/* Rooms Preview */}
      <section className="section-padding bg-hotel-beige">
        <div className="hotel-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="hotel-title text-black mb-4">Our Luxury Accommodations</h2>
            <p className="text-black">
              Choose from our selection of meticulously designed rooms and suites
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <RoomPreview
              image={getImagePath("1a1acbbc-64f6-44d1-8b5d-f0109e02f03e.png")}
              title="Executive Room"
              price={40000}
              description="Elegant room with king-size bed, city views, and modern amenities"
            />
            <RoomPreview
              image={getImagePath("1ab4d322-ad33-47ce-b765-091d8b14f781.png")}
              title="Standard Suite"
              price={80000}
              description="Spacious suite with separate living area and premium amenities"
            />
            <RoomPreview
              image={getImagePath("bc6140b3-ddd4-4e67-a150-73a6930b623d.png")}
              title="Mini Suite"
              price={45000}
              description="Our finest accommodation with panoramic views and luxurious features"
            />
          </div>

          <div className="text-center mt-12">
            <Button variant="hotel" size="lg">
              View All Rooms & Suites
            </Button>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <Events />

      {/* Testimonials - Updated to display real reviews */}
      <section className="relative section-padding">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
          style={{
            backgroundImage:
              `url('${getImagePath('b0b33b9b-6fb9-4d30-836e-20c55bc93064.png')}')`,
          }}
        />
        <div className="hotel-container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="hotel-title text-black mb-4">What Our Guests Say</h2>
            <p className="text-black">
              Hear from those who have experienced our hospitality
            </p>
          </div>

          <RecentReviews />
          
          <div className="flex justify-center mt-10">
            <Link to="/add-review">
              <Button variant="hotel" size="lg">
                Add Your Review
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-hotel-beige">
        <div className="hotel-container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="hotel-title text-black mb-6">Experience Luxury at La-Posh</h2>
            <p className="text-black mb-8">
              Book your stay now and discover why our guests return again and again for our
              exceptional service and unparalleled comfort.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button variant="hotel" size="lg" onClick={handleNavClick} className="w-full sm:w-auto">
                Book Your Stay
              </Button>
              <Link to="/contact" onClick={handleNavClick} className="w-full sm:w-auto">
                <Button variant="hotel" size="lg" className="w-full sm:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;
