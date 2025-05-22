
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import CounterBar from "@/components/CounterBar";
import { Star, Utensils, Wifi, Car, Clock, Glasses, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  return (
    <>
      <Navbar />
      <Hero />

      {/* About Section */}
      <section className="section-padding mt-24">
        <div className="hotel-container">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="hotel-title mb-6 text-black">
                Welcome to La Posh Signature Hotel & Suites
              </h2>
              <p className="mb-4 text-black">
                Welcome to La Posh Signature Hotel & Suites, where luxury meets elegance and sophistication. 
                Located in the heart of the Abraka Town, our hotel offers an unparalleled hospitality 
                experience, blending modern amenities with timeless charm.
              </p>
              <p className="mb-4 text-black">
                Our story began with a passion for creating unforgettable experiences, and a commitment 
                to excellence in every detail. From our lavish rooms and suites, to our world-class dining 
                and entertainment options, every aspect of our hotel is designed to exceed your expectations.
              </p>
              <p className="mb-6 text-black">
                Whether you're a discerning business traveler, a romantic couple, or a family on vacation, 
                we invite you to experience the La Posh difference. Let us pamper you with our signature 
                blend of luxury, comfort, and genuine hospitality.
              </p>
              <div className="flex items-center mb-8">
                <hr className="w-12 border-t-2 border-hotel-gold mr-4" />
                <span className="font-serif italic text-lg text-black">Experience the difference</span>
              </div>
              <Button variant="hotel" size="lg">
                Discover Our Story
              </Button>
            </div>
            <div className="lg:w-1/2 flex flex-row gap-4 items-center justify-center">
              <img
                src="/lovable-uploads/8160dfdf-2bee-40e2-b129-c74aaea6a773.png"
                alt="Luxury Hotel Room"
                className="rounded-lg w-1/2 h-[350px] object-cover"
              />
              <img
                src="/lovable-uploads/253c3040-a0de-47cd-b074-06c86921d8e7.png"
                alt="Hotel Exterior"
                className="rounded-lg w-1/2 h-[350px] object-cover"
              />
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
              title="Fine Dining Restaurant"
              description="Savor exquisite cuisine prepared by our master chefs in an elegant setting"
            />
            <Feature
              icon={Glasses}
              title="Exclusive Bar"
              description="Unwind with premium drinks and cocktails in our sophisticated lounge bar"
            />
            <Feature
              icon={Car}
              title="Secure Parking"
              description="Complimentary valet and secure parking facilities for all our guests"
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
              image="https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              title="Executive Room"
              price={40000}
              description="Elegant room with king-size bed, city views, and modern amenities"
            />
            <RoomPreview
              image="https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              title="Standard Suite"
              price={80000}
              description="Spacious suite with separate living area and premium amenities"
            />
            <RoomPreview
              image="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
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

      {/* Testimonials */}
      <section className="relative section-padding">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
          style={{
            backgroundImage:
              "url('/lovable-uploads/b0b33b9b-6fb9-4d30-836e-20c55bc93064.png')",
          }}
        />
        <div className="hotel-container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="hotel-title text-black mb-4">What Our Guests Say</h2>
            <p className="text-black">
              Hear from those who have experienced our hospitality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex text-hotel-gold mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-black mb-6">
                  "An exceptional experience from start to finish. The staff was attentive,
                  the room was immaculate, and the amenities were top-notch. Will definitely return."
                </p>
                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-full bg-cover bg-center mr-4"
                    style={{
                      backgroundImage: `url(https://randomuser.me/api/portraits/${i % 2 === 0 ? "women" : "men"}/${i + 20}.jpg)`,
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-black">John Doe</h4>
                    <p className="text-black text-sm">Business Traveler</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <Button variant="hotel" size="lg">
              Add Your Review
            </Button>
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
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="hotel" size="lg">
                Book Your Stay
              </Button>
              <Button variant="hotel" size="lg">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;
