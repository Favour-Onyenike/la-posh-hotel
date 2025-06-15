
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const RoomsCTA = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/booking');
  };

  return (
    <section className="section-padding bg-white py-16">
      <div className="hotel-container">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="hotel-title mb-6">Ready to Experience Comfort?</h2>
          <p className="text-lg mb-8 text-gray-700 max-w-3xl mx-auto">
            Book your stay today and enjoy our comfortable accommodations, impeccable service, 
            and the perfect blend of comfort and elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hotel" 
              size="lg" 
              className="font-medium"
              onClick={handleBookNow}
            >
              Book Your Room Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="font-medium border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-white"
              onClick={() => navigate('/suites')}
            >
              Explore Our Suites
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomsCTA;
