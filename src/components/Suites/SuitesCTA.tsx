
import React from "react";
import { Button } from "@/components/ui/button";

interface SuitesCTAProps {
  onBookNow: () => void;
}

const SuitesCTA = ({ onBookNow }: SuitesCTAProps) => {
  return (
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
            onClick={onBookNow}
          >
            Book Your Suite Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SuitesCTA;
