import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import CounterBar from "@/components/CounterBar";
import { Star, Utensils, Wifi, Car, Clock, Glasses, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

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

const RoomPreview = ({ image, title, price, description }) => {
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
      <p className="text-hotel-gold font-medium mb-2">From ${price} per night</p>
      <p className="text-black mb-4">{description}</p>
      <button className="text-hotel-navy font-medium border-b-2 border-hotel-gold pb-1 hover:text-hotel-gold transition-colors">
        View Details
      </button>
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
              <button className="hotel-button">
                Discover Our Story
              </button>
            </div>
            <div className="lg:w-1/2 flex flex-col gap-4 items-center">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Hotel Lobby"
                className="rounded-lg w-1/2 h-64 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Hotel Room"
                className="rounded-lg w-1/2 h-64 object-cover"
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
              title="Deluxe Room"
              price={199}
              description="Elegant room with king-size bed, city views, and modern amenities"
            />
            <RoomPreview
              image="https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              title="Executive Suite"
              price={299}
              description="Spacious suite with separate living area and premium amenities"
            />
            <RoomPreview
              image="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              title="Presidential Suite"
              price={499}
              description="Our finest accommodation with panoramic views and luxurious features"
            />
          </div>

          <div className="text-center mt-12">
            <button className="hotel-button">View All Rooms & Suites</button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative section-padding">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519690889869-e705e59f72e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
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
        </div>
      </section>

      {/* Location Section */}
      <section className="section-padding bg-hotel-navy">
        <div className="hotel-container">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="hotel-title mb-6 text-white">
                Prime Location in the City Center
              </h2>
              <p className="mb-6 text-white">
                Located in the heart of the city, Luxe Haven provides easy access to major
                attractions, business districts, and entertainment venues. Our prime location
                makes us the ideal choice for both business and leisure travelers.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <MapPin className="text-hotel-gold mt-1 mr-3" size={18} />
                  <p className="text-white">123 Luxury Avenue, Downtown, City 10001</p>
                </div>
                <div className="flex items-start">
                  <Clock className="text-hotel-gold mt-1 mr-3" size={18} />
                  <div>
                    <p className="text-white font-medium">Check-in / Check-out</p>
                    <p className="text-white">3:00 PM / 12:00 PM</p>
                  </div>
                </div>
              </div>
              <button className="px-6 py-3 bg-white text-hotel-navy font-sans font-medium transition-all duration-300 hover:bg-hotel-gold hover:text-white">
                Get Directions
              </button>
            </div>
            <div className="lg:w-1/2 h-80 lg:h-96">
              <div className="w-full h-full rounded-lg overflow-hidden">
                {/* This would typically be a map, but we're using a placeholder image */}
                <img
                  src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Hotel Location Map"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-hotel-beige">
        <div className="hotel-container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="hotel-title text-black mb-6">Experience Luxury at Luxe Haven</h2>
            <p className="text-black mb-8">
              Book your stay now and discover why our guests return again and again for our
              exceptional service and unparalleled comfort.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="hotel-button">
                Book Your Stay
              </button>
              <button className="px-6 py-3 bg-transparent border-2 border-hotel-navy text-hotel-navy font-sans font-medium transition-all duration-300 hover:bg-hotel-navy hover:text-white">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;
