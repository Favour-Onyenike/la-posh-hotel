
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RecentReviews from "@/components/RecentReviews";
import CounterBar from "@/components/CounterBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, Users, Award, Clock } from "lucide-react";

const Index = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <CounterBar />
      
      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="hotel-container">
          <div className="text-center mb-16">
            <h2 className="hotel-title text-black mb-4">About La Posh</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience luxury redefined in the heart of Abraka Town. Where elegance meets comfort.
            </p>
            <div className="h-1 w-24 bg-hotel-gold mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-hotel-beige p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="text-hotel-gold" size={24} />
              </div>
              <h3 className="font-semibold mb-2 text-black">Premium Service</h3>
              <p className="text-gray-600 text-sm">Exceptional hospitality with personalized attention to every guest</p>
            </div>
            
            <div className="text-center">
              <div className="bg-hotel-beige p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="text-hotel-gold" size={24} />
              </div>
              <h3 className="font-semibold mb-2 text-black">Luxury Amenities</h3>
              <p className="text-gray-600 text-sm">World-class facilities designed for comfort and convenience</p>
            </div>
            
            <div className="text-center">
              <div className="bg-hotel-beige p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="text-hotel-gold" size={24} />
              </div>
              <h3 className="font-semibold mb-2 text-black">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Round-the-clock assistance to ensure your stay is perfect</p>
            </div>
            
            <div className="text-center">
              <div className="bg-hotel-beige p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="text-hotel-gold" size={24} />
              </div>
              <h3 className="font-semibold mb-2 text-black">Prime Location</h3>
              <p className="text-gray-600 text-sm">Strategically located in the heart of Abraka Town</p>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/about">
              <Button variant="hotel" size="lg">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="hotel-container">
          <div className="text-center mb-16">
            <h2 className="hotel-title text-black mb-4">What Our Guests Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read what our valued guests have to say about their experience at La Posh
            </p>
            <div className="h-1 w-24 bg-hotel-gold mx-auto mt-6"></div>
          </div>
          
          <RecentReviews />
          
          <div className="text-center mt-12">
            <Link to="/add-review">
              <Button variant="hotel" size="lg">
                Share Your Experience
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Index;
