
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const RoomsIntroduction = () => {
  const navigate = useNavigate();

  return (
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
            <Button 
              variant="outline" 
              className="border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-white"
              onClick={() => navigate('/suites')}
            >
              View Our Premium Suites
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomsIntroduction;
